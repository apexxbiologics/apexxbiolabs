
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

type SS31Size = "10mg" | "50mg";

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
  name?: string;
  slug?: string;
  size?: string;
  price?: string | number;
  inventory?: string | number;
};

const productOptions = [
  {
    size: "10mg" as SS31Size,
    price: 45,
    id: "ss31-10mg",
    image: "/images/ss3110blue.png",
  },
  {
    size: "50mg" as SS31Size,
    price: 100,
    id: "ss31-50mg",
    image: "/images/ss3150blue.png",
  },
];

const latestCoaPath =
  "/images/coas/ss31-10mg-ss102609-wht-09-04-2026.pdf";

const formatMoney = (amount: number) =>
  Number(amount).toFixed(2);

function findSS31Product(
  products: DatabaseProduct[],
  size: SS31Size
) {
  return products.find((item) => {
    const slug = String(item.slug || "").toLowerCase().trim();
    const id = String(item.id || "").toLowerCase().trim();
    const name = String(item.name || "").toLowerCase().trim();
    const dbSize = String(item.size || "").toLowerCase().trim();

    if (size === "50mg") {
      return (
        slug === "ss31-50mg" ||
        slug === "ss-31-50mg" ||
        id === "ss31-50mg" ||
        id === "ss-31-50mg" ||
        ((name.includes("ss-31") || name.includes("ss31")) &&
          (dbSize === "50mg" || name.includes("50mg")))
      );
    }

    return (
      slug === "ss31" ||
      slug === "ss-31" ||
      slug === "ss31-10mg" ||
      slug === "ss-31-10mg" ||
      id === "ss31" ||
      id === "ss-31" ||
      id === "ss31-10mg" ||
      id === "ss-31-10mg" ||
      ((name.includes("ss-31") || name.includes("ss31")) &&
        (dbSize === "10mg" || name.includes("10mg")))
    );
  });
}

