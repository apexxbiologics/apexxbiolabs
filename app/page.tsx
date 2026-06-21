"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");

const [disclaimerChecked, setDisclaimerChecked] = useState(false);

    const [cartCount, setCartCount] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const productScrollRef = useRef<HTMLDivElement | null>(null);
    const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
const [activeQuality, setActiveQuality] = useState("potency");
const [menuOpen, setMenuOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);

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
  <div className="fixed inset-0 z-[9999] bg-[#020817] overflow-y-auto px-4 py-8">

    <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_55%)]" />

    <div className="relative min-h-screen flex items-start md:items-center justify-center">

      <div className="w-full max-w-3xl rounded-[36px] border border-blue-400/20 bg-gradient-to-b from-[#0f1d33] to-[#081526] shadow-[0_0_80px_rgba(59,130,246,0.22)] overflow-hidden">

        {/* Glow */}
<div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_55%)]" />
        {/* Header */}
        <div className="text-center px-8 md:px-14 pt-12 pb-8">

          <img
            src="/images/logo.png"
            alt="Apexx Biolabs"
            className="h-20 w-auto mx-auto mb-8"
          />

          <p className="uppercase tracking-[0.45em] text-blue-300 text-xs mb-5">
            Research Use Verification
          </p>

          <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tight text-white mb-6">
            Welcome to
            <span className="block bg-gradient-to-r from-blue-200 via-white to-blue-300 bg-clip-text text-transparent">
              Apexx Biolabs
            </span>
          </h1>

          <div className="h-px w-40 mx-auto bg-gradient-to-r from-transparent via-blue-400 to-transparent mb-8" />

          <p className="text-blue-100/75 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Before entering, please acknowledge that all products offered by
            Apexx Biolabs are intended strictly for lawful laboratory research
            and analytical purposes.
          </p>
        </div>

        {/* Main Content */}
        <div className="px-8 md:px-14 pb-10">

          <div className="rounded-3xl border border-blue-400/15 bg-white/[0.03] p-6 md:p-8 mb-8">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0">
                <span className="text-blue-300 text-xl">⚗️</span>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  Research Use Only
                </h3>

                <p className="text-blue-100/70 leading-relaxed">
                  Products sold on this website are not intended for human
                  consumption, medical use, veterinary use, diagnosis,
                  treatment, cure, or prevention of disease. No information
                  provided by Apexx Biolabs should be interpreted as medical
                  advice.
                </p>
              </div>

            </div>
          </div>

          {/* Checkbox */}
          <label className="group flex items-start gap-4 p-6 rounded-3xl border border-blue-400/15 bg-white/[0.03] cursor-pointer hover:border-blue-400/30 transition-all">

            <input
              type="checkbox"
              checked={disclaimerChecked}
              onChange={(e) => setDisclaimerChecked(e.target.checked)}
              className="mt-1 w-5 h-5 accent-blue-500"
            />

            <span className="text-blue-100/80 leading-relaxed">
              I confirm that I am at least <strong>21 years of age</strong> and
              understand that all products sold by Apexx Biolabs are intended
              exclusively for lawful laboratory research use.
            </span>

          </label>

          {/* Button */}
          <button
            onClick={handleAccept}
            disabled={!disclaimerChecked}
            className={`w-full mt-8 py-5 rounded-2xl uppercase tracking-[0.25em] text-sm font-bold transition-all ${
              disclaimerChecked
                ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] hover:scale-[1.01]"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            Enter Apexx Biolabs
          </button>

          <p className="text-center text-xs text-blue-100/40 uppercase tracking-[0.25em] mt-6">
            Laboratory Research Use Only
          </p>

        </div>
      </div>
    </div>
  </div>
)}

<div className="min-h-screen bg-[#081526] text-white">
{/* HEADER */}
<header className="fixed top-0 left-0 w-full z-50 border-b border-blue-900/70 bg-[#081526]/95 backdrop-blur-xl px-5 md:px-10 py-5">
  <div className="max-w-7xl mx-auto flex items-center justify-between">

    {/* LEFT MENU + LOGO */}
    <div className="flex items-center gap-6">
      <button
        onClick={() => setMenuOpen(true)}
        className="text-white hover:text-blue-400 transition-all"
      >
        <Menu size={34} />
      </button>

      <a href="/">
        <img
          src="/images/logo.png"
          alt="Apexx Biolabs"
          className="h-10 md:h-12 w-auto"
        />
      </a>
    </div>

    {/* CENTER NAV */}
    <nav className="hidden md:flex items-center gap-14 text-white text-sm font-bold uppercase tracking-[0.22em]">
      <a href="/" className="hover:text-blue-400 transition-all border-b-2 border-blue-500 pb-2">
        Home
      </a>

      <a href="/products" className="hover:text-blue-400 transition-all pb-2">
        Products
      </a>

      <a href="/coas" className="hover:text-blue-400 transition-all pb-2">
        COAs
      </a>

      <a href="/contact" className="hover:text-blue-400 transition-all pb-2">
        Contact
      </a>
    </nav>

    {/* RIGHT ICONS */}
    <div className="flex items-center gap-6">
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="text-white hover:text-blue-400 transition-all"
      >
        <Search size={34} />
      </button>

      <a
        href="/cart"
        className="relative text-white hover:text-blue-400 transition-all"
      >
        <ShoppingCart size={36} />

        {cartCount > 0 && (
          <span className="absolute -top-3 -right-4 bg-blue-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </a>
    </div>
  </div>

  {/* SEARCH BAR DROPDOWN */}
  {searchOpen && (
    <div className="max-w-3xl mx-auto mt-5 relative">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#020817] border border-blue-700 focus:border-blue-400 outline-none rounded-2xl px-6 py-4 text-white placeholder:text-gray-400 text-base"
      />

      {search && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#081526] border border-blue-800 rounded-2xl overflow-hidden z-[999]">
          {filteredProducts.map((product) => (
            <a
              key={product.name}
              href={product.href}
              className="block px-6 py-4 text-white hover:bg-[#102A4A] transition-all"
            >
              {product.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )}
</header>

{/* SIDE MENU */}
{menuOpen && (
  <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm">
    <div className="h-full w-[85%] max-w-sm bg-[#081526] border-r border-blue-900 p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <img
          src="/images/logo.png"
          alt="Apexx Biolabs"
          className="h-12 w-auto"
        />

        <button
          onClick={() => setMenuOpen(false)}
          className="text-white hover:text-blue-400 transition-all"
        >
          <X size={30} />
        </button>
      </div>

      <div className="flex flex-col gap-6 text-white text-lg font-semibold uppercase tracking-widest">
        <a href="/" className="hover:text-blue-400 transition-all">Home</a>
        <a href="/products" className="hover:text-blue-400 transition-all">Products</a>
        <a href="/coas" className="hover:text-blue-400 transition-all">COAs</a>
        <a href="/contact" className="hover:text-blue-400 transition-all">Contact</a>
        <a href="/peptide-info" className="hover:text-blue-400 transition-all">Peptide Info</a>
        <a href="/faq" className="hover:text-blue-400 transition-all">FAQ</a>
        <a href="/shipping" className="hover:text-blue-400 transition-all">Shipping</a>
        <a href="/refunds" className="hover:text-blue-400 transition-all">Refunds</a>
        <a href="/privacy" className="hover:text-blue-400 transition-all">Privacy Policy</a>
        <a href="/terms" className="hover:text-blue-400 transition-all">Terms</a>
      </div>
    </div>
  </div>
)}

{/* HERO */}
<section className="relative pt-44 pb-24 px-6 bg-[#081526] overflow-hidden">

  {/* Background Image */}
  <div
    className="absolute right-0 top-0 h-full w-full lg:w-[75%] bg-cover opacity-90"
    style={{
      backgroundImage: "url('/images/hero-vial-right.png')",
      backgroundPosition: "75% center",
    }}
  />

  {/* Navy Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#081526] via-[#081526]/92 to-transparent" />

  {/* Luxury Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_55%)]"></div>

  <div className="relative z-10 max-w-7xl mx-auto py-20 flex items-center">

    <div className="max-w-3xl">

      <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
        Research. Quality. Confidence.
      </p>

      <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
        Research
        <br />

        <span className="text-blue-300">
          Without Limits.
        </span>
      </h1>

      <p className="mt-8 text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">
        High-purity research compounds supported by analytical verification,
        batch documentation, and research-use transparency.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">

        <a
          href="#shop"
          className="bg-white text-[#081526] px-9 py-4 rounded-full text-sm uppercase tracking-widest font-semibold text-center hover:bg-blue-100 transition-all"
        >
          Shop Products
        </a>

        <a
          href="/coas"
          className="border border-white/10 bg-white/[0.04] backdrop-blur-sm px-9 py-4 rounded-full text-sm uppercase tracking-widest font-semibold text-center hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
        >
          View COAs
        </a>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">

        {[
          "99%+ Purity",
          "Third-Party Tested",
          "COA Included",
          "Fast Shipping",
        ].map((item) => (
          <div
            key={item}
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all"
          >
            <p className="text-blue-300 text-xl mb-3">✓</p>

            <p className="text-white/70 text-xs uppercase tracking-widest leading-relaxed">
              {item}
            </p>
          </div>
        ))}

      </div>

    </div>

  </div>
</section>

{/* PRODUCTS */}
<section
  id="shop"
  className="relative py-24 px-6 bg-[#081526] border-b border-white/10 overflow-hidden"
>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

  <div className="relative z-10 max-w-7xl mx-auto">

    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
      <div>
        <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
          Research Catalog
        </p>

        <h3 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.95]">
          Featured Compounds
        </h3>

        <p className="text-white/70 text-lg md:text-xl leading-relaxed mt-6 max-w-2xl">
          Research peptides, third-party identity tested, and batch documented.
        </p>
      </div>

      <a
        href="/products"
        className="hidden md:inline-flex border border-white/10 bg-white/[0.04] text-white rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
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
        className="hidden md:flex absolute left-0 top-[42%] -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-white/10 bg-[#102A4A]/80 backdrop-blur items-center justify-center text-3xl text-white hover:border-blue-400/50 hover:bg-[#16365d] transition-all"
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
          },
          {
            name: "BPC-157",
            desc: "10mg Research Peptide",
            image: "/images/bpc157.PNG",
            href: "/products/bpc157",
          },
          {
            name: "TB-500",
            desc: "10mg Research Peptide",
            image: "/images/tb500.PNG",
            href: "/products/tb500",
          },
          {
            name: "Bacteriostatic Water",
            desc: "Research Reconstitution Solution",
            image: "/images/bacwater.PNG",
            href: "/products/bacwater",
          },
          {
            name: "KPV",
            desc: "10mg Research Peptide",
            image: "/images/kpv.PNG",
            href: "/products/kpv",
          },
          {
            name: "GHK-Cu",
            desc: "100mg Research Peptide",
            image: "/images/ghkcu.PNG",
            href: "/products/ghkcu",
          },
          {
            name: "Pinealon",
            desc: "10mg Research Peptide",
            image: "/images/pinealon.PNG",
            href: "/products/pinealon",
          },
          {
            name: "Selank",
            desc: "10mg Research Peptide",
            image: "/images/selank.PNG",
            href: "/products/selank",
          },
          {
            name: "Semax",
            desc: "10mg Research Peptide",
            image: "/images/semax.PNG",
            href: "/products/semax",
          },
          {
            name: "MOTS-C",
            desc: "10mg Research Peptide",
            image: "/images/motsc.PNG",
            href: "/products/motsc",
          },
          {
            name: "ARA-290",
            desc: "10mg Research Peptide",
            image: "/images/ara290.PNG",
            href: "/products/ara290",
          },
          {
            name: "PE-22-28",
            desc: "10mg Research Peptide",
            image: "/images/pe2228.PNG",
            href: "/products/pe2228",
          },
          {
            name: "ADAMAX",
            desc: "10mg Research Peptide",
            image: "/images/adamax.PNG",
            href: "/products/adamax",
          },
          {
            name: "CJC/IPA Without DAC",
            desc: "10mg Research Peptide",
            image: "/images/cjcipa.PNG",
            href: "/products/cjcipa",
          },
        ].map((product) => (
          <div
            key={product.name}
            className="min-w-[290px] md:min-w-[340px] group"
          >
            <a href={product.href} className="block">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[430px] object-cover rounded-[1.6rem] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </a>

            <div className="pt-6 px-1">
              <h4 className="text-2xl font-black text-white mb-3">
                {product.name}
              </h4>

              <p className="text-white/60 mb-8">
                {product.desc}
              </p>

              <div className="flex gap-3">
                <a
                  href="/coas"
                  className="flex-1 border border-white/10 bg-white/[0.04] text-white rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
                >
                  COA
                </a>

                <a
                  href={product.href}
                  className="flex-1 bg-white text-[#081526] rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-blue-100 transition-all"
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
        className="hidden md:flex absolute right-0 top-[42%] -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-white/10 bg-[#102A4A]/80 backdrop-blur items-center justify-center text-3xl text-white hover:border-blue-400/50 hover:bg-[#16365d] transition-all"
      >
        ›
      </button>

    </div>

  </div>
</section>

{/* QUALITY VERIFICATION */}
<section className="relative py-24 px-6 bg-[#081526] border-b border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

  <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

    <div>
      <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
        Quality Verification
      </p>

      <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.95] mb-8">
        Quality You Can Verify.
      </h2>

      <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
        Every batch is supported by documentation and analytical review for
        research-focused consistency, purity, and transparency.
      </p>

      <div className="grid grid-cols-3 gap-6 mb-10 border-y border-white/10 py-8">
        <div>
          <p className="text-4xl font-black text-white">99%+</p>
          <p className="text-white/50 text-sm mt-2">Purity Target</p>
        </div>

        <div>
          <p className="text-4xl font-black text-white">HPLC</p>
          <p className="text-white/50 text-sm mt-2">Analysis</p>
        </div>

        <div>
          <p className="text-4xl font-black text-white">COA</p>
          <p className="text-white/50 text-sm mt-2">Batch Records</p>
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
                ? "bg-blue-500 text-white shadow-[0_0_25px_rgba(96,165,250,0.35)]"
                : "bg-white/[0.04] border border-white/10 text-white/60 hover:border-blue-400/50 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
        {activeQuality === "potency" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Verified Potency
            </h3>

            <p className="text-white/70 leading-relaxed mb-6">
              Analytical testing helps confirm that each batch aligns with the
              stated research concentration and identity specifications.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
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

            <p className="text-white/70 leading-relaxed mb-6">
              COAs provide batch-level information so researchers can review
              purity data before use in laboratory settings.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
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

            <p className="text-white/70 leading-relaxed mb-6">
              Products are packaged with research storage and handling standards
              in mind to help preserve batch integrity.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
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

            <p className="text-white/70 leading-relaxed mb-6">
              Apexx Biolabs products are intended strictly for lawful laboratory
              research use only and are not for human or veterinary use.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
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

            <p className="text-white/70 leading-relaxed mb-6">
              Batch records and testing documentation help support consistency
              across research materials.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
              <strong className="text-white">Why it matters:</strong> Consistent
              records help researchers compare and track batches.
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</section>
    
    <section className="relative py-24 px-6 bg-[#081526] border-y border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_55%)]"></div>

  <div className="relative z-10 max-w-7xl mx-auto">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16">

      <div>
        <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
          About Apexx
        </p>

        <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.95] mb-8">
          Scientific Precision.
          <br />
          Trusted Quality.
        </h2>
      </div>

      <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">
        Apexx Biolabs specializes in high-purity research compounds
        manufactured under strict analytical standards. Every batch undergoes
        rigorous verification to support purity, consistency, and reliability
        for laboratory research applications.
      </p>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all">
        <div className="w-12 h-12 rounded-full bg-blue-400/10 border border-blue-300/30 flex items-center justify-center text-blue-300 text-2xl mb-8">
          ✓
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">
          Third-Party Testing
        </h3>

        <p className="text-white/60 leading-relaxed">
          Independent analytical verification supporting transparency and consistency.
        </p>
      </div>

      <div className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all">
        <div className="w-12 h-12 rounded-full bg-blue-400/10 border border-blue-300/30 flex items-center justify-center text-blue-300 text-2xl mb-8">
          ⚗
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">
          Research Standards
        </h3>

        <p className="text-white/60 leading-relaxed">
          Manufactured and handled according to strict laboratory quality practices.
        </p>
      </div>

      <div className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all">
        <div className="w-12 h-12 rounded-full bg-blue-400/10 border border-blue-300/30 flex items-center justify-center text-blue-300 text-2xl mb-8">
          🔬
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">
          Batch Transparency
        </h3>

        <p className="text-white/60 leading-relaxed">
          COAs and supporting documentation available for verified batches.
        </p>
      </div>

    </div>

  </div>
</section>

<footer className="bg-[#081526] border-t border-blue-900/40 px-6 pt-24 pb-10">

  <div className="max-w-7xl mx-auto">

    {/* TOP */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">

      {/* BRAND */}
      <div>
        <img
          src="/images/logo.png"
          alt="Apexx Biolabs"
          className="h-12 w-auto mb-6"
        />

        <p className="text-white/70 leading-relaxed text-sm">
          High-purity research compounds supported by batch documentation,
          analytical testing, and research-use transparency.
        </p>
      </div>

      {/* COMPANY */}
      <div>
        <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Company
        </h4>

        <div className="space-y-4">
          <a href="/" className="block text-white/70 hover:text-white transition-all">
            Home
          </a>

          <a href="/products" className="block text-white/70 hover:text-white transition-all">
            Products
          </a>

          <a href="/coas" className="block text-white/70 hover:text-white transition-all">
            COAs
          </a>

          <a href="/contact" className="block text-white/70 hover:text-white transition-all">
            Contact
          </a>
        </div>
      </div>

      {/* RESOURCES */}
      <div>
        <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Resources
        </h4>

        <div className="space-y-4">
          <a href="/peptide-info" className="block text-white/70 hover:text-white transition-all">
            Peptide Info
          </a>

          <a href="/faq" className="block text-white/70 hover:text-white transition-all">
            FAQ
          </a>

          <a href="/shipping" className="block text-white/70 hover:text-white transition-all">
            Shipping
          </a>

          <a href="/refunds" className="block text-white/70 hover:text-white transition-all">
            Refunds
          </a>
        </div>
      </div>

      {/* CONTACT */}
      <div>
        <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Contact
        </h4>

        <div className="space-y-4">
          <a
            href="mailto:support@apexxbiolabs.com"
            className="block text-white/70 hover:text-white transition-all"
          >
            support@apexxbiolabs.com
          </a>

          <a
            href="https://www.tiktok.com/@apexx.nyc"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-white/70 hover:text-white transition-all"
          >
            TikTok
          </a>
        </div>
      </div>

    </div>

    {/* DISCLAIMER */}
    <div className="border-t border-white/10 pt-10">

      <p className="text-white/40 text-xs uppercase tracking-[0.18em] leading-relaxed max-w-5xl">
        FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION.
        NOT FOR MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
      </p>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">

        <p className="text-white/40 text-sm">
          © 2026 Apexx Biolabs. All Rights Reserved.
        </p>

        <div className="flex gap-8 text-sm text-white/40">
          <a href="/privacy" className="hover:text-white transition-all">
            Privacy
          </a>

          <a href="/terms" className="hover:text-white transition-all">
            Terms
          </a>

          <a href="/shipping" className="hover:text-white transition-all">
            Shipping
          </a>
        </div>

      </div>

    </div>

  </div>

</footer>

</div>
</>
);
}