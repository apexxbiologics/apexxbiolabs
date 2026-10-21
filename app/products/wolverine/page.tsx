
"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
  Check,
  Download,
  ExternalLink,
  ChevronDown,
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

/* =========================================================
   PRODUCT INFORMATION
========================================================= */

const product = {
  id: "wolverine",
  name: "Wolverine 20mg",
  image: "/images/wolverineblue.png",
  path: "/products/wolverine",
};

/* =========================================================
   LATEST COA — AXIOM ANALYTICS
========================================================= */

const latestCoa = {
  laboratory: "Axiom Analytics Laboratories",
  report: "AX-2026-4260-BT48",
  batch: "T-BPC-0025",
  date: "October 19, 2026",
  purity: "99.85%",
  totalContent: "21.06 mg",
  bpcPurity: "99.94%",
  bpcContent: "10.49 mg",
  tbPurity: "99.76%",
  tbContent: "10.57 mg",
  path: "/images/coas/BPC157_TB500_Wolverine_Axiom_COA_4pages.pdf",
};

/* =========================================================
   PREVIOUS COAS — FREEDOM DIAGNOSTICS
========================================================= */

const previousCoas = [
  {
    laboratory: "Freedom Diagnostics",
    date: "September 14, 2026",
    batch: "WOLV202609-BLU-AB-WOLB-0911",
    purity: "99.38%",
    totalContent: "21.24 mg",
    bpcContent: "11.10 mg",
    tbContent: "10.14 mg",
    path: "/images/coas/9-14-wolverine-coa.pdf",
  },
  {
    laboratory: "Freedom Diagnostics",
    date: "July 31, 2026",
    batch: "Clear Cap / Blue Crimp",
    purity: "99.34%",
    totalContent: "24.77 mg",
    bpcContent: null,
    tbContent: null,
    path: "/images/coas/7-31-wolverine-coa.pdf",
  },
];

/* =========================================================
   STYLING HELPERS
========================================================= */

const badgeClass =
  "rounded-full border px-4 py-2 text-xs font-semibold sm:text-sm";

const blueBadge =
  `${badgeClass} border-blue-400/20 bg-blue-400/10 text-[#A5D8FF]`;

const greenBadge =
  `${badgeClass} border-green-400/20 bg-green-500/10 text-green-300`;

const neutralBadge =
  `${badgeClass} border-white/10 bg-white/[0.04] text-white/60`;

const coaButton =
  "inline-flex items-center justify-center gap-2 rounded-full " +
  "border border-blue-400/20 bg-blue-400/10 px-5 py-2.5 " +
  "text-sm font-semibold text-blue-200 transition-all " +
  "hover:border-blue-300/40 hover:bg-blue-400/20";

function CoaActions({ path }: { path: string }) {
  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={coaButton}
      >
        View COA
      </a>

    </div>
  );
}

/* =========================================================
   WOLVERINE PRODUCT PAGE
========================================================= */

