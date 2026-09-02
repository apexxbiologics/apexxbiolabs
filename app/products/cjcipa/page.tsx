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

export default function CJCIPAPage() {
  const [added, setAdded] = useState(false);

  const [selectedQuantity, setSelectedQuantity] =
    useState(1);

  const [inventory, setInventory] =
    useState<number | null>(null);

  const [price, setPrice] = useState(55);

  const [databaseProductId, setDatabaseProductId] =
    useState<string | null>(null);

  const [flashSale, setFlashSale] =
    useState<FlashSale | null>(null);

  const [quantityDiscounts, setQuantityDiscounts] =
    useState<QuantityDiscountTier[]>([]);

  const product = {
    id: "cjcipa",
    name: "CJC/IPA",
    image: "/images/cjcipablue.png",
    path: "/products/cjcipa",
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

        const cjcipa =
          productData.products.find(
            (item: any) =>
              item.slug === "cjcipa" ||
              item.slug === "cjc-ipa" ||
              item.slug === "cjcipa-10mg" ||
              item.slug === "cjc-ipa-10mg" ||
              item.id === "cjcipa" ||
              item.id === "cjc-ipa" ||
              item.id === "cjcipa-10mg" ||
              item.id === "CJC-IPA-10mg" ||
              item.name
                ?.toLowerCase()
                .includes("cjc") ||
              item.name
                ?.toLowerCase()
                .includes("ipa")
          );

        if (cjcipa) {
          const dbId =
            String(cjcipa.id);

          const regularPrice =
            Number(
              cjcipa.price ?? 55
            );

          setDatabaseProductId(dbId);

          setInventory(
            Number(
              cjcipa.inventory ?? 0
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
          "Failed to fetch CJC/IPA data:",
          error
        );

        setDatabaseProductId(null);
        setInventory(null);
        setPrice(55);
        setFlashSale(null);
      }
    };

    const fetchQuantityDiscounts =
      async () => {
        try {
          const response =
            await fetch(
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
    isFlashSaleActive
      ? 0
      : selectedTier?.discount_percent ||
        0;

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

  const formatMoney = (
    amount: number
  ) =>
    Number(amount).toFixed(2);

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
      isFlashSaleActive
        ? null
        : getDiscountTier(
            newQuantity
          );

    const newDiscountPercent =
      isFlashSaleActive
        ? 0
        : newTier?.discount_percent ||
          0;

    const newDiscountedUnitPrice =
      effectiveUnitPrice *
      (1 -
        newDiscountPercent /
          100);

    const cartProduct = {
      id: product.id,

      name: product.name,

      price:
        newDiscountedUnitPrice,

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

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 md:p-8">
              <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs mb-3">
                Research Peptide
                Blend
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
                    selectedDiscountPercent >
                      0) && (
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
                High-purity CJC/IPA
                research peptide
                blend studied in
                laboratory models
                involving growth
                hormone secretagogue
                pathways, peptide
                signaling,
                pituitary-response
                models, and metabolic
                research
                applications.
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

                  {selectedQuantity >
                    1 && (
                    <p className="text-[#A5D8FF] text-xs font-semibold">
                      $
                      {formatMoney(
                        discountedUnitPrice
                      )}{" "}
                      / vial
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                    className={`relative min-h-[92px] rounded-[18px] border px-2 py-3 transition-all flex flex-col items-center justify-center ${
                      selectedQuantity ===
                      1
                        ? "border-blue-300 bg-blue-400/10"
                        : "border-white/10 bg-white/[0.025] hover:bg-white/[0.05]"
                    } disabled:opacity-35 disabled:cursor-not-allowed`}
                  >
                    {selectedQuantity ===
                      1 && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-300 text-[#081526] flex items-center justify-center">
                        <Check
                          size={11}
                          strokeWidth={
                            3
                          }
                        />
                      </span>
                    )}

                    <p className="font-black text-white text-sm">
                      1 Vial
                    </p>

                    <p className="text-xs text-white/45 mt-1">
                      $
                      {formatMoney(
                        effectiveUnitPrice
                      )}
                    </p>

                    {isFlashSaleActive && (
                      <p className="text-[10px] text-white/25 line-through mt-0.5">
                        $
                        {formatMoney(
                          price
                        )}
                      </p>
                    )}
                  </button>

                  {quantityDiscounts.map(
                    (tier) => {
                      const tierUnavailable =
                        inventory !==
                          null &&
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
                          key={
                            tier.id
                          }
                          type="button"
                          disabled={
                            tierUnavailable
                          }
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
                                size={
                                  11
                                }
                                strokeWidth={
                                  3
                                }
                              />
                            </span>
                          )}

                          <p className="font-black text-white text-sm">
                            {
                              tier.quantity
                            }{" "}
                            Vials
                          </p>

                          <p className="text-xs text-white/45 mt-1">
                            $
                            {formatMoney(
                              tierTotal
                            )}
                          </p>

                          {isFlashSaleActive ? (
                            <p className="text-[9px] uppercase tracking-[0.14em] text-[#A5D8FF] mt-1">
                              Flash Sale
                            </p>
                          ) : (
                            <p className="text-[9px] uppercase tracking-[0.14em] text-green-300 mt-1">
                              Save{" "}
                              {
                                tier.discount_percent
                              }
                              %
                            </p>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* KEEP THE REST OF YOUR EXISTING CJC/IPA JSX HERE */}