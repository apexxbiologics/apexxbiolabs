"use client";

import { useEffect, useState } from "react";

type Carrier = "AUTO" | "USPS" | "UPS" | "FedEx" | "DHL";

type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  first_name: string;
  last_name: string;
  payment_method: string;
  total: number;
  promo_code: string | null;
  discount: number | null;
  status: string;
  tracking_number: string | null;
  created_at: string;
};

function detectCarrier(
  trackingNumber: string
): Exclude<Carrier, "AUTO"> | null {
  const tracking = trackingNumber
    .trim()
    .replace(/[\s-]+/g, "")
    .toUpperCase();

  if (!tracking) {
    return null;
  }

  // UPS tracking numbers commonly begin with 1Z.
  if (/^1Z[A-Z0-9]{16}$/.test(tracking) || tracking.startsWith("1Z")) {
    return "UPS";
  }

  // USPS domestic and international tracking formats.
  if (
    /^(92|93|94|95)\d{18,20}$/.test(tracking) ||
    /^[A-Z]{2}\d{9}US$/.test(tracking)
  ) {
    return "USPS";
  }

  // DHL commonly uses 10 digits or JD/JJD prefixes.
  if (
    /^\d{10}$/.test(tracking) ||
    /^JD\d+$/.test(tracking) ||
    /^JJD\d+$/.test(tracking)
  ) {
    return "DHL";
  }

  // FedEx commonly uses 12, 15, 20, or 22 digits.
  if (
    /^\d{12}$/.test(tracking) ||
    /^\d{15}$/.test(tracking) ||
    /^\d{20}$/.test(tracking) ||
    /^\d{22}$/.test(tracking)
  ) {
    return "FedEx";
  }

  return null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [trackingInputs, setTrackingInputs] = useState<
    Record<string, string>
  >({});

  const [carrierInputs, setCarrierInputs] = useState<
    Record<string, Carrier>
  >({});

  const [sendingTracking, setSendingTracking] = useState<
    Record<string, boolean>
  >({});

  const [markingPaid, setMarkingPaid] = useState<
    Record<string, boolean>
  >({});

  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [lockedOut, setLockedOut] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error("Error fetching orders:", result.error);
        setOrders([]);
        return;
      }

      setOrders(result.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogin = async () => {
    if (!enteredUsername.trim() || !enteredPassword.trim()) {
      setLoginError("Please enter your username and password.");
      return;
    }

    try {
      setLoggingIn(true);
      setLoginError("");

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: enteredUsername.trim(),
          password: enteredPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUnlocked(true);
        setLoginError("");
        return;
      }

      if (result.locked) {
        setLockedOut(true);
        setLoginError("Too many failed attempts. Access locked.");
        return;
      }

      setLoginError(
        typeof result.attemptsLeft === "number"
          ? `Incorrect login. Attempts left: ${result.attemptsLeft}`
          : result.error || "Incorrect username or password."
      );
    } catch (error) {
      console.error("Admin login error:", error);
      setLoginError("Unable to log in. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    try {
      setMarkingPaid((current) => ({
        ...current,
        [orderId]: true,
      }));

      const response = await fetch("/api/admin/mark-paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.error || "Failed to mark the order as paid.");
        return;
      }

      alert("Order marked as paid. Inventory updated.");
      await fetchOrders();
    } catch (error) {
      console.error("Error marking order paid:", error);
      alert("Something went wrong while marking the order as paid.");
    } finally {
      setMarkingPaid((current) => ({
        ...current,
        [orderId]: false,
      }));
    }
  };

  const handleSendTracking = async (order: Order) => {
    const trackingNumber = (
      trackingInputs[order.id] || ""
    ).trim();

    if (!trackingNumber) {
      alert("Please enter a tracking number.");
      return;
    }

    const selectedCarrier =
      carrierInputs[order.id] || "AUTO";

    const carrier =
      selectedCarrier === "AUTO"
        ? detectCarrier(trackingNumber)
        : selectedCarrier;

    if (!carrier) {
      alert(
        "The carrier could not be detected. Please select USPS, UPS, FedEx, or DHL manually."
      );
      return;
    }

    try {
      setSendingTracking((current) => ({
        ...current,
        [order.id]: true,
      }));

      const response = await fetch(
        "/api/admin/send-tracking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
            trackingNumber,
            carrier,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.error ||
            "The tracking information could not be sent."
        );
        return;
      }

      alert(
        `Tracking information sent successfully through ${carrier}.`
      );

      setTrackingInputs((current) => {
        const updated = { ...current };
        delete updated[order.id];
        return updated;
      });

      setCarrierInputs((current) => {
        const updated = { ...current };
        delete updated[order.id];
        return updated;
      });

      await fetchOrders();
    } catch (error) {
      console.error("Error sending tracking:", error);

      alert(
        "Something went wrong while sending the tracking information."
      );
    } finally {
      setSendingTracking((current) => ({
        ...current,
        [order.id]: false,
      }));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return true;
    }

    const customerName =
      `${order.first_name || ""} ${order.last_name || ""}`.toLowerCase();

    return (
      order.order_number?.toLowerCase().includes(search) ||
      order.customer_email?.toLowerCase().includes(search) ||
      customerName.includes(search) ||
      order.payment_method?.toLowerCase().includes(search) ||
      order.status?.toLowerCase().includes(search) ||
      order.promo_code?.toLowerCase().includes(search) ||
      order.tracking_number?.toLowerCase().includes(search)
    );
  });

  const totalOrders = orders.length;

  const awaitingPayment = orders.filter(
    (order) => order.status === "awaiting_payment"
  ).length;

  const paidOrders = orders.filter(
    (order) => order.status === "paid"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "shipped"
  ).length;

  const totalRevenue = orders
    .filter(
      (order) =>
        order.status === "paid" ||
        order.status === "shipped" ||
        order.status === "Payment Received"
    )
    .reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#081526] px-6 text-white">
        <div className="w-full max-w-md rounded-[32px] border border-blue-400/20 bg-white/[0.04] p-8 shadow-[0_0_50px_rgba(59,130,246,0.18)]">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-300">
            Apexx Admin
          </p>

          <h1 className="mb-4 text-4xl font-black">
            Admin Access
          </h1>

          <p className="mb-6 text-white/60">
            Enter your username and password to view orders.
          </p>

          {loginError && (
            <p className="mb-4 text-sm font-bold text-red-300">
              {loginError}
            </p>
          )}

          {lockedOut ? (
            <p className="font-bold text-red-300">
              Too many failed attempts. Access has been locked.
            </p>
          ) : (
            <>
              <input
                type="text"
                value={enteredUsername}
                onChange={(event) =>
                  setEnteredUsername(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleLogin();
                  }
                }}
                placeholder="Username"
                autoComplete="username"
                className="mb-4 w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-4 text-white outline-none placeholder:text-white/40 focus:border-blue-300/50"
              />

              <input
                type="password"
                value={enteredPassword}
                onChange={(event) =>
                  setEnteredPassword(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleLogin();
                  }
                }}
                placeholder="Password"
                autoComplete="current-password"
                className="mb-5 w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-4 text-white outline-none placeholder:text-white/40 focus:border-blue-300/50"
              />

              <button
                type="button"
                onClick={handleLogin}
                disabled={loggingIn}
                className="w-full rounded-full bg-blue-400 py-4 font-black uppercase tracking-widest text-[#081526] transition-all hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loggingIn
                  ? "Checking..."
                  : "Enter Dashboard"}
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <a
          href="/admin"
          className="mb-8 inline-flex text-sm uppercase tracking-widest text-blue-300 transition-all hover:text-white"
        >
          ← Back to Dashboard
        </a>

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-blue-300">
              Apexx Biolabs
            </p>

            <h1 className="text-4xl font-black sm:text-5xl">
              Admin Orders
            </h1>

            <p className="mt-4 text-white/60">
              View customer orders, payment status, and
              shipment progress.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-blue-300/20 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-widest text-white/50">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {totalOrders}
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-300/20 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-widest text-white/50">
                  Awaiting
                </p>

                <p className="mt-2 text-3xl font-black text-yellow-300">
                  {awaitingPayment}
                </p>
              </div>

              <div className="rounded-2xl border border-green-300/20 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-widest text-white/50">
                  Paid
                </p>

                <p className="mt-2 text-3xl font-black text-green-300">
                  {paidOrders}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-300/20 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-widest text-white/50">
                  Shipped
                </p>

                <p className="mt-2 text-3xl font-black text-blue-300">
                  {shippedOrders}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-300/20 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-widest text-white/50">
                  Revenue
                </p>

                <p className="mt-2 text-3xl font-black text-blue-300">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <a
            href="/"
            className="inline-flex w-fit rounded-full border border-blue-300/30 px-6 py-3 text-blue-200 transition-all hover:bg-blue-500/10"
          >
            Back to Site
          </a>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search by order number, name, email, promo, tracking, or status..."
            className="w-full rounded-full border border-blue-300/20 bg-white/[0.06] px-6 py-4 text-white outline-none placeholder:text-white/40 focus:border-blue-300/50"
          />
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
          {loading ? (
            <div className="p-10 text-white/60">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-10 text-white/60">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1500px] text-left">
                <thead className="bg-white/[0.06] text-xs uppercase tracking-widest text-blue-200">
                  <tr>
                    <th className="p-5">Order</th>
                    <th className="p-5">Customer</th>
                    <th className="p-5">Payment</th>
                    <th className="p-5">Total</th>
                    <th className="p-5">Promo</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Created</th>
                    <th className="p-5">Tracking</th>
                    <th className="p-5">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => {
                    const enteredTracking =
                      trackingInputs[order.id] || "";

                    const selectedCarrier =
                      carrierInputs[order.id] || "AUTO";

                    const detectedCarrier =
                      selectedCarrier === "AUTO"
                        ? detectCarrier(enteredTracking)
                        : selectedCarrier;

                    return (
                      <tr
                        key={order.id}
                        className="border-t border-white/10 transition-colors hover:bg-white/[0.03]"
                      >
                        <td className="p-5 font-bold text-white">
                          {order.order_number}
                        </td>

                        <td className="p-5">
                          <p className="font-semibold">
                            {order.first_name}{" "}
                            {order.last_name}
                          </p>

                          <p className="text-sm text-white/50">
                            {order.customer_email}
                          </p>
                        </td>

                        <td className="p-5 capitalize text-blue-200">
                          {order.payment_method}
                        </td>

                        <td className="p-5 font-black text-blue-300">
                          ${Number(order.total || 0).toFixed(2)}
                        </td>

                        <td className="p-5">
                          {order.promo_code ? (
                            <div>
                              <p className="font-bold text-green-300">
                                {order.promo_code}
                              </p>

                              <p className="text-sm text-white/50">
                                -$
                                {Number(
                                  order.discount || 0
                                ).toFixed(2)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-white/30">
                              None
                            </span>
                          )}
                        </td>

                        <td className="p-5">
                          <span className="inline-flex rounded-full border border-blue-300/30 bg-blue-500/10 px-4 py-2 text-xs uppercase tracking-widest text-blue-200">
                            {order.status.replaceAll("_", " ")}
                          </span>
                        </td>

                        <td className="p-5 text-sm text-white/50">
                          {new Date(
                            order.created_at
                          ).toLocaleString()}
                        </td>

                        <td className="p-5">
                          {order.status === "paid" ? (
                            <div className="flex min-w-[430px] flex-col gap-3">
                              <div className="flex gap-2">
                                <input
                                  value={enteredTracking}
                                  onChange={(event) => {
                                    const trackingNumber =
                                      event.target.value;

                                    setTrackingInputs(
                                      (current) => ({
                                        ...current,
                                        [order.id]:
                                          trackingNumber,
                                      })
                                    );
                                  }}
                                  placeholder="Tracking number"
                                  className="w-56 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-blue-300/50"
                                />

                                <select
                                  value={selectedCarrier}
                                  onChange={(event) => {
                                    setCarrierInputs(
                                      (current) => ({
                                        ...current,
                                        [order.id]:
                                          event.target
                                            .value as Carrier,
                                      })
                                    );
                                  }}
                                  className="rounded-full border border-white/10 bg-[#10223a] px-4 py-2 text-sm text-white outline-none focus:border-blue-300/50"
                                >
                                  <option value="AUTO">
                                    Auto Detect
                                  </option>

                                  <option value="USPS">
                                    USPS
                                  </option>

                                  <option value="UPS">
                                    UPS
                                  </option>

                                  <option value="FedEx">
                                    FedEx
                                  </option>

                                  <option value="DHL">
                                    DHL
                                  </option>
                                </select>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSendTracking(order)
                                  }
                                  disabled={
                                    sendingTracking[order.id]
                                  }
                                  className="rounded-full bg-blue-400 px-5 py-2 text-sm font-black text-[#081526] transition-all hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {sendingTracking[order.id]
                                    ? "Sending..."
                                    : "Send Tracking"}
                                </button>

                                {enteredTracking.trim() && (
                                  <span
                                    className={`text-xs ${
                                      detectedCarrier
                                        ? "text-green-300"
                                        : "text-yellow-300"
                                    }`}
                                  >
                                    {selectedCarrier !==
                                    "AUTO"
                                      ? `Selected: ${selectedCarrier}`
                                      : detectedCarrier
                                        ? `Detected: ${detectedCarrier}`
                                        : "Select carrier manually"}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : order.status === "shipped" ? (
                            <div>
                              <p className="font-bold text-blue-300">
                                Shipped
                              </p>

                              {order.tracking_number && (
                                <p className="mt-1 max-w-[220px] break-all text-xs text-white/50">
                                  {order.tracking_number}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-white/40">
                              Mark paid first
                            </span>
                          )}
                        </td>

                        <td className="p-5">
                          {order.status ===
                          "awaiting_payment" ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleMarkPaid(order.id)
                              }
                              disabled={
                                markingPaid[order.id]
                              }
                              className="rounded-full bg-blue-400 px-5 py-2 text-sm font-black text-[#081526] transition-all hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {markingPaid[order.id]
                                ? "Updating..."
                                : "Mark Paid"}
                            </button>
                          ) : order.status === "paid" ? (
                            <span className="font-bold text-green-400">
                              Paid
                            </span>
                          ) : order.status ===
                            "shipped" ? (
                            <span className="font-bold text-blue-300">
                              Shipped
                            </span>
                          ) : (
                            <span className="text-sm text-white/40">
                              {order.status.replaceAll(
                                "_",
                                " "
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}