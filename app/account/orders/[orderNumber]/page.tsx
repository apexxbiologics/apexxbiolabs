"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Truck, CreditCard, RotateCcw } from "lucide-react";

type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
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

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        router.push("/account/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .eq("customer_email", user.email.toLowerCase())
        .single();

      if (!error && data) {
        setOrder(data as Order);
      }

      setLoading(false);
    }

    loadOrder();
  }, [orderNumber, router]);

  function handleReorder() {
    if (!order) return;

    const cartItems =
      typeof order.cart === "string" ? JSON.parse(order.cart) : order.cart || [];

    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
    router.push("/cart");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
        <p className="text-center text-white/60">Loading order...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black">Order not found</h1>
          <p className="mt-4 text-white/60">
            This order either does not exist or is not connected to your account.
          </p>

          <Link
            href="/account"
            className="mt-8 inline-flex rounded-full bg-blue-500 px-7 py-4 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-blue-400"
          >
            Back to Account
          </Link>
        </div>
      </main>
    );
  }

  const cartItems =
    typeof order.cart === "string" ? JSON.parse(order.cart) : order.cart || [];

  const status = order.status?.toLowerCase();

  const steps = [
    { label: "Order Placed", active: true },
    {
      label: "Payment Review",
      active: ["awaiting_payment", "paid", "processing", "shipped"].includes(
        status
      ),
    },
    {
      label: "Processing",
      active: ["paid", "processing", "shipped"].includes(status),
    },
    {
      label: "Shipped",
      active: status === "shipped",
    },
  ];

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-28 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/account"
          className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-blue-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Account
        </Link>

        <div className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-blue-300">
            Order Details
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                {order.order_number}
              </h1>

              <p className="mt-4 text-white/60">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
              {order.status}
            </div>
          </div>
        </div>

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="mb-8 text-3xl font-black">Order Timeline</h2>

          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.label}
                className={`rounded-2xl border p-5 ${
                  step.active
                    ? "border-blue-400/40 bg-blue-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <p
                  className={`mb-3 text-2xl font-black ${
                    step.active ? "text-blue-300" : "text-white/30"
                  }`}
                >
                  {step.active ? "✓" : "○"}
                </p>

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                  {step.label}
                </p>

                <p className="mt-2 text-xs text-white/45">
                  Step {index + 1}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <div className="mb-6 flex items-center gap-3">
              <Package className="text-blue-300" />
              <h2 className="text-3xl font-black">Items Ordered</h2>
            </div>

            <div className="space-y-4">
              {cartItems.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0f2035] p-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-2xl object-contain"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-black">{item.name}</h3>
                    <p className="mt-1 text-sm text-white/50">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-black text-blue-300">
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleReorder}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-500 px-7 py-4 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-blue-400"
            >
              <RotateCcw size={16} />
              Reorder
            </button>
          </section>

          <aside className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
              <div className="mb-5 flex items-center gap-3">
                <CreditCard className="text-blue-300" />
                <h2 className="text-2xl font-black">Payment Summary</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>${Number(order.shipping).toFixed(2)}</span>
                </div>

                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-green-300">
                    <span>Discount</span>
                    <span>-${Number(order.discount).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-white/10 pt-4 text-xl font-black text-white">
                  <span>Total</span>
                  <span className="text-blue-300">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
              <div className="mb-5 flex items-center gap-3">
                <Truck className="text-blue-300" />
                <h2 className="text-2xl font-black">Shipping</h2>
              </div>

              <div className="space-y-5 text-sm text-white/65">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/35">
                    Ship To
                  </p>
                  <p className="text-white">
                    {order.first_name} {order.last_name}
                  </p>
                  <p>{order.address}</p>
                  <p>
                    {order.city}, {order.state} {order.zip_code}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/35">
                    Carrier
                  </p>
                  <p className="text-white">
                    {order.carrier || "Not available yet"}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/35">
                    Tracking
                  </p>
                  <p className="text-white break-all">
                    {order.tracking_number || "Not available yet"}
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}