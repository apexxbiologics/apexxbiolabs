"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  first_name: string;
  last_name: string;
  cart: any;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  tracking_number: string | null;
  carrier: string | null;
  created_at: string;
};

export default function AccountPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        router.push("/account/login");
        return;
      }

      setEmail(user.email);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user.email.toLowerCase())
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }

      setLoading(false);
    }

    loadAccount();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/account/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
        <p className="text-center text-white/60">Loading account...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
              Customer Portal
            </p>

            <h1 className="text-5xl font-black tracking-tight">
              My Account
            </h1>

            <p className="mt-4 text-white/60">
              Signed in as {email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition hover:border-blue-400/50 hover:bg-white/[0.08]"
          >
            Log Out
          </button>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur md:p-8">
          <h2 className="mb-6 text-3xl font-black">Order History</h2>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <p className="text-white/60">
                No orders found for this email.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-block rounded-full bg-blue-500 px-7 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:bg-blue-400"
              >
                Shop Products
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const cartItems =
                  typeof order.cart === "string"
                    ? JSON.parse(order.cart)
                    : order.cart || [];

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-white/10 bg-[#0f2035] p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-blue-300">
                          {order.order_number}
                        </p>

                        <h3 className="mt-2 text-2xl font-black">
                          ${Number(order.total).toFixed(2)}
                        </h3>

                        <p className="mt-2 text-sm text-white/50">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                        {order.status}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3">
                      {cartItems.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm"
                        >
                          <span>{item.name}</span>
                          <span className="text-white/60">
                            Qty {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Payment
                        </p>
                        <p className="mt-1 capitalize">{order.status}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Carrier
                        </p>
                        <p className="mt-1">{order.carrier || "Not available yet"}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Tracking
                        </p>
                        <p className="mt-1">
                          {order.tracking_number || "Not available yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}