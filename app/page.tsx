"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");

const [disclaimerChecked, setDisclaimerChecked] = useState(false);

    const [cartCount, setCartCount] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const productScrollRef = useRef<HTMLDivElement | null>(null);
    const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
const [activeQuality, setActiveQuality] = useState("potency");

const startProductScroll = (direction: "left" | "right") => {
  stopProductScroll();

  autoScrollRef.current = setInterval(() => {
    productScrollRef.current?.scrollBy({
      left: direction === "left" ? -18 : 18,
    });
  }, 16);
};

const stopProductScroll = () => {
  if (autoScrollRef.current) {
    clearInterval(autoScrollRef.current);
    autoScrollRef.current = null;
  }
};

const products = [
  { name: "APX-3", href: "/products/apx3" },
  { name: "BPC-157", href: "/products/bpc157" },
  { name: "TB-500", href: "/products/tb500" },
  { name: "Bacteriostatic Water", href: "/products/bacwater" },
  { name: "KPV", href: "/products/kpv" },
  { name: "GHK-Cu", href: "/products/ghkcu" },
  { name: "Pinealon", href: "/products/pinealon" },
  { name: "Selank", href: "/products/selank" },
  { name: "Semax", href: "/products/semax" },
  { name: "MOTS-C", href: "/products/motsc" },
{ name: "ARA-290", href: "/products/ara290" },
{ name: "PE-22-28", href: "/products/pe2228" },
{ name: "ADAMAX", href: "/products/adamax" },
{ name: "CJC/IPA Without DAC", href: "/products/cjcipa" },
];

const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);

  const [accepted, setAccepted] = useState<boolean | null>(null);

useEffect(() => {
  const navEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;

  const isRefresh = navEntry?.type === "reload";

  const cameFromInternalPage =
    document.referrer &&
    document.referrer.includes(window.location.origin) &&
    !document.referrer.endsWith("/");

  if (isRefresh) {
    setAccepted(false);
  } else if (cameFromInternalPage) {
    setAccepted(true);
  } else {
    setAccepted(false);
  }
}, []);

useEffect(() => {
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const count = cart.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );

    setCartCount(count);
  };

  updateCartCount();

  window.addEventListener("storage", updateCartCount);
  window.addEventListener("cartUpdated", updateCartCount);

  return () => {
    window.removeEventListener("storage", updateCartCount);
    window.removeEventListener("cartUpdated", updateCartCount);
  };
}, []);
useEffect(() => {
  const video = videoRef.current;

  if (!video) return;

  video.muted = true;

  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}, [accepted]);

const handleAccept = () => {
  setAccepted(true);
};

if (accepted === null) {
  return null;
}

  return (
    <>
{!accepted && (
  <div className="fixed inset-0 z-[999] bg-black flex items-start md:items-center justify-center px-4 py-6 overflow-y-auto">
    <div className="w-full max-w-2xl border border-blue-900 bg-[#050505] p-6 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.18)]">
      
      <div className="text-center mb-8">
        <img
          src="/images/logo.png"
          alt="Apexx Biolabs"
          className="h-16 w-auto mx-auto mb-6"
        />

        <p className="uppercase tracking-[0.4em] text-blue-500 text-xs mb-4">
          Research Use Verification
        </p>

        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent">
          Welcome to Apexx Biolabs
        </h1>

        <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
          Before entering, please confirm that you understand our products are
          intended strictly for lawful laboratory research use only.
        </p>
      </div>

      <div className="border border-blue-950 bg-black/50 rounded-2xl p-5 md:p-6 mb-6">
        <p className="text-gray-300 text-sm leading-relaxed mb-5">
          Products sold on this website are NOT intended for human consumption,
          medical use, veterinary use, diagnosis, treatment, cure, or prevention
          of disease.
        </p>

        <label className="flex items-start gap-3 cursor-pointer border border-blue-900 rounded-xl p-4 bg-[#030712]">
          <input
            type="checkbox"
            checked={disclaimerChecked}
            onChange={(e) => setDisclaimerChecked(e.target.checked)}
            className="mt-1"
          />

          <span className="text-gray-300 text-sm leading-relaxed">
            I confirm that I am at least 21 years of age and understand that
            all products sold by Apexx Biolabs are intended strictly for lawful
            laboratory research use only.
          </span>
        </label>
      </div>

      <button
        onClick={handleAccept}
        disabled={!disclaimerChecked}
        className={`w-full py-4 uppercase tracking-widest text-sm font-semibold rounded-xl transition-all ${
          disclaimerChecked
            ? "bg-blue-600 hover:bg-blue-500 text-white"
            : "bg-gray-800 text-gray-500 cursor-not-allowed"
        }`}
      >
        Enter Apexx Biolabs
      </button>
    </div>
  </div>
)}

<main className="min-h-screen bg-[#081526] text-white">
{/* HEADER */}
<header className="fixed top-0 left-0 w-full z-50 border-b border-blue-900/70 bg-[#081526]/95 backdrop-blur-xl px-4 md:px-8 py-4">
  <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
    <a href="/">
      <img
        src="/images/logo.png"
        alt="Apexx Biolabs"
        className="h-12 md:h-14 w-auto"
      />
    </a>

    <div className="hidden md:block relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#050505] border border-blue-900 focus:border-blue-500 outline-none rounded-xl px-5 py-3 text-white placeholder:text-gray-500 text-sm"
      />

      {search && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#030712] border border-blue-900 rounded-xl overflow-hidden z-[999]">
          {filteredProducts.map((product) => (
<a
  key={product.name}
  href={product.href}
  className="block min-w-[290px] md:min-w-[340px] group"
>
              {product.name}
            </a>
          ))}
        </div>
      )}
    </div>

    <nav className="flex items-center gap-3 text-xs uppercase tracking-widest">
      <a
        href="/"
        className="border border-blue-700 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition-all"
      >
        Home
      </a>

      <a
        href="/products"
        className="border border-blue-700 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition-all"
      >
        Products
      </a>

      <a
        href="/cart"
        className="relative flex items-center justify-center w-12 h-12 border border-blue-700 rounded-xl hover:bg-blue-700 transition-all"
      >
        <ShoppingCart size={22} className="text-blue-400" />

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </a>
    </nav>
  </div>
