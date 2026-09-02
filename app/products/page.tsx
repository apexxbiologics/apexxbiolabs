"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  FlaskConical,
  Shirt,
  FileText,
  X,
} from "lucide-react";

type Product = {
  name: string;
  desc: string;
  category: string;
  image: string;
  href: string;
  productIds: string[];
};

type FlashSale = {
  id: string;
  product_id: string;
  sale_price: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
};

type StoreProduct = {
  id: string;
  name: string;
  price: number;
  size?: string | null;
};

const products: Product[] = [
  {
    name: "APX-3",
    desc: "10–20mg Research Peptide",
    category: "Metabolic Research",
    image: "/images/retatrutide.PNG",
    href: "/products/apx3",
    productIds: ["apx3-10mg", "apx3-20mg"],
  },
  {
    name: "APX-2",
    desc: "30mg Research Peptide",
    category: "Metabolic Research",
    image: "/images/apx230.png",
    href: "/products/apx2",
    productIds: ["apx2-30mg"],
  },
  {
    name: "Wolverine",
    desc: "20mg Research Blend",
    category: "Tissue Repair Research",
    image: "/images/wolverine.png",
    href: "/products/wolverine",
    productIds: ["wolverine-20mg"],
  },
  {
    name: "BPC-157",
    desc: "10mg Research Peptide",
    category: "Tissue Repair Research",
    image: "/images/bpc157.PNG",
    href: "/products/bpc157",
    productIds: ["bpc157-10mg"],
  },
  {
    name: "TB-500",
    desc: "10mg Research Peptide",
    category: "Tissue Repair Research",
    image: "/images/tb500.PNG",
    href: "/products/tb500",
    productIds: ["tb500-10mg"],
  },
  {
    name: "KLOW",
    desc: "80mg Research Peptide",
    category: "Metabolic Research",
    image: "/images/klow.png",
    href: "/products/klow",
    productIds: ["klow-80mg"],
  },
  {
    name: "Glutathione",
    desc: "1500mg Research Compound",
    category: "Cellular Research",
    image: "/images/glutathione1500.png",
    href: "/products/glutathione",
    productIds: ["glutathione-1500mg"],
  },
  {
    name: "KPV",
    desc: "10mg Research Peptide",
    category: "Tissue Repair Research",
    image: "/images/kpv.PNG",
    href: "/products/kpv",
    productIds: ["kpv-10mg"],
  },
  {
    name: "GHK-Cu",
    desc: "100mg Research Peptide",
    category: "Dermal Research",
    image: "/images/ghkcu.PNG",
    href: "/products/ghkcu",
    productIds: ["ghkcu-50mg", "ghkcu-100mg"],
  },
  {
    name: "Tesamorelin",
    desc: "5–10mg Research Peptide",
    category: "Secretagogue Research",
    image: "/images/tesa5.png",
    href: "/products/tesamorelin",
    productIds: ["tesamorelin-5mg", "Tesamorelin-10mg", "tesamorelin-10mg"],
  },
  {
    name: "CJC/IPA Without DAC",
    desc: "10mg Research Peptide",
    category: "Secretagogue Research",
    image: "/images/cjcipa.PNG",
    href: "/products/cjcipa",
    productIds: ["cjcipa-10mg", "cjcipa"],
  },
  {
    name: "MITO-X",
    desc: "120mg Research Blend",
    category: "Cellular Research",
    image: "/images/mitox120.png",
    href: "/products/mitox",
    productIds: ["mitox-120mg"],
  },
  {
    name: "NAD+",
    desc: "1000mg Research Compound",
    category: "Cellular Research",
    image: "/images/nad.png",
    href: "/products/nad",
    productIds: ["nad-1000mg"],
  },
  {
    name: "MOTS-C",
    desc: "10mg Research Peptide",
    category: "Cellular Research",
    image: "/images/motsc.PNG",
    href: "/products/motsc",
    productIds: ["motsc-10mg"],
  },
  {
    name: "5-Amino-1MQ",
    desc: "50mg Research Compound",
    category: "Metabolic Research",
    image: "/images/5amino1mq.png",
    href: "/products/5amino1mq",
    productIds: ["5amino1mq-50mg"],
  },
  {
    name: "SS-31",
    desc: "10mg Research Peptide",
    category: "Cellular Research",
    image: "/images/ss3110.png",
    href: "/products/ss31",
    productIds: ["ss31-10mg"],
  },
  {
    name: "ARA-290",
    desc: "10mg Research Peptide",
    category: "Cellular Research",
    image: "/images/ara290.PNG",
    href: "/products/ara290",
    productIds: ["ara290-10mg"],
  },
  {
    name: "AOD-9604",
    desc: "10mg Research Peptide",
    category: "Metabolic Research",
    image: "/images/aod9604.png",
    href: "/products/aod9604",
    productIds: ["aod9604-5mg", "aod9604-10mg"],
  },
  {
    name: "ADAMAX",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/adamax.PNG",
    href: "/products/adamax",
    productIds: ["adamax-10mg"],
  },
  {
    name: "NEURO-X",
    desc: "48mg Research Peptide Blend",
    category: "Neuro Research",
    image: "/images/neurox48.png",
    href: "/products/neurox",
    productIds: ["neurox-48mg"],
  },
  {
    name: "Semax",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/semax.PNG",
    href: "/products/semax",
    productIds: ["semax-10mg", "semax"],
  },
  {
    name: "Selank",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/selank.PNG",
    href: "/products/selank",
    productIds: ["selank-10mg", "selank"],
  },
  {
    name: "Pinealon",
    desc: "10mg Research Peptide",
    category: "Circadian Research",
    image: "/images/pinealon.PNG",
    href: "/products/pinealon",
    productIds: ["pinealon-10mg", "pinealon"],
  },
  {
    name: "PE-22-28",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/pe2228.PNG",
    href: "/products/pe2228",
    productIds: ["pe2228-10mg"],
  },
  {
    name: "Kisspeptin-10",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/kisspeptin10.png",
    href: "/products/kisspeptin10",
    productIds: ["kisspeptin10-10mg"],
  },
  {
    name: "PT-141",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/pt141.png",
    href: "/products/pt141",
    productIds: ["pt141-10mg"],
  },
];

