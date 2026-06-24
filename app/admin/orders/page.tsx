"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  first_name: string;
  last_name: string;
  payment_method: string;
  total: number;
  status: string;
  tracking_number: string | null;
  created_at: string;
};

export default function AdminOrdersPage() {

    const markPaymentReceived = async (orderNumber: string) => {
  const response = await fetch("/api/orders/payment-received", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderNumber }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    alert("Failed to mark payment received.");
    return;
  }

  alert("Payment received. Inventory updated.");
  window.location.reload();
};

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
const [enteredUsername, setEnteredUsername] = useState("");
const [enteredPassword, setEnteredPassword] = useState("");
const [unlocked, setUnlocked] = useState(false);
const [lockedOut, setLockedOut] = useState(false);
const [loginError, setLoginError] = useState("");
const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
  const search = searchTerm.toLowerCase();

  const filteredOrders = orders.filter((order) => {
  const search = searchTerm.trim().toLowerCase();

  if (!search) return true;

  return (
    order.order_number?.toLowerCase().includes(search) ||
    order.customer_email?.toLowerCase().includes(search) ||
    order.first_name?.toLowerCase().includes(search) ||
    order.last_name?.toLowerCase().includes(search) ||
    order.payment_method?.toLowerCase().includes(search) ||
    order.status?.toLowerCase().includes(search)
  );
});

  return (
    order.order_number?.toLowerCase().includes(search) ||
    order.customer_email?.toLowerCase().includes(search) ||
    order.first_name?.toLowerCase().includes(search) ||
    order.last_name?.toLowerCase().includes(search) ||
    order.status?.toLowerCase().includes(search)
  );
});