</header>

{/* HERO */}
<section className="relative pt-36 pb-28 px-6 bg-[#081526] overflow-hidden">
  <div
    className="absolute right-0 top-0 h-full w-full lg:w-[75%] bg-cover opacity-90"
    style={{
      backgroundImage: "url('/images/hero-vial-right.png')",
      backgroundPosition: "75% center",
    }}
  />

  <div className="absolute inset-0 bg-gradient-to-r from-[#081526] via-[#081526]/90 to-transparent" />
  <div className="absolute inset-0 bg-gradient-to-b from-[#081526]/10 via-transparent to-[#081526]" />

  <div className="relative z-10 max-w-7xl mx-auto py-24 flex items-center">
    {/* keep all your current hero text/buttons/cards here */}
  </div>
</section>

{/* PRODUCTS */}
<section
  id="shop"
  className="relative -mt-1 py-28 px-6 md:px-10 bg-gradient-to-b from-[#081526] via-[#0B1F38] to-[#081526] text-white"
>
  <div className="max-w-7xl mx-auto">
    <div className="flex items-end justify-between mb-12">
      <div>
        <p className="uppercase tracking-[0.4em] text-blue-400 text-sm mb-5">
          Research Catalog
        </p>

        <h3 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent">
          Featured Compounds
        </h3>

        <p className="text-gray-400 mt-5 text-lg">
          Research peptides, third-party identity tested, and batch documented.
        </p>
      </div>

      <a
        href="/products"
        className="hidden md:inline-flex border border-slate-500/70 text-slate-200 rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all"
      >
        View all
      </a>
    </div>

    <div className="relative">
      <button
        onMouseEnter={() => startProductScroll("left")}
        onMouseLeave={stopProductScroll}
        onClick={() =>
          productScrollRef.current?.scrollBy({
            left: -360,
            behavior: "smooth",
          })
        }
        className="hidden md:flex absolute left-0 top-[38%] -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-slate-500/70 bg-black/70 backdrop-blur items-center justify-center text-3xl text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
      >
        ‹
      </button>

      <div
        ref={productScrollRef}
        className="flex gap-7 overflow-x-auto scroll-smooth pb-6 px-1 md:px-20 no-scrollbar"
      >
        {[
          {
            name: "APX-3",
            desc: "10–20mg Research Peptide",
            image: "/images/retatrutide.PNG",
            href: "/products/apx3",
            bg: "from-[#56657a] via-[#334155] to-[#111827]",
          },
          {
            name: "BPC-157",
            desc: "10mg Research Peptide",
            image: "/images/bpc157.PNG",
            href: "/products/bpc157",
            bg: "from-[#4f6f64] via-[#334155] to-[#111827]",
          },
          {
            name: "TB-500",
            desc: "10mg Research Peptide",
            image: "/images/tb500.PNG",
            href: "/products/tb500",
            bg: "from-[#4e6a7d] via-[#334155] to-[#111827]",
          },
          {
            name: "Bacteriostatic Water",
            desc: "Research Reconstitution Solution",
            image: "/images/bacwater.PNG",
            href: "/products/bacwater",
            bg: "from-[#5b6475] via-[#334155] to-[#111827]",
          },
          {
            name: "KPV",
            desc: "10mg Research Peptide",
            image: "/images/kpv.PNG",
            href: "/products/kpv",
            bg: "from-[#536b5c] via-[#334155] to-[#111827]",
          },
          {
            name: "GHK-Cu",
            desc: "100mg Research Peptide",
            image: "/images/ghkcu.PNG",
            href: "/products/ghkcu",
            bg: "from-[#52718a] via-[#334155] to-[#111827]",
          },
          {
            name: "Pinealon",
            desc: "10mg Research Peptide",
            image: "/images/pinealon.PNG",
            href: "/products/pinealon",
            bg: "from-[#5f687a] via-[#334155] to-[#111827]",
          },
          {
            name: "Selank",
            desc: "10mg Research Peptide",
            image: "/images/selank.PNG",
            href: "/products/selank",
            bg: "from-[#56657a] via-[#334155] to-[#111827]",
          },
          {
            name: "Semax",
            desc: "10mg Research Peptide",
            image: "/images/semax.PNG",
            href: "/products/semax",
            bg: "from-[#56657a] via-[#334155] to-[#111827]",
          },
          {
            name: "MOTS-C",
            desc: "10mg Research Peptide",
            image: "/images/motsc.PNG",
            href: "/products/motsc",
            bg: "from-[#4e6a7d] via-[#334155] to-[#111827]",
          },
          {
            name: "ARA-290",
            desc: "10mg Research Peptide",
            image: "/images/ara290.PNG",
            href: "/products/ara290",
            bg: "from-[#536b5c] via-[#334155] to-[#111827]",
          },
          {
            name: "PE-22-28",
            desc: "10mg Research Peptide",
            image: "/images/pe2228.PNG",
            href: "/products/pe2228",
            bg: "from-[#5f687a] via-[#334155] to-[#111827]",
          },
          {
            name: "ADAMAX",
            desc: "10mg Research Peptide",
            image: "/images/adamax.PNG",
            href: "/products/adamax",
            bg: "from-[#52718a] via-[#334155] to-[#111827]",
          },
          {
            name: "CJC/IPA Without DAC",
            desc: "10mg Research Peptide",
            image: "/images/cjcipa.PNG",
            href: "/products/cjcipa",
            bg: "from-[#56657a] via-[#334155] to-[#111827]",
          },
        ].map((product) => (
          <div
            key={product.name}
            className="min-w-[290px] md:min-w-[340px] group"
          >
            <a href={product.href} className="block">
<div className="relative overflow-hidden rounded-[34px]">
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-[430px] object-cover rounded-[34px] transition-transform duration-500 group-hover:scale-105"
  />
</div>
            </a>

            <div className="pt-6 px-1">
              <h4 className="text-2xl font-black text-white mb-3">
                {product.name}
              </h4>

              <p className="text-gray-400 mb-8">
                {product.desc}
              </p>

              <div className="flex gap-3">
                <a
                  href="/coas"
                  className="flex-1 border border-slate-500 text-white rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-slate-700 transition-all"
                >
                  COA
                </a>

                <a
                  href={product.href}
                  className="flex-1 bg-white text-black rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onMouseEnter={() => startProductScroll("right")}
        onMouseLeave={stopProductScroll}
        onClick={() =>
          productScrollRef.current?.scrollBy({
            left: 360,
            behavior: "smooth",
          })
        }
        className="hidden md:flex absolute right-0 top-[38%] -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-slate-500/70 bg-black/70 backdrop-blur items-center justify-center text-3xl text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
      >
        ›
      </button>
    </div>
  </div>
</section>

  {/* QUALITY VERIFICATION */}
<section className="py-32 px-6 bg-gradient-to-b from-[#081526] via-[#0B1F38] to-[#081526] border-b border-blue-950">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

    <div>
      <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
        Quality Verification
      </p>

      <h2 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent mb-6">
        Quality You Can Verify.
      </h2>

      <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl">
        Every batch is supported by documentation and analytical review for
        research-focused consistency, purity, and transparency.
      </p>

      <div className="grid grid-cols-3 gap-6 mb-10 border-y border-blue-950 py-8">
        <div>
          <p className="text-3xl font-black text-white">99%+</p>
          <p className="text-gray-500 text-sm mt-1">Purity Target</p>
        </div>

        <div>
          <p className="text-3xl font-black text-white">HPLC</p>
          <p className="text-gray-500 text-sm mt-1">Analysis</p>
        </div>

        <div>
          <p className="text-3xl font-black text-white">COA</p>
          <p className="text-gray-500 text-sm mt-1">Batch Records</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { id: "potency", label: "Potency" },
          { id: "purity", label: "Purity" },
          { id: "stability", label: "Stability" },
          { id: "safety", label: "Safety" },
          { id: "consistency", label: "Consistency" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveQuality(item.id)}
            className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-widest transition-all ${
              activeQuality === item.id
                ? "bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.45)]"
                : "bg-[#050505] border border-blue-900 text-gray-400 hover:border-blue-500 hover:text-blue-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="border border-blue-900/70 bg-[#050505] rounded-3xl p-8">
        {activeQuality === "potency" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Verified Potency
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Analytical testing helps confirm that each batch aligns with the
              stated research concentration and identity specifications.
            </p>
            <div className="border-l-4 border-blue-500 bg-black rounded-xl p-5 text-gray-300">
              <strong className="text-white">Why it matters:</strong> Supports
              consistent research preparation and batch-to-batch confidence.
            </div>
          </div>
        )}

        {activeQuality === "purity" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Purity Documentation
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              COAs provide batch-level information so researchers can review
              purity data before use in laboratory settings.
            </p>
            <div className="border-l-4 border-blue-500 bg-black rounded-xl p-5 text-gray-300">
              <strong className="text-white">Why it matters:</strong> Clear
              documentation helps support transparency and trust.
            </div>
          </div>
        )}

        {activeQuality === "stability" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Stability-Focused Handling
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Products are packaged with research storage and handling standards
              in mind to help preserve batch integrity.
            </p>
            <div className="border-l-4 border-blue-500 bg-black rounded-xl p-5 text-gray-300">
              <strong className="text-white">Why it matters:</strong> Proper
              handling supports reliable research workflows.
            </div>
          </div>
        )}

        {activeQuality === "safety" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Research-Use Standards
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Apexx Biolabs products are intended strictly for lawful laboratory
              research use only and are not for human or veterinary use.
            </p>
            <div className="border-l-4 border-blue-500 bg-black rounded-xl p-5 text-gray-300">
              <strong className="text-white">Why it matters:</strong> Clear
              use limitations keep the catalog research-focused.
            </div>
          </div>
        )}

        {activeQuality === "consistency" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Batch Consistency
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Batch records and testing documentation help support consistency
              across research materials.
            </p>
            <div className="border-l-4 border-blue-500 bg-black rounded-xl p-5 text-gray-300">
              <strong className="text-white">Why it matters:</strong> Consistent
              records help researchers compare and track batches.
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="relative">
      <div className="relative rounded-[2rem] border border-blue-900 bg-[#050505] p-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-black"></div>

        <div className="relative z-10 flex justify-end mb-6">
          <div className="bg-black border border-blue-800 rounded-2xl px-5 py-4">
            <p className="text-white font-black">99%+ Purity</p>
            <p className="text-gray-500 text-sm">Verified by HPLC</p>
          </div>
        </div>

        <img
          src="/images/tb500.PNG"
          alt=""
          className="relative z-10 mx-auto h-[420px] object-contain"
        />

        <a
          href="/coas"
          className="relative z-10 mt-8 flex items-center justify-between bg-black border border-blue-900 rounded-2xl px-6 py-5 hover:border-blue-400 transition-all"
        >
          <div>
            <p className="text-white font-bold">See the Proof</p>
            <p className="text-gray-500 text-sm">View batch documentation</p>
          </div>

          <span className="text-blue-400 text-2xl">›</span>
        </a>
      </div>
    </div>

  </div>
</section>

<section className="py-16 px-6 border-t border-[#1E3A5F] border-b border-[#1E3A5F] bg-[#081526]">
  <div className="max-w-6xl mx-auto text-center">

    <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
      About Apexx
    </p>

    <h2 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent mb-8">
      Scientific Precision.
      <br />
      Trusted Quality.
    </h2>

    <div className="h-[1px] w-64 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-10"></div>

    <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed mb-16">
      Apexx Biolabs specializes in high-purity research compounds
      manufactured under strict analytical standards. Every batch undergoes
      rigorous verification to support purity, consistency, and reliability
      for laboratory research applications.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border border-blue-900 rounded-2xl p-8 bg-[#050505]">
        <div className="text-blue-400 text-3xl mb-4">✓</div>
        <h3 className="text-xl font-bold mb-3">
          Third-Party Testing
        </h3>
        <p className="text-gray-400">
          Independent analytical verification supporting transparency and consistency.
        </p>
      </div>

      <div className="border border-blue-900 rounded-2xl p-8 bg-[#050505]">
        <div className="text-blue-400 text-3xl mb-4">⚗</div>
        <h3 className="text-xl font-bold mb-3">
          Research Standards
        </h3>
        <p className="text-gray-400">
          Manufactured and handled according to strict laboratory quality practices.
        </p>
      </div>

      <div className="border border-blue-900 rounded-2xl p-8 bg-[#050505]">
        <div className="text-blue-400 text-3xl mb-4">🔬</div>
        <h3 className="text-xl font-bold mb-3">
          Batch Transparency
        </h3>
        <p className="text-gray-400">
          COAs and supporting documentation available for verified batches.
        </p>
      </div>
    </div>

  </div>
</section>

<footer className="bg-[#081526] border-t border-[#1E3A5F] px-6 pt-20 pb-8">  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
      <div>
        <img
          src="/images/logo.png"
          alt="Apexx Biolabs"
          className="h-14 w-auto mb-6"
        />

        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Research materials built on science, quality, and trust. Batch
          documentation and quality-focused support for laboratory research.
        </p>

        <div className="flex gap-3">
          <a
            href="https://www.tiktok.com/@apexx.nyc"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-blue-800 bg-[#050505] flex items-center justify-center hover:bg-blue-700 transition-all"
          >
            <span className="text-white font-black text-sm">♪</span>
          </a>

          <a
            href="mailto:support@apexxbiolabs.com"
            className="w-11 h-11 rounded-full border border-blue-800 bg-[#050505] flex items-center justify-center hover:bg-blue-700 transition-all"
          >
            <span className="text-white text-lg">✉</span>
          </a>
        </div>
      </div>

      <div>
        <h4 className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">
          Shop
        </h4>
        <div className="space-y-4 text-gray-400">
          <a href="/products" className="block hover:text-blue-300 transition-all">All Products</a>
          <a href="/coas" className="block hover:text-blue-300 transition-all">Certificates of Analysis</a>
          <a href="/process" className="block hover:text-blue-300 transition-all">Our Process</a>
        </div>
      </div>

      <div>
        <h4 className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">
          Research
        </h4>
        <div className="space-y-4 text-gray-400">
          <a href="/peptide-info" className="block hover:text-blue-300 transition-all">Peptide Info</a>
          <a href="/faq" className="block hover:text-blue-300 transition-all">FAQs</a>
          <a href="/coas" className="block hover:text-blue-300 transition-all">COAs</a>
        </div>
      </div>

      <div>
        <h4 className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">
          Support
        </h4>
        <div className="space-y-4 text-gray-400">
          <a href="/contact" className="block hover:text-blue-300 transition-all">Contact Us</a>
          <a href="/shipping" className="block hover:text-blue-300 transition-all">Shipping Policy</a>
          <a href="/refunds" className="block hover:text-blue-300 transition-all">Refund Policy</a>
          <a href="mailto:support@apexxbiolabs.com" className="block hover:text-blue-300 transition-all">
            support@apexxbiolabs.com
          </a>
        </div>
      </div>

      <div>
        <h4 className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">
          Legal
        </h4>
        <div className="space-y-4 text-gray-400">
          <a href="/privacy" className="block hover:text-blue-300 transition-all">Privacy Policy</a>
          <a href="/terms" className="block hover:text-blue-300 transition-all">Terms & Conditions</a>
          <a href="/refunds" className="block hover:text-blue-300 transition-all">Returns & Refunds</a>
          <a href="/shipping" className="block hover:text-blue-300 transition-all">Shipping Info</a>
        </div>
      </div>
    </div>

    <div className="border-t border-blue-950 pt-8 mb-8">
      <p className="max-w-5xl text-gray-500 text-xs uppercase tracking-widest leading-relaxed">
        FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION.
        NOT FOR MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
      </p>
    </div>

    <div className="border-t border-blue-950 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
      <p className="text-gray-500 text-sm">
        © 2026 Apexx Biolabs. All rights reserved.
      </p>

      <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm">
        <span>SSL Secured</span>
        <span>99%+ Purity</span>
        <span>Secure Packaging</span>
        <span>Research Use Only</span>
      </div>
    </div>
  </div>
</footer>

</main>
</>
);
}