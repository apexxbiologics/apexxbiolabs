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

type TesamorelinSize = "5mg" | "10mg";

type CoaData = {
  lab: string;
  purity: string;
  content: string;
  lot: string;
  href: string;
};

export default function TesamorelinPage() {
  const [added, setAdded] = useState(false);

  const [selectedMg, setSelectedMg] =
    useState<TesamorelinSize>("5mg");

  const [selectedQuantity, setSelectedQuantity] =
    useState(1);

  const [quantityDiscounts, setQuantityDiscounts] =
    useState<QuantityDiscountTier[]>([]);

  const [productData, setProductData] = useState({
    "5mg": {
      inventory: 0,
      price: 45,
    },

    "10mg": {
      inventory: 0,
      price: 85,
    },
  });

  const productOptions = {
    "5mg": {
      id: "tesamorelin-5mg",
      name: "Tesamorelin 5mg",
      image: "/images/tesa5blue.png",
      path: "/products/tesamorelin",
    },

    "10mg": {
      id: "tesamorelin-10mg",
      name: "Tesamorelin 10mg",
      image: "/images/tesa10blue.png",
      path: "/products/tesamorelin",
    },
  };

  /*
   * SIZE-SPECIFIC COA DATA
   *
   * 5mg only shows the 5mg Freedom Diagnostics COA.
   * 10mg only shows the 10mg Accumark Labs COA.
   */
  const coaData: Record<TesamorelinSize, CoaData> = {
    "5mg": {
      lab: "Freedom Diagnostics",
      purity: "99.89%",
      content: "5.48mg",
      lot: "Red Cap-1",
      href: "/images/coas/tesamorelincoa7-10-26.pdf",
    },

    "10mg": {
      lab: "Accumark Labs",
      purity: "99.99%",
      content: "9.968mg",
      lot: "TESA2608-01",
      href: "/images/coas/tesamorelin-10mg-8-26-26.pdf",
    },
  };

  const selectedProduct =
    productOptions[selectedMg];

  const selectedInventory =
    productData[selectedMg].inventory;

  const selectedPrice =
    productData[selectedMg].price;

  const selectedCoa =
    coaData[selectedMg];

  const isOutOfStock =
    selectedInventory <= 0;

  const isLimitedStock =
    selectedInventory > 0 &&
    selectedInventory <= 5;

  const favoriteProduct = {
    id: selectedProduct.id,
    name: selectedProduct.name,
    price: selectedPrice,
    image: selectedProduct.image,
    path: selectedProduct.path,
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

        const data =
          await response.json();

        if (!data.success) return;

        const tesa5 =
          data.products.find(
            (item: any) => {
              const slug =
                item.slug
                  ?.toLowerCase()
                  .trim();

              const name =
                item.name
                  ?.toLowerCase()
                  .trim();

              const size =
                item.size
                  ?.toLowerCase()
                  .trim();

              return (
                slug === "tesamorelin-5mg" ||
                slug === "tesa-5mg" ||
                item.id === "tesamorelin-5mg" ||
                item.id === "TESAMORELIN-5mg" ||
                (name?.includes("tesamorelin") &&
                  size === "5mg") ||
                name?.includes("tesamorelin 5")
              );
            }
          );

        const tesa10 =
          data.products.find(
            (item: any) => {
              const slug =
                item.slug
                  ?.toLowerCase()
                  .trim();

              const name =
                item.name
                  ?.toLowerCase()
                  .trim();

              const size =
                item.size
                  ?.toLowerCase()
                  .trim();

              return (
                slug === "tesamorelin-10mg" ||
                slug === "tesa-10mg" ||
                item.id === "tesamorelin-10mg" ||
                item.id === "TESAMORELIN-10mg" ||
                (name?.includes("tesamorelin") &&
                  size === "10mg") ||
                name?.includes("tesamorelin 10")
              );
            }
          );

        setProductData({
          "5mg": {
            inventory: Number(
              tesa5?.inventory ?? 0
            ),

            price: Number(
              tesa5?.price ?? 45
            ),
          },

          "10mg": {
            inventory: Number(
              tesa10?.inventory ?? 0
            ),

            price: Number(
              tesa10?.price ?? 85
            ),
          },
        });
      } catch (error) {
        console.error(
          "Failed to fetch Tesamorelin data:",
          error
        );
      }
    };

    const fetchQuantityDiscounts =
      async () => {
        try {
          const response = await fetch(
            "/api/quantity-discounts",
            {
              cache: "no-store",
            }
          );

          const data =
            await response.json();

          if (!data.success) return;

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

              discount_percent: Number(
                tier.discount_percent || 0
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
        }
      };

    fetchProductData();
    fetchQuantityDiscounts();
  }, []);

  const getDiscountTier = (
    quantity: number
  ) => {
    return (
      [...quantityDiscounts]
        .filter(
          (tier) =>
            quantity >= tier.quantity
        )
        .sort(
          (a, b) =>
            b.quantity - a.quantity
        )[0] || null
    );
  };

  const selectedTier =
    getDiscountTier(
      selectedQuantity
    );

  const selectedDiscountPercent =
    selectedTier?.discount_percent ||
    0;

  const discountedUnitPrice =
    selectedPrice *
    (1 -
      selectedDiscountPercent /
        100);

  const selectedTotal =
    discountedUnitPrice *
    selectedQuantity;

  const regularTotal =
    selectedPrice *
    selectedQuantity;

  const formatMoney = (
    amount: number
  ) =>
    Number(amount).toFixed(2);

  const selectSize = (
    mg: TesamorelinSize
  ) => {
    setSelectedMg(mg);

    setSelectedQuantity(1);

    setAdded(false);
  };

  const selectQuantity = (
    quantity: number
  ) => {
    if (
      quantity >
      selectedInventory
    ) {
      return;
    }

    setSelectedQuantity(
      quantity
    );

    setAdded(false);
  };

  const addToCart = () => {
    if (isOutOfStock) return;

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
          selectedProduct.id
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
      newQuantity >
      selectedInventory
    ) {
      alert(
        `Only ${selectedInventory} vial${
          selectedInventory === 1
            ? ""
            : "s"
        } of ${
          selectedProduct.name
        } are currently available.`
      );

      return;
    }

    const newTier =
      getDiscountTier(
        newQuantity
      );

    const newDiscountPercent =
      newTier?.discount_percent ||
      0;

    const newDiscountedUnitPrice =
      selectedPrice *
      (1 -
        newDiscountPercent /
          100);

    const cartProduct = {
      id: selectedProduct.id,

      name:
        selectedProduct.name,

      price:
        newDiscountedUnitPrice,

      basePrice:
        selectedPrice,

      quantity:
        newQuantity,

      image:
        selectedProduct.image,

      path:
        selectedProduct.path,

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
              item.id ===
              selectedProduct.id
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
      JSON.stringify(
        updatedCart
      )
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      {/* PRODUCT HERO */}
      <section className="relative px-5 md:px-10 py-10 md:py-14 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">

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
                    selectedProduct.image
                  }
                  alt={
                    selectedProduct.name
                  }
                  className="w-full h-full object-cover"
                />

              </div>
            </div>

            {/* PRODUCT CARD */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 md:p-8">

              <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-3">
                Research Peptide
              </p>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">

                <h1 className="text-4xl md:text-5xl font-black text-white">
                  {
                    selectedProduct.name
                  }
                </h1>

                <div className="sm:text-right">

                  <p className="text-3xl md:text-4xl font-black text-white">
                    $
                    {formatMoney(
                      selectedTotal
                    )}
                  </p>

                  {selectedDiscountPercent >
                    0 && (
                    <p className="text-white/35 text-sm line-through">
                      $
                      {formatMoney(
                        regularTotal
                      )}
                    </p>
                  )}

                </div>
              </div>

              <p className="text-white/60 leading-relaxed mb-5">
                High-purity
                Tesamorelin research
                peptide studied in
                laboratory models
                involving growth
                hormone-releasing
                hormone receptor
                pathways, GH
                signaling, IGF-1
                response pathways,
                and metabolic
                regulation.
              </p>

              {/* SIZE */}
              <div className="mb-5">

                <p className="uppercase tracking-widest text-white/45 text-xs mb-3">
                  Select Size
                </p>

                <div className="grid grid-cols-2 gap-3">

                  {(
                    [
                      "5mg",
                      "10mg",
                    ] as const
                  ).map((mg) => {

                    const option =
                      productData[mg];

                    const selected =
                      selectedMg === mg;

                    const optionOutOfStock =
                      option.inventory <=
                      0;

                    return (
                      <button
                        key={mg}
                        type="button"
                        onClick={() =>
                          selectSize(mg)
                        }
                        className={`relative rounded-2xl border px-4 py-3.5 transition-all ${
                          selected
                            ? "border-blue-300 bg-blue-400/10"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        }`}
                      >

                        {selected && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-300 text-[#081526] flex items-center justify-center">
                            <Check
                              size={12}
                              strokeWidth={3}
                            />
                          </span>
                        )}

                        <p className="font-black text-white">
                          {mg}
                        </p>

                        <p className="text-white/55 text-sm mt-1">
                          $
                          {formatMoney(
                            option.price
                          )}
                        </p>

                        {optionOutOfStock && (
                          <p className="text-red-300 text-[10px] uppercase tracking-widest mt-1">
                            Out of Stock
                          </p>
                        )}

                      </button>
                    );
                  })}

                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-5">

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-widest">
                  {selectedMg}
                </span>

                {selectedDiscountPercent >
                  0 && (
                  <span className="rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-green-200">
                    Save{" "}
                    {
                      selectedDiscountPercent
                    }
                    %
                  </span>
                )}

                {isLimitedStock && (
                  <span className="text-yellow-300 text-sm font-semibold">
                    Limited Stock
                  </span>
                )}

                {isOutOfStock && (
                  <span className="text-red-300 text-sm font-semibold">
                    Out of Stock
                  </span>
                )}

              </div>

              <div className="h-px bg-white/10 mb-5" />

{/* QUANTITY */}
<div className="mb-5">
  <div className="flex items-center justify-between gap-4 mb-3">
    <p className="uppercase tracking-widest text-white/45 text-xs">
      Quantity
    </p>

    {selectedQuantity > 1 && (
      <p className="text-[#A5D8FF] text-xs font-semibold">
        ${formatMoney(discountedUnitPrice)} / vial
      </p>
    )}
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">

    {/* 1 VIAL */}
    <button
      type="button"
      disabled={isOutOfStock}
      onClick={() => selectQuantity(1)}
      className={`relative min-h-[92px] rounded-[18px] border px-2 py-3 transition-all flex flex-col items-center justify-center ${
        selectedQuantity === 1
          ? "border-blue-300 bg-blue-400/10"
          : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]"
      } disabled:opacity-35 disabled:cursor-not-allowed`}
    >
      {selectedQuantity === 1 && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-300 text-[#081526] flex items-center justify-center">
          <Check size={11} strokeWidth={3} />
        </span>
      )}

      <p className="font-black text-white text-sm">
        1 Vial
      </p>

      <p className="text-xs text-white/45 mt-1">
        ${formatMoney(selectedPrice)}
      </p>
    </button>

    {/* ADMIN QUANTITY TIERS */}
    {quantityDiscounts.map((tier) => {
      const tierUnavailable =
        selectedInventory < tier.quantity;

      const tierTotal =
        selectedPrice *
        tier.quantity *
        (1 - tier.discount_percent / 100);

      const selected =
        selectedQuantity === tier.quantity;

      return (
        <button
          key={tier.id}
          type="button"
          disabled={tierUnavailable}
          onClick={() =>
            selectQuantity(tier.quantity)
          }
          className={`relative min-h-[92px] rounded-[18px] border px-2 py-3 transition-all flex flex-col items-center justify-center ${
            selected
              ? "border-blue-300 bg-blue-400/10"
              : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]"
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          {selected && (
            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-300 text-[#081526] flex items-center justify-center">
              <Check
                size={11}
                strokeWidth={3}
              />
            </span>
          )}

          <p className="font-black text-white text-sm">
            {tier.quantity} Vials
          </p>

          <p className="text-xs text-white/45 mt-1">
            ${formatMoney(tierTotal)}
          </p>

          <p className="text-[9px] uppercase tracking-[0.14em] text-green-300 mt-1">
            Save {tier.discount_percent}%
          </p>
        </button>
      );
    })}
  </div>
</div>

              {/* FREE GIFT */}
              <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 mb-5">

                <p className="text-center text-blue-100 text-xs font-semibold uppercase tracking-wider">
                  Complimentary gift
                  with any 8 vials
                </p>

              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-2 gap-3">

                {isOutOfStock ? (
                  <button
                    disabled
                    className="col-span-2 bg-white/[0.06] text-white/30 cursor-not-allowed rounded-full py-4 uppercase tracking-widest text-xs font-semibold"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    onClick={
                      addToCart
                    }
                    className="col-span-2 bg-white text-[#081526] hover:bg-blue-100 rounded-full py-4 uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >

                    <ShoppingCart
                      size={18}
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
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] rounded-full py-3.5 uppercase tracking-widest text-[11px] font-semibold text-center"
                >
                  View Cart
                </a>

                <a
                  href="/products"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] rounded-full py-3.5 uppercase tracking-widest text-[11px] font-semibold text-center"
                >
                  Keep Shopping
                </a>

              </div>

              {/* SIZE-SPECIFIC COA LINK */}
              <a
                href={selectedCoa.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-4 text-xs uppercase tracking-widest text-[#A5D8FF] hover:text-white transition-all"
              >
                View {selectedMg} Certificate of Analysis →
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* SIZE-SPECIFIC COA */}
      <section className="px-6 md:px-10 pb-12">

        <div className="max-w-7xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-6">

          <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">

            <div>

              <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
                {selectedCoa.lab}
              </p>

              <h3 className="text-2xl font-black text-white mb-4">
                Tesamorelin {selectedMg} Certificate of Analysis
              </h3>

              <div className="flex flex-wrap gap-2">

                <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                  ✓ Identity Confirmed
                </span>

                <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#A5D8FF] text-sm font-semibold">
                  {selectedCoa.purity} Purity
                </span>

                <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#A5D8FF] text-sm font-semibold">
                  {selectedCoa.content} Content
                </span>

                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
                  Lot: {selectedCoa.lot}
                </span>

              </div>
            </div>

            <div className="md:text-right">

              <p className="text-4xl font-black text-[#A5D8FF]">
                {selectedCoa.purity}
              </p>

              <p className="uppercase tracking-widest text-white/40 text-xs">
                Purity
              </p>

              <a
                href={selectedCoa.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-3 rounded-full border border-blue-400/20 bg-blue-400/10 px-5 py-2.5 text-blue-300 text-sm font-semibold hover:bg-blue-400/20 transition-all"
              >
                View {selectedMg} COA
              </a>

            </div>
          </div>

        </div>
      </section>

      {/* QUALITY */}
      <section className="px-6 md:px-10 pb-10">

        <div className="max-w-7xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-7 grid grid-cols-1 md:grid-cols-4 gap-6">

          {[
            [
              FlaskConical,
              "Research Use Only",
              "Strictly for laboratory research.",
            ],

            [
              ShieldCheck,
              "Third-Party Tested",
              `${selectedMg} analytical testing is available from ${selectedCoa.lab}.`,
            ],

            [
              ClipboardCheck,
              "Batch Documented",
              `${selectedMg} batch-specific analytical documentation is available.`,
            ],

            [
              ShieldCheck,
              `${selectedCoa.purity} Purity`,
              `${selectedMg} analytical documentation reports ${selectedCoa.purity} purity.`,
            ],
          ].map(
            ([Icon, title, text]: any) => (

              <div
                key={title}
                className="flex gap-4"
              >

                <Icon
                  className="text-[#A5D8FF]"
                  size={28}
                />

                <div>

                  <h3 className="text-white uppercase tracking-widest font-bold text-xs">
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

      {/* RESEARCH PROFILE */}
      <section className="px-6 md:px-10 pb-14">

        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

          <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-3">
            Research Profile
          </p>

          <h2 className="text-3xl font-black text-white mb-4">
            GH-Releasing Pathway Overview
          </h2>

          <p className="text-white/65 leading-relaxed max-w-4xl mb-7">
            Tesamorelin is studied
            in laboratory research
            for its interaction
            with growth
            hormone-releasing
            hormone receptor
            pathways, commonly
            evaluated in endocrine
            signaling, IGF-1
            response, and
            metabolic research
            models.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {[
              [
                "GHRH Pathway",
                "Studied for growth hormone-releasing hormone receptor signaling.",
              ],

              [
                "IGF-1 Response",
                "Evaluated in research models involving downstream IGF-1 activity.",
              ],

              [
                "Metabolic Research",
                "Used in laboratory studies involving metabolic and body-composition research pathways.",
              ],

              [
                "Storage",
                "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use.",
              ],
            ].map(
              ([title, text]) => (

                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >

                  <h3 className="text-white font-bold mb-2">
                    {title}
                  </h3>

                  <p className="text-white/55 text-sm leading-relaxed">
                    {text}
                  </p>

                </div>
              )
            )}

          </div>

        </div>
      </section>

      {/* RELATED */}
      <section className="px-6 md:px-10 pb-14">

        <div className="max-w-7xl mx-auto">

          <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
            Frequently Researched Together
          </p>

          <h2 className="text-3xl font-black text-white mb-6">
            Pair With Related Research Compounds
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {[
              {
                name: "CJC/IPA",

                image:
                  "/images/cjcipablue.png",

                path:
                  "/products/cjcipa",

                text:
                  "Research involving growth hormone signaling pathways and endocrine response models.",
              },

              {
                name: "MOTS-C",

                image:
                  "/images/motscblue.png",

                path:
                  "/products/motsc",

                text:
                  "Studied in laboratory models involving mitochondrial signaling and metabolic research.",
              },

              {
                name: "APX-3",

                image:
                  "/images/apx310blue.png",

                path:
                  "/products/apx3",

                text:
                  "Research involving metabolic signaling, energy regulation, and body-composition models.",
              },
            ].map((item) => (

              <a
                key={item.name}
                href={item.path}
                className="group rounded-[26px] border border-white/10 bg-white/[0.04] p-4 hover:border-blue-400/40 transition-all"
              >

                <div className="rounded-[22px] overflow-hidden mb-4 bg-[#93C5FD] h-[200px]">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                  />

                </div>

                <h3 className="text-xl font-black text-white mb-2">
                  {item.name}
                </h3>

                <p className="text-white/55 text-sm leading-relaxed">
                  {item.text}
                </p>

                <span className="inline-block mt-3 text-[#A5D8FF] text-sm font-semibold">
                  View Product →
                </span>

              </a>
            ))}

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
            key={section.title}
            className="px-6 md:px-10 pb-10"
          >

            <div className="max-w-7xl mx-auto rounded-[26px] border border-white/10 bg-white/[0.04] p-6">

              <h3 className="text-[#A5D8FF] font-bold uppercase tracking-[0.25em] text-xs mb-3">
                {section.title}
              </h3>

              <p className="text-white/55 text-sm leading-relaxed">
                {section.text}
              </p>

            </div>

          </section>
        )
      )}

    </main>
  );
}