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

type FlashSale = {
  id: string;
  product_id: string;
  sale_price: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
};

export default function PE2228Page() {
  const [added, setAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [inventory, setInventory] = useState<number | null>(null);
  const [price, setPrice] = useState(55);

  const [databaseProductId, setDatabaseProductId] =
    useState<string | null>(null);

  const [flashSale, setFlashSale] =
    useState<FlashSale | null>(null);

  const [quantityDiscounts, setQuantityDiscounts] =
    useState<QuantityDiscountTier[]>([]);

  const product = {
    id: "pe2228",
    name: "PE-22-28",
    image: "/images/pe2228blue.png",
    path: "/products/pe2228",
  };

  const isOutOfStock =
    inventory !== null && inventory <= 0;

  const isLimitedStock =
    inventory !== null &&
    inventory > 0 &&
    inventory <= 5;

  const flashSalePrice =
    flashSale !== null
      ? Number(flashSale.sale_price)
      : null;

  const isFlashSaleActive =
    flashSalePrice !== null &&
    Number.isFinite(flashSalePrice) &&
    flashSalePrice > 0 &&
    flashSalePrice < price;

  const effectiveUnitPrice =
    isFlashSaleActive
      ? flashSalePrice
      : price;

  const favoriteProduct = {
    id: product.id,
    name: product.name,
    price: effectiveUnitPrice,
    image: product.image,
    path: product.path,
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productResponse, saleResponse] =
          await Promise.all([
            fetch("/api/products", {
              cache: "no-store",
            }),

            fetch("/api/flash-sales", {
              cache: "no-store",
            }),
          ]);

        const productData =
          await productResponse.json();

        const saleData =
          await saleResponse.json().catch(
            () => ({
              success: false,
              sales: [],
            })
          );

        if (!productData.success) return;

        const pe2228 =
          productData.products.find(
            (item: any) =>
              item.slug === "pe2228" ||
              item.slug === "pe-22-28" ||
              item.slug === "pe2228-10mg" ||
              item.slug === "pe-22-28-10mg" ||
              item.id === "pe2228" ||
              item.id === "pe-22-28" ||
              item.id === "pe2228-10mg" ||
              item.id === "PE-22-28-10mg" ||
              item.name
                ?.toLowerCase()
                .includes("pe-22-28") ||
              item.name
                ?.toLowerCase()
                .includes("pe2228")
          );

        if (pe2228) {
          const dbId =
            String(pe2228.id);

          const regularPrice =
            Number(
              pe2228.price ?? 55
            );

          setDatabaseProductId(dbId);

          setInventory(
            Number(
              pe2228.inventory ?? 0
            )
          );

          setPrice(regularPrice);

          const now = Date.now();

          const matchingSale =
            Array.isArray(saleData.sales)
              ? saleData.sales.find(
                  (sale: FlashSale) => {
                    const starts =
                      new Date(
                        sale.starts_at
                      ).getTime();

                    const ends =
                      new Date(
                        sale.ends_at
                      ).getTime();

                    const salePrice =
                      Number(
                        sale.sale_price
                      );

                    return (
                      sale.active === true &&
                      String(
                        sale.product_id
                      ) === dbId &&
                      Number.isFinite(
                        starts
                      ) &&
                      Number.isFinite(
                        ends
                      ) &&
                      starts <= now &&
                      ends > now &&
                      Number.isFinite(
                        salePrice
                      ) &&
                      salePrice > 0 &&
                      salePrice < regularPrice
                    );
                  }
                )
              : null;

          setFlashSale(
            matchingSale || null
          );
        } else {
          setDatabaseProductId(null);
          setInventory(null);
          setPrice(55);
          setFlashSale(null);
        }
      } catch (error) {
        console.error(
          "Failed to fetch PE-22-28 data:",
          error
        );

        setDatabaseProductId(null);
        setInventory(null);
        setPrice(55);
        setFlashSale(null);
      }
    };

    const fetchQuantityDiscounts = async () => {
      try {
        const response = await fetch(
          "/api/quantity-discounts",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!data.success) return;

        const tiers = (data.tiers || [])
          .map((tier: any) => ({
            id: String(tier.id),
            name: String(tier.name || ""),
            quantity: Number(tier.quantity || 0),
            discount_percent: Number(
              tier.discount_percent || 0
            ),
            sort_order: Number(
              tier.sort_order || 0
            ),
          }))
          .filter(
            (tier: QuantityDiscountTier) =>
              tier.quantity > 1 &&
              tier.discount_percent >= 0
          )
          .sort(
            (
              a: QuantityDiscountTier,
              b: QuantityDiscountTier
            ) => {
              if (a.sort_order !== b.sort_order) {
                return a.sort_order - b.sort_order;
              }

              return a.quantity - b.quantity;
            }
          );

        setQuantityDiscounts(tiers);
      } catch (error) {
        console.error(
          "Failed to fetch quantity discounts:",
          error
        );
      }
    };

    fetchProductData();
    fetchQuantityDiscounts();

    const flashSaleRefresh =
      window.setInterval(
        fetchProductData,
        30_000
      );

    return () => {
      window.clearInterval(
        flashSaleRefresh
      );
    };
  }, []);

  const getDiscountTier = (quantity: number) => {
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
    getDiscountTier(selectedQuantity);

  const selectedDiscountPercent =
    isFlashSaleActive
      ? 0
      : selectedTier?.discount_percent || 0;

  const discountedUnitPrice =
    effectiveUnitPrice *
    (1 -
      selectedDiscountPercent /
        100);

  const selectedTotal =
    discountedUnitPrice *
    selectedQuantity;

  const regularTotal =
    price * selectedQuantity;

  const formatMoney = (amount: number) =>
    Number(amount).toFixed(2);

  const selectQuantity = (quantity: number) => {
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

    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingProduct =
      existingCart.find(
        (item: any) =>
          item.id === product.id
      );

    const existingQuantity =
      existingProduct
        ? Number(
            existingProduct.quantity || 0
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
        } of ${
          product.name
        } are currently available.`
      );

      return;
    }

    const newTier =
      isFlashSaleActive
        ? null
        : getDiscountTier(newQuantity);

    const newDiscountPercent =
      isFlashSaleActive
        ? 0
        : newTier?.discount_percent || 0;

    const newDiscountedUnitPrice =
      effectiveUnitPrice *
      (1 -
        newDiscountPercent /
          100);

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: newDiscountedUnitPrice,
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

      flashSaleApplied:
        isFlashSaleActive,

      flashSaleId:
        isFlashSaleActive
          ? flashSale?.id || null
          : null,

      flashSalePrice:
        isFlashSaleActive
          ? effectiveUnitPrice
          : null,

      databaseProductId:
        databaseProductId,
    };

    const updatedCart =
      existingProduct
        ? existingCart.map((item: any) =>
            item.id === product.id
              ? {
                  ...item,
                  ...cartProduct,
                }
              : item
          )
        : [...existingCart, cartProduct];

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
      {/* PRODUCT HERO */}
      <section className="relative px-5 md:px-10 py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">

            {/* IMAGE */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[520px] aspect-square rounded-[42px] overflow-hidden border border-blue-400/10 bg-white/[0.03] shadow-[0_0_30px_rgba(96,165,250,0.15)]">
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

            {/* PRODUCT CARD */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 md:p-8">
              <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-3">
                Research Peptide
              </p>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-black text-white">
                  {product.name}
                </h1>

                <div className="sm:text-right">
                  <p className="text-3xl md:text-4xl font-black text-white">
                    $
                    {formatMoney(
                      selectedTotal
                    )}
                  </p>

                  {(isFlashSaleActive ||
                    selectedDiscountPercent > 0) && (
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
                PE-22-28 research
                peptide produced for
                laboratory
                investigation of
                neuropeptide-associated
                signaling,
                stress-response
                pathways, and
                cellular
                communication
                mechanisms.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-widest">
                  10mg
                </span>

                {isFlashSaleActive && (
                  <span className="rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#A5D8FF]">
                    Flash Sale · $
                    {formatMoney(
                      effectiveUnitPrice
                    )}{" "}
                    / vial
                  </span>
                )}

                {selectedDiscountPercent > 0 && (
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
                        <Check
                          size={11}
                          strokeWidth={3}
                        />
                      </span>
                    )}

                    <p className="font-black text-white text-sm">
                      1 Vial
                    </p>

                    <p className="text-xs text-white/45 mt-1">
                      ${formatMoney(effectiveUnitPrice)}
                    </p>

                    {isFlashSaleActive && (
                      <p className="text-[10px] text-white/25 line-through mt-0.5">
                        ${formatMoney(price)}
                      </p>
                    )}
                  </button>

                  {/* ADMIN QUANTITY TIERS */}
                  {quantityDiscounts.map((tier) => {
                    const tierUnavailable =
                      inventory !== null &&
                      inventory <
                        tier.quantity;

                    const tierTotal =
                      isFlashSaleActive
                        ? effectiveUnitPrice *
                          tier.quantity
                        : price *
                          tier.quantity *
                          (1 -
                            tier.discount_percent /
                              100);

                    const selected =
                      selectedQuantity ===
                      tier.quantity;

                    return (
                      <button
                        key={tier.id}
                        type="button"
                        disabled={tierUnavailable}
                        onClick={() =>
                          selectQuantity(
                            tier.quantity
                          )
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

                        {isFlashSaleActive ? (
                          <p className="text-[9px] uppercase tracking-[0.14em] text-[#A5D8FF] mt-1">
                            Flash Sale
                          </p>
                        ) : (
                          <p className="text-[9px] uppercase tracking-[0.14em] text-green-300 mt-1">
                            Save {tier.discount_percent}%
                          </p>
                        )}
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
                    onClick={addToCart}
                    className="col-span-2 bg-white text-[#081526] hover:bg-blue-100 rounded-full py-4 uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />

                    {added
                      ? "Added To Cart"
                      : `Add ${selectedQuantity} ${
                          selectedQuantity === 1
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

              <div className="block text-center mt-4 text-xs uppercase tracking-widest text-white/35">
                COA Coming Soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COA SUMMARY */}
      <section className="px-6 md:px-10 pb-12">
        <div className="max-w-7xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
                Quality Verification
              </p>

              <h3 className="text-2xl font-black text-white mb-4">
                Certificate of Analysis
              </h3>

              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-semibold">
                  Testing Pending
                </span>

                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
                  10mg
                </span>

                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
                  PE-22-28
                </span>
              </div>
            </div>

            <div className="md:text-right">
              <p className="uppercase tracking-widest text-white/40 text-xs">
                Laboratory Verification
              </p>

              <button
                type="button"
                disabled
                className="inline-flex mt-3 cursor-not-allowed rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-white/40 text-sm font-semibold"
              >
                COA Coming Soon
              </button>
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
              "Testing Pending",
              "Independent analytical testing has not yet been completed.",
            ],

            [
              ClipboardCheck,
              "Batch Documentation",
              "Batch-specific analytical documentation will be added when available.",
            ],

            [
              ShieldCheck,
              "Research Material",
              "Produced for laboratory research applications only.",
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
            Neuro Research Overview
          </h2>

          <p className="text-white/65 leading-relaxed max-w-4xl mb-7">
            PE-22-28 is studied in
            laboratory research
            involving
            neuropeptide-associated
            signaling,
            stress-response models,
            and cellular
            communication
            mechanisms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              [
                "Neuropeptide Signaling",
                "Studied in laboratory models involving peptide-associated neural signaling pathways.",
              ],

              [
                "Stress-Response Models",
                "Evaluated in experimental research involving adaptive cellular signaling pathways.",
              ],

              [
                "Cellular Communication",
                "Investigated in research involving receptor-pathway interactions and molecular signaling behavior.",
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
                name: "Semax",
                image:
                  "/images/semaxblue.png",
                path:
                  "/products/semax",
                text:
                  "Studied in laboratory models involving peptide-associated cellular signaling and molecular pathways.",
              },

              {
                name: "Selank",
                image:
                  "/images/selankblue.png",
                path:
                  "/products/selank",
                text:
                  "Research involving peptide-associated signaling and biochemical mechanisms.",
              },

              {
                name: "Pinealon",
                image:
                  "/images/pinealonblue.png",
                path:
                  "/products/pinealon",
                text:
                  "Studied in laboratory models involving neuronal signaling and cellular research pathways.",
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
          title: "FDA Disclaimer",

          text:
            "These statements have not been evaluated by the U.S. Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only and are not for human or veterinary consumption.",
        },

        {
          title: "Customer Acknowledgment",

          text:
            "By purchasing this product, the customer acknowledges that this material is intended solely for lawful laboratory research purposes and will not be used for human consumption, veterinary use, medical use, diagnosis, treatment, cure, or prevention of disease. Apexx Biolabs does not provide dosing instructions, treatment recommendations, medical advice, or guidance regarding human use of any product.",
        },
      ].map((section) => (
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
      ))}
    </main>
  );
}