"use client";

import { useEffect, useState } from "react";

import {
  ShoppingCart,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
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

export default function AdamaxPage() {
  const [added, setAdded] = useState(false);

  const [
    selectedQuantity,
    setSelectedQuantity,
  ] = useState(1);

  const [
    inventory,
    setInventory,
  ] = useState<number | null>(
    null
  );

  const [price, setPrice] =
    useState(65);

  const [
    quantityDiscounts,
    setQuantityDiscounts,
  ] = useState<
    QuantityDiscountTier[]
  >([]);

  const product = {
    id: "adamax",
    name: "ADAMAX",
    image:
      "/images/adamaxblue.PNG",
    path:
      "/products/adamax",
  };

  const isOutOfStock =
    inventory !== null &&
    inventory <= 0;

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
    const fetchProductData =
      async () => {
        try {
          const response =
            await fetch(
              "/api/products",
              {
                cache:
                  "no-store",
              }
            );

          const data =
            await response.json();

          if (!data.success) {
            return;
          }

          const adamax =
            data.products.find(
              (item: any) =>
                item.slug ===
                  "adamax" ||
                item.slug ===
                  "adamax-10mg" ||
                item.id ===
                  "adamax" ||
                item.id ===
                  "adamax-10mg" ||
                item.id ===
                  "ADAMAX-10mg" ||
                item.name
                  ?.toLowerCase()
                  .includes(
                    "adamax"
                  )
            );

          if (adamax) {
            setInventory(
              Number(
                adamax.inventory ??
                  0
              )
            );

            setPrice(
              Number(
                adamax.price ??
                  65
              )
            );
          } else {
            setInventory(
              null
            );

            setPrice(65);
          }
        } catch (error) {
          console.error(
            "Failed to fetch ADAMAX data:",
            error
          );

          setInventory(
            null
          );

          setPrice(65);
        }
      };

    const fetchQuantityDiscounts =
      async () => {
        try {
          const response =
            await fetch(
              "/api/quantity-discounts",
              {
                cache:
                  "no-store",
              }
            );

          const data =
            await response.json();

          if (!data.success) {
            return;
          }

          const tiers = (
            data.tiers || []
          )
            .map(
              (tier: any) => ({
                id: String(
                  tier.id
                ),

                name: String(
                  tier.name ||
                    ""
                ),

                quantity:
                  Number(
                    tier.quantity ||
                      0
                  ),

                discount_percent:
                  Number(
                    tier.discount_percent ||
                      0
                  ),

                sort_order:
                  Number(
                    tier.sort_order ||
                      0
                  ),
              })
            )
            .filter(
              (
                tier: QuantityDiscountTier
              ) =>
                tier.quantity >
                  1 &&
                tier.discount_percent >=
                  0
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
        }
      };

    fetchProductData();
    fetchQuantityDiscounts();
  }, []);

  const getDiscountTier = (
    quantity: number
  ) => {
    return (
      [
        ...quantityDiscounts,
      ]
        .filter(
          (tier) =>
            quantity >=
            tier.quantity
        )
        .sort(
          (a, b) =>
            b.quantity -
            a.quantity
        )[0] || null
    );
  };

  const selectedTier =
    getDiscountTier(
      selectedQuantity
    );

  const selectedDiscountPercent =
    selectedTier
      ?.discount_percent ||
    0;

  const discountedUnitPrice =
    price *
    (1 -
      selectedDiscountPercent /
        100);

  const selectedTotal =
    discountedUnitPrice *
    selectedQuantity;

  const regularTotal =
    price *
    selectedQuantity;

  const formatMoney = (
    amount: number
  ) =>
    Number(
      amount
    ).toFixed(2);

  const selectQuantity = (
    quantity: number
  ) => {
    if (
      inventory !== null &&
      quantity > inventory
    ) {
      return;
    }

    setSelectedQuantity(
      quantity
    );

    setAdded(false);
  };

  const addToCart = () => {
    if (isOutOfStock) {
      return;
    }

    const existingCart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        ) || "[]"
      );

    const existingProduct =
      existingCart.find(
        (item: any) =>
          item.id ===
          product.id
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
      newQuantity >
        inventory
    ) {
      alert(
        `Only ${inventory} vial${
          inventory === 1
            ? ""
            : "s"
        } of ${
          product.name
        } are currently available.`
      );

      return;
    }

    const newTier =
      getDiscountTier(
        newQuantity
      );

    const newDiscountPercent =
      newTier
        ?.discount_percent ||
      0;

    const newDiscountedUnitPrice =
      price *
      (1 -
        newDiscountPercent /
          100);

    const cartProduct = {
      id: product.id,
      name: product.name,

      price:
        newDiscountedUnitPrice,

      basePrice: price,

      quantity:
        newQuantity,

      image:
        product.image,

      path:
        product.path,

      quantityDiscountPercent:
        newDiscountPercent,

      quantityDiscountTierId:
        newTier?.id ||
        null,

      quantityDiscountTierQuantity:
        newTier?.quantity ||
        null,
    };

    const updatedCart =
      existingProduct
        ? existingCart.map(
            (item: any) =>
              item.id ===
              product.id
                ? cartProduct
                : item
          )
        : [
            ...existingCart,
            cartProduct,
          ];

    localStorage.setItem(
      "cart",
      JSON.stringify(
        updatedCart
      )
    );

    window.dispatchEvent(
      new Event(
        "cartUpdated"
      )
    );

    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      {/* PRODUCT HERO */}
      <section className="relative px-5 md:px-10 py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-start">

            {/* IMAGE */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[520px] aspect-square rounded-[42px] overflow-hidden border border-blue-400/10 bg-white/[0.03] shadow-[0_0_30px_rgba(96,165,250,0.15)]">
                <FavoriteButton
                  product={
                    favoriteProduct
                  }
                />

                <img
                  src={
                    product.image
                  }
                  alt={
                    product.name
                  }
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* PRODUCT CARD */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 md:p-8">

              <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-3">
                Research Peptide
                Blend
              </p>

              <div className="flex items-start justify-between gap-5 mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white">
                    {
                      product.name
                    }
                  </h1>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-1">
                    Total
                  </p>

                  <p className="text-3xl font-black text-white">
                    $
                    {formatMoney(
                      selectedTotal
                    )}
                  </p>
                </div>
              </div>

              <p className="text-white/65 leading-relaxed mb-5">
                High-purity
                ADAMAX research
                peptide blend
                intended strictly
                for laboratory
                research
                applications and
                analytical use.
              </p>

              {/* PRODUCT META */}
              <div className="flex flex-wrap gap-3 mb-5">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold">
                  10mg
                </span>

                {isOutOfStock ? (
                  <span className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
                    Out of Stock
                  </span>
                ) : isLimitedStock ? (
                  <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-200">
                    Limited Stock
                  </span>
                ) : (
                  <span className="rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-200">
                    In Stock
                  </span>
                )}
              </div>

              <div className="h-px bg-white/10 mb-5" />

              {/* QUANTITY */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <p className="uppercase tracking-widest text-white/45 text-xs">
                    Quantity
                  </p>
                </div>

                <div className="text-right">
                  {selectedDiscountPercent >
                  0 ? (
                    <>
                      <p className="text-xs text-white/35 line-through">
                        $
                        {formatMoney(
                          price
                        )}{" "}
                        each
                      </p>

                      <p className="text-sm font-bold text-blue-200">
                        $
                        {formatMoney(
                          discountedUnitPrice
                        )}{" "}
                        each
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-bold text-white">
                      $
                      {formatMoney(
                        price
                      )}{" "}
                      each
                    </p>
                  )}
                </div>
              </div>

              {/* QUANTITY TIER BUTTONS */}
              <div
                className="grid gap-3 mb-5"
                style={{
                  gridTemplateColumns: `repeat(${
                    quantityDiscounts.length +
                    1
                  }, minmax(0, 1fr))`,
                }}
              >
                {/* 1 VIAL */}
                <button
                  type="button"
                  disabled={
                    isOutOfStock
                  }
                  onClick={() =>
                    selectQuantity(
                      1
                    )
                  }
                  className={`relative rounded-2xl border px-3 py-4 transition-all ${
                    selectedQuantity ===
                    1
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-white/10 bg-white/[0.03] hover:border-blue-400/40"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {selectedQuantity ===
                    1 && (
                    <Check
                      size={15}
                      className="absolute right-2 top-2 text-blue-300"
                    />
                  )}

                  <p className="font-black text-lg">
                    1
                  </p>

                  <p className="text-xs text-white/45">
                    Vial
                  </p>

                  <p className="text-xs font-bold text-white mt-2">
                    $
                    {formatMoney(
                      price
                    )}
                  </p>
                </button>

                {/* ADMIN TIERS */}
                {quantityDiscounts.map(
                  (tier) => {
                    const disabled =
                      inventory !==
                        null &&
                      tier.quantity >
                        inventory;

                    const tierUnitPrice =
                      price *
                      (1 -
                        tier.discount_percent /
                          100);

                    const tierTotal =
                      tierUnitPrice *
                      tier.quantity;

                    const selected =
                      selectedQuantity ===
                      tier.quantity;

                    return (
                      <button
                        type="button"
                        key={
                          tier.id
                        }
                        disabled={
                          disabled
                        }
                        onClick={() =>
                          selectQuantity(
                            tier.quantity
                          )
                        }
                        className={`relative rounded-2xl border px-3 py-4 transition-all ${
                          selected
                            ? "border-blue-400 bg-blue-500/10"
                            : "border-white/10 bg-white/[0.03] hover:border-blue-400/40"
                        } disabled:opacity-35 disabled:cursor-not-allowed`}
                      >
                        {selected && (
                          <Check
                            size={
                              15
                            }
                            className="absolute right-2 top-2 text-blue-300"
                          />
                        )}

                        <p className="font-black text-lg">
                          {
                            tier.quantity
                          }
                        </p>

                        <p className="text-xs text-white/45">
                          Vials
                        </p>

                        <p className="text-xs font-bold text-blue-200 mt-1">
                          {
                            tier.discount_percent
                          }
                          % off
                        </p>

                        <p className="text-xs font-bold text-white mt-1">
                          $
                          {formatMoney(
                            tierTotal
                          )}
                        </p>
                      </button>
                    );
                  }
                )}
              </div>

              {selectedDiscountPercent >
                0 && (
                <div className="flex items-center justify-between text-sm mb-5 rounded-xl border border-green-400/15 bg-green-500/[0.06] px-4 py-3">
                  <span className="text-white/55">
                    Quantity savings
                  </span>

                  <span className="font-bold text-green-300">
                    -$
                    {formatMoney(
                      regularTotal -
                        selectedTotal
                    )}
                  </span>
                </div>
              )}

              {/* GIFT */}
              <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 mb-5">
                <p className="text-blue-100 text-xs sm:text-sm font-semibold text-center uppercase tracking-wider">
                  Complimentary
                  gift with any 8
                  vials
                </p>
              </div>

              {/* ADD TO CART */}
              {isOutOfStock ? (
                <button
                  disabled
                  className="w-full bg-white/[0.06] text-white/30 cursor-not-allowed rounded-full py-4 uppercase tracking-widest text-sm font-semibold"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={
                    addToCart
                  }
                  className="w-full bg-white text-[#081526] hover:bg-blue-100 rounded-full py-4 uppercase tracking-widest text-sm font-semibold transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart
                    size={20}
                  />

                  {added
                    ? "Added To Cart"
                    : "Add To Cart"}
                </button>
              )}

              {/* SECONDARY ACTIONS */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <a
                  href="/cart"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] rounded-full py-3.5 uppercase tracking-widest text-xs font-semibold text-center transition-all"
                >
                  View Cart
                </a>

                <a
                  href="/products"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] rounded-full py-3.5 uppercase tracking-widest text-xs font-semibold text-center transition-all"
                >
                  Keep Shopping
                </a>
              </div>

              <div className="text-center mt-4">
                <a
                  href="/images/coas/adamaxcoa7-20-26.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 text-sm font-semibold transition-all"
                >
                  View ADAMAX COA
                  →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COA */}
      <section className="px-5 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
                Freedom
                Diagnostics
              </p>

              <h3 className="text-2xl font-black mb-4">
                Latest
                Certificate of
                Analysis
              </h3>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-semibold">
                  ✓ Identity
                  Confirmed
                </span>

                <span className="px-3 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm font-semibold">
                  99.21% Purity
                </span>

                <span className="px-3 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm font-semibold">
                  13.71mg Content
                </span>

                <span className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
                  Lot: Black
                  Cap-1
                </span>
              </div>
            </div>

            <div className="md:text-right">
              <div className="text-4xl font-black text-[#A5D8FF]">
                99.21%
              </div>

              <div className="uppercase tracking-widest text-white/40 text-xs mt-1">
                Purity
              </div>

              <a
                href="/images/coas/adamaxcoa7-20-26.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-3 text-blue-300 font-semibold hover:text-blue-200 transition-all"
              >
                View Full COA →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUALITY */}
      <section className="px-5 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
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
            ([
              Icon,
              title,
              text,
            ]: any) => (
              <div
                key={
                  title
                }
                className="flex gap-3"
              >
                <Icon
                  className="text-[#A5D8FF] shrink-0"
                  size={27}
                />

                <div>
                  <h3 className="text-white uppercase tracking-widest font-bold text-xs">
                    {
                      title
                    }
                  </h3>

                  <p className="text-white/50 text-sm mt-1 leading-relaxed">
                    {
                      text
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* RESEARCH */}
      <section className="px-5 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto rounded-[30px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
            Research Profile
          </p>

          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Peptide Blend
            Research Overview
          </h2>

          <p className="text-white/65 leading-relaxed max-w-4xl mb-6">
            ADAMAX is a
            multi-peptide
            research blend
            studied in
            laboratory models
            involving cellular
            signaling, recovery
            pathways, metabolic
            regulation, and
            peptide synergy
            research
            applications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              [
                "Peptide Synergy",
                "Studied in laboratory models evaluating combined peptide interactions and biological signaling pathways.",
              ],

              [
                "Recovery Research",
                "Investigated in research involving tissue response, cellular recovery, and regenerative processes.",
              ],

              [
                "Metabolic Studies",
                "Evaluated in laboratory settings examining energy utilization and metabolic pathway regulation.",
              ],

              [
                "Storage",
                "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use.",
              ],
            ].map(
              ([
                title,
                text,
              ]) => (
                <div
                  key={
                    title
                  }
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <h3 className="font-bold mb-2">
                    {
                      title
                    }
                  </h3>

                  <p className="text-white/55 text-sm leading-relaxed">
                    {
                      text
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="px-5 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto">

          <div className="mb-5">
            <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
              Related Research
            </p>

            <h2 className="text-3xl font-black">
              Frequently
              Researched
              Together
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* APX-3 */}
            <a
              href="/products/apx3"
              className="group rounded-[26px] border border-white/10 bg-white/[0.04] p-4 hover:border-blue-400/50 transition-all"
            >
              <div className="rounded-[22px] overflow-hidden mb-4 bg-[#93C5FD] h-[210px] flex items-center justify-center">
                <img
                  src="/images/apx310blue.png"
                  alt="APX-3"
                  className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-xl font-black mb-2">
                APX-3
              </h3>

              <p className="text-white/55 text-sm leading-relaxed mb-3">
                Triple agonist
                research peptide
                studied in
                metabolic
                regulation and
                body composition
                models.
              </p>

              <span className="text-[#A5D8FF] font-semibold text-sm">
                View Product →
              </span>
            </a>

            {/* MOTS-C */}
            <a
              href="/products/motsc"
              className="group rounded-[26px] border border-white/10 bg-white/[0.04] p-4 hover:border-blue-400/50 transition-all"
            >
              <div className="rounded-[22px] overflow-hidden mb-4 bg-[#93C5FD] h-[210px] flex items-center justify-center">
                <img
                  src="/images/motscblue.png"
                  alt="MOTS-c"
                  className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-xl font-black mb-2">
                MOTS-c
              </h3>

              <p className="text-white/55 text-sm leading-relaxed mb-3">
                Studied in
                laboratory
                models involving
                mitochondrial
                signaling and
                metabolic
                research.
              </p>

              <span className="text-[#A5D8FF] font-semibold text-sm">
                View Product →
              </span>
            </a>

            {/* CJC IPA */}
            <a
              href="/products/cjcipa"
              className="group rounded-[26px] border border-white/10 bg-white/[0.04] p-4 hover:border-blue-400/50 transition-all"
            >
              <div className="rounded-[22px] overflow-hidden mb-4 bg-[#93C5FD] h-[210px] flex items-center justify-center">
                <img
                  src="/images/cjcipablue.png"
                  alt="CJC/IPA"
                  className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-xl font-black mb-2">
                CJC/IPA
              </h3>

              <p className="text-white/55 text-sm leading-relaxed mb-3">
                Research
                involving growth
                hormone signaling
                pathways and
                endocrine
                response models.
              </p>

              <span className="text-[#A5D8FF] font-semibold text-sm">
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
      ].map(
        (section) => (
          <section
            key={
              section.title
            }
            className="px-5 md:px-10 pb-8"
          >
            <div className="max-w-7xl mx-auto rounded-[26px] border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-[#A5D8FF] font-bold uppercase tracking-[0.25em] text-xs mb-3">
                {
                  section.title
                }
              </h3>

              <p className="text-white/55 text-sm leading-relaxed">
                {
                  section.text
                }
              </p>
            </div>
          </section>
        )
      )}
    </main>
  );
}