
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

/* =========================================================
   TYPES
========================================================= */

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

type DatabaseProduct = {
  id: string | number;
  slug?: string;
  name?: string;
  price?: string | number;
  inventory?: string | number;
};

/* =========================================================
   PRODUCT AND COAS
========================================================= */

const product = {
  id: "bpc157",
  name: "BPC-157",
  image: "/images/bpc157blue.png",
  path: "/products/bpc157",
};

const latestCoa = {
  laboratory: "Axiom Analytics Laboratories",
  batch: "T-BPC-0032",
  purity: "99.57%",
  content: "10.47 mg",
  report: "AX-2026-2898-W7B5",
  issued: "October 16, 2026",
  path: "/images/coas/BPC-157_10mg_Axiom_COA_3pages.pdf",
};

const previousCoas = [
  {
    label: "SteriGenix · BPC102608-CBLU",
    subtitle: "Previous Certificate of Analysis",
    batch: "BPC102608-CBLU",
    purity: "99.80%",
    content: "10.18 mg",
    path: "/images/coas/bpc157-10mg-bpc102608-cblu-09-07-2026.pdf",
  },
  {
    label: "Blue Cap-2",
    subtitle: "Earlier Certificate of Analysis",
    batch: "Blue Cap-2",
    purity: "99.72%",
    content: "11.78 mg",
    path: "/images/coas/bpc157coa7-10-26.pdf",
  },
  {
    label: "Black Cap-1",
    subtitle: "Original Certificate of Analysis",
    batch: "Black Cap-1",
    purity: "99.33%",
    content: "11.58 mg",
    path: "/images/coas/bpc-157-10mg-black-cap-coa.pdf",
  },
];

const formatMoney = (amount: number) =>
  Number(amount).toFixed(2);

/* =========================================================
   BPC-157 PRODUCT PAGE
========================================================= */

