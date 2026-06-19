"use client";

import { useState } from "react";

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
      name: "Bacteriostatic Water",
      desc: "Research Reconstitution Solution",
      category: "Research Solutions",
      image: "/images/bacwater.PNG",
      href: "/products/bacwater",
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
      name: "Pinealon",
      desc: "10mg Research Peptide",
      category: "Circadian Research",
      image: "/images/pinealon.PNG",
      href: "/products/pinealon",
    },
    {
      name: "Selank",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/selank.PNG",
      href: "/products/selank",
    },
    {
      name: "Semax",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/semax.PNG",
      href: "/products/semax",
    },
    {
      name: "MOTS-C",
      desc: "10mg Research Peptide",
      category: "Cellular Research",
      image: "/images/motsc.PNG",
      href: "/products/motsc",
    },
    {
      name: "ARA-290",
      desc: "10mg Research Peptide",
      category: "Cellular Research",
      image: "/images/ara290.PNG",
      href: "/products/ara290",
    },
    {
      name: "PE-22-28",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/pe2228.PNG",
      href: "/products/pe2228",
    },
    {
      name: "ADAMAX",
      desc: "10mg Research Peptide",
      category: "Neuro Research",
      image: "/images/adamax.PNG",
      href: "/products/adamax",
    },
    {
      name: "CJC/IPA Without DAC",
      desc: "10mg Research Peptide",
      category: "Secretagogue Research",
      image: "/images/cjcipa.PNG",
      href: "/products/cjcipa",
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
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-blue-900 bg-[#030712] px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/">
            <img
              src="/images/logo.png"
              alt=""
              className="h-12 w-auto"
            />
          </a>

          <a
            href="/"
            className="border border-blue-700 text-blue-400 px-5 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-all"
          >
            Home
          </a>
        </div>
      </header>

      <section className="px-6 py-20 bg-gradient-to-b from-[#030712] via-black to-black">
        <div className="max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-5">
            Research Catalog
          </p>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent mb-5">
            All Products
          </h1>

          <p className="text-gray-400 text-lg mb-12">
            Premium research compounds organized by research category.
          </p>

          <div className="relative max-w-xl mb-10">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050505] border border-blue-900 focus:border-blue-500 outline-none rounded-full px-6 py-4 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-14">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                  activeCategory === category
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.35)]"
                    : "bg-[#050505] border border-blue-900 text-gray-400 hover:border-blue-500 hover:text-blue-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {filteredProducts.map((product) => (
              <div
                key={product.name}
                onClick={() => (window.location.href = product.href)}
                className="cursor-pointer bg-[#050505] border border-blue-900/60 rounded-3xl overflow-hidden hover:border-blue-400 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="bg-black h-[360px] flex items-center justify-center border-b border-blue-950">
                  <img
                    src={product.image}
                    alt=""
                    className="h-72 object-contain hover:scale-105 transition-all duration-300"
                  />
                </div>

                <div className="p-7">
                  <p className="text-blue-400 text-xs uppercase tracking-widest mb-3">
                    {product.category}
                  </p>

                  <h2 className="text-2xl font-black mb-3">
                    {product.name}
                  </h2>

                  <p className="text-gray-400 mb-8">
                    {product.desc}
                  </p>

                  <div className="flex gap-3">
                    <a
                      href="/coas"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 border border-blue-700/70 text-blue-300 rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-all"
                    >
                      COA
                    </a>

                    <a
                      href={product.href}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-blue-600 text-white rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-blue-500 transition-all"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-gray-500 text-center mt-20">
              No products found.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}