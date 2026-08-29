"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  FlaskConical,
  Shirt,
  FileText,
} from "lucide-react";

type Product = {
  name: string;
  desc: string;
  category: string;
  image: string;
  href: string;
};

const products: Product[] = [
  {
    name: "APX-3",
    desc: "10–20mg Research Peptide",
    category: "Metabolic Research",
    image: "/images/retatrutide.PNG",
    href: "/products/apx3",
  },
  {
    name: "APX-2",
    desc: "30mg Research Peptide",
    category: "Metabolic Research",
    image: "/images/apx230.png",
    href: "/products/apx2",
  },
  {
    name: "Wolverine",
    desc: "20mg Research Blend",
    category: "Tissue Repair Research",
    image: "/images/wolverine.png",
    href: "/products/wolverine",
  },
  {
    name: "BPC-157",
    desc: "10mg Research Peptide",
    category: "Tissue Repair Research",
    image: "/images/bpc157.PNG",
    href: "/products/bpc157",
  },
  {
    name: "TB-500",
    desc: "10mg Research Peptide",
    category: "Tissue Repair Research",
    image: "/images/tb500.PNG",
    href: "/products/tb500",
  },
  {
    name: "KLOW",
    desc: "80mg Research Peptide",
    category: "Metabolic Research",
    image: "/images/klow.png",
    href: "/products/klow",
  },
  {
    name: "Glutathione",
    desc: "1500mg Research Compound",
    category: "Cellular Research",
    image: "/images/glutathione1500.png",
    href: "/products/glutathione",
  },
  {
    name: "KPV",
    desc: "10mg Research Peptide",
    category: "Tissue Repair Research",
    image: "/images/kpv.PNG",
    href: "/products/kpv",
  },
  {
    name: "GHK-Cu",
    desc: "100mg Research Peptide",
    category: "Dermal Research",
    image: "/images/ghkcu.PNG",
    href: "/products/ghkcu",
  },
  {
    name: "Tesamorelin",
    desc: "5–10mg Research Peptide",
    category: "Secretagogue Research",
    image: "/images/tesa5.png",
    href: "/products/tesamorelin",
  },
  {
    name: "CJC/IPA Without DAC",
    desc: "10mg Research Peptide",
    category: "Secretagogue Research",
    image: "/images/cjcipa.PNG",
    href: "/products/cjcipa",
  },
  {
    name: "MITO-X",
    desc: "120mg Research Blend",
    category: "Cellular Research",
    image: "/images/mitox120.png",
    href: "/products/mitox",
  },
  {
    name: "NAD+",
    desc: "1000mg Research Compound",
    category: "Cellular Research",
    image: "/images/nad.png",
    href: "/products/nad",
  },
  {
    name: "MOTS-C",
    desc: "10mg Research Peptide",
    category: "Cellular Research",
    image: "/images/motsc.PNG",
    href: "/products/motsc",
  },
  {
    name: "5-Amino-1MQ",
    desc: "50mg Research Compound",
    category: "Metabolic Research",
    image: "/images/5amino1mq.png",
    href: "/products/5amino1mq",
  },
  {
    name: "SS-31",
    desc: "10mg Research Peptide",
    category: "Cellular Research",
    image: "/images/ss3110.png",
    href: "/products/ss31",
  },
  {
    name: "ARA-290",
    desc: "10mg Research Peptide",
    category: "Cellular Research",
    image: "/images/ara290.PNG",
    href: "/products/ara290",
  },
  {
    name: "AOD-9604",
    desc: "10mg Research Peptide",
    category: "Metabolic Research",
    image: "/images/aod9604.png",
    href: "/products/aod9604",
  },
  {
    name: "ADAMAX",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/adamax.PNG",
    href: "/products/adamax",
  },
  {
    name: "NEURO-X",
    desc: "48mg Research Peptide Blend",
    category: "Neuro Research",
    image: "/images/neurox48.png",
    href: "/products/neurox",
  },
  {
    name: "Semax",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/semax.PNG",
    href: "/products/semax",
  },
  {
    name: "Selank",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/selank.PNG",
    href: "/products/selank",
  },
  {
    name: "Pinealon",
    desc: "10mg Research Peptide",
    category: "Circadian Research",
    image: "/images/pinealon.PNG",
    href: "/products/pinealon",
  },
  {
    name: "PE-22-28",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/pe2228.PNG",
    href: "/products/pe2228",
  },
  {
    name: "Kisspeptin-10",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/kisspeptin10.png",
    href: "/products/kisspeptin10",
  },
  {
    name: "PT-141",
    desc: "10mg Research Peptide",
    category: "Neuro Research",
    image: "/images/pt141.png",
    href: "/products/pt141",
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

function cleanCategory(category: string) {
  return category.replace(" Research", "");
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.desc.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const scrollToGear = () => {
    document.getElementById("apexx-gear")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white">
      {/* TOP */}
      <section className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-5 pb-6 pt-10 md:px-6 md:pt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-300">
                Apexx Biolabs
              </p>

              <h1 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
                Products
              </h1>

              <p className="mt-2 max-w-xl text-sm text-white/40 md:text-base">
                Research compounds, storage essentials, and Apexx apparel.
              </p>
            </div>

            <div className="w-full lg:w-[360px]">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-blue-300/40 focus:bg-white/[0.045]"
                />
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={scrollToGear}
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-300 px-4 py-2.5 text-[11px] font-bold text-[#081526] transition-all hover:bg-blue-200"
            >
              <Shirt size={14} />
              Shop Apexx Gear
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <Link
              href="/coas"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2.5 text-[11px] font-semibold text-white/55 transition-all hover:border-white/20 hover:text-white"
            >
              <FileText size={13} />
              View COAs
            </Link>
          </div>

          {/* FILTERS */}
          <div className="mt-5 overflow-x-auto">
            <div className="flex min-w-max items-center gap-2 pb-1">
              {categories.map((category) => {
                const active = activeCategory === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setActiveCategory(category.value)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold transition-all ${
                      active
                        ? "bg-white text-[#081526]"
                        : "border border-white/[0.08] bg-white/[0.02] text-white/45 hover:border-blue-300/30 hover:text-white"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-300/70">
              Research Catalog
            </p>

            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              {activeCategory === "All"
                ? "Research Products"
                : categories.find(
                    (category) => category.value === activeCategory
                  )?.label}
            </h2>
          </div>

          <p className="whitespace-nowrap text-[11px] text-white/30">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="group overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/25 hover:bg-white/[0.035]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#06111f]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,197,253,0.07),transparent_70%)]" />

                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.035] md:p-6"
                  />
                </div>

                <div className="p-3.5 md:p-4">
                  <p className="mb-1.5 truncate text-[8px] uppercase tracking-[0.16em] text-blue-300/65 md:text-[9px]">
                    {cleanCategory(product.category)}
                  </p>

                  <h3 className="truncate text-sm font-bold leading-tight md:text-base">
                    {product.name}
                  </h3>

                  <p className="mt-1 truncate text-[11px] text-white/40 md:text-xs">
                    {product.desc}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-2.5">
                    <span className="text-[10px] font-semibold text-white/45 transition-colors group-hover:text-white md:text-[11px]">
                      View Product
                    </span>

                    <ArrowRight
                      size={13}
                      className="text-blue-300 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] py-16 text-center">
            <p className="text-sm text-white/40">No products found.</p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-3 text-xs font-semibold text-blue-300 hover:text-blue-200"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* APEXX GEAR */}
      <section
        id="apexx-gear"
        className="scroll-mt-20 border-t border-white/[0.07]"
      >
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
          <div className="mb-5">
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-300/70">
              Beyond The Lab
            </p>

            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              Apexx Gear
            </h2>

            <p className="mt-1 text-xs text-white/35 md:text-sm">
              Storage essentials and branded apparel.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {/* VIAL CASE */}
            <Link
              href="/products/vial-storage-case"
              className="group grid grid-cols-[135px_1fr] overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:border-blue-300/25 hover:bg-white/[0.035] sm:grid-cols-[165px_1fr]"
            >
              <div className="relative h-[150px] overflow-hidden bg-[#93C5FD] sm:h-[165px]">
                <img
                  src="/images/vial-case.png"
                  alt="Apexx Biolabs Vial Storage Case"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-between p-4">
                <div>
                  <div className="mb-2 flex items-center gap-1.5">
                    <FlaskConical size={11} className="text-blue-300" />

                    <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-blue-300/70">
                      Accessory
                    </p>
                  </div>

                  <h3 className="text-base font-bold leading-tight tracking-tight md:text-lg">
                    Vial Storage Case
                  </h3>

                  <p className="mt-1 text-sm font-bold text-blue-300 md:text-base">
                    $14.99
                  </p>

                  <p className="mt-1.5 text-[11px] text-white/35 md:text-xs">
                    14-vial protective storage
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                  <span className="text-[10px] font-semibold text-white/45 transition-colors group-hover:text-white">
                    View Product
                  </span>

                  <ArrowRight
                    size={13}
                    className="text-blue-300 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>

            {/* SIGNATURE TEE */}
            <Link
              href="/products/apexx-shirt"
              className="group grid grid-cols-[135px_1fr] overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:border-blue-300/25 hover:bg-white/[0.035] sm:grid-cols-[165px_1fr]"
            >
              <div className="relative h-[150px] overflow-hidden bg-[#93C5FD] sm:h-[165px]">
                <img
                  src="/images/apexx-shirt-blue-front.png"
                  alt="Apexx Biolabs Signature Tee"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.035]"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-between p-4">
                <div>
                  <div className="mb-2 flex items-center gap-1.5">
                    <Shirt size={11} className="text-blue-300" />

                    <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-blue-300/70">
                      Apparel
                    </p>
                  </div>

                  <h3 className="text-base font-bold leading-tight tracking-tight md:text-lg">
                    Apexx Signature Tee
                  </h3>

                  <p className="mt-1 text-sm font-bold text-blue-300 md:text-base">
                    $29.99
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <p className="text-[11px] text-white/35 md:text-xs">
                      100% Cotton · S–XL
                    </p>

                    <div className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full border border-white/20 bg-[#93C5FD]" />
                      <span className="h-2.5 w-2.5 rounded-full border border-white/20 bg-[#E8E1DA]" />
                      <span className="h-2.5 w-2.5 rounded-full border border-white/20 bg-[#777863]" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                  <span className="text-[10px] font-semibold text-white/45 transition-colors group-hover:text-white">
                    View Product
                  </span>

                  <ArrowRight
                    size={13}
                    className="text-blue-300 transition-transform group-hover:translate-x-1"
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