const totalOrders = orders.length;
const awaitingPayment = orders.filter((o) => o.status === "awaiting_payment").length;
const paidOrders = orders.filter((o) => o.status === "paid").length;
const shippedOrders = orders.filter((o) => o.status === "shipped").length;
const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  if (!unlocked) {
  return (
    <main className="min-h-screen bg-[#081526] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[32px] border border-blue-400/20 bg-white/[0.04] p-8 shadow-[0_0_50px_rgba(59,130,246,0.18)]">
        <p className="uppercase tracking-[0.35em] text-blue-300 text-xs mb-4">
          Apexx Admin
        </p>

        <h1 className="text-4xl font-black mb-4">Admin Access</h1>

        <p className="text-white/60 mb-6">
          Enter your username and password to view orders.
        </p>

        {loginError && (
          <p className="mb-4 text-sm text-red-300 font-bold">
            {loginError}
          </p>
        )}

        {lockedOut ? (
          <p className="text-red-300 font-bold">
            Too many failed attempts. Access has been locked.
          </p>
        ) : (
          <>
            <input
              type="text"
              value={enteredUsername}
              onChange={(e) => setEnteredUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-full bg-white/[0.06] border border-white/10 px-5 py-4 text-white outline-none mb-4"
            />

            <input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-full bg-white/[0.06] border border-white/10 px-5 py-4 text-white outline-none mb-5"
            />

            <button
              onClick={async () => {
                const response = await fetch("/api/admin/login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username: enteredUsername,
                    password: enteredPassword,
                  }),
                });

                const result = await response.json();

                if (result.success) {
                  setUnlocked(true);
                  setLoginError("");
                } else if (result.locked) {
                  setLockedOut(true);
                  setLoginError("Too many failed attempts. Access locked.");
                } else {
                  setLoginError(
                    `Incorrect login. Attempts left: ${result.attemptsLeft}`
                  );
                }
              }}
              className="w-full rounded-full bg-blue-400 text-[#081526] font-black py-4 uppercase tracking-widest"
            >
              Enter Dashboard
            </button>
          </>
        )}
      </div>
    </main>
  );
}

  return (

    <main className="min-h-screen bg-[#081526] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <a
          href="/admin"
          className="inline-flex mb-8 text-blue-300 hover:text-white text-sm uppercase tracking-widest transition-all"
        >
          ← Back to Dashboard
        </a>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
              Apexx Biolabs
            </p>

            <h1 className="text-5xl font-black">
              Admin Orders
            </h1>

            <p className="text-white/60 mt-4">
              View customer orders, payment status, and shipment progress.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
  <div className="rounded-2xl border border-blue-300/20 bg-white/[0.04] p-5">
    <p className="text-white/50 text-xs uppercase tracking-widest">Total Orders</p>
    <p className="text-3xl font-black text-white mt-2">{totalOrders}</p>
  </div>

  <div className="rounded-2xl border border-yellow-300/20 bg-white/[0.04] p-5">
    <p className="text-white/50 text-xs uppercase tracking-widest">Awaiting</p>
    <p className="text-3xl font-black text-yellow-300 mt-2">{awaitingPayment}</p>
  </div>

  <div className="rounded-2xl border border-green-300/20 bg-white/[0.04] p-5">
    <p className="text-white/50 text-xs uppercase tracking-widest">Paid</p>
    <p className="text-3xl font-black text-green-300 mt-2">{paidOrders}</p>
  </div>

  <div className="rounded-2xl border border-blue-300/20 bg-white/[0.04] p-5">
    <p className="text-white/50 text-xs uppercase tracking-widest">Shipped</p>
    <p className="text-3xl font-black text-blue-300 mt-2">{shippedOrders}</p>
  </div>

  <div className="rounded-2xl border border-blue-300/20 bg-white/[0.04] p-5">
    <p className="text-white/50 text-xs uppercase tracking-widest">Revenue</p>
    <p className="text-3xl font-black text-blue-300 mt-2">
      ${totalRevenue.toFixed(2)}
    </p>
  </div>
</div>

          </div>

          <a
            href="/"
            className="rounded-full border border-blue-300/30 px-6 py-3 text-blue-200 hover:bg-blue-500/10 transition-all"
          >
            Back to Site
          </a>
        </div>

<div className="mb-6">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search by order number, name, email, or status..."
    className="w-full rounded-full border border-blue-300/20 bg-white/[0.06] px-6 py-4 text-white placeholder:text-white/40 outline-none focus:border-blue-300/50"
  />
</div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] overflow-hidden">
          {loading ? (
            <div className="p-10 text-white/60">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-10 text-white/60">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
<table className="min-w-[1300px] w-full text-left">
                    <thead className="bg-white/[0.06] text-blue-200 uppercase tracking-widest text-xs">
                  <tr>
                    <th className="p-5">Order</th>
                    <th className="p-5">Customer</th>
                    <th className="p-5">Payment</th>
                    <th className="p-5">Total</th>
                    <th className="p-5">Status</th>
<th className="p-5">Created</th>
<th className="p-5">Tracking</th>
<th className="p-5">Actions</th>                  
</tr>
                </thead>

                <tbody>
{filteredOrders.map((order) => (
                            <tr
                      key={order.id}
                      className="border-t border-white/10 hover:bg-white/[0.03]"
                    >
                      <td className="p-5 font-bold text-white">
                        {order.order_number}
                      </td>

                      <td className="p-5">
                        <p className="font-semibold">
                          {order.first_name} {order.last_name}
                        </p>
                        <p className="text-white/50 text-sm">
                          {order.customer_email}
                        </p>
                      </td>

                      <td className="p-5 capitalize text-blue-200">
                        {order.payment_method}
                      </td>

                      <td className="p-5 font-black text-blue-300">
                        ${Number(order.total).toFixed(2)}
                      </td>

                      <td className="p-5">
                        <span className="inline-flex rounded-full border border-blue-300/30 bg-blue-500/10 px-4 py-2 text-xs uppercase tracking-widest text-blue-200">
                          {order.status}
                        </span>
                      </td>

                      <td className="p-5 text-white/50 text-sm">
                        {new Date(order.created_at).toLocaleString()}
                      </td>

{/* Tracking column */}
<td className="p-5">
  {order.status === "paid" ? (
    <div className="flex gap-2">
      <input
        value={trackingInputs[order.id] || ""}
        onChange={(e) =>
          setTrackingInputs({
            ...trackingInputs,
            [order.id]: e.target.value,
          })
        }
        placeholder="Tracking #"
        className="w-44 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm text-white outline-none"
      />

      <button
        onClick={async () => {
          await fetch("/api/admin/send-tracking", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: order.id,
              trackingNumber: trackingInputs[order.id],
              carrier: "USPS",
            }),
          });

          fetchOrders();
        }}
        className="rounded-full bg-blue-400 px-5 py-2 text-sm font-black text-[#081526] hover:bg-blue-300 transition-all"
      >
        Send
      </button>
    </div>
  ) : order.status === "shipped" ? (
    <span className="text-blue-300 font-bold">Shipped</span>
  ) : (
    <span className="text-white/40 text-sm">Mark paid first</span>
  )}
</td>

{/* Actions column */}
<td className="p-5">
  {order.status === "awaiting_payment" ? (
    <button
      onClick={async () => {
        await fetch("/api/admin/mark-paid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
          }),
        });

        fetchOrders();
      }}
      className="rounded-full bg-blue-400 px-5 py-2 text-sm font-black text-[#081526] hover:bg-blue-300 transition-all"
    >
      Mark Paid
    </button>
  ) : order.status === "paid" ? (
    <span className="text-green-400 font-bold">Paid</span>
  ) : (
    <span className="text-blue-300 font-bold">Shipped</span>
  )}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}