export default function SS31Page() {
  const [selectedSize, setSelectedSize] =
    useState<SS31Size>("10mg");

  const [added, setAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [inventory, setInventory] = useState<number | null>(null);
  const [price, setPrice] = useState(45);
  const [productLoaded, setProductLoaded] = useState(false);

  const [databaseProductId, setDatabaseProductId] =
    useState<string | null>(null);

  const [flashSale, setFlashSale] =
    useState<FlashSale | null>(null);

  const [quantityDiscounts, setQuantityDiscounts] =
    useState<QuantityDiscountTier[]>([]);

  const selectedOption =
    productOptions.find((item) => item.size === selectedSize) ||
    productOptions[0];

  const product = {
    id: selectedOption.id,
    name: `SS-31 ${selectedSize}`,
    image: selectedOption.image,
    path: "/products/ss31",
  };

  const isOutOfStock =
    productLoaded && (inventory === null || inventory <= 0);

  const isLimitedStock =
    inventory !== null && inventory > 0 && inventory <= 5;

  const flashSalePrice =
    flashSale !== null ? Number(flashSale.sale_price) : null;

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

  /* =========================================================
     FETCH PRODUCT INVENTORY AND FLASH SALES
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchProductData = async () => {
      try {
        const [productResponse, saleResponse] =
          await Promise.all([
            fetch("/api/products", { cache: "no-store" }),
            fetch("/api/flash-sales", { cache: "no-store" }),
          ]);

        const productData = await productResponse.json();

        const saleData = await saleResponse.json().catch(() => ({
          success: false,
          sales: [],
        }));

        if (cancelled) return;

        const products: DatabaseProduct[] =
          productData.success &&
          Array.isArray(productData.products)
            ? productData.products
            : [];

        const ss31 = findSS31Product(products, selectedSize);

        if (ss31) {
          const dbId = String(ss31.id);

          const regularPrice = Number(
            ss31.price ?? selectedOption.price
          );

          setDatabaseProductId(dbId);
          setInventory(Number(ss31.inventory ?? 0));
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
          setInventory(0);
          setPrice(selectedOption.price);
          setFlashSale(null);
        }

        setProductLoaded(true);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch SS-31 data:", error);

        setDatabaseProductId(null);
        setInventory(0);
        setPrice(selectedOption.price);
        setFlashSale(null);
        setProductLoaded(true);
      }
    };

    fetchProductData();

    const refresh = window.setInterval(
      fetchProductData,
      30_000
    );

    return () => {
      cancelled = true;
      window.clearInterval(refresh);
    };
  }, [selectedSize, selectedOption.price]);

  /* =========================================================
     FETCH QUANTITY DISCOUNTS
  ========================================================= */

  useEffect(() => {
    const fetchQuantityDiscounts = async () => {
      try {
        const response = await fetch(
          "/api/quantity-discounts",
          { cache: "no-store" }
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
            sort_order: Number(tier.sort_order || 0),
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
  }, []);

  /* =========================================================
     QUANTITY PRICING
  ========================================================= */

  const getDiscountTier = (quantity: number) => {
    return (
      [...quantityDiscounts]
        .filter((tier) => quantity >= tier.quantity)
        .sort((a, b) => b.quantity - a.quantity)[0] ||
      null
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

  const selectSize = (size: SS31Size) => {
    if (size === selectedSize) return;

    setSelectedSize(size);
    setSelectedQuantity(1);
    setAdded(false);
    setInventory(null);
    setDatabaseProductId(null);
    setFlashSale(null);
    setPrice(size === "50mg" ? 100 : 45);
    setProductLoaded(false);
  };

  const selectQuantity = (quantity: number) => {
    if (
      !productLoaded ||
      (inventory !== null && quantity > inventory)
    ) {
      return;
    }

    setSelectedQuantity(quantity);
    setAdded(false);
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const addToCart = () => {
    if (
      !productLoaded ||
      !databaseProductId ||
      isOutOfStock
    ) {
      return;
    }

    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

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
      quantityDiscountPercent: newDiscountPercent,
      quantityDiscountTierId: newTier?.id || null,
      quantityDiscountTierQuantity:
        newTier?.quantity || null,
      flashSaleApplied: isFlashSaleActive,
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

    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">
      {/* PRODUCT HERO */}
      <section className="relative px-5 md:px-10 py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">
            {/* PRODUCT IMAGE */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[520px] aspect-square rounded-[42px] overflow-hidden border border-blue-400/10 bg-white/[0.03] shadow-[0_0_30px_rgba(96,165,250,0.15)]">
                <FavoriteButton product={favoriteProduct} />

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
                SS-31 research peptide produced for laboratory
                investigation of mitochondrial biology, cellular
                energy regulation, oxidative stress pathways,
                and mitochondrial membrane-associated signaling.
              </p>

              {/* SIZE SELECTOR — APX-3 STYLE */}
              <div className="mb-5">
                <p className="uppercase tracking-[0.18em] text-white/40 text-xs mb-3">
                  Select Size
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {productOptions.map((option) => {
                    const selected =
                      selectedSize === option.size;

                    return (
                      <button
                        key={option.size}
                        type="button"
                        onClick={() =>
                          selectSize(option.size)
                        }
                        aria-pressed={selected}
                        className={`relative min-h-[84px] rounded-[17px] border px-3 py-3 transition-all flex flex-col items-center justify-center ${
                          selected
                            ? "border-blue-300 bg-blue-400/10"
                            : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]"
                        }`}
                      >
                        {selected && (
                          <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-300 text-[#081526]">
                            <Check
                              size={12}
                              strokeWidth={3}
                            />
                          </span>
                        )}

                        <p
                          className={`text-base font-black ${
                            selected
                              ? "text-white"
                              : "text-white/60"
                          }`}
                        >
                          {option.size}
                        </p>

                        <p
                          className={`text-sm mt-1 ${
                            selected
                              ? "text-white/45"
                              : "text-white/35"
                          }`}
                        >
                          ${formatMoney(option.price)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PRODUCT STATUS */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-widest">
                  {selectedSize}
                </span>

                {isFlashSaleActive && (
                  <span className="rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#A5D8FF]">
                    Flash Sale · $
                    {formatMoney(effectiveUnitPrice)} / vial
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
                  {/* ONE VIAL */}
                  <button
                    type="button"
                    disabled={!productLoaded || isOutOfStock}
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
                      !productLoaded ||
                      inventory === null ||
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

              {/* ACTION BUTTONS */}
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

              {/* COA LINK */}
              {selectedSize === "10mg" ? (
                <a
                  href={latestCoaPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-4 text-xs uppercase tracking-widest text-[#A5D8FF] hover:text-white transition-all"
                >
                  View Certificate of Analysis →
                </a>
              ) : (
                <p className="text-center mt-4 text-xs uppercase tracking-widest text-white/40">
                  Certificate of Analysis not yet available
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COA SUMMARY
      ===================================================== */}

      {selectedSize === "10mg" ? (
        <section className="px-6 md:px-10 pb-12">
          <div className="max-w-7xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
              <div>
                <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
                  Freedom Diagnostics
                </p>

                <h3 className="text-2xl font-black text-white mb-4">
                  Latest Certificate of Analysis
                </h3>

                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                    ✓ Identity Confirmed
                  </span>

                  <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#A5D8FF] text-sm font-semibold">
                    99.39% Purity
                  </span>

                  <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#A5D8FF] text-sm font-semibold">
                    13.57mg Net Content
                  </span>

                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
                    Lot: SS102609-WHT
                  </span>

                  <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    No Fentanyl Detected
                  </span>

                  <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    Endotoxin: Pass
                  </span>
                </div>
              </div>

              <div className="md:text-right">
                <p className="text-4xl font-black text-[#A5D8FF]">
                  99.39%
                </p>

                <p className="uppercase tracking-widest text-white/40 text-xs">
                  Purity
                </p>

                <a
                  href={latestCoaPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-3 rounded-full border border-blue-400/20 bg-blue-400/10 px-5 py-2.5 text-blue-300 text-sm font-semibold hover:bg-blue-400/20 transition-all"
                >
                  View Full COA
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-6 md:px-10 pb-12">
          <div className="max-w-7xl mx-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-2">
              Quality Documentation
            </p>

            <h3 className="text-2xl font-black text-white mb-3">
              SS-31 50mg Certificate of Analysis
            </h3>

            <p className="text-white/55 leading-relaxed">
              Certificate of Analysis not yet available
              for the 50mg variant.
            </p>
          </div>
        </section>
      )}

      {/* =====================================================
          QUALITY
      ===================================================== */}

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
              "Independent laboratory testing documentation available for verified lots.",
            ],
            [
              ClipboardCheck,
              "Batch Documented",
              "Batch-specific analytical documentation is provided when available.",
            ],
            [
              ShieldCheck,
              "Research Material",
              "Produced for laboratory research applications only.",
            ],
          ].map(([Icon, title, description]: any) => (
            <div key={title} className="flex gap-4">
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
          ))}
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
            Mitochondrial Research Overview
          </h2>

          <p className="text-white/65 leading-relaxed max-w-4xl mb-7">
            SS-31 is studied in laboratory research models
            involving mitochondrial biology, cellular
            energetics, oxidative stress signaling, and
            mitochondrial membrane-associated processes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              [
                "Mitochondrial Function",
                "Studied in laboratory models involving mitochondrial activity and cellular energetics.",
              ],
              [
                "Membrane Research",
                "Evaluated in research involving mitochondrial membrane-associated processes.",
              ],
              [
                "Oxidative Stress",
                "Investigated in cellular models involving oxidative stress and redox signaling.",
              ],
              [
                "Storage",
                "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use.",
              ],
            ].map(([title, description]) => (
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
            ))}
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
                name: "MOTS-C",
                image: "/images/motscblue.png",
                path: "/products/motsc",
                text: "Studied in laboratory models involving mitochondrial signaling and metabolic research.",
              },
              {
                name: "NAD+",
                image: "/images/nadblue.png",
                path: "/products/nad",
                text: "Research involving cellular energy, redox pathways, and metabolic signaling.",
              },
              {
                name: "ARA-290",
                image: "/images/ara290blue.png",
                path: "/products/ara290",
                text: "Research involving cellular protection pathways and tissue-response signaling models.",
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

      {/* =====================================================
          DISCLAIMERS
      ===================================================== */}

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
