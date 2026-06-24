"use client";

import { useState } from "react";

type OrderStatus = {
  order_number: string;
  customer_email: string;
  first_name: string;
  last_name: string;
  total: number;
  status: string;
  tracking_number: string | null;
  carrier: string | null;
  created_at: string;
};

export default function OrderStatusPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getTrackingUrl = () => {
    if (!order?.tracking_number || !order?.carrier) return "";

    if (order.carrier === "USPS") {
      return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${order.tracking_number}`;
    }

    if (order.carrier === "UPS") {
      return `https://www.ups.com/track?tracknum=${order.tracking_number}`;
    }

    if (order.carrier === "FedEx") {
      return `https://www.fedex.com/fedextrack/?trknbr=${order.tracking_number}`;
    }

    return "";
  };

  const handleLookup = async () => {
    setLoading(true);
    setError("");
    setOrder(null);

    const response = await fetch("/api/order-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderNumber, email }),
    });

    const data = await response.json();

    if (!data.success) {
      setError(data.error || "Order not found.");
    } else {
      setOrder(data.order);
    }

    setLoading(false);
  };
  

  return (

    <main className="min-h-screen bg-[#081526] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
            Apexx Biolabs
          </p>

          <h1 className="text-5xl md:text-6xl font-black mb-5">
            Order Status
          </h1>

          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Enter your order number and email address to view payment and
            shipment status.
          </p>
        </div>

        <div className="rounded-[2rem] border border-blue-300/20 bg-white/[0.04] p-8 shadow-[0_0_50px_rgba(59,130,246,0.14)]">
          <div className="grid grid-cols-1 gap-5">
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order Number, e.g. APX-178205..."
              className="w-full rounded-full bg-white/[0.06] border border-white/10 px-6 py-4 text-white placeholder:text-white/40 outline-none focus:border-blue-300/50"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email used at checkout"
              className="w-full rounded-full bg-white/[0.06] border border-white/10 px-6 py-4 text-white placeholder:text-white/40 outline-none focus:border-blue-300/50"
            />

            <button
              onClick={handleLookup}
              disabled={loading}
              className="rounded-full bg-blue-400 text-[#081526] font-black py-4 uppercase tracking-widest hover:bg-blue-300 transition-all disabled:opacity-50"
            >
              {loading ? "Searching..." : "Check Status"}
            </button>
          </div>

          {error && (
            <p className="mt-6 text-red-300 font-bold text-center">
              {error}
            </p>
          )}

          {order && (
            <div className="mt-8 rounded-[2rem] border border-blue-300/20 bg-[#06111f] p-7">
              <p className="uppercase tracking-[0.3em] text-blue-300 text-xs mb-3">
                Order Found
              </p>

              <h2 className="text-3xl font-black mb-5">
                {order.order_number}
              </h2>

              <div className="space-y-3 text-white/70">
                <p>
                  <strong className="text-white">Customer:</strong>{" "}
                  {order.first_name} {order.last_name}
                </p>

                <p>
                  <strong className="text-white">Total:</strong>{" "}
                  ${Number(order.total).toFixed(2)}
                </p>

                <p>
                  <strong className="text-white">Status:</strong>{" "}
                  <span className="uppercase text-blue-300 font-bold">
                    {order.status.replace("_", " ")}
                  </span>
                </p>

                <p>
                  <strong className="text-white">Placed:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              {order.status === "shipped" && order.tracking_number && (
                <div className="mt-7 rounded-2xl border border-blue-300/20 bg-white/[0.05] p-5">
                  <p className="uppercase tracking-[0.25em] text-blue-300 text-xs mb-2">
                    Tracking
                  </p>

                  <p className="text-white font-black break-all">
                    {order.tracking_number}
                  </p>

                  <p className="text-white/50 mt-2">
                    Carrier: {order.carrier}
                  </p>

                  {getTrackingUrl() && (
                    <a
                      href={getTrackingUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-5 rounded-full bg-blue-400 px-6 py-3 text-[#081526] font-black uppercase tracking-widest hover:bg-blue-300 transition-all"
                    >
                      Track Package
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}