export default function BPC157Page() {
  const [added, setAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] =
    useState(1);

  const [inventory, setInventory] =
    useState<number | null>(null);

  const [price, setPrice] = useState(50);

  const [databaseProductId, setDatabaseProductId] =
    useState<string | null>(null);

  const [flashSale, setFlashSale] =
    useState<FlashSale | null>(null);

  const [showPreviousCoa, setShowPreviousCoa] =
    useState(false);

  const [quantityDiscounts, setQuantityDiscounts] =
    useState<QuantityDiscountTier[]>([]);

  const [productLoaded, setProductLoaded] =
    useState(false);

  /* =====================================================
     INVENTORY AND PRICING
  ===================================================== */

  const isOutOfStock =
    productLoaded &&
    (inventory === null || inventory <= 0);

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
    isFlashSaleActive && flashSalePrice !== null
      ? flashSalePrice
      : price;

  const favoriteProduct = {
    id: product.id,
    name: product.name,
    price: effectiveUnitPrice,
    image: product.image,
    path: product.path,
  };

  /* =====================================================
     FETCH PRODUCT DATA AND FLASH SALES
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

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
          await saleResponse.json().catch(() => ({
            success: false,
            sales: [],
          }));

        if (cancelled) return;

        const products: DatabaseProduct[] =
          productData.success &&
          Array.isArray(productData.products)
            ? productData.products
            : [];

        const bpc157 = products.find((item) => {
          const slug = String(
            item.slug || ""
          ).toLowerCase();

          const id = String(
            item.id || ""
          ).toLowerCase();

          const name = String(
            item.name || ""
          ).toLowerCase();

          return (
            slug === "bpc157" ||
            slug === "bpc-157" ||
            slug === "bpc157-10mg" ||
            slug === "bpc-157-10mg" ||
            id === "bpc157" ||
            id === "bpc-157" ||
            id === "bpc157-10mg" ||
            id === "bpc-157-10mg" ||
            name.includes("bpc")
          );
        });

        if (bpc157) {
          const dbId = String(bpc157.id);
          const regularPrice = Number(
            bpc157.price ?? 50
          );

          setDatabaseProductId(dbId);
          setInventory(
            Number(bpc157.inventory ?? 0)
          );
          setPrice(regularPrice);

          const now = Date.now();

          const matchingSale =
            Array.isArray(saleData.sales)
              ? saleData.sales.find(
                  (sale: FlashSale) => {
                    const starts = new Date(
                      sale.starts_at
                    ).getTime();

                    const ends = new Date(
                      sale.ends_at
                    ).getTime();

                    const salePrice = Number(
                      sale.sale_price
                    );

                    return (
                      sale.active === true &&
                      String(sale.product_id) ===
                        dbId &&
                      Number.isFinite(starts) &&
                      Number.isFinite(ends) &&
                      starts <= now &&
                      ends > now &&
                      Number.isFinite(salePrice) &&
                      salePrice > 0 &&
                      salePrice < regularPrice
                    );
                  }
                )
              : null;

          setFlashSale(matchingSale || null);
        } else {
          setDatabaseProductId(null);
          setInventory(null);
          setPrice(50);
          setFlashSale(null);
        }

        setProductLoaded(true);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Failed to fetch BPC-157 data:",
          error
        );

        setDatabaseProductId(null);
        setInventory(null);
        setPrice(50);
        setFlashSale(null);
        setProductLoaded(true);
      }
    };

    fetchProductData();

    const interval = window.setInterval(
      fetchProductData,
      30000
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  /* =====================================================
     FETCH QUANTITY DISCOUNTS
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchQuantityDiscounts = async () => {
      try {
        const response = await fetch(
          "/api/quantity-discounts",
          { cache: "no-store" }
        );

        const data = await response.json();

        if (cancelled || !data.success) return;

        const tiers: QuantityDiscountTier[] = (
          data.tiers || []
        )
          .map((tier: any) => ({
            id: String(tier.id),
            name: String(tier.name || ""),
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
            (tier: QuantityDiscountTier) =>
              tier.quantity > 1 &&
              tier.discount_percent >= 0
          )
          .sort(
            (
              a: QuantityDiscountTier,
              b: QuantityDiscountTier
            ) =>
              a.sort_order !== b.sort_order
                ? a.sort_order - b.sort_order
                : a.quantity - b.quantity
          );

        setQuantityDiscounts(tiers);
      } catch (error) {
        console.error(
          "Failed to fetch quantity discounts:",
          error
        );
      }
    };

    fetchQuantityDiscounts();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     QUANTITY CALCULATIONS
  ===================================================== */

  const getDiscountTier = (quantity: number) =>
    [...quantityDiscounts]
      .filter(
        (tier) => quantity >= tier.quantity
      )
      .sort(
        (a, b) => b.quantity - a.quantity
      )[0] || null;

  const selectedTier =
    getDiscountTier(selectedQuantity);

  const selectedDiscountPercent =
    isFlashSaleActive
      ? 0
      : selectedTier?.discount_percent || 0;

  const discountedUnitPrice =
    effectiveUnitPrice *
    (1 - selectedDiscountPercent / 100);

  const selectedTotal =
    discountedUnitPrice * selectedQuantity;

  const regularTotal =
    price * selectedQuantity;

  const selectQuantity = (quantity: number) => {
    if (
      !productLoaded ||
      (inventory !== null &&
        quantity > inventory)
    ) {
      return;
    }

    setSelectedQuantity(quantity);
    setAdded(false);
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = () => {
    if (
      !productLoaded ||
      !databaseProductId ||
      isOutOfStock
    ) {
      return;
    }

    let existingCart: any[] = [];

    try {
      const storedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      existingCart = Array.isArray(storedCart)
        ? storedCart
        : [];
    } catch {
      existingCart = [];
    }

    const existingProduct = existingCart.find(
      (item: any) => item.id === product.id
    );

    const existingQuantity = existingProduct
      ? Number(existingProduct.quantity || 0)
      : 0;

    const newQuantity =
      existingQuantity + selectedQuantity;

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

    const newTier = isFlashSaleActive
      ? null
      : getDiscountTier(newQuantity);

    const newDiscountPercent = isFlashSaleActive
      ? 0
      : newTier?.discount_percent || 0;

    const newDiscountedUnitPrice =
      effectiveUnitPrice *
      (1 - newDiscountPercent / 100);

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

      flashSaleId: isFlashSaleActive
        ? flashSale?.id || null
        : null,

      flashSalePrice: isFlashSaleActive
        ? effectiveUnitPrice
        : null,

      databaseProductId,
    };

    const updatedCart = existingProduct
      ? existingCart.map((item: any) =>
          item.id === product.id
            ? { ...item, ...cartProduct }
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

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      {/* =====================================================
          PRODUCT HERO
      ===================================================== */}

      <section className="relative px-5 md:px-10 py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">

            {/* PRODUCT IMAGE */}

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

            {/* PRODUCT INFORMATION */}

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
                    ${formatMoney(selectedTotal)}
                  </p>

                  {(isFlashSaleActive ||
                    selectedDiscountPercent > 0) && (
                    <p className="text-white/35 text-sm line-through">
                      ${formatMoney(regularTotal)}
                    </p>
                  )}

                </div>
              </div>

              <p className="text-white/60 leading-relaxed mb-5">
                High-purity BPC-157 research peptide
                studied in laboratory models involving
                tissue repair signaling, vascular pathway
                research, gastrointestinal models, and
                cellular response mechanisms.
              </p>

              {/* PRODUCT BADGES */}

              <div className="flex flex-wrap items-center gap-3 mb-5">

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-widest">
                  10mg
                </span>

                {isFlashSaleActive && (
                  <span className="rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#A5D8FF]">
                    Flash Sale · $
                    {formatMoney(effectiveUnitPrice)}
                    {" "}/ vial
                  </span>
                )}

                {selectedDiscountPercent > 0 && (
                  <span className="rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-green-200">
                    Save {selectedDiscountPercent}%
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

              {/* =================================================
                  QUANTITY SELECTOR
              ================================================= */}

              <div className="mb-5">

                <div className="flex items-center justify-between gap-4 mb-3">

                  <p className="uppercase tracking-widest text-white/45 text-xs">
                    Quantity
                  </p>

                  {selectedQuantity > 1 && (
                    <p className="text-[#A5D8FF] text-xs font-semibold">
                      ${formatMoney(discountedUnitPrice)}
                      {" "}/ vial
                    </p>
                  )}

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">

                  {/* SINGLE VIAL */}

                  <button
                    type="button"
                    disabled={
                      !productLoaded || isOutOfStock
                    }
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

                  {/* QUANTITY DISCOUNT TIERS */}

                  {quantityDiscounts.map((tier) => {
                    const tierUnavailable =
                      !productLoaded ||
                      inventory === null ||
                      inventory < tier.quantity;

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
                  Complimentary gift with any 8 vials
                </p>
              </div>

              {/* CART BUTTONS */}

              <div className="grid grid-cols-2 gap-3">

                {!productLoaded ? (
                  <button
                    disabled
                    className="col-span-2 bg-white/[0.06] text-white/40 rounded-full py-4 uppercase tracking-widest text-xs font-semibold"
                  >
                    Loading Product
                  </button>
                ) : isOutOfStock ? (
                  <button
                    disabled
                    className="col-span-2 bg-white/[0.06] text-white/30 cursor-not-allowed rounded-full py-4 uppercase tracking-widest text-xs font-semibold"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    type="button"
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

              {/* MAIN COA LINK */}

              <a
                href={latestCoa.path}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-4 text-xs uppercase tracking-widest text-[#A5D8FF] hover:text-white transition-all"
              >
                View Certificate of Analysis →
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CERTIFICATES OF ANALYSIS
      ===================================================== */}

      <section className="px-6 md:px-10 pb-12">

        <div className="max-w-7xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-6">

          {/* LATEST AXIOM ANALYTICS COA */}

          <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">

            <div>

              <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
                {latestCoa.laboratory}
              </p>

              <h3 className="text-2xl font-black text-white mb-4">
                Latest Certificate of Analysis
              </h3>

              <div className="flex flex-wrap gap-2">

                <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                  ✓ Identity Confirmed
                </span>

                <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#A5D8FF] text-sm font-semibold">
                  {latestCoa.purity} Purity
                </span>

                <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#A5D8FF] text-sm font-semibold">
                  {latestCoa.content} Content
                </span>

                <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-semibold">
                  Rapid PCR: Target DNA Not Detected
                </span>

                <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-semibold">
                  Fentanyl Screen: None Detected
                </span>

                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
                  Batch: {latestCoa.batch}
                </span>

              </div>
            </div>

            {/* VIEW AND DOWNLOAD NEW COA */}

            <div className="md:text-right">

              <p className="text-4xl font-black text-[#A5D8FF]">
                {latestCoa.purity}
              </p>

              <p className="uppercase tracking-widest text-white/40 text-xs">
                Purity
              </p>

              <a
                href={latestCoa.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-3 rounded-full border border-blue-400/20 bg-blue-400/10 px-5 py-2.5 text-blue-300 text-sm font-semibold hover:bg-blue-400/20 transition-all"
              >
                View Latest COA
              </a>

            </div>
          </div>

          {/* =================================================
              PREVIOUS COAS DROPDOWN
          ================================================= */}

          <div className="mt-6 border-t border-white/10 pt-5">

            <button
              type="button"
              onClick={() =>
                setShowPreviousCoa(
                  (previous) => !previous
                )
              }
              aria-expanded={showPreviousCoa}
              className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 px-5 text-xs uppercase tracking-widest text-white/80 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
            >
              {showPreviousCoa
                ? "Hide Previous COAs"
                : "See Previous COAs"}
            </button>

            {showPreviousCoa && (
              <div className="mt-5 space-y-4">

                {previousCoas.map((coa) => (
                  <div
                    key={coa.path}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                  >

                    <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">

                      <div>

                        <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
                          {coa.subtitle}
                        </p>

                        <h3 className="text-xl font-black text-white mb-4">
                          {coa.label}
                        </h3>

                        <div className="flex flex-wrap gap-2">

                          <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#A5D8FF] text-sm font-semibold">
                            {coa.purity} Purity
                          </span>

                          <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#A5D8FF] text-sm font-semibold">
                            {coa.content} Content
                          </span>

                          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
                            Lot: {coa.batch}
                          </span>

                        </div>
                      </div>

                      <div className="md:text-right">

                        <p className="text-3xl font-black text-[#A5D8FF]">
                          {coa.purity}
                        </p>

                        <p className="uppercase tracking-widest text-white/40 text-xs">
                          Purity
                        </p>

                        <a
                          href={coa.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex mt-3 rounded-full border border-blue-400/20 bg-blue-400/10 px-5 py-2.5 text-blue-300 text-sm font-semibold hover:bg-blue-400/20 transition-all"
                        >
                          View COA
                        </a>

                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          QUALITY
      ===================================================== */}

      <section className="px-6 md:px-10 pb-10">

        <div className="max-w-7xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-7 grid grid-cols-1 md:grid-cols-4 gap-6">

          {[
            {
              Icon: FlaskConical,
              title: "Research Use Only",
              description:
                "Strictly for laboratory research.",
            },
            {
              Icon: ShieldCheck,
              title: "Third-Party Tested",
              description:
                "Independent lab verified when available.",
            },
            {
              Icon: ClipboardCheck,
              title: "Batch Documented",
              description:
                "Documentation available for verified lots.",
            },
            {
              Icon: ShieldCheck,
              title: "Quality Target",
              description:
                "99%+ purity target.",
            },
          ].map(
            ({ Icon, title, description }) => (
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
                    {description}
                  </p>

                </div>
              </div>
            )
          )}

        </div>
      </section>

      {/* =====================================================
          RESEARCH PROFILE
      ===================================================== */}

      <section className="px-6 md:px-10 pb-14">

        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

          <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-3">
            Research Profile
          </p>

          <h2 className="text-3xl font-black text-white mb-4">
            Tissue Repair Research Overview
          </h2>

          <p className="text-white/65 leading-relaxed max-w-4xl mb-7">
            BPC-157 is studied in laboratory research
            models involving tissue repair signaling,
            vascular pathway research, gastrointestinal
            models, and cellular response mechanisms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {[
              {
                title: "Tissue Research",
                description:
                  "Studied in models involving cellular repair and response pathways.",
              },
              {
                title: "GI Research Models",
                description:
                  "Evaluated in laboratory investigations involving mucosal integrity.",
              },
              {
                title: "Vascular Pathways",
                description:
                  "Researched in relation to angiogenesis and nitric oxide signaling.",
              },
              {
                title: "Storage",
                description:
                  "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use.",
              },
            ].map(
              ({ title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >

                  <h3 className="text-white font-bold mb-2">
                    {title}
                  </h3>

                  <p className="text-white/55 text-sm leading-relaxed">
                    {description}
                  </p>

                </div>
              )
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

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
                name: "TB-500",
                image: "/images/tb500blue.png",
                path: "/products/tb500",
                description:
                  "Research focused on recovery pathways and cellular migration models.",
              },
              {
                name: "KPV",
                image: "/images/kpvblue.png",
                path: "/products/kpv",
                description:
                  "Studied in models involving inflammatory pathways and cellular signaling mechanisms.",
              },
              {
                name: "ARA-290",
                image: "/images/ara290blue.png",
                path: "/products/ara290",
                description:
                  "Research involving tissue protection pathways and cellular response signaling.",
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
                  {item.description}
                </p>

                <span className="inline-block mt-3 text-[#A5D8FF] text-sm font-semibold">
                  View Product →
                </span>

              </a>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          DISCLAIMERS
      ===================================================== */}

      {[
        {
          title: "FDA Disclaimer",
          description:
            "These statements have not been evaluated by the U.S. Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only and are not for human or veterinary consumption.",
        },
        {
          title: "Customer Acknowledgment",
          description:
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
              {section.description}
            </p>

          </div>
        </section>
      ))}

    </main>
  );
}
