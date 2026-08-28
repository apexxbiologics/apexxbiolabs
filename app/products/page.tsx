"use client";

import { useState } from "react";
import { Search } from "lucide-react";

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
    "Lab Accessories",
  ];

  const products = [
    {
      name: "APX-3",
      desc: "10–20mg Research Peptide",
      category: "Metabolic Research",
      image: "/images/retatrutide.PNG",
      href: "/products/apx3",
      showCoa: true,
    },
    {
      name: "APX-2",
      desc: "30mg Research Peptide",
      category: "Metabolic Research",
      image: "/images/apx230.png",
      href: "/products/apx2",
      showCoa: true,
    },
    {
      name: "Wolverine",
      desc: "20mg Research Blend",
      category: "Tissue Repair Research",
      image: "/images/wolverine.png",
      href: "/products/wolverine",
      showCoa: true,
    },
    {
      name: "BPC-157",
      desc: "10mg Research Peptide",
      category: "Tissue Repair Research",
      image: "/images/bpc157.PNG",
      href: "/products/bpc157",
      showCoa: true,
    },
    {
      name: "TB-500",
      desc: "10mg Research Peptide",
      category: "Tissue Repair Research",
      image: "/images/tb500.PNG",
      href: "/products/tb500",
      showCoa: true,
    },
    {
      name: "KLOW",
      desc: "80mg Research Peptide",
      category: "Metabolic Research",
      image: "/images/klow.png",
      href: "/products/klow",
      showCoa: true,
    },
    {
      name: "Glutathione",
      desc: "1500mg Research Compound",
      category: "Cellular Research",
      image: "/images/glutathione1500.png",
      href: "/products/glutathione",
      showCoa: true,
    },
    {
      name: "KPV",
      desc: "10mg Research Peptide",
      category: "Tissue Repair Research",
      image: "/images/kpv.PNG",
      href: "/products/kpv",
      showCoa: true,
    },
    {
      name: "GHK-Cu",
      desc: "100mg Research Peptide",
      category: "Dermal Research",
      image: "/images/ghkcu.PNG",
      href: "/products/ghkcu",
      showCoa: true,
    },
    {
      name: "Tesamorelin",
      desc: "5–10mg Research Peptide",
      category: "Secretagogue Research",
      image: "/images/tesa5.png",
      href: "/products/tesamorelin",
      showCoa: true,
    },
    {
      name: "CJC/IPA Without DAC",
      desc: "10mg Research Peptide",
      category: "Secretagogue Research",
      image: "/images/cjcipa.PNG",
      href: "/products/cjcipa",
      showCoa: true,
    },
    {
      name: "MITO-X",
      desc: "120mg Research Blend",
      category: "Cellular Research",
      image: "/images/mitox120.png",
      href: "/products/mitox",
      showCoa: true,
    },
    {
      name: "NAD+",
      desc: "1000mg Research Compound",
      category: "Cellular Research",
      image: "/images/nad.png",
      href: "/products/nad",
      showCoa: true,
    },
    {
      name: "MOTS-C",
      desc: "10mg Research Peptide",
      category: "Cellular Research",
      image: "/images/motsc.PNG",
      href: "/products/motsc",
      showCoa: true,
    },
    {
      name: "5-Amino-1MQ",
      desc: "50mg Research Compound",
      category: "Metabolic Research",
      image: "/images/5amino1mq.png",
      href: "/products/5amino1mq",
      showCoa: true,
    },
    {
      name: "SS-31",
      desc: "10mg Research Peptide",
      category: "Cellular Research",
      image: "/images/ss3110.png",
      href: "/products/ss31",
      showCoa: true,
    },
    {
      name: "ARA-290",
      desc: "10mg Research Peptide",
      category: "Cellular Research",
      image: "/images/ara290.PNG",
      href: "/products/ara290",
      showCoa: true,
    },
    {
      name: "AOD-9604",
      desc: "10mg Research Peptide",
      category: "Metabolic Research",
      image: "/images/aod9604.png",
      href: "/products/aod9604",
      showCoa: true,
    },
    {
      name: "ADAMAX",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/adamax.PNG",
      href: "/products/adamax",
      showCoa: true,
    },
    {
      name: "NEURO-X",
      desc: "48mg Research Peptide Blend",
      category: "Neuro Research",
      image: "/images/neurox48.png",
      href: "/products/neurox",
      showCoa: true,
    },
    {
      name: "Semax",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/semax.PNG",
      href: "/products/semax",
      showCoa: true,
    },
    {
      name: "Selank",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/selank.PNG",
      href: "/products/selank",
      showCoa: true,
    },
    {
      name: "Pinealon",
      desc: "10mg Research Peptide",
      category: "Circadian Research",
      image: "/images/pinealon.PNG",
      href: "/products/pinealon",
      showCoa: true,
    },
    {
      name: "PE-22-28",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/pe2228.PNG",
      href: "/products/pe2228",
      showCoa: true,
    },
    {
      name: "Kisspeptin-10",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/kisspeptin10.png",
      href: "/products/kisspeptin10",
      showCoa: true,
    },
    {
      name: "PT-141",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/pt141.png",
      href: "/products/pt141",
      showCoa: true,
    },

    // VIAL STORAGE CASE
    {
      name: "Vial Storage Case",
      desc: "$14.99 • Protective Vial Storage",
      category: "Lab Accessories",
      image: "/images/vial-case.png",
      href: "/products/vial-storage-case",
      showCoa: false,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">
      {/* HERO */}
      <section className="relative px-6 pt-24 pb-20 bg-[#081526] border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.16),transparent_55%)]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-3 mb-8">
              <span className="h-2 w-2 rounded-full bg-blue-300" />

              <span className="text-blue-200 text-xs font-bold uppercase tracking-[0.28em]">
                Research Catalog
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.9] mb-8">
              Research
              <br />
              <span className="text-blue-300">Products.</span>
            </h1>

            <p className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
              Browse high-purity research compounds organized by category,
              with product details, COA access, and research-use documentation.
            </p>
          </div>

          {/* SEARCH + STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 items-end mt-12">
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
                className="w-full bg-[#101d2f] border border-blue-400/40 focus:border-blue-300 outline-none rounded-full pl-16 pr-6 py-5 text-white placeholder:text-white/45 shadow-[0_20px_80px_rgba(0,0,0,0.22)]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center">
                <p className="text-3xl font-black text-white">
                  {products.length}
                </p>

                <p className="text-white/45 text-xs uppercase tracking-widest mt-2">
                  Products
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center">
                <p className="text-3xl font-black text-white">COA</p>

                <p className="text-white/45 text-xs uppercase tracking-widest mt-2">
                  Access
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center">
                <p className="text-3xl font-black text-white">RUO</p>

                <p className="text-white/45 text-xs uppercase tracking-widest mt-2">
                  Only
                </p>
              </div>
            </div>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="mt-12 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-6 py-3 text-sm font-bold transition-all ${
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

      {/* PRODUCTS */}
      <section className="relative px-6 py-20 bg-[#081526] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.08),transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="uppercase tracking-[0.3em] text-blue-300 text-xs mb-4">
                {activeCategory === "Lab Accessories"
                  ? "Apexx Lab Accessories"
                  : "Available Research Materials"}
              </p>

              <h2 className="text-3xl md:text-5xl font-black text-white">
                {activeCategory === "All"
                  ? "Complete Catalog"
                  : activeCategory}
              </h2>
            </div>

            <p className="text-white/45 text-sm uppercase tracking-widest">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {filteredProducts.map((product) => (
              <div
                key={product.name}
                onClick={() => (window.location.href = product.href)}
                className="group cursor-pointer rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3 hover:bg-white/[0.07] hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative h-[360px] flex items-center justify-center rounded-[1.7rem] bg-[#06111f]/50 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-80 w-auto object-contain rounded-[28px] transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* ACCESSORY BADGE */}
                  {!product.showCoa && (
                    <div className="absolute top-4 left-4 rounded-full border border-blue-300/20 bg-[#081526]/80 backdrop-blur-md px-4 py-2">
                      <p className="text-blue-200 text-[10px] uppercase tracking-[0.2em] font-bold">
                        Accessory
                      </p>
                    </div>
                  )}
                </div>

                {/* PRODUCT DETAILS */}
                <div className="p-5 pt-7">
                  <p className="text-blue-300 text-xs uppercase tracking-widest mb-3">
                    {product.category}
                  </p>

                  <h2 className="text-2xl font-black text-white mb-3">
                    {product.name}
                  </h2>

                  <p
                    className={`text-white/60 ${
                      product.showCoa ? "mb-8" : "mb-2"
                    }`}
                  >
                    {product.desc}
                  </p>

                  {!product.showCoa && (
                    <p className="text-white/35 text-xs leading-relaxed mb-8">
                      Compact protective storage for organizing research vials.
                    </p>
                  )}

                  {/* BUTTONS */}
                  {product.showCoa ? (
                    <div className="flex gap-3">
                      <a
                        href="/coas"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 border border-white/10 bg-white/[0.04] text-white rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
                      >
                        COA
                      </a>

                      <a
                        href={product.href}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-white text-[#081526] rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-blue-100 transition-all"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <a
                      href={product.href}
                      onClick={(e) => e.stopPropagation()}
                      className="block w-full bg-white text-[#081526] rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-blue-100 transition-all"
                    >
                      View Case
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* NO RESULTS */}
          {filteredProducts.length === 0 && (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center mt-16">
              <p className="text-white/60 text-lg">
                No products found. Try another search or category.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}