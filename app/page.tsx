"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");

const [disclaimerChecked, setDisclaimerChecked] = useState(false);

    const [cartCount, setCartCount] = useState(0);
      const [moreOpen, setMoreOpen] = useState(false);

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
<div className="w-full max-w-2xl border border-blue-900 bg-[#050505] p-4 md:p-10 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.2)]">            
  <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">
              Disclaimer
            </h1>

<div className="space-y-4 text-gray-300 leading-relaxed text-xs md:text-sm">              <p>
                Apexx Biolabs products are intended strictly for laboratory
                research purposes only.
              </p>

              <p>
                Products sold on this website are NOT intended for human
                consumption, medical use, veterinary use, diagnosis, treatment,
                cure, or prevention of disease.
              </p>

              <p>By entering this website, you acknowledge that:</p>

              <div className="space-y-4 text-gray-400">

<label className="flex items-start gap-3 cursor-pointer border border-blue-900 rounded-xl p-3 md:p-5bg-black/40">
  <input
    type="checkbox"
    checked={disclaimerChecked}
    onChange={(e) => setDisclaimerChecked(e.target.checked)}
    className="mt-1"
  />

  <span className="text-gray-300 leading-relaxed">
    I confirm that I am at least 21 years of age and understand that all
    products sold by Apexx Biolabs are intended strictly for lawful laboratory
    research use only. I understand these products are not for human
    consumption, medical use, veterinary use, diagnosis, treatment, cure, or
    prevention of disease, and I agree to comply with all applicable federal,
    state, and local laws regarding the purchase, possession, and use of
    research materials.
  </span>
</label>

</div>
            </div>

            <div className="flex justify-center mt-10">
              <button
  onClick={handleAccept}
  disabled={!disclaimerChecked}
  className={`px-10 py-4 uppercase tracking-widest text-sm font-semibold rounded-xl transition-all ${
    disclaimerChecked
      ? "bg-blue-600 hover:bg-blue-500 text-white"
      : "bg-gray-800 text-gray-500 cursor-not-allowed"
  }`}
>
  I Acknowledge & Enter
</button>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-black text-white">
        <header className="fixed top-0 left-0 w-full z-50 border-b border-blue-900 bg-black/80 backdrop-blur-md px-4 py-4">

<div className="flex flex-col md:flex-row items-center justify-between gap-4">    <img
  src="/images/logo.png"
  alt="Apexx Biolabs"
  className="h-12 w-auto shrink-0"
