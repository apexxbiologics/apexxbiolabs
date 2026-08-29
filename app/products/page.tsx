"use client";

import { useMemo, useState } from "react";
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

function shortCategory(category: string) {
  if (category === "Tissue Repair Research") return "Tissue Repair";
  return category.replace(" Research", "");
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-5 pb-7 pt-10 md:px-6 md:pb-8 md:pt-14">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#93C5FD]">
                Apexx Biolabs
              </p>

              <h1 className="text-4xl font-bold tracking-[-0.035em] md:text-5xl">
                Shop Apexx.
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-white/45 md:text-[15px]">
                Browse our research catalog, laboratory accessories,
                and Apexx apparel.
              </p>
            </div>

            {/* TOP NAV */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTo("research-products")}
                className="rounded-lg bg-[#93C5FD] px-4 py-2.5 text-xs font-bold text-[#071423] transition hover:bg-[#b4d7fb]"
              >
                Research
              </button>

              <button
                type="button"
                onClick={() => scrollTo("apexx-gear")}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <Shirt size={13} />
                Apexx Gear
              </button>

              <Link
                href="/coas"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <FileText size={13} />
                COAs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESEARCH
      ===================================================== */}

      <section
        id="research-products"
        className="scroll-mt-16"
      >
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
          {/* HEADER */}
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#93C5FD]/70">
                Research Catalog
              </p>

              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  Research Products
                </h2>

                <span className="text-xs text-white/25">
                  {filteredProducts.length}
                </span>
              </div>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-[310px]">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog..."
                className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.025] pl-10 pr-10 text-xs text-white outline-none transition placeholder:text-white/25 focus:border-[#93C5FD]/35 focus:bg-white/[0.04]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* FILTERS */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max items-center gap-1.5 pb-1">
              {categories.map((category) => {
                const active =
                  activeCategory === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() =>
                      setActiveCategory(category.value)
                    }
                    className={`rounded-lg px-3.5 py-2 text-[10px] font-semibold transition ${
                      active
                        ? "bg-white text-[#071423]"
                        : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRODUCTS */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => (
                <Link
                  key={product.name}
                  href={product.href}
                  className="group overflow-hidden rounded-xl border border-white/[0.065] bg-[#0A192B] transition duration-300 hover:-translate-y-0.5 hover:border-[#93C5FD]/25 hover:bg-[#0C1C30]"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-[1/0.92] overflow-hidden bg-[#081727]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(147,197,253,0.075),transparent_62%)]" />

                    <img
                      src={product.image}
                      alt={product.name}
                      className="relative h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.035] md:p-5"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="p-3.5">
                    <p className="mb-1.5 truncate text-[8px] font-semibold uppercase tracking-[0.16em] text-[#93C5FD]/65">
                      {shortCategory(product.category)}
                    </p>

                    <h3 className="truncate text-sm font-bold tracking-tight text-white">
                      {product.name}
                    </h3>

                    <p className="mt-1 truncate text-[10px] text-white/35">
                      {product.desc}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.055] pt-2.5">
                      <span className="text-[10px] font-semibold text-white/40 transition group-hover:text-[#93C5FD]">
                        View
                      </span>

                      <ArrowRight
                        size={12}
                        className="text-[#93C5FD]/70 transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
              <p className="text-sm text-white/35">
                No products found.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-3 text-xs font-semibold text-[#93C5FD]"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          APEXX GEAR
      ===================================================== */}

      <section
        id="apexx-gear"
        className="scroll-mt-16 border-t border-white/[0.06] bg-[#06111E]"
      >
        <div className="mx-auto max-w-7xl px-5 py-9 md:px-6 md:py-11">
          {/* SECTION HEADER */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#93C5FD]/70">
                Apexx Collection
              </p>

              <h2 className="text-2xl font-bold tracking-tight">
                Gear & Apparel
              </h2>

              <p className="mt-1.5 text-xs text-white/35">
                Lab storage and Apexx essentials.
              </p>
            </div>
          </div>

          {/* GEAR CARDS */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* ===============================================
                VIAL CASE
            =============================================== */}

            <Link
              href="/products/vial-storage-case"
              className="group grid min-h-[190px] grid-cols-[42%_58%] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A192B] transition duration-300 hover:border-[#93C5FD]/25"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden bg-[#93C5FD]">
                <img
                  src="/images/vial-case.png"
                  alt="Apexx Vial Storage Case"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>

              {/* DETAILS */}
              <div className="flex flex-col justify-between p-5">
                <div>
                  <div className="mb-3 flex items-center gap-1.5 text-[#93C5FD]">
                    <FlaskConical size={12} />

                    <span className="text-[8px] font-semibold uppercase tracking-[0.2em]">
                      Lab Accessory
                    </span>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight">
                    Vial Storage Case
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-white/40">
                    Protective storage for up to 14 research vials.
                  </p>

                  <p className="mt-3 text-base font-bold text-white">
                    $14.99
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-[#93C5FD]">
                  View Product
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>

            {/* ===============================================
                SHIRT
            =============================================== */}

            <Link
              href="/products/apexx-shirt"
              className="group grid min-h-[190px] grid-cols-[42%_58%] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A192B] transition duration-300 hover:border-[#93C5FD]/25"
            >
              {/* SHIRT IMAGE */}
              <div className="relative overflow-hidden bg-[#93C5FD]">
                <img
                  src="/images/apexx-shirt-blue-front.png"
                  alt="Apexx Signature Tee"
                  className="absolute inset-0 h-full w-full object-contain object-center p-2 transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>

              {/* DETAILS */}
              <div className="flex flex-col justify-between p-5">
                <div>
                  <div className="mb-3 flex items-center gap-1.5 text-[#93C5FD]">
                    <Shirt size={12} />

                    <span className="text-[8px] font-semibold uppercase tracking-[0.2em]">
                      Apparel
                    </span>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight">
                    Apexx Signature Tee
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-white/40">
                    100% cotton · Sizes S–XL
                  </p>

                  {/* COLORS */}
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full border border-white/20 bg-[#93C5FD]" />
                    <span className="h-3 w-3 rounded-full border border-white/20 bg-[#E8E1DA]" />
                    <span className="h-3 w-3 rounded-full border border-white/20 bg-[#777863]" />
                  </div>

                  <p className="mt-3 text-base font-bold text-white">
                    $29.99
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-[#93C5FD]">
                  View Product
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-1"
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