export default function WolverinePage() {
  const [added, setAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [inventory, setInventory] = useState<number | null>(null);
  const [price, setPrice] = useState(90);

  const [databaseProductId, setDatabaseProductId] =
    useState<string | null>(null);

  const [flashSale, setFlashSale] =
    useState<FlashSale | null>(null);

  const [showPreviousCoa, setShowPreviousCoa] =
    useState(false);

  const [quantityDiscounts, setQuantityDiscounts] =
    useState<QuantityDiscountTier[]>([]);

  /* =====================================================
     INVENTORY AND PRICING
  ===================================================== */

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
     FETCH PRODUCT, FLASH SALES, AND DISCOUNTS
  ===================================================== */

  useEffect(() => {
    let mounted = true;

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

        const saleData = await saleResponse
          .json()
          .catch(() => ({
            success: false,
            sales: [],
          }));

        if (!mounted || !productData.success) {
          return;
        }

        const products = Array.isArray(productData.products)
          ? productData.products
          : [];

        const wolverine = products.find((item: any) => {
          const slug = String(item.slug || "")
            .toLowerCase()
            .trim();

          const id = String(item.id || "")
            .toLowerCase()
            .trim();

          const name = String(item.name || "")
            .toLowerCase()
            .trim();

          const size = String(item.size || "")
            .toLowerCase()
            .trim();

          return (
            slug === "wolverine" ||
            slug === "wolverine-20mg" ||
            id === "wolverine" ||
            id === "wolverine-20mg" ||
            (name.includes("wolverine") && size === "20mg") ||
            name.includes("wolverine 20")
          );
        });

        if (wolverine) {
          const dbId = String(wolverine.id);
          const regularPrice = Number(wolverine.price ?? 90);

          setDatabaseProductId(dbId);
          setInventory(Number(wolverine.inventory ?? 0));
          setPrice(regularPrice);

          const now = Date.now();

          const matchingSale = Array.isArray(saleData.sales)
            ? saleData.sales.find((sale: FlashSale) => {
                const starts = new Date(
                  sale.starts_at
                ).getTime();

                const ends = new Date(
                  sale.ends_at
                ).getTime();

                const salePrice = Number(sale.sale_price);

                return (
                  sale.active === true &&
                  String(sale.product_id) === dbId &&
                  Number.isFinite(starts) &&
                  Number.isFinite(ends) &&
                  starts <= now &&
                  ends > now &&
                  Number.isFinite(salePrice) &&
                  salePrice > 0 &&
                  salePrice < regularPrice
                );
              })
            : null;

          setFlashSale(matchingSale || null);
        } else {
          setDatabaseProductId(null);
          setInventory(null);
          setPrice(90);
          setFlashSale(null);
        }
      } catch (error) {
        console.error(
          "Failed to fetch Wolverine data:",
          error
        );

        if (!mounted) return;

        setDatabaseProductId(null);
        setInventory(null);
        setPrice(90);
        setFlashSale(null);
      }
    };

    const fetchQuantityDiscounts = async () => {
      try {
        const response = await fetch(
          "/api/quantity-discounts",
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!mounted || !data.success) {
          return;
        }

        const tiers: QuantityDiscountTier[] = (
          Array.isArray(data.tiers) ? data.tiers : []
        )
          .map((tier: any) => ({
            id: String(tier.id),
            name: String(tier.name || ""),
            quantity: Number(tier.quantity || 0),
            discount_percent: Number(
              tier.discount_percent || 0
            ),
            sort_order: Number(tier.sort_order || 0),
          }))
          .filter(
            (tier: QuantityDiscountTier) =>
              tier.quantity > 1 &&
              tier.discount_percent >= 0
          )
          .sort((a: QuantityDiscountTier, b: QuantityDiscountTier) => {
            if (a.sort_order !== b.sort_order) {
              return a.sort_order - b.sort_order;
            }

            return a.quantity - b.quantity;
          });

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

    const flashSaleRefresh = window.setInterval(
      fetchProductData,
      30000
    );

    return () => {
      mounted = false;
      window.clearInterval(flashSaleRefresh);
    };
  }, []);

  /* =====================================================
     QUANTITY DISCOUNT CALCULATIONS
  ===================================================== */

  const getDiscountTier = (quantity: number) => {
    return (
      [...quantityDiscounts]
        .filter((tier) => quantity >= tier.quantity)
        .sort((a, b) => b.quantity - a.quantity)[0] || null
    );
  };

  const selectedTier = getDiscountTier(selectedQuantity);

  const selectedDiscountPercent = isFlashSaleActive
    ? 0
    : selectedTier?.discount_percent || 0;

  const discountedUnitPrice =
    effectiveUnitPrice *
    (1 - selectedDiscountPercent / 100);

  const selectedTotal =
    discountedUnitPrice * selectedQuantity;

  const regularTotal = price * selectedQuantity;

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

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = () => {
    if (isOutOfStock) return;

    let existingCart: any[] = [];

    try {
      const stored = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      existingCart = Array.isArray(stored)
        ? stored
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

  /* =====================================================
     PAGE LAYOUT
  ===================================================== */

  return (
    <main className="min-h-screen overflow-hidden bg-[#081526] text-white">

      {/* =================================================
          PRODUCT HERO
      ================================================= */}

      <section className="relative overflow-hidden px-5 py-10 md:px-10 md:py-14">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">

            {/* PRODUCT IMAGE */}

            <div className="flex items-center justify-center">

              <div className="relative aspect-square w-full max-w-[520px] overflow-hidden rounded-[42px] border border-blue-400/10 bg-white/[0.03] shadow-[0_0_30px_rgba(96,165,250,0.15)]">

                <FavoriteButton product={favoriteProduct} />

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

              </div>

            </div>

            {/* PRODUCT CARD */}

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:p-8">

              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#A5D8FF]">
                Research Blend
              </p>

              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <h1 className="text-4xl font-black text-white md:text-5xl">
                  {product.name}
                </h1>

                <div className="sm:text-right">

                  <p className="text-3xl font-black text-white md:text-4xl">
                    ${formatMoney(selectedTotal)}
                  </p>

                  {(isFlashSaleActive ||
                    selectedDiscountPercent > 0) && (
                    <p className="text-sm text-white/35 line-through">
                      ${formatMoney(regularTotal)}
                    </p>
                  )}

                </div>

              </div>

              <p className="mb-5 leading-relaxed text-white/60">
                High-purity Wolverine research blend studied in
                laboratory models involving tissue repair pathways,
                cellular migration, recovery-related signaling,
                and cellular response mechanisms.
              </p>

              {/* PRODUCT BADGES */}

              <div className="mb-5 flex flex-wrap items-center gap-3">

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-widest">
                  20mg
                </span>

                {isFlashSaleActive && (
                  <span className="rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#A5D8FF]">
                    Flash Sale · ${formatMoney(effectiveUnitPrice)} / vial
                  </span>
                )}

                {selectedDiscountPercent > 0 && (
                  <span className="rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-green-200">
                    Save {selectedDiscountPercent}%
                  </span>
                )}

                {isLimitedStock && (
                  <span className="text-sm font-semibold text-yellow-300">
                    Limited Stock
                  </span>
                )}

                {isOutOfStock && (
                  <span className="text-sm font-semibold text-red-300">
                    Out of Stock
                  </span>
                )}

              </div>

              <div className="mb-5 h-px bg-white/10" />

              {/* =================================================
                  QUANTITY SELECTOR
              ================================================= */}

              <div className="mb-5">

                <div className="mb-3 flex items-center justify-between gap-4">

                  <p className="text-xs uppercase tracking-widest text-white/45">
                    Quantity
                  </p>

                  {selectedQuantity > 1 && (
                    <p className="text-xs font-semibold text-[#A5D8FF]">
                      ${formatMoney(discountedUnitPrice)} / vial
                    </p>
                  )}

                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">

                  {/* SINGLE VIAL */}

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => selectQuantity(1)}
                    className={`relative flex min-h-[92px] flex-col items-center justify-center rounded-[18px] border px-2 py-3 transition-all ${
                      selectedQuantity === 1
                        ? "border-blue-300 bg-blue-400/10"
                        : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]"
                    } disabled:cursor-not-allowed disabled:opacity-35`}
                  >

                    {selectedQuantity === 1 && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-300 text-[#081526]">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}

                    <p className="text-sm font-black text-white">
                      1 Vial
                    </p>

                    <p className="mt-1 text-xs text-white/45">
                      ${formatMoney(effectiveUnitPrice)}
                    </p>

                    {isFlashSaleActive && (
                      <p className="mt-0.5 text-[10px] text-white/25 line-through">
                        ${formatMoney(price)}
                      </p>
                    )}

                  </button>

                  {/* ADMIN QUANTITY DISCOUNT TIERS */}

                  {quantityDiscounts.map((tier) => {
                    const tierUnavailable =
                      inventory !== null &&
                      inventory < tier.quantity;

                    const tierTotal = isFlashSaleActive
                      ? effectiveUnitPrice * tier.quantity
                      : price *
                        tier.quantity *
                        (1 - tier.discount_percent / 100);

                    const selected =
                      selectedQuantity === tier.quantity;

                    return (
                      <button
                        key={tier.id}
                        type="button"
                        disabled={tierUnavailable}
                        onClick={() => selectQuantity(tier.quantity)}
                        className={`relative flex min-h-[92px] flex-col items-center justify-center rounded-[18px] border px-2 py-3 transition-all ${
                          selected
                            ? "border-blue-300 bg-blue-400/10"
                            : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]"
                        } disabled:cursor-not-allowed disabled:opacity-30`}
                      >

                        {selected && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-300 text-[#081526]">
                            <Check size={11} strokeWidth={3} />
                          </span>
                        )}

                        <p className="text-sm font-black text-white">
                          {tier.quantity} Vials
                        </p>

                        <p className="mt-1 text-xs text-white/45">
                          ${formatMoney(tierTotal)}
                        </p>

                        {isFlashSaleActive ? (
                          <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-[#A5D8FF]">
                            Flash Sale
                          </p>
                        ) : (
                          <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-green-300">
                            Save {tier.discount_percent}%
                          </p>
                        )}

                      </button>
                    );
                  })}

                </div>

              </div>

              {/* FREE GIFT */}

              <div className="mb-5 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3">
                <p className="text-center text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Complimentary gift with any 8 vials
                </p>
              </div>

              {/* CART ACTIONS */}

              <div className="grid grid-cols-2 gap-3">

                {isOutOfStock ? (
                  <button
                    disabled
                    className="col-span-2 cursor-not-allowed rounded-full bg-white/[0.06] py-4 text-xs font-semibold uppercase tracking-widest text-white/30"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={addToCart}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-full bg-white py-4 text-xs font-bold uppercase tracking-widest text-[#081526] transition-all hover:bg-blue-100"
                  >

                    <ShoppingCart size={18} />

                    {added
                      ? "Added To Cart"
                      : `Add ${selectedQuantity} ${
                          selectedQuantity === 1 ? "Vial" : "Vials"
                        } To Cart`}

                  </button>
                )}

                <a
                  href="/cart"
                  className="rounded-full border border-white/10 bg-white/[0.04] py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest hover:bg-white/[0.07]"
                >
                  View Cart
                </a>

                <a
                  href="/products"
                  className="rounded-full border border-white/10 bg-white/[0.04] py-3.5 text-center text-[11px] font-semibold uppercase tracking-widest hover:bg-white/[0.07]"
                >
                  Keep Shopping
                </a>

              </div>

              <a
                href={latestCoa.path}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center text-xs uppercase tracking-widest text-[#A5D8FF] transition-all hover:text-white"
              >
                View Certificate of Analysis →
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          CERTIFICATES OF ANALYSIS
      ================================================= */}

      <section className="px-6 pb-12 md:px-10">

        <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-white/[0.04] p-6 md:p-8">

          {/* LATEST AXIOM ANALYTICS COA */}

          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">

            <div>

              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#A5D8FF]">
                {latestCoa.laboratory}
              </p>

              <h2 className="mb-2 text-2xl font-black text-white">
                Latest Certificate of Analysis
              </h2>

              <p className="mb-5 text-sm text-white/45">
                Issued {latestCoa.date} · Report {latestCoa.report}
              </p>

              <div className="flex flex-wrap gap-2">

                <span className={greenBadge}>
                  <Check size={14} className="mr-1 inline" />
                  Identity Confirmed
                </span>

                <span className={blueBadge}>
                  {latestCoa.purity} Overall Purity
                </span>

                <span className={blueBadge}>
                  {latestCoa.totalContent} Total Content
                </span>

                <span className={blueBadge}>
                  BPC-157: {latestCoa.bpcContent}
                </span>

                <span className={blueBadge}>
                  TB-500: {latestCoa.tbContent}
                </span>

                <span className={neutralBadge}>
                  Batch: {latestCoa.batch}
                </span>

                <span className={greenBadge}>
                  Rapid PCR: Target DNA Not Detected
                </span>

                <span className={greenBadge}>
                  Fentanyl: None Detected
                </span>

              </div>

              {/* INDIVIDUAL PEPTIDE RESULTS */}

              <div className="mt-5 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                  <p className="mb-1 text-xs uppercase tracking-widest text-white/45">
                    BPC-157
                  </p>

                  <p className="text-xl font-black text-white">
                    {latestCoa.bpcPurity}
                  </p>

                  <p className="mt-1 text-sm text-[#A5D8FF]">
                    {latestCoa.bpcContent} content
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                  <p className="mb-1 text-xs uppercase tracking-widest text-white/45">
                    TB-500
                  </p>

                  <p className="text-xl font-black text-white">
                    {latestCoa.tbPurity}
                  </p>

                  <p className="mt-1 text-sm text-[#A5D8FF]">
                    {latestCoa.tbContent} content
                  </p>

                </div>

              </div>

            </div>

            {/* LATEST COA ACTIONS */}

            <div className="md:text-right">

              <p className="text-4xl font-black text-[#A5D8FF]">
                {latestCoa.purity}
              </p>

              <p className="mb-4 text-xs uppercase tracking-widest text-white/40">
                Overall Purity
              </p>

              <CoaActions path={latestCoa.path} />

            </div>

          </div>

          {/* =================================================
              PREVIOUS COAS DROPDOWN
          ================================================= */}

          <div className="mt-7 border-t border-white/10 pt-5">

            <button
              type="button"
              onClick={() =>
                setShowPreviousCoa((previous) => !previous)
              }
              aria-expanded={showPreviousCoa}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-white/80 transition-all hover:border-blue-400/50 hover:bg-white/[0.07]"
            >

              {showPreviousCoa
                ? "Hide Previous COAs"
                : "View Previous COAs"}

              <ChevronDown
                size={17}
                className={`transition-transform duration-200 ${
                  showPreviousCoa ? "rotate-180" : ""
                }`}
              />

            </button>

            {showPreviousCoa && (
              <div className="mt-5 space-y-4">

                {previousCoas.map((coa, index) => (
                  <div
                    key={coa.path}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 md:p-6"
                  >

                    <div className="grid items-center gap-5 md:grid-cols-[1fr_auto]">

                      <div>

                        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#A5D8FF]">
                          {coa.laboratory}
                        </p>

                        <h3 className="mb-2 text-xl font-black text-white">
                          Previous Certificate of Analysis #{index + 1}
                        </h3>

                        <p className="mb-4 text-sm text-white/45">
                          {coa.date}
                        </p>

                        <div className="flex flex-wrap gap-2">

                          <span className={greenBadge}>
                            <Check
                              size={14}
                              className="mr-1 inline"
                            />
                            Identity Confirmed
                          </span>

                          <span className={blueBadge}>
                            {coa.purity} Purity
                          </span>

                          <span className={blueBadge}>
                            {coa.totalContent} Total Content
                          </span>

                          {coa.bpcContent && (
                            <span className={blueBadge}>
                              BPC-157: {coa.bpcContent}
                            </span>
                          )}

                          {coa.tbContent && (
                            <span className={blueBadge}>
                              TB-500: {coa.tbContent}
                            </span>
                          )}

                          <span className={neutralBadge}>
                            Lot: {coa.batch}
                          </span>

                        </div>

                      </div>

                      {/* PREVIOUS COA ACTIONS */}

                      <div className="md:text-right">

                        <p className="text-3xl font-black text-[#A5D8FF]">
                          {coa.purity}
                        </p>

                        <p className="mb-4 text-xs uppercase tracking-widest text-white/40">
                          Purity
                        </p>

                        <CoaActions path={coa.path} />

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          QUALITY FEATURES
      ================================================= */}

      <section className="px-6 pb-10 md:px-10">

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-7 md:grid-cols-4">

          {[
            {
              Icon: FlaskConical,
              title: "Research Use Only",
              description: "Strictly for laboratory research.",
            },
            {
              Icon: ShieldCheck,
              title: "Third-Party Tested",
              description:
                "Independent analytical testing is available for this research batch.",
            },
            {
              Icon: ClipboardCheck,
              title: "Batch Documented",
              description:
                "Batch-specific analytical documentation is available.",
            },
            {
              Icon: ShieldCheck,
              title: `${latestCoa.purity} Purity`,
              description:
                "Current Axiom Analytics documentation reports 99.85% overall purity.",
            },
          ].map(({ Icon, title, description }) => (
            <div key={title} className="flex gap-4">

              <Icon
                className="shrink-0 text-[#A5D8FF]"
                size={28}
              />

              <div>

                <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                  {title}
                </h3>

                <p className="mt-1 text-sm text-white/50">
                  {description}
                </p>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* =================================================
          RESEARCH PROFILE
      ================================================= */}

      <section className="px-6 pb-14 md:px-10">

        <div className="mx-auto max-w-7xl rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#A5D8FF]">
            Research Profile
          </p>

          <h2 className="mb-4 text-3xl font-black text-white">
            Tissue Repair Blend Overview
          </h2>

          <p className="mb-7 max-w-4xl leading-relaxed text-white/65">
            Wolverine is a research blend studied in laboratory
            models involving tissue repair signaling, cellular
            migration, repair-associated pathways, and cellular
            response mechanisms.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            {[
              {
                title: "Tissue Repair Research",
                text: "Studied in models involving cellular repair and tissue response pathways.",
              },
              {
                title: "Cellular Migration",
                text: "Evaluated in laboratory models involving cellular movement and response signaling.",
              },
              {
                title: "Repair Pathways",
                text: "Researched in relation to recovery-associated pathway signaling and cellular behavior.",
              },
              {
                title: "Storage",
                text: "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >

                <h3 className="mb-2 font-bold text-white">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-white/55">
                  {item.text}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =================================================
          RELATED PRODUCTS
      ================================================= */}

      <section className="px-6 pb-14 md:px-10">

        <div className="mx-auto max-w-7xl">

          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#A5D8FF]">
            Frequently Researched Together
          </p>

          <h2 className="mb-6 text-3xl font-black text-white">
            Pair With Related Research Compounds
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {[
              {
                name: "BPC-157",
                image: "/images/bpc157blue.png",
                path: "/products/bpc157",
                text: "Research involving tissue repair pathways and cellular response mechanisms.",
              },
              {
                name: "TB-500",
                image: "/images/tb500blue.png",
                path: "/products/tb500",
                text: "Research focused on recovery pathways and cellular migration models.",
              },
              {
                name: "ARA-290",
                image: "/images/ara290blue.png",
                path: "/products/ara290",
                text: "Research involving tissue protection pathways and cellular response signaling.",
              },
            ].map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="group rounded-[26px] border border-white/10 bg-white/[0.04] p-4 transition-all hover:border-blue-400/40"
              >

                <div className="mb-4 h-[200px] overflow-hidden rounded-[22px] bg-[#93C5FD]">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                  />

                </div>

                <h3 className="mb-2 text-xl font-black text-white">
                  {item.name}
                </h3>

                <p className="text-sm leading-relaxed text-white/55">
                  {item.text}
                </p>

                <span className="mt-3 inline-block text-sm font-semibold text-[#A5D8FF]">
                  View Product →
                </span>

              </a>
            ))}

          </div>

        </div>

      </section>

      {/* =================================================
          DISCLAIMERS
      ================================================= */}

      {[
        {
          title: "FDA Disclaimer",
          text: "These statements have not been evaluated by the U.S. Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only and are not for human or veterinary consumption.",
        },
        {
          title: "Customer Acknowledgment",
          text: "By purchasing this product, the customer acknowledges that this material is intended solely for lawful laboratory research purposes and will not be used for human consumption, veterinary use, medical use, diagnosis, treatment, cure, or prevention of disease. Apexx Biolabs does not provide dosing instructions, treatment recommendations, medical advice, or guidance regarding human use of any product.",
        },
      ].map((section) => (
        <section
          key={section.title}
          className="px-6 pb-10 md:px-10"
        >

          <div className="mx-auto max-w-7xl rounded-[26px] border border-white/10 bg-white/[0.04] p-6">

            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#A5D8FF]">
              {section.title}
            </h3>

            <p className="text-sm leading-relaxed text-white/55">
              {section.text}
            </p>

          </div>

        </section>
      ))}

    </main>
  );
}
