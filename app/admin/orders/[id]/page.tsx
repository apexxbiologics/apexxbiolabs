import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type CartItem = {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
};

function formatMoney(value: unknown) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusClasses(status: string) {
  const normalized = String(status || "").toLowerCase();

  if (
    normalized === "paid" ||
    normalized === "payment received"
  ) {
    return "border-green-400/20 bg-green-500/10 text-green-200";
  }

  if (normalized === "shipped") {
    return "border-blue-400/20 bg-blue-500/10 text-blue-200";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "refunded"
  ) {
    return "border-red-400/20 bg-red-500/10 text-red-200";
  }

  return "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";
}

export default async function AdminOrderDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const {
    data: order,
    error,
  } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  const cart = Array.isArray(order.cart)
    ? (order.cart as CartItem[])
    : [];

  const customerName =
    `${order.first_name || ""} ${order.last_name || ""}`.trim() ||
    "Customer";

  const discount = Number(order.discount || 0);
  const rewardDiscount = Number(order.reward_discount || 0);
  const shipping = Number(order.shipping || 0);
  const subtotal = Number(order.subtotal || 0);
  const total = Number(order.total || 0);

  return (
    <main className="min-h-screen bg-[#081526] px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <a
            href="/admin/orders"
            className="inline-flex text-sm uppercase tracking-widest text-blue-300 transition-all hover:text-white"
          >
            ← Back to Orders
          </a>

          {order.customer_email && (
            <a
              href="/admin/customers"
              className="inline-flex text-sm uppercase tracking-widest text-white/40 transition-all hover:text-white"
            >
              Customers
            </a>
          )}
        </div>

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-blue-300">
              Apexx Order
            </p>

            <h1 className="text-4xl font-black sm:text-5xl">
              {order.order_number || order.id}
            </h1>

            <p className="mt-3 text-white/50">
              Placed {formatDate(order.created_at)}
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-5 py-2 text-sm font-bold capitalize ${statusClasses(
              order.status
            )}`}
          >
            {String(order.status || "Unknown").replaceAll("_", " ")}
          </span>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Customer
            </p>
            <p className="mt-3 font-bold">{customerName}</p>
            <p className="mt-1 break-all text-sm text-blue-200">
              {order.customer_email || "—"}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Payment
            </p>
            <p className="mt-3 font-bold capitalize">
              {String(order.payment_method || "—").replaceAll("_", " ")}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Total
            </p>
            <p className="mt-3 text-3xl font-black text-blue-300">
              {formatMoney(total)}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Tracking
            </p>
            <p className="mt-3 break-all font-bold">
              {order.tracking_number || "Not added"}
            </p>
            {order.carrier && (
              <p className="mt-1 text-sm text-white/45">
                {order.carrier}
              </p>
            )}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 lg:col-span-2">
            <h2 className="mb-6 text-2xl font-black">
              Order Items
            </h2>

            {cart.length === 0 ? (
              <p className="text-white/45">
                No cart items were found on this order.
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => {
                  const quantity = Number(item.quantity || 0);
                  const price = Number(item.price || 0);

                  return (
                    <div
                      key={`${item.id || item.name || "item"}-${index}`}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/10 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Order item"}
                            className="h-16 w-16 shrink-0 rounded-xl object-contain"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-xs text-white/30">
                            No Image
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-bold">
                            {item.name || item.id || "Item"}
                          </p>
                          <p className="mt-1 text-sm text-white/45">
                            Qty {quantity} × {formatMoney(price)}
                          </p>
                        </div>
                      </div>

                      <p className="text-lg font-black text-blue-300">
                        {formatMoney(quantity * price)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[30px] border border-blue-400/15 bg-blue-500/[0.05] p-7">
            <h2 className="mb-6 text-2xl font-black">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/50">Subtotal</span>
                <span className="font-bold">
                  {formatMoney(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/50">
                    Promo Discount
                    {order.promo_code ? ` (${order.promo_code})` : ""}
                  </span>
                  <span className="font-bold text-green-300">
                    -{formatMoney(discount)}
                  </span>
                </div>
              )}

              {rewardDiscount > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/50">
                    Rewards
                  </span>
                  <span className="font-bold text-green-300">
                    -{formatMoney(rewardDiscount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <span className="text-white/50">Shipping</span>
                <span className="font-bold">
                  {formatMoney(shipping)}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-black">
                    Total
                  </span>
                  <span className="text-2xl font-black text-blue-300">
                    {formatMoney(total)}
                  </span>
                </div>
              </div>
            </div>

            {order.redeemed_points ? (
              <div className="mt-6 rounded-2xl border border-purple-300/15 bg-purple-500/10 p-4">
                <p className="text-xs uppercase tracking-widest text-purple-200/60">
                  Redeemed Points
                </p>
                <p className="mt-2 font-black text-purple-200">
                  {Number(order.redeemed_points || 0)}
                </p>
              </div>
            ) : null}
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7">
            <h2 className="mb-6 text-2xl font-black">
              Shipping Address
            </h2>

            <div className="space-y-2 text-white/70">
              <p className="font-bold text-white">
                {customerName}
              </p>

              {order.address && <p>{order.address}</p>}

              {(order.city || order.state || order.zip_code) && (
                <p>
                  {[order.city, order.state, order.zip_code]
                    .filter(Boolean)
                    .join(", ")
                    .replace(", ,", ",")}
                </p>
              )}

              {!order.address &&
                !order.city &&
                !order.state &&
                !order.zip_code && (
                  <p className="text-white/35">
                    No shipping address saved.
                  </p>
                )}
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7">
            <h2 className="mb-6 text-2xl font-black">
              Order Details
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Order ID
                </p>
                <p className="mt-2 break-all text-sm font-semibold">
                  {order.id}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Status
                </p>
                <p className="mt-2 font-semibold capitalize">
                  {String(order.status || "Unknown").replaceAll("_", " ")}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Created
                </p>
                <p className="mt-2 font-semibold">
                  {formatDate(order.created_at)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Promo Code
                </p>
                <p className="mt-2 font-semibold">
                  {order.promo_code || "None"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
