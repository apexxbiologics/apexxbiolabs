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
  {
    label: "All",
    value: "All",
  },
  {
    label: "Metabolic",
    value: "Metabolic Research",
  },
  {
    label: "Repair",
    value: "Tissue Repair Research",
  },
  {
    label: "Dermal",
    value: "Dermal Research",
  },
  {
    label: "Secretagogue",
    value: "Secretagogue Research",
  },
  {
    label: "Cellular",
    value: "Cellular Research",
  },
  {
    label: "Neuro",
    value: "Neuro Research",
  },
  {
    label: "Circadian",
    value: "Circadian Research",
  },
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
        activeCategory === "All" ||
        product.category === activeCategory;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.desc.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-[#081526] text-white">
      {/* =========================================================
          TOP
      ========================================================= */}

      <section className="border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 pt-10 md:pt-12 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

            {/* TITLE */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-blue-300 font-semibold mb-2">
                Apexx Biolabs
              </p>

              <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em]">
                Products
              </h1>

              <p className="text-white/40 text-sm md:text-base mt-2 max-w-xl">
                Research compounds, storage essentials, and Apexx apparel.
              </p>
            </div>

            {/* SEARCH */}
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
                  className="
                    w-full
                    h-11
                    rounded-xl
                    border border-white/10
                    bg-white/[0.03]
                    pl-11 pr-4
                    text-sm
                    text-white
                    placeholder:text-white/30
                    outline-none
                    transition-all
                    focus:border-blue-300/40
                    focus:bg-white/[0.045]
                  "
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              QUICK LINKS
          ===================================================== */}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <a
              href="#apexx-gear"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-300
                px-4
                py-2.5
                text-[11px]
                font-bold
                text-[#081526]
                transition-all
                hover:bg-blue-200
              "
            >
              <Shirt size={14} />

              Shop Apexx Gear

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <Link
              href="/coas"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border border-white/10
                bg-white/[0.025]
                px-4
                py-2.5
                text-[11px]
                font-semibold
                text-white/55
                transition-all
                hover:border-white/20
                hover:text-white
              "
            >
              <FileText size={13} />

              View COAs
            </Link>
          </div>

          {/* =====================================================
              FILTERS
          ===================================================== */}

          <div className="mt-5 overflow-x-auto">
            <div className="flex min-w-max items-center gap-2 pb-1">
              {categories.map((category) => {
                const active = activeCategory === category.value;

                return (
                  <button
                    key={category.value}
                    onClick={() =>
                      setActiveCategory(category.value)
                    }
                    className={`
                      whitespace-nowrap
                      rounded-full
                      px-4
                      py-2
                      text-[11px]
                      font-semibold
                      transition-all
                      ${
                        active
                          ? "bg-white text-[#081526]"
                          : "border border-white/[0.08] bg-white/[0.02] text-white/45 hover:border-blue-300/30 hover:text-white"
                      }
                    `}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RESEARCH PRODUCTS
      ========================================================= */}

      <section className="max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-blue-300/70 font-semibold mb-1.5">
              Research Catalog
            </p>

            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              {activeCategory === "All"
                ? "Research Products"
                : categories.find(
                    (category) =>
                      category.value === activeCategory
                  )?.label}
            </h2>
          </div>

          <p className="text-[11px] text-white/30 whitespace-nowrap">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="
                  group
                  overflow-hidden
                  rounded-xl
                  border border-white/[0.07]
                  bg-white/[0.02]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-blue-300/25
                  hover:bg-white/[0.035]
                "
              >
                {/* IMAGE */}
                <div className="relative aspect-square overflow-hidden bg-[#06111f]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,197,253,0.07),transparent_70%)]" />

                  <img
                    src={product.image}
                    alt={product.name}
                    className="
                      relative
                      w-full
                      h-full
                      object-contain
                      p-4
                      md:p-6
                      transition-transform
                      duration-500
                      group-hover:scale-[1.035]
                    "
                  />
                </div>

                {/* INFO */}
                <div className="p-3.5 md:p-4">
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.16em] text-blue-300/65 mb-1.5 truncate">
                    {cleanCategory(product.category)}
                  </p>

                  <h3 className="text-sm md:text-base font-bold leading-tight truncate">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-[11px] md:text-xs text-white/40 truncate">
                    {product.desc}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[10px] md:text-[11px] font-semibold text-white/45 transition-colors group-hover:text-white">
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
            <p className="text-white/40 text-sm">
              No products found.
            </p>

            <button
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

      {/* =========================================================
          APEXX GEAR
      ========================================================= */}

      <section
        id="apexx-gear"
        className="border-t border-white/[0.07] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-10">

          {/* HEADER */}
          <div className="mb-5">
            <p className="text-[9px] uppercase tracking-[0.25em] text-blue-300/70 font-semibold mb-1.5">
              Beyond The Lab
            </p>

            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Apexx Gear
            </h2>

            <p className="text-white/35 text-xs md:text-sm mt-1">
              Storage essentials and branded apparel.
            </p>
          </div>

          {/* GEAR GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

            {/* =====================================================
                VIAL STORAGE CASE
            ===================================================== */}

            <Link
              href="/products/vial-storage-case"
              className="
                group
                grid
                grid-cols-[145px_1fr]
                sm:grid-cols-[175px_1fr]
                overflow-hidden
                rounded-xl
                border border-white/[0.07]
                bg-white/[0.02]
                transition-all
                duration-300
                hover:border-blue-300/25
                hover:bg-white/[0.035]
              "
            >
              {/* IMAGE */}
              <div className="relative h-[155px] sm:h-[175px] overflow-hidden bg-[#93C5FD]">
                <img
                  src="/images/vial-case.png"
                  alt="Apexx Biolabs Vial Storage Case"
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-[1.035]
                  "
                />
              </div>

              {/* INFO */}
              <div className="min-w-0 flex flex-col justify-between p-4">

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FlaskConical
                      size={11}
                      className="text-blue-300"
                    />

                    <p className="text-[8px] uppercase tracking-[0.2em] text-blue-300/70 font-semibold">
                      Accessory
                    </p>
                  </div>

                  <h3 className="text-base md:text-lg font-bold tracking-tight leading-tight">
                    Vial Storage Case
                  </h3>

                  <p className="text-blue-300 text-sm md:text-base font-bold mt-1">
                    $14.99
                  </p>

                  <p className="text-white/35 text-[11px] md:text-xs mt-1.5">
                    14-vial protective storage
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
                  <span className="text-[10px] font-semibold text-white/45 group-hover:text-white transition-colors">
                    View Product
                  </span>

                  <ArrowRight
                    size={13}
                    className="text-blue-300 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>

            {/* =====================================================
                SIGNATURE TEE
            ===================================================== */}

            <Link
              href="/products/apexx-shirt"
              className="
                group
                grid
                grid-cols-[145px_1fr]
                sm:grid-cols-[175px_1fr]
                overflow-hidden
                rounded-xl
                border border-white/[0.07]
                bg-white/[0.02]
                transition-all
                duration-300
                hover:border-blue-300/25
                hover:bg-white/[0.035]
              "
            >
              {/* IMAGE */}
              <div className="relative h-[155px] sm:h-[175px] overflow-hidden bg-[#93C5FD]">
                <img
                  src="/images/apexx-shirt-blue-front.png"
                  alt="Apexx Biolabs Signature Tee"
                  className="
                    w-full
                    h-full
                    object-cover
                    object-top
                    transition-transform
                    duration-500
                    group-hover:scale-[1.035]
                  "
                />
              </div>

              {/* INFO */}
              <div className="min-w-0 flex flex-col justify-between p-4">

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Shirt
                      size={11}
                      className="text-blue-300"
                    />

                    <p className="text-[8px] uppercase tracking-[0.2em] text-blue-300/70 font-semibold">
                      Apparel
                    </p>
                  </div>

                  <h3 className="text-base md:text-lg font-bold tracking-tight leading-tight">
                    Apexx Signature Tee
                  </h3>

                  <p className="text-blue-300 text-sm md:text-base font-bold mt-1">
                    $29.99
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <p className="text-white/35 text-[11px] md:text-xs">
                      100% Cotton · S–XL
                    </p>

                    <div className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#93C5FD] border border-white/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E8E1DA] border border-white/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#777863] border border-white/20" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
                  <span className="text-[10px] font-semibold text-white/45 group-hover:text-white transition-colors">
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

      {/* SMOOTH SCROLL */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  );
}