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

type ConversationMessage = {
  id: string;
  direction: "outbound" | "inbound";
  subject: string;
  body_text: string;
  from_email: string | null;
  to_email: string | null;
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

  const [contactOrder, setContactOrder] = useState<Order | null>(null);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sendingCustomerEmail, setSendingCustomerEmail] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [loadingConversation, setLoadingConversation] = useState(false);

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

  const loadConversation = async (order: Order) => {
    try {
      setLoadingConversation(true);
      const response = await fetch(
        `/api/admin/order-conversation?orderId=${encodeURIComponent(order.id)}`,
        { cache: "no-store" }
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        setConversationMessages([]);
        setContactError(result.error || "Conversation history could not be loaded.");
        return;
      }

      const messages = (result.messages || []) as ConversationMessage[];
      setConversationMessages(messages);

      if (messages.length > 0) {
        const firstSubject = messages[0].subject || `Regarding Your Apexx Biolabs Order ${order.order_number}`;
        setContactSubject(/^re:/i.test(firstSubject) ? firstSubject : `Re: ${firstSubject}`);
      }
    } catch (error) {
      console.error("Conversation load error:", error);
      setConversationMessages([]);
      setContactError("Conversation history could not be loaded.");
    } finally {
      setLoadingConversation(false);
    }
  };

  const openContactModal = (order: Order) => {
    setContactOrder(order);
    setContactSubject(`Regarding Your Apexx Biolabs Order ${order.order_number}`);
    setContactMessage("");
    setContactError("");
    setContactSuccess("");
    setConversationMessages([]);
    void loadConversation(order);
  };

  const closeContactModal = () => {
    if (sendingCustomerEmail) return;
    setContactOrder(null);
    setContactSubject("");
    setContactMessage("");
    setContactError("");
    setContactSuccess("");
    setConversationMessages([]);
  };

  const handleContactCustomer = async () => {
    if (!contactOrder) return;

    const subject = contactSubject.trim();
    const message = contactMessage.trim();

    if (!subject) {
      setContactError("Please enter an email subject.");
      return;
    }

    if (!message) {
      setContactError("Please enter a message.");
      return;
    }

    try {
      setSendingCustomerEmail(true);
      setContactError("");
      setContactSuccess("");

      const response = await fetch("/api/admin/contact-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: contactOrder.id,
          subject,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setContactError(result.error || "The email could not be sent.");
        return;
      }

      setContactSuccess(
        result.warning
          ? `Email sent to ${contactOrder.customer_email}. ${result.warning}`
          : `Email sent successfully to ${contactOrder.customer_email}.`
      );
      setContactMessage("");
      await loadConversation(contactOrder);
    } catch (error) {
      console.error("Contact customer error:", error);
      setContactError("Something went wrong while sending the email.");
    } finally {
      setSendingCustomerEmail(false);
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
                          <div className="flex min-w-[180px] flex-col items-start gap-3">
                            {order.status === "awaiting_payment" ? (
                              <button
                                type="button"
                                onClick={() => handleMarkPaid(order.id)}
                                disabled={markingPaid[order.id]}
                                className="rounded-full bg-blue-400 px-5 py-2 text-sm font-black text-[#081526] transition-all hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {markingPaid[order.id] ? "Updating..." : "Mark Paid"}
                              </button>
                            ) : order.status === "paid" ? (
                              <span className="font-bold text-green-400">Paid</span>
                            ) : order.status === "shipped" ? (
                              <span className="font-bold text-blue-300">Shipped</span>
                            ) : (
                              <span className="text-sm text-white/40">
                                {order.status.replaceAll("_", " ")}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => openContactModal(order)}
                              className="rounded-full border border-blue-300/30 bg-blue-500/10 px-5 py-2 text-sm font-bold text-blue-200 transition-all hover:border-blue-300/60 hover:bg-blue-500/20 hover:text-white"
                            >
                              Conversation / Email
                            </button>
                          </div>
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

      {contactOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeContactModal();
          }}
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-blue-300/20 bg-[#0b1b30] p-6 shadow-2xl sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.35em] text-blue-300">Order Conversation</p>
                <h2 className="text-3xl font-black text-white">Customer Conversation</h2>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  View the order conversation and send a branded Apexx reply. This stays separate from promotional campaigns.
                </p>
              </div>
              <button
                type="button"
                onClick={closeContactModal}
                disabled={sendingCustomerEmail}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:opacity-40"
                aria-label="Close contact customer window"
              >
                ×
              </button>
            </div>

            <div className="mb-6 grid gap-3 rounded-2xl border border-blue-300/15 bg-white/[0.04] p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40">Customer</p>
                <p className="mt-1 font-bold text-white">{contactOrder.first_name} {contactOrder.last_name}</p>
                <p className="mt-1 break-all text-sm text-blue-200">{contactOrder.customer_email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40">Order</p>
                <p className="mt-1 font-bold text-white">{contactOrder.order_number}</p>
                <p className="mt-1 text-sm capitalize text-white/55">{contactOrder.status.replaceAll("_", " ")}</p>
              </div>
            </div>

            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">Conversation</p>
                  <p className="mt-1 text-sm text-white/45">Customer replies will appear here after the Resend inbound webhook is connected.</p>
                </div>
                {conversationMessages.length > 0 && (
                  <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">
                    {conversationMessages.length} message{conversationMessages.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              <div className="conversation-scrollbar max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/10 p-4">
                {loadingConversation ? (
                  <p className="py-6 text-center text-sm text-white/45">Loading conversation...</p>
                ) : conversationMessages.length === 0 ? (
                  <p className="py-6 text-center text-sm text-white/45">No saved messages yet. Your first email will start this conversation.</p>
                ) : (
                  conversationMessages.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-4 ${
                        item.direction === "outbound"
                          ? "ml-6 border-blue-300/20 bg-blue-500/10"
                          : "mr-6 border-green-300/20 bg-green-500/10"
                      }`}
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <span className={`text-xs font-black uppercase tracking-widest ${item.direction === "outbound" ? "text-blue-200" : "text-green-200"}`}>
                          {item.direction === "outbound" ? "Apexx Biolabs" : "Customer"}
                        </span>
                        <span className="text-xs text-white/35">{new Date(item.created_at).toLocaleString()}</span>
                      </div>
                      <p className="mb-2 text-sm font-bold text-white/85">{item.subject}</p>
                      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/65">{item.body_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-200">Subject</label>
            <input
              type="text"
              value={contactSubject}
              onChange={(event) => setContactSubject(event.target.value)}
              maxLength={180}
              className="mb-5 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-blue-300/50"
            />

            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-200">Message</label>
            <textarea
              value={contactMessage}
              onChange={(event) => setContactMessage(event.target.value)}
              rows={9}
              maxLength={5000}
              placeholder={`Hi ${contactOrder.first_name || "there"},\n\nWe're reaching out regarding your order...`}
              className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 leading-7 text-white outline-none placeholder:text-white/30 focus:border-blue-300/50"
            />

            <div className="mt-2 flex justify-between text-xs text-white/35">
              <span>Line breaks are preserved.</span>
              <span>{contactMessage.length}/5000</span>
            </div>

            {contactError && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-200">{contactError}</div>
            )}
            {contactSuccess && (
              <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-5 py-4 text-sm font-bold text-green-200">{contactSuccess}</div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeContactModal}
                disabled={sendingCustomerEmail}
                className="rounded-full border border-white/10 px-6 py-3 font-bold text-white/70 transition-all hover:bg-white/5 hover:text-white disabled:opacity-40"
              >
                {contactSuccess ? "Close" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleContactCustomer}
                disabled={sendingCustomerEmail || !contactSubject.trim() || !contactMessage.trim()}
                className="rounded-full bg-blue-400 px-7 py-3 font-black uppercase tracking-widest text-[#081526] transition-all hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sendingCustomerEmail
                  ? "Sending..."
                  : conversationMessages.length > 0
                    ? "Send Reply"
                    : "Send Email"}
              </button>
            </div>

            <style jsx>{`
              .conversation-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #3b82f6 #0b1b30;
              }

              .conversation-scrollbar::-webkit-scrollbar {
                width: 8px;
              }

              .conversation-scrollbar::-webkit-scrollbar-track {
                background: #0b1b30;
                border-radius: 999px;
              }

              .conversation-scrollbar::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #60a5fa, #2563eb);
                border: 2px solid #0b1b30;
                border-radius: 999px;
              }

              .conversation-scrollbar::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #93c5fd, #3b82f6);
              }
            `}</style>
          </div>
        </div>
      )}
    </main>
  );
}