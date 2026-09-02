"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Check,
  PackageOpen,
  ShoppingCart,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  inventory: number;
  image?: string;
  category?: string;
  size?: string;
  active?: boolean;
};

type BundleItem = Product & {
  quantity: number;
};

const bundleTiers = [
  { quantity: 3, discount: 5 },
  { quantity: 5, discount: 10 },
  { quantity: 10, discount: 15 },
  { quantity: 20, discount: 20 },
];

const eligibleBundleKeywords = [
  "apx-3",
  "apx3",
  "apx-2",
  "apx2",
  "bpc-157",
  "bpc157",
  "tb-500",
  "tb500",
  "ghk-cu",
  "ghkcu",
  "cjc",
  "ipamorelin",
  "cjcipa",
  "cjc-ipa",
  "mots-c",
  "motsc",
  "pe-22-28",
  "pe2228",
  "pinealon",
  "selank",
  "semax",
  "adamax",
  "ara-290",
  "ara290",
  "nad+",
  "nad",
  "aod-9604",
  "aod9604",
  "pt-141",
  "pt141",
  "5-amino-1mq",
  "5amino1mq",
  "kisspeptin",
  "kisspeptin-10",
  "kisspeptin10",
  "tesamorelin",
  "glutathione",
  "wolverine",
  "klow",
  "ss-31",
  "ss31",
  "mito-x",
  "mitox",
  "neuro-x",
  "neurox",
  "kpv",
];

const PRODUCTS_PER_PAGE = 8;

const bundleProductImages: Record<string, string> = {
  "apx3": "/images/apx310blue.png",
  "apx310": "/images/apx310blue.png",
  "apx310mg": "/images/apx310blue.png",
  "apx320": "/images/apx320blue.png",
  "apx320mg": "/images/apx320blue.png",

  "apx2": "/images/apx230blue.png",
  "apx230": "/images/apx230blue.png",
  "apx230mg": "/images/apx230blue.png",

  "wolverine": "/images/wolverineblue.png",
  "bpc157": "/images/bpc157blue.png",
  "tb500": "/images/tb500blue.png",
  "klow": "/images/klowblue.png",

  "glutathione": "/images/glutathione1500blue.png",
  "glutathione1500": "/images/glutathione1500blue.png",
  "glutathione1500mg": "/images/glutathione1500blue.png",

  "kpv": "/images/kpvblue.png",
  "ghkcu": "/images/ghkcublue.png",

  "tesamorelin": "/images/tesa5blue.png",
  "tesamorelin5": "/images/tesa5blue.png",
  "tesamorelin5mg": "/images/tesa5blue.png",

  "cjcipa": "/images/cjcipablue.png",
  "cjcipawithoutdac": "/images/cjcipablue.png",

  "mitox": "/images/mitox120blue.png",
  "mitox120": "/images/mitox120blue.png",
  "mitox120mg": "/images/mitox120blue.png",

  "nad": "/images/nadblue.png",
  "nad1000": "/images/nadblue.png",
  "nad1000mg": "/images/nadblue.png",

  "motsc": "/images/motscblue.png",

  "5amino1mq": "/images/5amino1mqblue.png",
  "5amino1mq50": "/images/5amino1mqblue.png",
  "5amino1mq50mg": "/images/5amino1mqblue.png",

  "ss31": "/images/ss3110blue.png",
  "ss3110": "/images/ss3110blue.png",
  "ss3110mg": "/images/ss3110blue.png",

  "ara290": "/images/ara290blue.png",
  "aod9604": "/images/aod9604blue.png",
  "adamax": "/images/adamaxblue.PNG",

  "neurox": "/images/neurox48blue.png",
  "neurox48": "/images/neurox48blue.png",
  "neurox48mg": "/images/neurox48blue.png",

  "semax": "/images/semaxblue.PNG",
  "selank": "/images/selankblue.PNG",
  "pinealon": "/images/pinealonblue.png",
  "pe2228": "/images/pe2228blue.png",
  "kisspeptin10": "/images/kisspeptin10blue.png",
  "pt141": "/images/pt141blue.png",
};

