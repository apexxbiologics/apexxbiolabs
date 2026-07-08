"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
  Mail,
} from "lucide-react";

import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function APX3Page() {
  const [added, setAdded] = useState(false);
  const [selectedMg, setSelectedMg] = useState<"10mg" | "20mg">("10mg");
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [productData, setProductData] = useState({
    "10mg": {
      inventory: 0,
      price: 70,
    },
    "20mg": {
      inventory: 0,
      price: 130,
    },
  });

  const productOptions = {
    "10mg": {
      id: "APX-3-10mg",
      name: "APX-3 10mg",
      image: "/images/apx310blue.png",
    },
    "20mg": {
      id: "APX-3-20mg",
      name: "APX-3 20mg",
      image: "/images/apx320.png",
    },
  };

  const selectedProduct = productOptions[selectedMg];
  const selectedInventory = productData[selectedMg].inventory;
  const selectedPrice = productData[selectedMg].price;
  const inStock = selectedInventory > 0;

  const products = [
    { name: "APX-3", keywords: ["apx", "apx3", "apx-3"], path: "/products/apx3" },
    { name: "Adamax", keywords: ["adamax"], path: "/products/adamax" },
    { name: "ARA-290", keywords: ["ara", "ara290", "ara-290"], path: "/products/ara290" },
    { name: "Bacteriostatic Water", keywords: ["bac water", "water", "bacteriostatic"], path: "/products/bacwater" },
    { name: "BPC-157", keywords: ["bpc", "bpc157", "bpc-157"], path: "/products/bpc157" },
    { name: "CJC/IPA", keywords: ["cjc", "ipa", "cjc ipa", "cjc/ipa"], path: "/products/cjcipa" },
    { name: "GHK-Cu", keywords: ["ghk", "ghkcu", "ghk-cu"], path: "/products/ghkcu" },
    { name: "KPV", keywords: ["kpv"], path: "/products/kpv" },
    { name: "MOTS-C", keywords: ["mots", "motsc", "mots-c"], path: "/products/motsc" },
    { name: "PE-22-28", keywords: ["pe", "pe2228", "pe-22-28"], path: "/products/pe2228" },
    { name: "Pinealon", keywords: ["pinealon"], path: "/products/pinealon" },
    { name: "Selank", keywords: ["selank"], path: "/products/selank" },
    { name: "Semax", keywords: ["semax"], path: "/products/semax" },
    { name: "TB-500", keywords: ["tb", "tb500", "tb-500"], path: "/products/tb500" },
    { name: "Tesamorelin", keywords: ["tesa", "tesamorelin"], path: "/products/tesamorelin" },
  ];

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!data.success) return;

        const apx10 = data.products.find(
          (product: any) => product.slug === "apx3-10mg"
        );

        const apx20 = data.products.find(
          (product: any) => product.slug === "apx3-20mg"
        );

        setProductData({
          "10mg": {
            inventory: Number(apx10?.inventory ?? 0),
            price: Number(apx10?.price ?? 70),
          },
          "20mg": {
            inventory: Number(apx20?.inventory ?? 0),
            price: Number(apx20?.price ?? 130),
          },
        });
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };

    fetchProductData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchTerm.toLowerCase().trim();

    const match = products.find(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.keywords.some((keyword) => keyword.includes(query))
    );

    if (match) {
      window.location.href = match.path;
    }
  };

  const addToCart = () => {
    if (!inStock) return;

    const product = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedPrice,
      quantity,
      image: selectedProduct.image,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = existingCart.find(
      (item: any) => item.id === product.id
    );

    const updatedCart = existingProduct
      ? existingCart.map((item: any) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...existingCart, product];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      <section className="relative px-6 md:px-10 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 items-start">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[520px] h-[520px] rounded-[48px] overflow-hidden border border-blue-400/10 bg-white/[0.03] backdrop-blur-sm shadow-[0_0_30px_rgba(96,165,250,0.15)]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
                Research Peptide
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                {selectedProduct.name}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                A high-purity triple-agonist research peptide studied for its
                interaction with GIP, GLP-1, and glucagon receptor pathways in
                metabolic regulation and body composition research.
              </p>

              <p className="text-5xl font-black text-white mb-3">
                ${selectedPrice.toFixed(2)}
              </p>

              <div
                className={`font-semibold mb-8 ${
                  inStock ? "text-blue-300" : "text-red-300"
                }`}
              >
                {selectedInventory <= 5 && (
                  <div
                    className={`font-semibold mb-8 ${
                      selectedInventory <= 0 ? "text-red-300" : "text-yellow-300"
                    }`}
                  >
                    {selectedInventory <= 0 ? "Out of Stock" : "Limited Stock"}
                  </div>
                )}
              </div>

              <div className="h-px bg-white/10 mb-8" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Select Size
                  </p>

                  <div className="flex gap-3">
                    {(["10mg", "20mg"] as const).map((mg) => (
                      <button
                        key={mg}
                        onClick={() => {
                          setSelectedMg(mg);
                          setAdded(false);
                          setQuantity(1);
                        }}
                        className={`px-7 py-4 rounded-full border uppercase tracking-widest text-sm font-semibold transition-all ${
                          selectedMg === mg
                            ? "bg-white text-[#081526] border-white"
                            : "border-white/10 bg-white/[0.04] text-white/70 hover:border-blue-400/50 hover:text-white"
                        }`}
                      >
                        {mg}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Quantity
                  </p>

                  <div className="flex items-center w-fit rounded-full border border-white/10 bg-white/[0.04] p-2">
                    <button
                      onClick={() => {
                        setQuantity((prev) => Math.max(1, prev - 1));
                        setAdded(false);
                      }}
                      className="w-11 h-11 rounded-full text-2xl text-blue-300 hover:bg-white/[0.08]"
                    >
                      −
                    </button>

                    <div className="w-12 h-11 flex items-center justify-center text-lg font-bold">
                      {quantity}
                    </div>

                    <button
                      onClick={() => {
                        setQuantity((prev) =>
                          Math.min(selectedInventory || 1, prev + 1)
                        );
                        setAdded(false);
                      }}
                      disabled={!inStock}
                      className="w-11 h-11 rounded-full text-2xl text-blue-300 hover:bg-white/[0.08] disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7m16 0H4m16 0V8a1 1 0 00-1-1h-3.5M4 12V8a1 1 0 011-1h3.5m0 0a1.5 1.5 0 113 0m-3 0h3m0 0a1.5 1.5 0 113 0"
                    />
                  </svg>

                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                    FREE Bacteriostatic Water With Purchase of Any 4 Vials
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inStock ? (
                  <button
                    onClick={addToCart}
                    className="bg-white text-[#081526] hover:bg-blue-100 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={22} />
                    {added ? "Added To Cart" : "Add To Cart"}
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-white/[0.06] text-white/30 cursor-not-allowed rounded-full py-5 uppercase tracking-widest text-sm font-semibold"
                  >
                    Out of Stock
                  </button>
                )}

                <a
                  href="/cart"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  View Cart
                </a>

                <a
                  href="/products"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  Continue Shopping
                </a>

                <a
                  href={
                    selectedMg === "20mg"
                      ? "/images/coas/apx3-20mg-blue-cap-coa.pdf"
                      : "/coas"
                  }
                  target={selectedMg === "20mg" ? "_blank" : undefined}
                  rel={selectedMg === "20mg" ? "noopener noreferrer" : undefined}
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  View COA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedMg === "20mg" && (
        <section className="px-6 md:px-10 pb-16">
          <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="uppercase tracking-[0.35em] text-blue-300 text-xs mb-2">
                  Freedom Diagnostics
                </p>

                <h3 className="text-2xl font-black text-white mb-5">
                  Latest Certificate of Analysis
                </h3>

                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="text-green-400 font-semibold">
                      ✓ Identity Confirmed
                    </span>
                  </div>

                  <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <span className="text-[#A5D8FF] font-semibold">
                      99.92% Purity
                    </span>
                  </div>

                  <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <span className="text-[#A5D8FF] font-semibold">
                      23.89mg Content
                    </span>
                  </div>

                  <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <span className="text-white/70">Lot: Blue Cap-1</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end">
                <div className="text-5xl font-black text-[#A5D8FF]">
                  99.92%
                </div>

                <div className="uppercase tracking-widest text-white/40 text-xs mt-1">
                  Purity
                </div>

                <a
                  href="/images/coas/apx3-20mg-blue-cap-coa.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 rounded-full border border-blue-400/20 bg-blue-400/10 px-6 py-3 text-blue-300 font-semibold hover:bg-blue-400/20 transition-all"
                >
                  View Full COA
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            [FlaskConical, "Research Use Only", "Strictly for laboratory research."],
            [ShieldCheck, "Third-Party Tested", "Independent lab verified."],
            [ClipboardCheck, "Batch Documented", "Full transparency."],
            [ShieldCheck, "Quality Target", "99%+ purity target."],
          ].map(([Icon, title, text]: any) => (
            <div key={title} className="flex gap-4">
              <Icon className="text-blue-300" size={34} />

              <div>
                <h3 className="text-white uppercase tracking-widest font-bold text-sm">
                  {title}
                </h3>

                <p className="text-white/50 text-sm mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-3">
            Research Profile
          </p>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Triple-Agonist Pathway Overview
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            APX-3 is studied in laboratory research for its interaction with
            GIP, GLP-1, and glucagon receptor pathways, commonly evaluated in
            metabolic signaling, energy regulation, and body composition research.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              ["GIP Pathway", "Studied for incretin signaling and nutrient-response research."],
              ["GLP-1 Pathway", "Evaluated in metabolic regulation and glucose-response models."],
              ["Glucagon Pathway", "Researched for energy expenditure and metabolic balance."],
              ["Storage", "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 hover:border-blue-400/50 transition-all"
              >
                <h3 className="text-white text-lg font-bold mb-3">{title}</h3>

                <p className="text-white/60 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources & References */}
<section className="px-6 md:px-10 pb-16">
  <div className="max-w-7xl mx-auto">
    <div className="mb-10">
      <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
        Sources & References
      </p>

      <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
Scientific References
      </h2>

      <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
        Select peer-reviewed publications and clinical research resources
        related to retatrutide, a triple agonist studied in GIP, GLP-1, and
        glucagon receptor pathway research.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
{[
  {
    type: "Clinical Trial",
    source: "New England Journal of Medicine",
    title:
      "Triple-Hormone-Receptor Agonist Retatrutide for Obesity — A Phase 2 Trial",
    authors: "Jastreboff AM, et al.",
    year: "2023",
    url: "https://pubmed.ncbi.nlm.nih.gov/37366315/",
  },
  {
    type: "Clinical Trial",
    source: "The Lancet",
    title:
      "Retatrutide, a GIP, GLP-1 and Glucagon Receptor Agonist, for People with Type 2 Diabetes",
    authors: "Rosenstock J, et al.",
    year: "2023",
    url: "https://pubmed.ncbi.nlm.nih.gov/37385280/",
  },
  {
    type: "Liver Research",
    source: "Nature Medicine",
    title:
      "Triple Hormone Receptor Agonist Retatrutide for Metabolic Dysfunction-Associated Steatotic Liver Disease",
    authors: "Sanyal AJ, et al.",
    year: "2024",
    url: "https://pubmed.ncbi.nlm.nih.gov/38858523/",
  },
  {
    type: "Meta-Analysis",
    source: "Nutrition, Metabolism & Cardiovascular Diseases",
    title:
      "Effects of Once-Weekly Retatrutide on Weight and Metabolic Outcomes",
    authors: "Pasqualotto E, et al.",
    year: "2024",
    url: "https://pubmed.ncbi.nlm.nih.gov/39318607/",
  },
  {
    type: "Review Article",
    source: "Expert Opinion",
    title:
      "A Review of the Investigational Drug Retatrutide, a Novel Triple Agonist",
    authors: "Kaur M, et al.",
    year: "2024",
    url: "https://pubmed.ncbi.nlm.nih.gov/38367045/",
  },
  {
    type: "Clinical Registry",
    source: "ClinicalTrials.gov",
    title: "Retatrutide Clinical Trials Registry",
    authors: "ClinicalTrials.gov",
    year: "Ongoing",
    url: "https://clinicaltrials.gov/search?term=retatrutide",
  },
].map((paper) => (
        <a
          key={paper.title}
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-7 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
        >
          <div className="flex items-center justify-between gap-4 mb-5">
            <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-[#A5D8FF] text-xs font-bold uppercase tracking-widest">
              {paper.type}
            </span>

            <span className="text-white/40 text-sm">{paper.year}</span>
          </div>

          <p className="text-[#A5D8FF] text-xs font-bold uppercase tracking-[0.25em] mb-4">
            {paper.source}
          </p>

          <h3 className="text-xl font-black text-white leading-snug mb-5 group-hover:text-blue-200 transition-all">
            {paper.title}
          </h3>

          <p className="text-white/50 italic mb-6">{paper.authors}</p>

          <span className="text-[#A5D8FF] font-semibold">
            View Source →
          </span>
        </a>
      ))}
    </div>

    <p className="text-white/40 text-xs uppercase tracking-widest leading-relaxed mt-8">
      References are provided for educational research context only. Apexx
      Biolabs products are sold strictly for laboratory research use only.
    </p>
  </div>
</section>

      {/* Frequently Researched Together */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
              Related Research
            </p>

            <h2 className="text-3xl md:text-4xl font-black text-white">
              Frequently Researched Together
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/products/adamax"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/adamaxblue.PNG"
                  alt="Adamax"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                Adamax
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Research involving metabolic regulation and performance-focused laboratory models.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>

            <a
              href="/products/motsc"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/motscblue.png"
                  alt="MOTS-c"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                MOTS-c
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Studied in laboratory models involving mitochondrial signaling and metabolic research.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>

            <a
              href="/products/cjcipa"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/cjcipablue.png"
                  alt="CJC/IPA"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                CJC/IPA
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Research involving growth hormone signaling pathways and endocrine response models.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>
          </div>
        </div>
      </section>

      {[
        {
          title: "FDA Disclaimer",
          text:
            "These statements have not been evaluated by the U.S. Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only and are not for human or veterinary consumption.",
        },
        {
          title: "Customer Acknowledgment",
          text:
            "By purchasing this product, the customer acknowledges that this material is intended solely for lawful laboratory research purposes and will not be used for human consumption, veterinary use, medical use, diagnosis, treatment, cure, or prevention of disease. Apexx Biolabs does not provide dosing instructions, treatment recommendations, medical advice, or guidance regarding human use of any product.",
        },
      ].map((section) => (
        <section key={section.title} className="px-6 md:px-10 pb-16">
          <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
            <h3 className="text-blue-300 font-bold uppercase tracking-[0.25em] text-sm mb-4">
              {section.title}
            </h3>

            <p className="text-white/60 text-sm leading-relaxed">
              {section.text}
            </p>
          </div>
        </section>
      ))}

      <footer className="bg-[#081526] border-t border-white/10 px-6 md:px-10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
          <div>
            <img
              src="/images/logo.png"
              alt="Apexx Biolabs"
              className="h-12 w-auto mb-5"
            />

            <p className="text-white/60 text-sm leading-relaxed">
              Premium research-grade peptides built on science, quality, and transparency.
            </p>

<div className="flex gap-3 mt-6">
  <a
    href="https://www.tiktok.com/@apexx.nyc"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="TikTok"
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
  >
    <FaTiktok size={18} />
  </a>

  <a
    href="https://x.com/ApexxBiolabsLLC"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="X"
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
  >
    <FaXTwitter size={18} />
  </a>

  <a
    href="mailto:support@apexxbiolabs.com"
    aria-label="Email"
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
  >
    <HiOutlineMail size={18} />
  </a>
</div>
          </div>

          {[
            ["Shop", [["All Products", "/products"], ["Certificates of Analysis", "/coas"]]],
            ["Resources", [["Research Library", "/peptide-info"], ["FAQ", "/faq"]]],
            ["Support", [["Contact Us", "/contact"], ["Shipping Info", "/shipping"], ["Returns & Refunds", "/refunds"]]],
            ["Legal", [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]]],
          ].map(([title, links]: any) => (
            <div key={title}>
              <h4 className="text-white font-bold uppercase tracking-widest mb-5 text-sm">
                {title}
              </h4>

              <div className="space-y-3 text-white/50">
                {links.map(([label, href]: any) => (
                  <a key={label} href={href} className="block hover:text-blue-300">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-4 text-white/40 text-sm">
          <p>© 2026 Apexx Biolabs. All rights reserved.</p>
          <p>SSL Secured · 99%+ Purity · Research Use Only</p>
        </div>
      </footer>
    </main>
  );
}