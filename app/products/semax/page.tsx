"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
  BadgePercent,
  Check,
} from "lucide-react";

import FavoriteButton from "@/components/FavoriteButton";

type QuantityDiscountTier = {
  id: string;
  name: string;
  quantity: number;
  discount_percent: number;
  sort_order: number;
};

export default function SemaxPage() {
  const [added, setAdded] = useState(false);

  const [selectedQuantity, setSelectedQuantity] =
    useState(1);

  const [inventory, setInventory] =
    useState<number | null>(null);

  const [price, setPrice] = useState(55);

  const [quantityDiscounts, setQuantityDiscounts] =
    useState<QuantityDiscountTier[]>([]);

  const [discountsLoading, setDiscountsLoading] =
    useState(true);

  const product = {
    id: "semax",
    name: "Semax",
    image: "/images/semaxblue.png",
    path: "/products/semax",
  };

  const isOutOfStock =
    inventory !== null && inventory <= 0;

  const isLimitedStock =
    inventory !== null &&
    inventory > 0 &&
    inventory <= 5;

  const favoriteProduct = {
    id: product.id,
    name: product.name,
    price,
    image: product.image,
    path: product.path,
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          "/api/products",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!data.success) return;

        const semax = data.products.find(
          (item: any) =>
            item.slug === "semax" ||
            item.slug === "semax-10mg" ||
            item.id === "semax" ||
            item.id === "semax-10mg" ||
            item.id === "SEMAX-10mg" ||
            item.name
              ?.toLowerCase()
              .includes("semax")
        );

        if (semax) {
          setInventory(
            Number(semax.inventory ?? 0)
          );

          setPrice(
            Number(semax.price ?? 55)
          );
        } else {
          setInventory(null);
          setPrice(55);
        }
      } catch (error) {
        console.error(
          "Failed to fetch Semax data:",
          error
        );

        setInventory(null);
        setPrice(55);
      }
    };

    const fetchQuantityDiscounts =
      async () => {
        setDiscountsLoading(true);

        try {
          const response = await fetch(
            "/api/quantity-discounts",
            {
              cache: "no-store",
            }
          );

          const data =
            await response.json();

          if (!data.success) {
            setQuantityDiscounts([]);
            return;
          }

          const tiers = (
            data.tiers || []
          )
            .map((tier: any) => ({
              id: String(tier.id),

              name: String(
                tier.name || ""
              ),

              quantity: Number(
                tier.quantity || 0
              ),

              discount_percent:
                Number(
                  tier.discount_percent ||
                    0
                ),

              sort_order: Number(
                tier.sort_order || 0
              ),
            }))
            .filter(
              (
                tier: QuantityDiscountTier
              ) =>
                tier.quantity > 1 &&
                tier.discount_percent >= 0
            )
            .sort(
              (
                a: QuantityDiscountTier,
                b: QuantityDiscountTier
              ) => {
                if (
                  a.sort_order !==
                  b.sort_order
                ) {
                  return (
                    a.sort_order -
                    b.sort_order
                  );
                }

                return (
                  a.quantity -
                  b.quantity
                );
              }
            );

          setQuantityDiscounts(
            tiers
          );
        } catch (error) {
          console.error(
            "Failed to fetch quantity discounts:",
            error
          );

          setQuantityDiscounts([]);
        } finally {
          setDiscountsLoading(false);
        }
      };

    fetchProductData();
    fetchQuantityDiscounts();
  }, []);

  const getDiscountForQuantity = (
    quantity: number
  ) => {
    const eligibleTiers =
      quantityDiscounts
        .filter(
          (tier) =>
            quantity >= tier.quantity
        )
        .sort(
          (a, b) =>
            b.quantity - a.quantity
        );

    return eligibleTiers[0] || null;
  };

  const selectedTier =
    getDiscountForQuantity(
      selectedQuantity
    );

  const selectedDiscountPercent =
    selectedTier
      ? Number(
          selectedTier.discount_percent
        )
      : 0;

  const selectedUnitPrice =
    price *
    (1 -
      selectedDiscountPercent / 100);

  const selectedTotal =
    selectedUnitPrice *
    selectedQuantity;

  const selectedRegularTotal =
    price * selectedQuantity;

  const selectedSavings =
    selectedRegularTotal -
    selectedTotal;

  const formatMoney = (
    amount: number
  ) => {
    return Number(amount).toFixed(2);
  };

  const selectQuantity = (
    quantity: number
  ) => {
    if (
      inventory !== null &&
      quantity > inventory
    ) {
      return;
    }

    setSelectedQuantity(quantity);

    setAdded(false);
  };

  const addToCart = () => {
    if (isOutOfStock) return;

    if (
      inventory !== null &&
      selectedQuantity > inventory
    ) {
      return;
    }

    const existingCart = JSON.parse(
      localStorage.getItem("cart") ||
        "[]"
    );

    const existingProduct =
      existingCart.find(
        (item: any) =>
          item.id === product.id
      );

    const existingQuantity =
      existingProduct
        ? Number(
            existingProduct.quantity ||
              0
          )
        : 0;

    const newQuantity =
      existingQuantity +
      selectedQuantity;

    if (
      inventory !== null &&
      newQuantity > inventory
    ) {
      alert(
        `Only ${inventory} vial${
          inventory === 1 ? "" : "s"
        } of ${product.name} are currently available.`
      );

      return;
    }

    /*
      Recalculate the quantity discount
      using the NEW combined quantity.

      Example:
      - customer adds 5
      - then adds another 5
      - cart becomes 10
      - 10-vial tier is applied
    */

    const newTier =
      getDiscountForQuantity(
        newQuantity
      );

    const newDiscountPercent =
      newTier
        ? Number(
            newTier.discount_percent
          )
        : 0;

    const newDiscountedUnitPrice =
      price *
      (1 -
        newDiscountPercent / 100);

    const cartProduct = {
      id: product.id,

      name: product.name,

      /*
        Keep price as the discounted
        PER-VIAL price because your
        existing cart currently uses
        price × quantity.
      */
      price:
        newDiscountedUnitPrice,

      /*
        Save the regular product price
        too. We will use this when we
        update checkout/server-side
        validation next.
      */
      basePrice: price,

      quantity: newQuantity,

      image: product.image,

      path: product.path,

      quantityDiscountPercent:
        newDiscountPercent,

      quantityDiscountTierId:
        newTier?.id || null,

      quantityDiscountTierQuantity:
        newTier?.quantity || null,
    };

    const updatedCart =
      existingProduct
        ? existingCart.map(
            (item: any) =>
              item.id === product.id
                ? {
                    ...item,
                    ...cartProduct,
                  }
                : item
          )
        : [
            ...existingCart,
            cartProduct,
          ];

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">
      <section className="relative px-6 md:px-10 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 items-start">
            {/* PRODUCT IMAGE */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[520px] h-[520px] rounded-[48px] overflow-hidden border border-blue-400/10 bg-white/[0.03] backdrop-blur-sm shadow-[0_0_30px_rgba(96,165,250,0.15)]">
                <FavoriteButton
                  product={favoriteProduct}
                />

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-4">
                Research Peptide
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                {product.name}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                High-purity Semax
                research peptide
                studied in laboratory
                models involving
                peptide signaling,
                neurochemical pathway
                research, cognitive
                signaling pathways,
                and cellular response
                mechanisms.
              </p>

              {/* PRICE */}
              <div className="mb-3">
                {selectedQuantity ===
                1 ? (
                  <p className="text-5xl font-black text-white">
                    $
                    {formatMoney(
                      price
                    )}
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                      <p className="text-5xl font-black text-white">
                        $
                        {formatMoney(
                          selectedTotal
                        )}
                      </p>

                      {selectedDiscountPercent >
                        0 && (
                        <p className="text-xl text-white/35 line-through mb-1">
                          $
                          {formatMoney(
                            selectedRegularTotal
                          )}
                        </p>
                      )}
                    </div>

                    <p className="text-[#A5D8FF] font-semibold mt-2">
                      $
                      {formatMoney(
                        selectedUnitPrice
                      )}{" "}
                      per vial
                    </p>
                  </>
                )}
              </div>

              {isLimitedStock && (
                <div className="font-semibold mb-8 text-yellow-300">
                  Limited Stock
                </div>
              )}

              {isOutOfStock && (
                <div className="font-semibold mb-8 text-red-300">
                  Out of Stock
                </div>
              )}

              {!isLimitedStock &&
                !isOutOfStock && (
                  <div className="mb-8" />
                )}

              <div className="h-px bg-white/10 mb-8" />

              {/* SIZE */}
              <div className="mb-8">
                <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                  Size
                </p>

                <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white">
                  10mg
                </div>
              </div>

              {/* QUANTITY SELECTOR */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="uppercase tracking-widest text-white/50 text-sm">
                      Choose Quantity
                    </p>

                    <p className="text-white/35 text-xs mt-1">
                      Quantity savings
                      are applied
                      automatically.
                    </p>
                  </div>

                  {selectedDiscountPercent >
                    0 && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-green-200">
                      <BadgePercent
                        size={15}
                      />

                      Save{" "}
                      {selectedDiscountPercent}
                      %
                    </span>
                  )}
                </div>

                {discountsLoading ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/40">
                    Loading quantity
                    pricing...
                  </div>
                ) : (
                  <div
                    className={`grid gap-3 ${
                      quantityDiscounts.length >=
                      2
                        ? "grid-cols-1 sm:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {/* 1 VIAL */}
                    {(() => {
                      const unavailable =
                        inventory !==
                          null &&
                        inventory < 1;

                      const selected =
                        selectedQuantity ===
                        1;

                      return (
                        <button
                          type="button"
                          disabled={
                            unavailable
                          }
                          onClick={() =>
                            selectQuantity(
                              1
                            )
                          }
                          className={`relative rounded-[22px] border p-5 text-left transition-all ${
                            selected
                              ? "border-blue-300 bg-blue-400/10 shadow-[0_0_24px_rgba(96,165,250,0.12)]"
                              : "border-white/10 bg-white/[0.035] hover:border-blue-400/40 hover:bg-white/[0.055]"
                          } ${
                            unavailable
                              ? "opacity-35 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {selected && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-300 text-[#081526] flex items-center justify-center">
                              <Check
                                size={
                                  15
                                }
                                strokeWidth={
                                  3
                                }
                              />
                            </div>
                          )}

                          <p className="text-white font-black text-lg">
                            1 Vial
                          </p>

                          <p className="text-2xl font-black text-white mt-2">
                            $
                            {formatMoney(
                              price
                            )}
                          </p>

                          <p className="text-white/35 text-xs uppercase tracking-widest mt-2">
                            Regular
                            Price
                          </p>
                        </button>
                      );
                    })()}

                    {/* ADMIN-CONTROLLED TIERS */}
                    {quantityDiscounts.map(
                      (tier) => {
                        const tierTotal =
                          price *
                          tier.quantity *
                          (1 -
                            tier.discount_percent /
                              100);

                        const regularTierTotal =
                          price *
                          tier.quantity;

                        const perVial =
                          tierTotal /
                          tier.quantity;

                        const unavailable =
                          inventory !==
                            null &&
                          inventory <
                            tier.quantity;

                        const selected =
                          selectedQuantity ===
                          tier.quantity;

                        return (
                          <button
                            key={
                              tier.id
                            }
                            type="button"
                            disabled={
                              unavailable
                            }
                            onClick={() =>
                              selectQuantity(
                                tier.quantity
                              )
                            }
                            className={`relative rounded-[22px] border p-5 text-left transition-all ${
                              selected
                                ? "border-blue-300 bg-blue-400/10 shadow-[0_0_24px_rgba(96,165,250,0.12)]"
                                : "border-white/10 bg-white/[0.035] hover:border-blue-400/40 hover:bg-white/[0.055]"
                            } ${
                              unavailable
                                ? "opacity-35 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {selected && (
                              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-300 text-[#081526] flex items-center justify-center">
                                <Check
                                  size={
                                    15
                                  }
                                  strokeWidth={
                                    3
                                  }
                                />
                              </div>
                            )}

                            <p className="text-white font-black text-lg pr-8">
                              {
                                tier.quantity
                              }{" "}
                              Vials
                            </p>

                            <div className="mt-2">
                              <p className="text-2xl font-black text-white">
                                $
                                {formatMoney(
                                  tierTotal
                                )}
                              </p>

                              <p className="text-white/30 text-sm line-through">
                                $
                                {formatMoney(
                                  regularTierTotal
                                )}
                              </p>
                            </div>

                            <p className="text-[#A5D8FF] text-xs font-semibold mt-2">
                              $
                              {formatMoney(
                                perVial
                              )}{" "}
                              / vial
                            </p>

                            <div className="mt-3">
                              <span className="inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-green-200">
                                Save{" "}
                                {Number(
                                  tier.discount_percent
                                ).toFixed(
                                  tier.discount_percent %
                                    1 ===
                                    0
                                    ? 0
                                    : 2
                                )}
                                %
                              </span>
                            </div>

                            {unavailable && (
                              <p className="text-red-200 text-xs font-semibold mt-3">
                                Not enough
                                inventory
                              </p>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                )}

                {/* SELECTED SUMMARY */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-white/40 uppercase tracking-widest text-[11px]">
                        Selected
                      </p>

                      <p className="text-white font-bold mt-1">
                        {
                          selectedQuantity
                        }{" "}
                        {selectedQuantity ===
                        1
                          ? "vial"
                          : "vials"}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-white/40 uppercase tracking-widest text-[11px]">
                        Total
                      </p>

                      <p className="text-xl font-black text-white mt-1">
                        $
                        {formatMoney(
                          selectedTotal
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedSavings >
                    0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                      <span className="text-white/45 text-sm">
                        Quantity
                        savings
                      </span>

                      <span className="text-green-300 font-bold text-sm">
                        −$
                        {formatMoney(
                          selectedSavings
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* FREE GIFT */}
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={
                        2
                      }
                      d="M20 12v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7m16 0H4m16 0V8a1 1 0 00-1-1h-3.5M4 12V8a1 1 0 011-1h3.5m0 0a1.5 1.5 0 113 0m-3 0h3m0 0a1.5 1.5 0 113 0"
                    />
                  </svg>

                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                    Receive a
                    Complimentary Gift
                    With Any 8 Vials
                  </p>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="bg-white/[0.06] text-white/30 cursor-not-allowed rounded-full py-5 uppercase tracking-widest text-sm font-semibold"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    onClick={
                      addToCart
                    }
                    className="bg-white text-[#081526] hover:bg-blue-100 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart
                      size={22}
                    />

                    {added
                      ? "Added To Cart"
                      : `Add ${selectedQuantity} ${
                          selectedQuantity ===
                          1
                            ? "Vial"
                            : "Vials"
                        } To Cart`}
                  </button>
                )}

                <a
                  href="/cart"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  View Cart
                </a>

                <a
                  href="/products"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  Continue Shopping
                </a>

                <a
                  href="/images/coas/semax-10mg-coa.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  View All COAs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COA SUMMARY */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-xs mb-2">
                Janoshik
              </p>

              <h3 className="text-2xl font-black text-white mb-5">
                Latest Certificate
                of Analysis
              </h3>

              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="text-green-400 font-semibold">
                    ✓ Identity
                    Confirmed
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    99.33% Purity
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    11.71mg
                    Content
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white/70">
                    Batch:
                    SEMX1005182026-10
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="text-5xl font-black text-[#A5D8FF]">
                99.33%
              </div>

              <div className="uppercase tracking-widest text-white/40 text-xs mt-1">
                Purity
              </div>

              <a
                href="/images/coas/semax-10mg-coa.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 rounded-full border border-blue-400/20 bg-blue-400/10 px-6 py-3 text-blue-300 font-semibold hover:bg-blue-400/20 transition-all"
              >
                View Full COA
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUALITY CARDS */}
      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            [
              FlaskConical,
              "Research Use Only",
              "Strictly for laboratory research.",
            ],

            [
              ShieldCheck,
              "Third-Party Tested",
              "Independent lab verified when available.",
            ],

            [
              ClipboardCheck,
              "Batch Documented",
              "Documentation available for verified lots.",
            ],

            [
              ShieldCheck,
              "Quality Target",
              "99%+ purity target.",
            ],
          ].map(
            ([Icon, title, text]: any) => (
              <div
                key={title}
                className="flex gap-4"
              >
                <Icon
                  className="text-[#A5D8FF]"
                  size={34}
                />

                <div>
                  <h3 className="text-white uppercase tracking-widest font-bold text-sm">
                    {title}
                  </h3>

                  <p className="text-white/50 text-sm mt-1">
                    {text}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* RESEARCH OVERVIEW */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
          <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
            Research Profile
          </p>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Semax Research
            Overview
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            Semax is studied in
            laboratory research
            models involving peptide
            signaling, neurochemical
            pathway research,
            cognitive signaling
            pathways, and cellular
            response mechanisms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              [
                "Peptide Signaling",
                "Studied in models involving peptide-based signaling pathways.",
              ],

              [
                "Neurochemical Research",
                "Evaluated in laboratory investigations involving neurochemical response models.",
              ],

              [
                "Cognitive Signaling",
                "Researched in relation to cognitive signaling, neuroregulation, and cellular response mechanisms.",
              ],

              [
                "Storage",
                "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use.",
              ],
            ].map(
              ([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 hover:border-blue-400/50 transition-all"
                >
                  <h3 className="text-white text-lg font-bold mb-3">
                    {title}
                  </h3>

                  <p className="text-white/60 text-sm leading-relaxed">
                    {text}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* FREQUENTLY RESEARCHED TOGETHER */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
              Related Research
            </p>

            <h2 className="text-3xl md:text-4xl font-black text-white">
              Frequently
              Researched
              Together
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/products/selank"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/selankblue.png"
                  alt="Selank"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                Selank
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Research involving
                neuropeptide
                signaling and
                central nervous
                system models.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>

            <a
              href="/products/pinealon"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/pinealonblue.png"
                  alt="Pinealon"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                Pinealon
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Studied in
                laboratory models
                involving
                neuroregulation and
                cellular signaling
                pathways.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>

            <a
              href="/products/pe2228"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/pe2228blue.png"
                  alt="PE-22-28"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                PE-22-28
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Studied in
                laboratory models
                involving
                neurobiological
                signaling and
                cognitive research
                pathways.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* DISCLAIMERS */}
      {[
        {
          title:
            "FDA Disclaimer",

          text:
            "These statements have not been evaluated by the U.S. Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only and are not for human or veterinary consumption.",
        },

        {
          title:
            "Customer Acknowledgment",

          text:
            "By purchasing this product, the customer acknowledges that this material is intended solely for lawful laboratory research purposes and will not be used for human consumption, veterinary use, medical use, diagnosis, treatment, cure, or prevention of disease. Apexx Biolabs does not provide dosing instructions, treatment recommendations, medical advice, or guidance regarding human use of any product.",
        },
      ].map((section) => (
        <section
          key={section.title}
          className="px-6 md:px-10 pb-16"
        >
          <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
            <h3 className="text-[#A5D8FF] font-bold uppercase tracking-[0.25em] text-sm mb-4">
              {section.title}
            </h3>

            <p className="text-white/60 text-sm leading-relaxed">
              {section.text}
            </p>
          </div>
        </section>
      ))}
    </main>
  );
}