const normalizeProductKey = (value?: string) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const getBundleProductImage = (product: {
  id?: string;
  name?: string;
  slug?: string;
  image?: string;
}) => {
  const candidates = [
    normalizeProductKey(product.slug),
    normalizeProductKey(product.id),
    normalizeProductKey(product.name),
  ];

  for (const candidate of candidates) {
    if (bundleProductImages[candidate]) {
      return bundleProductImages[candidate];
    }
  }

  // Some Supabase IDs/names include vial size or punctuation.
  // Use the exact blue image files from /public/images.
  const aliasGroups = [
    { matches: ["apx310mg", "apx310", "apx3"], image: "/images/apx310blue.png" },
    { matches: ["apx320mg", "apx320"], image: "/images/apx320.png" },
    { matches: ["apx230mg", "apx230", "apx2"], image: "/images/apx230blue.png" },
    { matches: ["glutathione1500mg", "glutathione1500", "glutathione"], image: "/images/glutathione1500blue.png" },
    { matches: ["mitox120mg", "mitox120", "mitox"], image: "/images/mitox120blue.png" },
    { matches: ["neurox48mg", "neurox48", "neurox"], image: "/images/neurox48blue.png" },
    { matches: ["ss3110mg", "ss3110", "ss31"], image: "/images/ss3110blue.png" },
    { matches: ["5amino1mq50mg", "5amino1mq50", "5amino1mq"], image: "/images/5amino1mqblue.png" },
    { matches: ["aod9604"], image: "/images/aod9604blue.png" },
    { matches: ["ara290"], image: "/images/ara290blue.png" },
    { matches: ["adamax"], image: "/images/adamaxblue.PNG" },
    { matches: ["bpc157"], image: "/images/bpc157blue.png" },
    { matches: ["cjcipa", "cjcipawithoutdac"], image: "/images/cjcipablue.png" },
    { matches: ["ghkcu"], image: "/images/ghkcublue.png" },
    { matches: ["kisspeptin10", "kisspeptin"], image: "/images/kisspeptin10blue.png" },
    { matches: ["klow"], image: "/images/klowblue.png" },
    { matches: ["kpv"], image: "/images/kpvblue.png" },
    { matches: ["motsc"], image: "/images/motscblue.png" },
    { matches: ["nad1000mg", "nad1000", "nad"], image: "/images/nadblue.png" },
    { matches: ["pe2228"], image: "/images/pe2228blue.png" },
    { matches: ["pinealon"], image: "/images/pinealonblue.png" },
    { matches: ["pt141"], image: "/images/pt141blue.png" },
    { matches: ["semax"], image: "/images/semaxblue.png" },
    { matches: ["selank"], image: "/images/selankblue.png" },
    { matches: ["tb500"], image: "/images/tb500blue.png" },
    { matches: ["tesamorelin5mg", "tesamorelin5", "tesamorelin"], image: "/images/tesa5blue.png" },
    { matches: ["wolverine"], image: "/images/wolverineblue.png" },
  ];

  for (const alias of aliasGroups) {
    if (
      candidates.some((candidate) =>
        alias.matches.some(
          (match) =>
            candidate === match ||
            candidate.startsWith(match) ||
            candidate.includes(match)
        )
      )
    ) {
      return alias.image;
    }
  }

  return product.image || "";
};

