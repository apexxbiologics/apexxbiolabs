"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  FlaskConical,
  Shirt,
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
          HEADER
      ========================================================= */}

      <section className="border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 pt-10 md:pt-14 pb-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* TITLE */}
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.28em] text-blue-300 font-semibold mb-3">
                Apexx Biolabs
              </p>

              <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em]">
                Products
              </h1>

              <p className="text-white/45 text-sm md:text-base mt-3 max-w-xl">
                Research compounds, storage essentials, and Apexx apparel.
              </p>
            </div>

            {/* SEARCH */}
            <div className="w-full lg:w-[360px]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  className="
                    w-full
                    h-12
                    rounded-xl
                    border border-white/10
                    bg-white/[0.035]
                    pl-11 pr-4
                    text-sm text-white
                    placeholder:text-white/30
                    outline-none
                    transition
                    focus:border-blue-300/50
                    focus:bg-white/[0.05]
                  "
                />
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mt-7 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max pb-1">
              {categories.map((category) => {
                const active = activeCategory === category.value;

                return (
                  <button
                    key={category.value}
                    onClick={() => setActiveCategory(category.value)}
                    className={`
                      whitespace-nowrap
                      rounded-full
                      px-4 py-2
                      text-xs font-semibold
                      transition-all
                      ${
                        active
                          ? "bg-blue-300 text-[#081526]"
                          : "border border-white/10 bg-white/[0.025] text-white/50 hover:text-white hover:border-white/20"
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

      <section className="max-w-7xl mx-auto px-5 md:px-6 py-9 md:py-11">
        {/* SECTION TITLE */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-blue-300/80 font-semibold mb-2">
              Research Catalog
            </p>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {activeCategory === "All"
                ? "Research Products"
                : categories.find(
                    (category) => category.value === activeCategory
                  )?.label}
            </h2>
          </div>

          <p className="text-xs text-white/35 whitespace-nowrap">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </p>
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filteredProducts.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border border-white/[0.08]
                  bg-white/[0.025]
                  transition-all duration-300
                  hover:border-blue-300/30
                  hover:bg-white/[0.04]
                  hover:-translate-y-0.5
                "
              >
                {/* IMAGE */}
                <div className="relative aspect-square bg-[#06111f] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,197,253,0.08),transparent_70%)]" />

                  <img
                    src={product.image}
                    alt={product.name}
                    className="
                      relative
                      w-full h-full
                      object-contain
                      p-5 md:p-7
                      transition-transform
                      duration-500
                      group-hover:scale-[1.04]
                    "
                  />
                </div>

                {/* INFO */}
                <div className="p-4 md:p-5">
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-blue-300/75 mb-2 truncate">
                    {cleanCategory(product.category)}
                  </p>

                  <h3 className="text-base md:text-lg font-bold leading-tight truncate">
                    {product.name}
                  </h3>

                  <p className="mt-1.5 text-xs md:text-sm text-white/45 truncate">
                    {product.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] md:text-xs font-semibold text-white/65 group-hover:text-blue-200 transition">
                      View Product
                    </span>

                    <ArrowRight
                      size={15}
                      className="text-blue-300 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-white/[0.08] rounded-2xl bg-white/[0.02]">
            <p className="text-white/45 text-sm">
              No products found.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-4 text-blue-300 text-sm font-semibold hover:text-blue-200"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* =========================================================
          APEXX GEAR
      ========================================================= */}

      <section className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-10 md:py-14">
          {/* SECTION TITLE */}
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-blue-300/80 font-semibold mb-2">
              Beyond The Lab
            </p>

            <div className="flex items-end justify-between gap-5">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Apexx Gear
                </h2>

                <p className="text-white/40 text-sm mt-2">
                  Storage essentials and branded apparel.
                </p>
              </div>
            </div>
          </div>

          {/* GEAR GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* =====================================================
                VIAL CASE
            ===================================================== */}

            <Link
              href="/products/vial-storage-case"
              className="
                group
                overflow-hidden
                rounded-2xl
                border border-white/[0.08]
                bg-white/[0.025]
                transition-all duration-300
                hover:border-blue-300/30
                hover:bg-white/[0.04]
              "
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#93C5FD]">
                <img
                  src="/images/vial-case.png"
                  alt="Apexx Biolabs Vial Storage Case"
                  className="
                    w-full h-full
                    object-cover
                    transition-transform duration-500
                    group-hover:scale-[1.025]
                  "
                />

                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-[#081526]/85 backdrop-blur-md px-3 py-1.5">
                  <FlaskConical
                    size={12}
                    className="text-blue-300"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em]">
                    Accessory
                  </span>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                      Vial Storage Case
                    </h3>

                    <p className="text-white/40 text-sm mt-1.5">
                      14-vial protective storage
                    </p>
                  </div>

                  <p className="text-lg font-bold text-blue-300 whitespace-nowrap">
                    $14.99
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.07] flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/65 group-hover:text-white">
                    View Product
                  </span>

                  <ArrowRight
                    size={16}
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
                overflow-hidden
                rounded-2xl
                border border-white/[0.08]
                bg-white/[0.025]
                transition-all duration-300
                hover:border-blue-300/30
                hover:bg-white/[0.04]
              "
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#93C5FD]">
                <img
                  src="/images/apexx-shirt-blue-front.png"
                  alt="Apexx Biolabs Signature Tee"
                  className="
                    w-full h-full
                    object-cover object-[center_20%]
                    transition-transform duration-500
                    group-hover:scale-[1.025]
                  "
                />

                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-[#081526]/85 backdrop-blur-md px-3 py-1.5">
                  <Shirt
                    size={12}
                    className="text-blue-300"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em]">
                    Apparel
                  </span>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                      Apexx Signature Tee
                    </h3>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mt-1.5">
                      <p className="text-white/40 text-sm">
                        100% Cotton · S–XL
                      </p>

                      {/* COLOR DOTS */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#93C5FD] border border-white/20" />
                        <span className="w-3 h-3 rounded-full bg-[#E8E1DA] border border-white/20" />
                        <span className="w-3 h-3 rounded-full bg-[#777863] border border-white/20" />
                      </div>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-blue-300 whitespace-nowrap">
                    $29.99
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.07] flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/65 group-hover:text-white">
                    View Product
                  </span>

                  <ArrowRight
                    size={16}
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