/>
<div className="flex justify-center mt-4">
<div className="relative w-full md:max-w-md">    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full bg-[#050505] border border-blue-900 focus:border-blue-500 outline-none rounded-xl px-4 py-3 text-white placeholder:text-gray-500 text-sm shadow-[0_0_20px_rgba(37,99,235,0.12)]"
    />

    {search && filteredProducts.length > 0 && (
      <div className="absolute top-full left-0 right-0 mt-3 bg-black border border-blue-900 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.25)] overflow-hidden z-[999]">
        {filteredProducts.map((product) => (
          <a
            key={product.name}
            href={product.href}
            className="block px-5 py-4 text-sm uppercase tracking-widest hover:bg-blue-900/40 transition-all"
          >
            {product.name}
          </a>
        ))}
      </div>
    )}
  </div>
</div>

    <nav className="flex items-center gap-4 text-xs uppercase tracking-widest">
      <a
  href="/"
  className="border border-blue-700 text-blue-400 px-4 py-2 hover:bg-blue-700 hover:text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all rounded-lg font-semibold tracking-[0.15em] uppercase"
>
  Home
</a>

      <div className="relative py-4">
  <button
  onClick={() => setMoreOpen(!moreOpen)}
  className="border border-blue-700 text-blue-400 px-4 py-2 hover:bg-blue-700 hover:text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all rounded-lg font-semibold tracking-[0.15em] uppercase"
>
  More
</button>

  {moreOpen && (
    <div className="absolute right-0 top-full flex flex-col bg-black border border-blue-900 rounded-xl min-w-[190px] shadow-[0_0_30px_rgba(37,99,235,0.25)] overflow-hidden z-50">
      <a href="/peptide-info" className="px-5 py-4 hover:bg-blue-900/40 transition-all">Peptide Info</a>
      <a href="/coas" className="px-5 py-4 hover:bg-blue-900/40 transition-all">COAs</a>
      <a href="/about" className="px-5 py-4 hover:bg-blue-900/40 transition-all">About Us</a>
      <a href="/contact" className="px-5 py-4 hover:bg-blue-900/40 transition-all">Contact</a>
      <a href="/process" className="px-5 py-4 hover:bg-blue-900/40 transition-all">Our Process</a>
      <a href="/faq" className="px-5 py-4 hover:bg-blue-900/40 transition-all">FAQs</a>
      <a href="/shipping" className="px-5 py-4 hover:bg-blue-900/40 transition-all">
  Shipping Policy
</a>
<a href="/refunds" className="px-5 py-4 hover:bg-blue-900/40 transition-all">
  Refund Policy
</a>
<a href="/privacy" className="px-5 py-4 hover:bg-blue-900/40 transition-all">
  Privacy Policy
</a>
    </div>
  )}
</div>

      <a
  href="/cart"
  className="relative flex items-center justify-center w-12 h-12 border border-blue-700 rounded-xl hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all"
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
<section className="relative flex flex-col items-center justify-center text-center pt-36 pb-24 px-6 bg-black overflow-hidden">

  <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">

<div className="relative w-full max-w-6xl mx-auto mb-10 overflow-hidden rounded-2xl">      
  <img
        src="/images/hero.png"
        alt="Apexx Biolabs"
        className="w-full h-auto block mx-auto"
      />

    </div>

    <div className="mt-4 inline-block border border-blue-700/70 rounded-full px-6 py-2 bg-blue-950/20 shadow-[0_0_25px_rgba(37,99,235,0.25)]">
      <p className="text-blue-400 text-xs uppercase tracking-[0.35em] font-semibold">
        Research Use Only • Precision Tested
      </p>
    </div>

    <h2 className="mt-8 text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-700 bg-clip-text text-transparent tracking-tight">
      Precision Research Peptides
    </h2>

    <p className="mt-8 text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed">
      High-purity research compounds developed for laboratory applications,
      analytical consistency, and research-focused quality assurance.
    </p>

    <div className="mt-8 h-[1px] w-72 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

    <div className="flex gap-6 mt-12">
      <a
        href="#shop"
        className="bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] px-8 py-4 text-sm uppercase tracking-widest font-semibold transition-all rounded-lg"
      >
        Shop Catalog
      </a>

      <a
        href="/coas"
        className="border border-blue-700 hover:bg-blue-700 px-8 py-4 text-sm uppercase tracking-widest font-semibold transition-all rounded-lg"
      >
        View COAs
      </a>
    </div>

    <p className="mt-6 text-xs text-gray-500 uppercase tracking-widest">
      For laboratory research use only. Not for human consumption.
    </p>
  </div>
</section>

        {/* TRUST BAR */}
        <section className="border-t border-b border-blue-900 py-10">
          <div className="flex flex-wrap justify-center gap-16 text-center">
            <div>
              <p className="text-xl font-bold text-blue-400">99%+</p>
              <p className="text-gray-400 uppercase tracking-widest text-xs mt-2">
                Purity Verified
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-blue-400">HPLC</p>
              <p className="text-gray-400 uppercase tracking-widest text-xs mt-2">
                Batch Tested
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-blue-400">USA</p>
              <p className="text-gray-400 uppercase tracking-widest text-xs mt-2">
                Fast Shipping
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-blue-400">RUO</p>
              <p className="text-gray-400 uppercase tracking-widest text-xs mt-2">
                Research Use Only
              </p>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="shop" className="py-28 px-10 bg-black">
          <h3 className="text-4xl font-bold text-center mb-16">
            Featured Compounds
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

{/* APX-3 */}
<div
  id="APX-3"
  onClick={() => (window.location.href = "/products/apx3")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>
              <img
                src="/images/retatrutide.PNG"
                alt="APX3"
                className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
              />

              <h4 className="text-2xl font-semibold">APX-3</h4>

              <p className="text-gray-400 mt-3">10-20mg Research Peptide</p>

              <a
  href="/products/apx3"
  className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
>
  View Product
</a>

    </div>

{/* BPC-157 */}
<div
  onClick={() => (window.location.href = "/products/bpc157")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>
  <img
    src="/images/bpc157.PNG"
    alt="BPC-157"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">BPC-157</h4>

  <p className="text-gray-400 mt-3">10mg Research Peptide</p>

  <span className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg">
    View Product
  </span>
</div>

{/* TB-500 */}
<div
  onClick={() => (window.location.href = "/products/tb500")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>
  <img
    src="/images/tb500.PNG"
    alt="TB-500"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />
              <h4 className="text-2xl font-semibold">TB-500</h4>

              <p className="text-gray-400 mt-3">10mg Research Peptide</p>

              <a
                href="/products/tb500"
                className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
              >
                View Product
              </a>
            </div>
{/* BACTERIOSTATIC WATER */}
<div
  onClick={() => (window.location.href = "/products/bacwater")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>
  <img
    src="/images/bacwater.PNG"
    alt="Bacteriostatic Water"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />
  <h4 className="text-2xl font-semibold">
    Bacteriostatic Water
  </h4>

  <p className="text-gray-400 mt-3">
    Research Reconstitution Solution
  </p>

  <a
    href="/products/bacwater"
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>

</div>

{/* KPV */}
<div
  onClick={() => (window.location.href = "/products/kpv")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>

  <img
    src="/images/kpv.PNG"
    alt="KPV"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">
    KPV
  </h4>

  <p className="text-gray-400 mt-3">
    10mg Research Peptide
  </p>

  <a
    href="/products/kpv"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>

</div>

{/* GHK-CU */}
<div
  onClick={() => (window.location.href = "/products/ghkcu")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>

  <img
    src="/images/ghkcu.PNG"
    alt="GHK-Cu"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">
    GHK-Cu
  </h4>

  <p className="text-gray-400 mt-3">
    100mg Research Peptide
  </p>

  <a
    href="/products/ghkcu"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>

</div>

{/* PINEALON */}
<div
  onClick={() => (window.location.href = "/products/pinealon")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>

  <img
    src="/images/pinealon.PNG"
    alt="Pinealon"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">
    Pinealon
  </h4>

  <p className="text-gray-400 mt-3">
    10mg Research Peptide
  </p>

  <a
    href="/products/pinealon"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>

</div>

{/* SELANK */}
<div
  onClick={() => (window.location.href = "/products/selank")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>

  <img
    src="/images/selank.PNG"
    alt="Selank"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">
    Selank
  </h4>

  <p className="text-gray-400 mt-3">
    10mg Research Peptide
  </p>

  <a
    href="/products/selank"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>

</div>

{/* SEMAX */}
<div
  onClick={() => (window.location.href = "/products/semax")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>

  <img
    src="/images/semax.PNG"
    alt="Semax"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">
    Semax
  </h4>

  <p className="text-gray-400 mt-3">
    10mg Research Peptide
  </p>

  <a
    href="/products/semax"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>

</div>

{/* MOTS-C */}
<div
  onClick={() => (window.location.href = "/products/motsc")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>
  <img
    src="/images/motsc.PNG"
    alt="MOTS-C"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">MOTS-C</h4>

  <p className="text-gray-400 mt-3">10mg Research Peptide</p>

  <a
    href="/products/motsc"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>
</div>

{/* ARA-290 */}
<div
  onClick={() => (window.location.href = "/products/ara290")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>
  <img
    src="/images/ara290.PNG"
    alt="ARA-290"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">ARA-290</h4>

  <p className="text-gray-400 mt-3">10mg Research Peptide</p>

  <a
    href="/products/ara290"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>
</div>

{/* PE-22-28 */}
<div
  onClick={() => (window.location.href = "/products/pe2228")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>
  <img
    src="/images/pe2228.PNG"
    alt="PE-22-28"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">PE-22-28</h4>

  <p className="text-gray-400 mt-3">10mg Research Peptide</p>

  <a
    href="/products/pe2228"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>
</div>

{/* ADAMAX */}
<div
  onClick={() => (window.location.href = "/products/adamax")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>
  <img
    src="/images/adamax.PNG"
    alt="ADAMAX"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">ADAMAX</h4>

  <p className="text-gray-400 mt-3">10mg Research Peptide</p>

  <a
    href="/products/adamax"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>
</div>

{/* CJC/IPA WITHOUT DAC */}
<div
  onClick={() => (window.location.href = "/products/cjcipa")}
  className="border border-blue-900 bg-[#050505] p-8 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 rounded-xl cursor-pointer"
>
  <img
    src="/images/cjcipa.PNG"
    alt="CJC/IPA Without DAC"
    className="h-72 object-contain w-full mb-8 hover:scale-105 transition-all duration-300"
  />

  <h4 className="text-2xl font-semibold">CJC/IPA Without DAC</h4>

  <p className="text-gray-400 mt-3">10mg Research Peptide</p>

  <a
    href="/products/cjcipa"
    onClick={(e) => e.stopPropagation()}
    className="inline-block mt-8 border border-blue-700 hover:bg-blue-700 px-5 py-3 text-sm uppercase tracking-widest transition-all rounded-lg"
  >
    View Product
  </a>
</div>

          </div>
        </section>

        {/* ABOUT SECTION */}
<section className="py-32 px-6 border-t border-blue-950 border-b border-blue-950 bg-black">
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

<footer className="border-t border-blue-900 py-10 px-6 bg-black">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      <p className="text-gray-500 text-sm text-center lg:text-left">
        © 2026 Apexx Biolabs. All rights reserved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-widest">
        <a href="/about" className="text-gray-500 hover:text-blue-400 transition-all">
          About
        </a>

        <a href="/contact" className="text-gray-500 hover:text-blue-400 transition-all">
          Contact
        </a>

        <a href="/terms" className="text-gray-500 hover:text-blue-400 transition-all">
          Terms & Conditions
        </a>

        <a href="/privacy" className="text-gray-500 hover:text-blue-400 transition-all">
          Privacy Policy
        </a>

        <a href="/refunds" className="text-gray-500 hover:text-blue-400 transition-all">
          Refund Policy
        </a>

        <a href="/shipping" className="text-gray-500 hover:text-blue-400 transition-all">
          Shipping Policy
        </a>

        <span className="hidden md:inline text-blue-900">|</span>

        <a
          href="mailto:support@apexxbiolabs.com"
          className="text-blue-400 hover:text-blue-300 transition-all"
        >
          support@apexxbiolabs.com
        </a>

        <a
          href="https://instagram.com/apexxbiolabs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-all"
        >
          @apexx.nyc
        </a>
      </div>
    </div>

    <div className="mt-8 border-t border-blue-950 pt-6 text-center">
      <p className="text-blue-500/70 uppercase tracking-widest text-xs mb-4">
        Research Materials • Quality Controlled • Secure Packaging • Customer Support
      </p>

      <p className="max-w-5xl mx-auto text-gray-600 text-xs uppercase tracking-widest leading-relaxed">
        FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION.
        NOT FOR MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
      </p>
    </div>
  </div>
</footer>

</main>
</>
);
}