const categories = [
  { label: "All", value: "All" },
  { label: "Metabolic", value: "Metabolic Research" },
  { label: "Repair", value: "Tissue Repair Research" },
  { label: "Dermal", value: "Dermal Research" },
  { label: "Secretagogue", value: "Secretagogue Research" },
  { label: "Cellular", value: "Cellular Research" },
  { label: "Neuro", value: "Neuro Research" },
  { label: "Circadian", value: "Circadian Research" },
];

function shortCategory(category: string) {
  if (category === "Tissue Repair Research") return "Tissue Repair";
  return category.replace(" Research", "");
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadPricing = async () => {
      try {
        const [salesResponse, productsResponse] = await Promise.all([
          fetch("/api/flash-sales", { cache: "no-store" }),
          fetch("/api/products", { cache: "no-store" }),
        ]);

        const salesData = await salesResponse.json().catch(() => ({}));
        const productsData = await productsResponse.json().catch(() => ({}));

        if (cancelled) return;

        if (salesResponse.ok) {
          const rows = Array.isArray(salesData.sales)
            ? salesData.sales
            : Array.isArray(salesData.flashSales)
            ? salesData.flashSales
            : [];

          const now = Date.now();

          setFlashSales(
            rows.filter((sale: FlashSale) => {
              const starts = new Date(sale.starts_at).getTime();
              const ends = new Date(sale.ends_at).getTime();

              return (
                sale.active !== false &&
                Number.isFinite(starts) &&
                Number.isFinite(ends) &&
                starts <= now &&
                ends > now
              );
            })
          );
        }

        if (productsResponse.ok && productsData.success) {
          setStoreProducts(
            Array.isArray(productsData.products)
              ? productsData.products.map((product: any) => ({
                  id: String(product.id),
                  name: String(product.name || ""),
                  price: Number(product.price || 0),
                  size: product.size ?? null,
                }))
              : []
          );
        }
      } catch (error) {
        // Keep the catalog usable at regular pricing if pricing lookup fails.
        console.error("Unable to load storefront flash-sale pricing:", error);
      }
    };

    loadPricing();

    // Refresh periodically so scheduled sales appear/end without requiring
    // a full browser reload.
    const interval = window.setInterval(loadPricing, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const getProductPricing = (product: Product) => {
    const matchingStoreProducts = storeProducts.filter((storeProduct) =>
      product.productIds.some(
        (id) => id.toLowerCase() === storeProduct.id.toLowerCase()
      )
    );

    const matchingSales = flashSales
      .map((sale) => {
        const storeProduct = matchingStoreProducts.find(
          (item) =>
            item.id.toLowerCase() === String(sale.product_id).toLowerCase()
        );

        if (!storeProduct) return null;

        const salePrice = Number(sale.sale_price);
        const regularPrice = Number(storeProduct.price);

        if (
          !Number.isFinite(salePrice) ||
          !Number.isFinite(regularPrice) ||
          salePrice <= 0 ||
          regularPrice <= 0 ||
          salePrice >= regularPrice
        ) {
          return null;
        }

        return {
          productId: storeProduct.id,
          regularPrice,
          salePrice,
          size: storeProduct.size || "",
        };
      })
      .filter(Boolean) as {
      productId: string;
      regularPrice: number;
      salePrice: number;
      size: string;
    }[];

    if (matchingSales.length === 0) return null;

    // For cards that represent more than one size, show the lowest active
    // flash-sale price and label the size so the customer knows which variant.
    return matchingSales.sort((a, b) => a.salePrice - b.salePrice)[0];
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "All" ||
        product.category === activeCategory;

      const searchMatch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.desc.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [search, activeCategory]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-[#071423] text-white">
      {/* TOP */}
      <section className="border-b border-white/[0.055]">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#93C5FD]/70">
                Apexx Biolabs
              </p>

              <h1 className="text-4xl font-bold tracking-[-0.035em] sm:text-5xl md:text-[52px]">
                Research Catalog
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
                Research compounds, laboratory accessories, and Apexx apparel.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/build-a-bundle"
                className="inline-flex items-center gap-2 rounded-full bg-[#93C5FD] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#071423] transition hover:bg-[#b9dbff]"
              >
                Build Bundle
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={() => scrollTo("apexx-gear")}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/55 transition hover:border-white/15 hover:text-white"
              >
                <Shirt size={16} />
                Gear
              </button>

              <Link
                href="/coas"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/55 transition hover:border-white/15 hover:text-white"
              >
                <FileText size={16} />
                COAs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BUNDLE STRIP */}
      <section className="border-b border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-[#93C5FD]/15 bg-[#93C5FD]/[0.045] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#93C5FD]">
                  Build Your Own Bundle
                </span>

                <span className="text-xs text-white/35">
                  Mix & match eligible research vials
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/50">
                <span>3 · 5% off</span>
                <span>5 · 10% off</span>
                <span>10 · 15% off</span>
                <span>20 · 20% off</span>
              </div>
            </div>

            <Link
              href="/build-a-bundle"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:text-[#93C5FD]"
            >
              Start Building
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section id="research-products" className="scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 py-9 md:px-6 md:py-11">
          {/* TOOLBAR */}
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">
                Research Products
              </h2>
              <span className="text-xs text-white/30">
                {filteredProducts.length}
              </span>
            </div>

            <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
              <div className="relative w-full lg:w-[330px]">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  className="h-11 w-full rounded-full border border-white/[0.07] bg-white/[0.025] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#93C5FD]/30"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max items-center gap-1 border-b border-white/[0.05] pb-2">
              {categories.map((category) => {
                const active = activeCategory === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setActiveCategory(category.value)}
                    className={`relative px-3.5 py-2.5 text-xs font-semibold transition ${
                      active
                        ? "text-white"
                        : "text-white/30 hover:text-white/65"
                    }`}
                  >
                    {category.label}

                    {active && (
                      <span className="absolute inset-x-2 -bottom-[9px] h-px bg-[#93C5FD]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRODUCTS */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => {
                const pricing = getProductPricing(product);

                return (
                  <Link
                    key={product.name}
                    href={product.href}
                    className="group min-w-0"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[22px] border border-white/[0.055] bg-[#0A1828] transition duration-300 group-hover:border-[#93C5FD]/25">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(147,197,253,0.08),transparent_62%)]" />

                      {pricing && (
                        <span className="absolute left-3 top-3 z-10 rounded-full border border-[#93C5FD]/25 bg-[#071423]/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#93C5FD] backdrop-blur">
                          Flash Sale
                        </span>
                      )}

                      <img
                        src={product.image}
                        alt={product.name}
                        className="relative h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.035] sm:p-6"
                      />
                    </div>

                    <div className="px-1 pt-4">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#93C5FD]/55">
                        {shortCategory(product.category)}
                      </p>

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-white sm:text-lg">
                            {product.name}
                          </h3>

                          <p className="mt-1.5 truncate text-xs text-white/40">
                            {product.desc}
                          </p>

                          {pricing && (
                            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                              <span className="text-sm text-white/30 line-through">
                                ${pricing.regularPrice.toFixed(2)}
                              </span>

                              <span className="text-base font-black text-[#93C5FD]">
                                ${pricing.salePrice.toFixed(2)}
                              </span>

                              {pricing.size && product.productIds.length > 1 && (
                                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                                  {pricing.size}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <ArrowRight
                          size={14}
                          className="mt-0.5 shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-[#93C5FD]"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.05] py-14 text-center">
              <p className="text-xs text-white/30">No products found.</p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#93C5FD]"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* GEAR */}
      <section
        id="apexx-gear"
        className="scroll-mt-16 border-t border-white/[0.05] bg-[#06111E]"
      >
        <div className="mx-auto max-w-7xl px-5 py-9 md:px-6">
          <div className="mb-5">
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#93C5FD]/60">
              Apexx Collection
            </p>
            <h2 className="text-2xl font-bold tracking-tight">Gear & Apparel</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Link
              href="/products/vial-storage-case"
              className="group grid min-h-[185px] grid-cols-[38%_62%] overflow-hidden rounded-xl border border-white/[0.055] bg-[#0A192B] transition hover:border-[#93C5FD]/20"
            >
              <div className="relative overflow-hidden bg-[#91C2FD]">
                <img
                  src="/images/vial-case.png"
                  alt="Apexx Vial Storage Case"
                  className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>

              <div className="flex flex-col justify-center p-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#93C5FD]/60">
                  Lab Accessory
                </p>

                <h3 className="text-lg font-bold">Vial Storage Case</h3>

                <p className="mt-1.5 text-xs leading-5 text-white/40">
                  Protective storage for up to 14 research vials.
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-base font-bold">$14.99</span>
                  <ArrowRight
                    size={14}
                    className="text-[#93C5FD]/60 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </Link>

            <Link
              href="/products/apexx-shirt"
              className="group grid min-h-[185px] grid-cols-[38%_62%] overflow-hidden rounded-xl border border-white/[0.055] bg-[#0A192B] transition hover:border-[#93C5FD]/20"
            >
              <div className="relative overflow-hidden bg-[#93C5FD]">
                <img
                  src="/images/apexx-shirt-blue-front.png"
                  alt="Apexx Signature Tee"
                  className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>

              <div className="flex flex-col justify-center p-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#93C5FD]/60">
                  Apparel
                </p>

                <h3 className="text-lg font-bold">Apexx Signature Tee</h3>

                <p className="mt-1.5 text-xs leading-5 text-white/40">
                  100% cotton · Sizes S–XL
                </p>

                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border border-white/20 bg-[#93C5FD]" />
                  <span className="h-2.5 w-2.5 rounded-full border border-white/20 bg-[#E8E1DA]" />
                  <span className="h-2.5 w-2.5 rounded-full border border-white/20 bg-[#777863]" />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-base font-bold">$29.99</span>
                  <ArrowRight
                    size={14}
                    className="text-[#93C5FD]/60 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
