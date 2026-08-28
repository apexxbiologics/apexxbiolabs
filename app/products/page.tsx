"use client";

import { useState } from "react";
import {
  Search,
  FlaskConical,
  Shirt,
  ArrowRight,
} from "lucide-react";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Metabolic Research",
    "Tissue Repair Research",
    "Dermal Research",
    "Secretagogue Research",
    "Cellular Research",
    "Neuro Research",
    "Circadian Research",
    "Research Solutions",
  ];

  const products = [
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.desc.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative px-6 pt-16 pb-12 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.16),transparent_55%)]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-3 mb-5">
              <span className="h-2 w-2 rounded-full bg-blue-300" />

              <span className="text-blue-200 text-xs font-bold uppercase tracking-[0.28em]">
                Research Catalog
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-5">
              Research
              <br />
              <span className="text-blue-300">
                Products.
              </span>
            </h1>

            <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-2xl">
              Browse high-purity research compounds organized by category,
              with product details, COA access, and research-use documentation.
            </p>
          </div>

          {/* SEARCH + STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 items-end mt-8">
            <div className="relative">
              <Search
                size={22}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-200/60"
              />

              <input
                type="text"
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#101d2f] border border-blue-400/40 focus:border-blue-300 outline-none rounded-2xl pl-14 pr-5 py-4 text-white placeholder:text-white/45 shadow-[0_20px_80px_rgba(0,0,0,0.22)]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
                <p className="text-2xl font-black">
                  {products.length}
                </p>

                <p className="text-white/45 text-xs uppercase tracking-widest mt-1">
                  Products
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
                <p className="text-2xl font-black">
                  COA
                </p>

                <p className="text-white/45 text-xs uppercase tracking-widest mt-1">
                  Access
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
                <p className="text-2xl font-black">
                  RUO
                </p>

                <p className="text-white/45 text-xs uppercase tracking-widest mt-1">
                  Only
                </p>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  activeCategory === category
                    ? "bg-white text-[#081526] shadow-[0_0_30px_rgba(255,255,255,0.18)]"
                    : "bg-white/[0.04] border border-white/10 text-white/55 hover:border-blue-400/50 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          RESEARCH PRODUCTS
      ========================================================= */}

      <section className="relative px-6 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.08),transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
            <div>
              <p className="uppercase tracking-[0.3em] text-blue-300 text-xs mb-4">
                Available Research Materials
              </p>

              <h2 className="text-2xl md:text-4xl font-black">
                {activeCategory === "All"
                  ? "Complete Catalog"
                  : activeCategory}
              </h2>
            </div>

            <p className="text-white/45 text-sm uppercase tracking-widest">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.name}
                onClick={() => (window.location.href = product.href)}
                className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.035] p-2.5 hover:bg-white/[0.06] hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/5] flex items-center justify-center rounded-xl bg-[#06111f]/50 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[88%] max-w-[88%] w-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-3.5 pt-4">
                  <p className="text-blue-300 text-[10px] uppercase tracking-[0.18em] mb-2">
                    {product.category}
                  </p>

                  <h2 className="text-lg md:text-xl font-bold mb-1.5">
                    {product.name}
                  </h2>

                  <p className="text-white/60 mb-5">
                    {product.desc}
                  </p>

                  <div className="flex gap-3">
                    <a
                      href="/coas"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 border border-white/10 bg-white/[0.04] text-white rounded-xl py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
                    >
                      COA
                    </a>

                    <a
                      href={product.href}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-white text-[#081526] rounded-xl py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] hover:bg-blue-100 transition-all"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center mt-16">
              <p className="text-white/60 text-lg">
                No products found. Try another search or category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          APEXX GEAR
      ========================================================= */}

      <section className="relative px-6 pb-16 pt-2">
        <div className="max-w-7xl mx-auto">
          {/* SECTION INTRO */}
          <div className="mb-5">
            <p className="uppercase tracking-[0.3em] text-blue-300 text-xs mb-4">
              Beyond The Lab
            </p>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Apexx{" "}
              <span className="text-blue-300">
                Gear.
              </span>
            </h2>

            <p className="mt-3 text-white/50 max-w-2xl text-sm md:text-base">
              Shop Apexx Biolabs storage essentials, accessories, and branded
              apparel.
            </p>
          </div>

          {/* =====================================================
              LAB ACCESSORIES
          ===================================================== */}

          <div className="relative rounded-2xl border border-blue-300/15 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-blue-500/[0.04] overflow-hidden p-3 md:p-4">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-400/10 blur-[100px]" />

            {/* HEADER */}
            <div className="relative z-10 flex items-center gap-4 mb-5">
              <div className="h-10 w-10 rounded-xl border border-blue-300/20 bg-blue-400/10 flex items-center justify-center">
                <FlaskConical
                  size={21}
                  className="text-blue-300"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-300 mb-1">
                  Apexx Essentials
                </p>

                <h3 className="text-2xl md:text-2xl font-black">
                  Lab Accessories
                </h3>
              </div>
            </div>

            {/* VIAL CASE */}
            <div
              onClick={() =>
                (window.location.href =
                  "/products/vial-storage-case")
              }
              className="relative z-10 group cursor-pointer grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] overflow-hidden rounded-2xl border border-white/10 bg-[#071321]/80 hover:border-blue-400/40 transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="p-4">
                <div className="relative overflow-hidden rounded-xl bg-[#93C5FD] aspect-[16/10]">
                  <img
                    src="/images/vial-case.png"
                    alt="Apexx Biolabs Vial Storage Case"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  <div className="absolute top-5 left-5 rounded-full border border-white/30 bg-[#081526]/75 backdrop-blur-md px-4 py-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                      Lab Accessory
                    </span>
                  </div>
                </div>
              </div>

              {/* INFO */}
              <div className="flex flex-col justify-center p-5 md:p-7">
                <p className="text-blue-300 text-xs uppercase tracking-[0.24em] mb-4">
                  Protective Storage
                </p>

                <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                  Vial Storage Case
                </h3>

                <p className="text-blue-300 text-xl font-bold mt-3">
                  $14.99
                </p>

                <p className="text-white/55 text-sm leading-relaxed mt-3 max-w-lg">
                  Compact protective storage designed to keep research
                  vials organized in one clean, secure case.
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/60">
                    14 Vial Capacity
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/60">
                    Protective Design
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/60">
                    Apexx Branded
                  </span>
                </div>

                <a
                  href="/products/vial-storage-case"
                  onClick={(e) => e.stopPropagation()}
                  className="group/button mt-5 inline-flex w-full sm:w-fit items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#081526] hover:bg-blue-100 transition-all"
                >
                  View Case

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover/button:translate-x-1"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* =====================================================
              APPAREL
          ===================================================== */}

          <div className="relative mt-7 rounded-2xl border border-blue-300/15 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-blue-500/[0.035] overflow-hidden p-3 md:p-4">
            <div className="pointer-events-none absolute left-1/3 top-0 h-64 w-64 rounded-full bg-blue-500/[0.07] blur-[100px]" />

            {/* HEADER */}
            <div className="relative z-10 flex items-center gap-4 mb-5">
              <div className="h-10 w-10 rounded-xl border border-blue-300/20 bg-blue-400/10 flex items-center justify-center">
                <Shirt
                  size={21}
                  className="text-blue-300"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-300 mb-1">
                  Apexx Apparel
                </p>

                <h3 className="text-2xl md:text-2xl font-black">
                  Apparel
                </h3>
              </div>
            </div>

            {/* =====================================================
                SHIRT FEATURE CARD
            ===================================================== */}

            <div
              onClick={() =>
                (window.location.href = "/products/apexx-shirt")
              }
              className="relative z-10 group cursor-pointer grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] overflow-hidden rounded-2xl border border-white/10 bg-[#071321]/80 hover:border-blue-400/40 transition-all duration-300"
            >
              {/* =================================================
                  IMAGE SIDE
              ================================================= */}

              <div className="p-3 md:p-4 flex items-center justify-center">
                <div className="relative w-full max-w-[360px] overflow-hidden rounded-xl bg-[#93C5FD]">
                  <img
                    src="/images/apexx-shirt-blue-front.png"
                    alt="Apexx Biolabs Signature Tee"
                    className="w-full aspect-[4/5] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  {/* BADGE */}
                  <div className="absolute top-5 left-5 rounded-full border border-white/25 bg-[#081526]/80 backdrop-blur-md px-4 py-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                      Apexx Apparel
                    </span>
                  </div>

                  {/* COLOR DOTS */}
                  <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-[#081526]/80 px-4 py-2 backdrop-blur-md">
                    <span className="h-3.5 w-3.5 rounded-full border border-white/20 bg-[#93C5FD]" />

                    <span className="h-3.5 w-3.5 rounded-full border border-white/20 bg-[#E8E1DA]" />

                    <span className="h-3.5 w-3.5 rounded-full border border-white/20 bg-[#777863]" />
                  </div>
                </div>
              </div>

              {/* =================================================
                  INFO SIDE
              ================================================= */}

              <div className="flex flex-col justify-center p-5 md:p-7 lg:p-12">
                <p className="text-blue-300 text-xs uppercase tracking-[0.24em] mb-4">
                  Signature Collection
                </p>

                <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-[0.95]">
                  Apexx Biolabs
                  <br />

                  <span className="text-blue-300">
                    Signature Tee
                  </span>
                </h3>

                <p className="text-white text-2xl font-black mt-4">
                  $29.99
                </p>

                <p className="text-white/55 text-sm leading-relaxed mt-3 max-w-xl">
                  A clean everyday tee featuring minimal Apexx Biolabs
                  branding on the front and our signature vertical Apexx
                  graphic across the back.
                </p>

                {/* PRODUCT INFO */}
                <div className="mt-5 grid grid-cols-2 gap-2 max-w-lg">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1">
                      Material
                    </p>

                    <p className="font-bold text-white">
                      100% Cotton
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1">
                      Sizes
                    </p>

                    <p className="font-bold text-white">
                      S – XL
                    </p>
                  </div>
                </div>

                {/* COLORS */}
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3">
                    Available Colors
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/65">
                      <span className="h-3 w-3 rounded-full bg-[#93C5FD]" />
                      Apexx Blue
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/65">
                      <span className="h-3 w-3 rounded-full border border-black/10 bg-[#E8E1DA]" />
                      Ivory
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/65">
                      <span className="h-3 w-3 rounded-full bg-[#777863]" />
                      Olive
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                <a
                  href="/products/apexx-shirt"
                  onClick={(e) => e.stopPropagation()}
                  className="group/button mt-5 inline-flex w-full sm:w-fit items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#081526] hover:bg-blue-100 transition-all"
                >
                  Shop Tee

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover/button:translate-x-1"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}