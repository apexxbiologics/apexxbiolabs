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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [enteredPassword, setEnteredPassword] = useState("");
const [unlocked, setUnlocked] = useState(false);

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

  if (!unlocked) {
  return (
    <main className="min-h-screen bg-[#081526] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[32px] border border-blue-400/20 bg-white/[0.04] p-8 shadow-[0_0_50px_rgba(59,130,246,0.18)]">
        <p className="uppercase tracking-[0.35em] text-blue-300 text-xs mb-4">
          Apexx Admin
        </p>

        <h1 className="text-4xl font-black mb-4">
          Admin Access
        </h1>

        <p className="text-white/60 mb-6">
          Enter your admin password to view orders.
        </p>

        <input
          type="password"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full rounded-full bg-white/[0.06] border border-white/10 px-5 py-4 text-white outline-none mb-5"
        />

        <button
          onClick={() => {
            if (enteredPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
              setUnlocked(true);
            } else {
              alert("Incorrect password");
            }
          }}
          className="w-full rounded-full bg-blue-400 text-[#081526] font-black py-4 uppercase tracking-widest"
        >
          Enter Dashboard
        </button>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-10">
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
          </div>

          <a
            href="/"
            className="rounded-full border border-blue-300/30 px-6 py-3 text-blue-200 hover:bg-blue-500/10 transition-all"
          >
            Back to Site
          </a>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] overflow-hidden">
          {loading ? (
            <div className="p-10 text-white/60">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-white/60">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.06] text-blue-200 uppercase tracking-widest text-xs">
                  <tr>
                    <th className="p-5">Order</th>
                    <th className="p-5">Customer</th>
                    <th className="p-5">Payment</th>
                    <th className="p-5">Total</th>
                    <th className="p-5">Status</th>
<th className="p-5">Created</th>
<th className="p-5">Actions</th>                  
</tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
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

                      <td className="p-5">
  {order.status !== "paid" ? (
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
  ) : (
    <span className="text-green-400 font-bold">
      Paid
    </span>
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