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
  path?: string;

  price?: number;
  basePrice?: number;
  quantity?: number;

  /*
   * SAME-PRODUCT / BULK PRICING
   */
  quantityDiscountPercent?: number;
  quantityDiscountTierId?: string | null;
  quantityDiscountTierQuantity?: number | null;

  /*
   * BUILD YOUR OWN BUNDLE
   */
  bundleId?: string | null;
  bundleType?: string | null;
  bundleDiscountPercent?: number;
  bundleTierQuantity?: number | null;
  bundleBaseUnitPrice?: number;
  bundleDiscountedUnitPrice?: number;

  /*
   * FLASH SALE
   */
  flashSaleApplied?: boolean;
  flashSaleId?: string | null;
  flashSalePrice?: number | null;
};

type BundleSummary = {
  bundleId: string;
  quantity: number;
  discountPercent: number;
  tierQuantity: number | null;
  regularTotal: number;
  discountedTotal: number;
};

type BulkSummary = {
  name: string;
  quantity: number;
  discountPercent: number;
  tierQuantity: number | null;
  regularPrice: number;
  discountedPrice: number;
};

type FlashSaleSummary = {
  name: string;
  quantity: number;
  regularPrice: number;
  salePrice: number;
  flashSaleId: string | null;
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
  const normalized = String(
    status || ""
  ).toLowerCase();

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

function normalizeCart(
  cart: unknown
): CartItem[] {
  if (Array.isArray(cart)) {
    return cart as CartItem[];
  }

  if (typeof cart === "string") {
    try {
      const parsed = JSON.parse(cart);

      return Array.isArray(parsed)
        ? (parsed as CartItem[])
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

function getBundleSummaries(
  cart: CartItem[]
): BundleSummary[] {
  const bundleMap = new Map<
    string,
    BundleSummary
  >();

  cart.forEach((item) => {
    const isBundle =
      item.bundleType ===
        "build-your-own" &&
      Boolean(item.bundleId);

    if (!isBundle || !item.bundleId) {
      return;
    }

    const quantity = Math.max(
      0,
      Number(item.quantity || 0)
    );

    const regularPrice = Number(
      item.bundleBaseUnitPrice ??
        item.basePrice ??
        item.price ??
        0
    );

    const discountedPrice = Number(
      item.bundleDiscountedUnitPrice ??
        item.price ??
        0
    );

    const discountPercent = Number(
      item.bundleDiscountPercent || 0
    );

    const existing =
      bundleMap.get(item.bundleId);

    if (existing) {
      existing.quantity += quantity;

      existing.regularTotal +=
        regularPrice * quantity;

      existing.discountedTotal +=
        discountedPrice * quantity;

      existing.discountPercent =
        Math.max(
          existing.discountPercent,
          discountPercent
        );

      if (
        item.bundleTierQuantity !==
          null &&
        item.bundleTierQuantity !==
          undefined
      ) {
        existing.tierQuantity =
          Number(
            item.bundleTierQuantity
          );
      }

      return;
    }

    bundleMap.set(item.bundleId, {
      bundleId: item.bundleId,
      quantity,
      discountPercent,
      tierQuantity:
        item.bundleTierQuantity !==
          null &&
        item.bundleTierQuantity !==
          undefined
          ? Number(
              item.bundleTierQuantity
            )
          : null,
      regularTotal:
        regularPrice * quantity,
      discountedTotal:
        discountedPrice * quantity,
    });
  });

  return Array.from(
    bundleMap.values()
  );
}

function getBulkSummaries(
  cart: CartItem[]
): BulkSummary[] {
  return cart
    .filter((item) => {
      const isBundle =
        item.bundleType ===
        "build-your-own";

      const isFlashSale =
        item.flashSaleApplied === true;

      return (
        !isBundle &&
        !isFlashSale &&
        Number(
          item.quantityDiscountPercent ||
            0
        ) > 0
      );
    })
    .map((item) => {
      const discountedPrice = Number(
        item.price || 0
      );

      const regularPrice = Number(
        item.basePrice ??
          item.bundleBaseUnitPrice ??
          discountedPrice
      );

      return {
        name:
          item.name ||
          item.id ||
          "Product",

        quantity: Math.max(
          0,
          Number(item.quantity || 0)
        ),

        discountPercent: Number(
          item.quantityDiscountPercent ||
            0
        ),

        tierQuantity:
          item.quantityDiscountTierQuantity !==
            null &&
          item.quantityDiscountTierQuantity !==
            undefined
            ? Number(
                item.quantityDiscountTierQuantity
              )
            : null,

        regularPrice,
        discountedPrice,
      };
    });
}

function getFlashSaleSummaries(
  cart: CartItem[]
): FlashSaleSummary[] {
  return cart
    .filter(
      (item) =>
        item.flashSaleApplied === true
    )
    .map((item) => {
      const salePrice = Number(
        item.flashSalePrice ??
          item.price ??
          0
      );

      const regularPrice = Number(
        item.basePrice ??
          item.price ??
          0
      );

      return {
        name:
          item.name ||
          item.id ||
          "Product",

        quantity: Math.max(
          0,
          Number(item.quantity || 0)
        ),

        regularPrice,
        salePrice,

        flashSaleId:
          item.flashSaleId || null,
      };
    });
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

  const cart =
    normalizeCart(order.cart);

  const customerName =
    `${order.first_name || ""} ${
      order.last_name || ""
    }`.trim() || "Customer";

  const discount = Number(
    order.discount || 0
  );

  const rewardDiscount = Number(
    order.reward_discount || 0
  );

  const redeemedPoints = Number(
    order.redeemed_points || 0
  );

  const shipping = Number(
    order.shipping || 0
  );

  const subtotal = Number(
    order.subtotal || 0
  );

  const total = Number(
    order.total || 0
  );

  const promoCode = String(
    order.promo_code || ""
  ).trim();

  /*
   * SPECIAL PRICING SUMMARIES
   */
  const bundleSummaries =
    getBundleSummaries(cart);

  const bulkSummaries =
    getBulkSummaries(cart);

  const flashSaleSummaries =
    getFlashSaleSummaries(cart);

  const hasBundlePricing =
    bundleSummaries.length > 0;

  const hasBulkPricing =
    bulkSummaries.length > 0;

  const hasFlashSale =
    flashSaleSummaries.length >
    0;

  const hasPromoCode =
    Boolean(promoCode);

  const hasRewards =
    redeemedPoints > 0 ||
    rewardDiscount > 0;

  const hasAnySpecialPricing =
    hasBundlePricing ||
    hasBulkPricing ||
    hasFlashSale ||
    hasPromoCode ||
    hasRewards;

  return (
    <main className="min-h-screen bg-[#081526] px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================
            TOP NAVIGATION
        ===================================== */}

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

        {/* =====================================
            ORDER HEADER
        ===================================== */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-blue-300">
              Apexx Order
            </p>

            <h1 className="text-4xl font-black sm:text-5xl">
              {order.order_number ||
                order.id}
            </h1>

            <p className="mt-3 text-white/50">
              Placed{" "}
              {formatDate(
                order.created_at
              )}
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-5 py-2 text-sm font-bold capitalize ${statusClasses(
              order.status
            )}`}
          >
            {String(
              order.status ||
                "Unknown"
            ).replaceAll(
              "_",
              " "
            )}
          </span>
        </div>

        {/* =====================================
            ORDER INFO CARDS
        ===================================== */}

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* CUSTOMER */}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Customer
            </p>

            <p className="mt-3 font-bold">
              {customerName}
            </p>

            <p className="mt-1 break-all text-sm text-blue-200">
              {order.customer_email ||
                "—"}
            </p>
          </div>

          {/* PAYMENT */}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Payment
            </p>

            <p className="mt-3 font-bold capitalize">
              {String(
                order.payment_method ||
                  "—"
              ).replaceAll(
                "_",
                " "
              )}
            </p>
          </div>

          {/* TOTAL */}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Total
            </p>

            <p className="mt-3 text-3xl font-black text-blue-300">
              {formatMoney(total)}
            </p>
          </div>

          {/* TRACKING */}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Tracking
            </p>

            <p className="mt-3 break-all font-bold">
              {order.tracking_number ||
                "Not added"}
            </p>

            {order.carrier && (
              <p className="mt-1 text-sm text-white/45">
                {order.carrier}
              </p>
            )}
          </div>
        </div>

        {/* =====================================
            ORDER ITEMS + SUMMARY
        ===================================== */}

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ORDER ITEMS */}

          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 lg:col-span-2">
            <h2 className="mb-6 text-2xl font-black">
              Order Items
            </h2>

            {cart.length === 0 ? (
              <p className="text-white/45">
                No cart items were
                found on this order.
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map(
                  (
                    item,
                    index
                  ) => {
                    const quantity =
                      Number(
                        item.quantity ||
                          0
                      );

                    const price =
                      Number(
                        item.price ||
                          0
                      );

                    const basePrice =
                      Number(
                        item.basePrice ??
                          item.bundleBaseUnitPrice ??
                          price
                      );

                    const isBundle =
                      item.bundleType ===
                      "build-your-own";

                    const isFlashSale =
                      item.flashSaleApplied ===
                      true;

                    const bulkDiscount =
                      Number(
                        item.quantityDiscountPercent ||
                          0
                      );

                    return (
                      <div
                        key={`${
                          item.id ||
                          item.name ||
                          "item"
                        }-${index}`}
                        className="rounded-2xl border border-white/10 bg-black/10 p-5"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex min-w-0 items-center gap-4">

                            {item.image ? (
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name ||
                                  "Order item"
                                }
                                className="h-16 w-16 shrink-0 rounded-xl object-contain"
                              />
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-xs text-white/30">
                                No Image
                              </div>
                            )}

                            <div className="min-w-0">

                              <p className="font-bold">
                                {item.name ||
                                  item.id ||
                                  "Item"}
                              </p>

                              <p className="mt-1 text-sm text-white/45">
                                Qty{" "}
                                {quantity} ×{" "}
                                {formatMoney(
                                  price
                                )}
                              </p>

                              {(isBundle ||
                                isFlashSale ||
                                bulkDiscount >
                                  0) && (
                                <div className="mt-2 flex flex-wrap gap-2">

                                  {isBundle && (
                                    <span className="rounded-full border border-purple-300/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-purple-200">
                                      Bundle ·{" "}
                                      {Number(
                                        item.bundleDiscountPercent ||
                                          0
                                      )}
                                      % Off
                                    </span>
                                  )}

                                  {isFlashSale && (
                                    <span className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-200">
                                      Flash Sale
                                    </span>
                                  )}

                                  {!isBundle &&
                                    !isFlashSale &&
                                    bulkDiscount >
                                      0 && (
                                      <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-200">
                                        Bulk ·{" "}
                                        {
                                          bulkDiscount
                                        }
                                        % Off
                                      </span>
                                    )}
                                </div>
                              )}

                              {basePrice >
                                price && (
                                <p className="mt-2 text-xs text-white/35">
                                  Regular{" "}
                                  {formatMoney(
                                    basePrice
                                  )}{" "}
                                  / vial
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="text-lg font-black text-blue-300">
                            {formatMoney(
                              quantity *
                                price
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* ORDER SUMMARY */}

          <section className="rounded-[30px] border border-blue-400/15 bg-blue-500/[0.05] p-7">

            <h2 className="mb-6 text-2xl font-black">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">

              <div className="flex items-center justify-between gap-4">
                <span className="text-white/50">
                  Subtotal
                </span>

                <span className="font-bold">
                  {formatMoney(
                    subtotal
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/50">
                    Promo Discount
                    {promoCode
                      ? ` (${promoCode})`
                      : ""}
                  </span>

                  <span className="font-bold text-green-300">
                    -
                    {formatMoney(
                      discount
                    )}
                  </span>
                </div>
              )}

              {rewardDiscount >
                0 && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/50">
                    Rewards
                  </span>

                  <span className="font-bold text-green-300">
                    -
                    {formatMoney(
                      rewardDiscount
                    )}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <span className="text-white/50">
                  Shipping
                </span>

                <span className="font-bold">
                  {shipping === 0
                    ? "FREE"
                    : formatMoney(
                        shipping
                      )}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-black">
                    Total
                  </span>

                  <span className="text-2xl font-black text-blue-300">
                    {formatMoney(
                      total
                    )}
                  </span>
                </div>
              </div>
            </div>

            {redeemedPoints >
            0 ? (
              <div className="mt-6 rounded-2xl border border-purple-300/15 bg-purple-500/10 p-4">

                <p className="text-xs uppercase tracking-widest text-purple-200/60">
                  Redeemed Points
                </p>

                <p className="mt-2 font-black text-purple-200">
                  {redeemedPoints}{" "}
                  points
                </p>

                {rewardDiscount >
                  0 && (
                  <p className="mt-1 text-xs text-purple-200/60">
                    {formatMoney(
                      rewardDiscount
                    )}{" "}
                    reward discount
                  </p>
                )}
              </div>
            ) : null}
          </section>
        </div>

        {/* =====================================
            PRICING & PROMOTIONS
        ===================================== */}

        <section className="mb-8 rounded-[30px] border border-blue-300/15 bg-white/[0.04] p-7">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.28em] text-blue-300">
                Pricing Details
              </p>

              <h2 className="text-2xl font-black">
                Pricing & Promotions
              </h2>

              <p className="mt-2 text-sm text-white/45">
                Discounts and
                promotional pricing
                used on this order.
              </p>
            </div>

            {hasAnySpecialPricing ? (
              <span className="rounded-full border border-green-300/20 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-green-200">
                Special Pricing Used
              </span>
            ) : (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/35">
                Standard Pricing
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {/* PROMO / AFFILIATE CODE */}

            <div className="rounded-2xl border border-green-300/15 bg-green-500/[0.06] p-5">

              <p className="text-xs font-black uppercase tracking-widest text-green-200/60">
                Promo / Affiliate
                Code
              </p>

              {promoCode ? (
                <>
                  <p className="mt-3 text-xl font-black text-green-200">
                    {promoCode}
                  </p>

                  <p className="mt-2 text-sm text-white/45">
                    Saved{" "}
                    {formatMoney(
                      discount
                    )}
                  </p>
                </>
              ) : (
                <p className="mt-3 font-semibold text-white/35">
                  None
                </p>
              )}
            </div>

            {/* REWARDS */}

            <div className="rounded-2xl border border-purple-300/15 bg-purple-500/[0.06] p-5">

              <p className="text-xs font-black uppercase tracking-widest text-purple-200/60">
                Rewards
              </p>

              {hasRewards ? (
                <>
                  <p className="mt-3 text-xl font-black text-purple-200">
                    {redeemedPoints}{" "}
                    Points
                  </p>

                  <p className="mt-2 text-sm text-white/45">
                    Saved{" "}
                    {formatMoney(
                      rewardDiscount
                    )}
                  </p>
                </>
              ) : (
                <p className="mt-3 font-semibold text-white/35">
                  None
                </p>
              )}
            </div>

            {/* FLASH SALE STATUS */}

            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-500/[0.06] p-5">

              <p className="text-xs font-black uppercase tracking-widest text-cyan-200/60">
                Flash Sale
              </p>

              {hasFlashSale ? (
                <>
                  <p className="mt-3 text-xl font-black text-cyan-200">
                    Applied
                  </p>

                  <p className="mt-2 text-sm text-white/45">
                    {
                      flashSaleSummaries.length
                    }{" "}
                    item
                    {flashSaleSummaries.length ===
                    1
                      ? ""
                      : "s"}
                  </p>
                </>
              ) : (
                <p className="mt-3 font-semibold text-white/35">
                  None
                </p>
              )}
            </div>
          </div>

          {/* BUILD YOUR OWN BUNDLE */}

          {hasBundlePricing && (
            <div className="mt-6">

              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-purple-200">
                Build Your Own Bundle
              </p>

              <div className="grid gap-3 lg:grid-cols-2">
                {bundleSummaries.map(
                  (
                    bundle,
                    index
                  ) => (
                    <div
                      key={`${bundle.bundleId}-${index}`}
                      className="rounded-2xl border border-purple-300/20 bg-purple-500/10 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <div>
                          <span className="inline-flex rounded-full border border-purple-300/20 bg-purple-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-200">
                            Bundle
                          </span>

                          <p className="mt-3 font-black">
                            {
                              bundle.quantity
                            }{" "}
                            {bundle.quantity ===
                            1
                              ? "Vial"
                              : "Vials"}
                          </p>
                        </div>

                        <p className="text-xl font-black text-purple-200">
                          {
                            bundle.discountPercent
                          }
                          % Off
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-black/10 p-3">
                          <p className="text-[10px] uppercase tracking-widest text-white/35">
                            Regular
                          </p>

                          <p className="mt-1 font-bold text-white/60 line-through">
                            {formatMoney(
                              bundle.regularTotal
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-black/10 p-3">
                          <p className="text-[10px] uppercase tracking-widest text-white/35">
                            Bundle
                          </p>

                          <p className="mt-1 font-black text-purple-200">
                            {formatMoney(
                              bundle.discountedTotal
                            )}
                          </p>
                        </div>
                      </div>

                      {bundle.tierQuantity && (
                        <p className="mt-3 text-xs text-white/35">
                          Qualified at{" "}
                          {
                            bundle.tierQuantity
                          }
                          -vial tier
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* BULK QUANTITY PRICING */}

          {hasBulkPricing && (
            <div className="mt-6">

              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-blue-200">
                Bulk Quantity Pricing
              </p>

              <div className="grid gap-3 lg:grid-cols-2">
                {bulkSummaries.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={`bulk-${index}-${item.name}`}
                      className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">

                        <div>
                          <span className="inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-200">
                            Bulk
                          </span>

                          <p className="mt-3 font-black">
                            {item.name}
                          </p>

                          <p className="mt-1 text-sm text-white/45">
                            Qty{" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>

                        <p className="text-xl font-black text-blue-200">
                          {
                            item.discountPercent
                          }
                          % Off
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">

                        {item.regularPrice >
                          item.discountedPrice && (
                          <span className="text-white/35 line-through">
                            {formatMoney(
                              item.regularPrice
                            )}{" "}
                            / vial
                          </span>
                        )}

                        <span className="font-black text-blue-200">
                          {formatMoney(
                            item.discountedPrice
                          )}{" "}
                          / vial
                        </span>
                      </div>

                      {item.tierQuantity && (
                        <p className="mt-3 text-xs text-white/35">
                          Quantity tier:{" "}
                          {
                            item.tierQuantity
                          }{" "}
                          vials
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* FLASH SALES */}

          {hasFlashSale && (
            <div className="mt-6">

              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                Flash Sale Pricing
              </p>

              <div className="grid gap-3 lg:grid-cols-2">

                {flashSaleSummaries.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={`flash-${index}-${item.name}`}
                      className="rounded-2xl border border-cyan-300/20 bg-cyan-500/10 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">

                        <div>
                          <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                            Flash Sale
                          </span>

                          <p className="mt-3 font-black">
                            {item.name}
                          </p>

                          <p className="mt-1 text-sm text-white/45">
                            Qty{" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>

                        <p className="text-xl font-black text-cyan-200">
                          {formatMoney(
                            item.salePrice
                          )}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">

                        {item.regularPrice >
                          item.salePrice && (
                          <span className="text-white/35 line-through">
                            Regular{" "}
                            {formatMoney(
                              item.regularPrice
                            )}
                          </span>
                        )}

                        <span className="font-black text-cyan-200">
                          Sale{" "}
                          {formatMoney(
                            item.salePrice
                          )}{" "}
                          / vial
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {!hasAnySpecialPricing && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-6 text-center">

              <p className="font-bold text-white/60">
                No promotional or
                discounted pricing was
                used on this order.
              </p>

              <p className="mt-2 text-sm text-white/35">
                This order used
                standard product
                pricing.
              </p>
            </div>
          )}
        </section>

        {/* =====================================
            SHIPPING + ORDER DETAILS
        ===================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* SHIPPING */}

          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7">

            <h2 className="mb-6 text-2xl font-black">
              Shipping Address
            </h2>

            <div className="space-y-2 text-white/70">

              <p className="font-bold text-white">
                {customerName}
              </p>

              {order.address && (
                <p>
                  {order.address}
                </p>
              )}

              {(order.city ||
                order.state ||
                order.zip_code) && (
                <p>
                  {[
                    order.city,
                    order.state,
                    order.zip_code,
                  ]
                    .filter(Boolean)
                    .join(", ")
                    .replace(
                      ", ,",
                      ","
                    )}
                </p>
              )}

              {!order.address &&
                !order.city &&
                !order.state &&
                !order.zip_code && (
                  <p className="text-white/35">
                    No shipping address
                    saved.
                  </p>
                )}
            </div>
          </section>

          {/* ORDER DETAILS */}

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
                  {String(
                    order.status ||
                      "Unknown"
                  ).replaceAll(
                    "_",
                    " "
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Created
                </p>

                <p className="mt-2 font-semibold">
                  {formatDate(
                    order.created_at
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Promo / Affiliate
                  Code
                </p>

                <p
                  className={`mt-2 font-semibold ${
                    promoCode
                      ? "text-green-200"
                      : ""
                  }`}
                >
                  {promoCode ||
                    "None"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Promo Savings
                </p>

                <p className="mt-2 font-semibold">
                  {discount > 0
                    ? `-${formatMoney(
                        discount
                      )}`
                    : "None"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Rewards Redeemed
                </p>

                <p className="mt-2 font-semibold">
                  {redeemedPoints >
                  0
                    ? `${redeemedPoints} points`
                    : "None"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}