export default function BuildABundlePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundle, setBundle] = useState<BundleItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!data.success) {
          console.error("Failed to load products:", data);
          return;
        }

        const normalizedProducts = (data.products || [])
          .map((product: any) => ({
            id: String(product.id || ""),
            name: String(product.name || ""),
            slug: product.slug ? String(product.slug) : undefined,
            price: Number(product.price || 0),
            inventory: Number(product.inventory || 0),

            image: product.image
              ? String(product.image)
              : product.image_url
              ? String(product.image_url)
              : "",

            category: product.category
              ? String(product.category)
              : "",

            size: product.size
              ? String(product.size)
              : "",

            active:
              product.active === undefined
                ? true
                : Boolean(product.active),
          }))
          .filter((product: Product) => {
            const id = product.id.toLowerCase().trim();
            const name = product.name.toLowerCase().trim();
            const slug = product.slug?.toLowerCase().trim() || "";
            const category = product.category?.toLowerCase() || "";

            const isPhysicalProduct =
              name.includes("shirt") ||
              name.includes("t-shirt") ||
              name.includes("tee") ||
              name.includes("vial case") ||
              name.includes("storage case") ||
              category.includes("accessor") ||
              category.includes("apparel") ||
              category.includes("shirt");

            if (isPhysicalProduct) {
              return false;
            }

            const eligible = eligibleBundleKeywords.some(
              (keyword) =>
                id.includes(keyword) ||
                name.includes(keyword) ||
                slug.includes(keyword)
            );

            return (
              product.active !== false &&
              product.price > 0 &&
              eligible
            );
          })
          .sort((a: Product, b: Product) =>
            a.name.localeCompare(b.name)
          )
          .map((product: Product) => ({
            ...product,
            image: getBundleProductImage(product),
          }));

        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Failed to fetch bundle products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [search]);

  const totalVials = useMemo(() => {
    return bundle.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [bundle]);

  const subtotal = useMemo(() => {
    return bundle.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [bundle]);

  const currentTier = useMemo(() => {
    return (
      [...bundleTiers]
        .filter((tier) => totalVials >= tier.quantity)
        .sort((a, b) => b.quantity - a.quantity)[0] || null
    );
  }, [totalVials]);

  const currentDiscount = currentTier?.discount || 0;

  const savings = subtotal * (currentDiscount / 100);

  const bundleTotal = subtotal - savings;

  const nextTier = useMemo(() => {
    return (
      bundleTiers.find(
        (tier) => totalVials < tier.quantity
      ) || null
    );
  }, [totalVials]);

  const vialsUntilNextTier = nextTier
    ? Math.max(0, nextTier.quantity - totalVials)
    : 0;

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.size?.toLowerCase().includes(query) ||
        product.slug?.toLowerCase().includes(query)
    );
  }, [products, search]);

  const visibleProducts = filteredProducts.slice(
    0,
    visibleCount
  );

  const hasMoreProducts =
    visibleCount < filteredProducts.length;

  const getBundleQuantity = (productId: string) => {
    return (
      bundle.find((item) => item.id === productId)?.quantity || 0
    );
  };

  const addProduct = (product: Product) => {
    if (product.inventory <= 0) return;

    const currentQuantity = getBundleQuantity(product.id);

    if (currentQuantity >= product.inventory) return;

    setBundle((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setAddedToCart(false);
  };

  const removeProduct = (productId: string) => {
    setBundle((current) =>
      current
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    setAddedToCart(false);
  };

  const removeAllProduct = (productId: string) => {
    setBundle((current) =>
      current.filter((item) => item.id !== productId)
    );

    setAddedToCart(false);
  };

  const clearBundle = () => {
    setBundle([]);
    setAddedToCart(false);
  };

  const formatMoney = (amount: number) =>
    Number(amount).toFixed(2);

  const addBundleToCart = () => {
    if (totalVials < 3) return;

    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const bundleId = `bundle-${Date.now()}`;

    const newBundleItems = bundle.map((item) => {
      const discountedUnitPrice =
        item.price * (1 - currentDiscount / 100);

      return {
        id: item.id,
        name: item.name,

        price: discountedUnitPrice,
        basePrice: item.price,

        quantity: item.quantity,

        image: item.image || "",

        path: item.slug
          ? `/products/${item.slug}`
          : "/products",

        bundleId,
        bundleType: "build-your-own",

        bundleDiscountPercent: currentDiscount,
        bundleTierQuantity: currentTier?.quantity || null,

        bundleBaseUnitPrice: item.price,
        bundleDiscountedUnitPrice: discountedUnitPrice,
      };
    });

    const updatedCart = [
      ...existingCart,
      ...newBundleItems,
    ];

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setAddedToCart(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden px-5 md:px-10 pt-12 md:pt-16 pb-9">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(147,197,253,0.12),transparent_52%)]" />

        <div className="relative max-w-7xl mx-auto">

          <div className="max-w-3xl">

            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.32em] text-[#A5D8FF] mb-3">
              Build Your Own Bundle
            </p>

            <h1 className="text-4xl md:text-6xl font-black tracking-[-0.035em]">
              Mix. Match.
              <span className="text-[#A5D8FF]"> Save More.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm md:text-base leading-7 text-white/50">
              Choose your research vials and unlock greater
              savings automatically as your bundle grows.
            </p>

          </div>

        </div>

      </section>

      {/* DISCOUNT TIERS */}
      <section className="px-5 md:px-10 pb-7">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">

            {bundleTiers.map((tier) => {
              const unlocked =
                totalVials >= tier.quantity;

              const active =
                currentTier?.quantity === tier.quantity;

              return (
                <div
                  key={tier.quantity}
                  className={`
                    relative rounded-[18px] border px-4 py-3.5
                    transition-all duration-300
                    ${
                      active
                        ? "border-[#93C5FD]/50 bg-[#93C5FD]/10"
                        : unlocked
                        ? "border-[#93C5FD]/20 bg-white/[0.04]"
                        : "border-white/[0.07] bg-white/[0.025]"
                    }
                  `}
                >

                  <div className="flex items-start justify-between gap-2">

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.22em] text-white/35">
                        {tier.quantity}+ Vials
                      </p>

                      <p className="mt-1 text-xl md:text-2xl font-black">
                        {tier.discount}% Off
                      </p>
                    </div>

                    {unlocked && (
                      <div className="w-5 h-5 rounded-full bg-[#A5D8FF] text-[#081526] flex items-center justify-center shrink-0">
                        <Check
                          size={11}
                          strokeWidth={3}
                        />
                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* PROGRESS */}
      <section className="px-5 md:px-10 pb-8">

        <div className="max-w-7xl mx-auto">

          <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.025] px-5 py-4">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

              <div className="flex items-baseline gap-2">

                <span className="text-2xl font-black">
                  {totalVials}
                </span>

                <span className="text-sm text-white/45">
                  {totalVials === 1
                    ? "vial selected"
                    : "vials selected"}
                </span>

              </div>

              {nextTier ? (
                <p className="text-xs md:text-sm text-white/50">
                  Add{" "}
                  <span className="font-bold text-[#A5D8FF]">
                    {vialsUntilNextTier} more
                  </span>{" "}
                  to unlock{" "}
                  <span className="font-bold text-white">
                    {nextTier.discount}% off
                  </span>
                </p>
              ) : (
                <p className="text-xs md:text-sm font-bold text-[#A5D8FF]">
                  Maximum savings unlocked — 20% off
                </p>
              )}

            </div>

            <div className="mt-4 flex items-center gap-1.5">

              {[3, 5, 10, 20].map((quantity) => (
                <div
                  key={quantity}
                  className={`
                    h-1.5 flex-1 rounded-full transition-all
                    ${
                      totalVials >= quantity
                        ? "bg-[#93C5FD]"
                        : "bg-white/[0.07]"
                    }
                  `}
                />
              ))}

            </div>

          </div>

        </div>

      </section>

      {/* BUILDER */}
      <section className="px-5 md:px-10 pb-20">

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_370px] gap-7 items-start">

          {/* PRODUCTS */}
          <div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">

              <div>

                <p className="text-[10px] uppercase tracking-[0.28em] text-[#A5D8FF] mb-1.5">
                  Select Products
                </p>

                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  Build Your Bundle
                </h2>

              </div>

              {/* SEARCH */}
              <div className="relative w-full md:w-[330px]">

                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search products"
                  className="
                    w-full rounded-full
                    border border-white/[0.08]
                    bg-white/[0.035]
                    py-3 pl-11 pr-11
                    text-sm text-white
                    placeholder:text-white/25
                    outline-none
                    transition
                    focus:border-[#93C5FD]/40
                    focus:bg-white/[0.05]
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}

              </div>

            </div>

            {/* PRODUCT GRID */}
            {loading ? (
              <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] py-16 text-center text-sm text-white/35">
                Loading research products...
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] py-16 text-center">

                <PackageOpen
                  size={30}
                  className="mx-auto mb-3 text-white/20"
                />

                <p className="text-sm text-white/40">
                  No matching products found.
                </p>

              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {visibleProducts.map((product) => {
                    const selectedQty =
                      getBundleQuantity(product.id);

                    const outOfStock =
                      product.inventory <= 0;

                    const atInventoryLimit =
                      selectedQty >= product.inventory;

                    return (
                      <div
                        key={product.id}
                        className={`
                          group relative flex items-center gap-4
                          rounded-[20px] border p-3
                          transition-all duration-200
                          ${
                            selectedQty > 0
                              ? "border-[#93C5FD]/35 bg-[#93C5FD]/[0.07]"
                              : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.04]"
                          }
                        `}
                      >

                        {/* IMAGE */}
                        <div className="relative w-[74px] h-[74px] md:w-[82px] md:h-[82px] shrink-0 overflow-hidden rounded-[16px] bg-[#93C5FD]">

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-1.5"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#081526]/30">
                              <PackageOpen size={26} />
                            </div>
                          )}

                          {selectedQty > 0 && (
                            <div className="absolute top-1.5 right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#081526] flex items-center justify-center text-[9px] font-black">
                              {selectedQty}
                            </div>
                          )}

                        </div>

                        {/* DETAILS */}
                        <div className="min-w-0 flex-1">

                          <h3 className="text-sm md:text-[15px] font-bold leading-snug text-white">
                            {product.name}
                          </h3>

                          {product.size && (
                            <p className="mt-0.5 text-[11px] text-white/30">
                              {product.size}
                            </p>
                          )}

                          <p className="mt-1.5 text-sm font-semibold text-[#C9E2FF]">
                            ${formatMoney(product.price)}
                          </p>

                          {outOfStock && (
                            <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-red-300">
                              Out of stock
                            </p>
                          )}

                        </div>

                        {/* ADD / QUANTITY */}
                        <div className="shrink-0">

                          {selectedQty > 0 ? (
                            <div className="flex items-center rounded-full border border-white/[0.09] bg-[#071321] p-1">

                              <button
                                type="button"
                                onClick={() =>
                                  removeProduct(product.id)
                                }
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/55 hover:bg-white/[0.07] hover:text-white"
                              >
                                <Minus size={14} />
                              </button>

                              <span className="w-7 text-center text-xs font-black">
                                {selectedQty}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  addProduct(product)
                                }
                                disabled={atInventoryLimit}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-[#081526] hover:bg-[#DCEEFF] disabled:opacity-30"
                              >
                                <Plus size={14} />
                              </button>

                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                addProduct(product)
                              }
                              disabled={outOfStock}
                              className="
                                h-9 px-4 rounded-full
                                bg-white text-[#081526]
                                text-[10px] font-black uppercase tracking-[0.13em]
                                transition
                                hover:bg-[#DCEEFF]
                                disabled:opacity-30
                              "
                            >
                              Add
                            </button>
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>

                {/* SHOW MORE */}
                {hasMoreProducts && (
                  <div className="flex justify-center mt-6">

                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount(
                          (current) =>
                            current + PRODUCTS_PER_PAGE
                        )
                      }
                      className="
                        group inline-flex items-center gap-2
                        rounded-full border border-white/[0.09]
                        bg-white/[0.025]
                        px-6 py-3
                        text-[10px] font-bold uppercase tracking-[0.18em]
                        text-white/60
                        transition
                        hover:border-white/[0.16]
                        hover:bg-white/[0.05]
                        hover:text-white
                      "
                    >
                      Show More

                      <ChevronDown
                        size={14}
                        className="transition-transform group-hover:translate-y-0.5"
                      />

                    </button>

                  </div>
                )}

                {!hasMoreProducts &&
                  filteredProducts.length > PRODUCTS_PER_PAGE &&
                  !search && (
                    <div className="mt-6 text-center">

                      <button
                        type="button"
                        onClick={() => {
                          setVisibleCount(PRODUCTS_PER_PAGE);

                          window.scrollTo({
                            top: 500,
                            behavior: "smooth",
                          });
                        }}
                        className="text-[10px] uppercase tracking-[0.18em] text-white/30 hover:text-white/60"
                      >
                        Show Less
                      </button>

                    </div>
                  )}

              </>
            )}

          </div>

          {/* SUMMARY */}
          <aside className="lg:sticky lg:top-24 rounded-[26px] border border-white/[0.08] bg-[#0C1B2E] p-5 md:p-6 shadow-2xl shadow-black/10">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-[9px] uppercase tracking-[0.28em] text-[#A5D8FF]">
                  Bundle Summary
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Your Bundle
                </h2>

              </div>

              {bundle.length > 0 && (
                <button
                  type="button"
                  onClick={clearBundle}
                  className="text-[10px] uppercase tracking-[0.12em] text-white/30 hover:text-white/70"
                >
                  Clear
                </button>
              )}

            </div>

            {/* EMPTY */}
            {bundle.length === 0 ? (
              <div className="mt-6 rounded-[18px] border border-dashed border-white/[0.09] py-8 px-5 text-center">

                <PackageOpen
                  size={28}
                  className="mx-auto mb-3 text-white/20"
                />

                <p className="text-sm text-white/40">
                  Select at least 3 vials to build your bundle.
                </p>

              </div>
            ) : (
              <div className="mt-6 space-y-3">

                {bundle.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >

                    <div className="w-11 h-11 shrink-0 overflow-hidden rounded-xl bg-[#93C5FD]">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : null}

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-xs font-bold">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-white/35">
                        {item.quantity} × ${formatMoney(item.price)}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-xs font-bold">
                        $
                        {formatMoney(
                          item.price * item.quantity
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeAllProduct(item.id)
                        }
                        className="mt-0.5 text-[9px] text-white/25 hover:text-red-300"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

            <div className="my-5 h-px bg-white/[0.07]" />

            {/* TOTALS */}
            <div className="space-y-2.5">

              <div className="flex justify-between text-xs text-white/45">
                <span>Vials</span>
                <span className="text-white/70">
                  {totalVials}
                </span>
              </div>

              <div className="flex justify-between text-xs text-white/45">
                <span>Subtotal</span>
                <span className="text-white/70">
                  ${formatMoney(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[#A5D8FF]">
                  Bundle Savings
                  {currentDiscount > 0
                    ? ` (${currentDiscount}%)`
                    : ""}
                </span>

                <span className="font-semibold text-[#A5D8FF]">
                  -${formatMoney(savings)}
                </span>
              </div>

            </div>

            <div className="my-5 h-px bg-white/[0.07]" />

            {/* TOTAL */}
            <div className="flex items-end justify-between gap-3">

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Bundle Total
                </p>

                <p className="mt-1 text-3xl font-black tracking-tight">
                  ${formatMoney(bundleTotal)}
                </p>
              </div>

              {currentDiscount > 0 && (
                <span className="rounded-full bg-[#93C5FD]/10 px-3 py-1.5 text-[10px] font-bold text-[#A5D8FF]">
                  {currentDiscount}% OFF
                </span>
              )}

            </div>

            {/* NEXT TIER */}
            {nextTier && (
              <div className="mt-5 flex items-start gap-2.5 rounded-[16px] bg-[#93C5FD]/[0.07] px-4 py-3">

                <Sparkles
                  size={15}
                  className="mt-0.5 shrink-0 text-[#A5D8FF]"
                />

                <p className="text-[11px] leading-5 text-white/55">
                  Add{" "}
                  <span className="font-bold text-white">
                    {vialsUntilNextTier} more{" "}
                    {vialsUntilNextTier === 1
                      ? "vial"
                      : "vials"}
                  </span>{" "}
                  to unlock{" "}
                  <span className="font-bold text-[#A5D8FF]">
                    {nextTier.discount}% off.
                  </span>
                </p>

              </div>
            )}

            {!nextTier && (
              <div className="mt-5 flex items-center gap-2.5 rounded-[16px] bg-[#93C5FD]/[0.07] px-4 py-3">

                <Check
                  size={15}
                  className="shrink-0 text-[#A5D8FF]"
                />

                <p className="text-[11px] font-semibold text-[#A5D8FF]">
                  Maximum bundle savings unlocked.
                </p>

              </div>
            )}

            {/* CART BUTTON */}
            {totalVials < 3 ? (
              <button
                type="button"
                disabled
                className="mt-5 w-full rounded-full bg-white/[0.06] py-4 text-[10px] font-bold uppercase tracking-[0.17em] text-white/25"
              >
                Add {3 - totalVials} More{" "}
                {3 - totalVials === 1 ? "Vial" : "Vials"}
              </button>
            ) : (
              <button
                type="button"
                onClick={addBundleToCart}
                className="
                  mt-5 w-full rounded-full
                  bg-white py-4
                  text-[10px] font-black uppercase tracking-[0.17em]
                  text-[#081526]
                  transition
                  hover:bg-[#DCEEFF]
                  flex items-center justify-center gap-2
                "
              >
                {addedToCart ? (
                  <>
                    <Check size={15} />
                    Bundle Added
                  </>
                ) : (
                  <>
                    <ShoppingCart size={15} />
                    Add Bundle To Cart
                  </>
                )}
              </button>
            )}

            {addedToCart && (
              <a
                href="/cart"
                className="mt-4 block text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#A5D8FF] hover:text-white"
              >
                View Cart →
              </a>
            )}

          </aside>

        </div>

      </section>

    </main>
  );
}