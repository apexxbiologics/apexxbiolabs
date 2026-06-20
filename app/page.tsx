"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  Search,
  ShieldCheck,
  FlaskConical,
  ClipboardCheck,
  Truck,
  Lock,
  Headphones,
  X,
} from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const productScrollRef = useRef<HTMLDivElement | null>(null);

  const products = [
    { name: "APX-3", desc: "10–20mg Research Peptide", image: "/images/retatrutide.PNG", href: "/products/apx3" },
    { name: "Adamax", desc: "10mg Research Peptide", image: "/images/adamax.PNG", href: "/products/adamax" },
    { name: "ARA-290", desc: "10mg Research Peptide", image: "/images/ara290.PNG", href: "/products/ara290" },
    { name: "Bacteriostatic Water", desc: "Sterile Diluent", image: "/images/bacwater.PNG", href: "/products/bacwater" },
    { name: "BPC-157", desc: "10mg Research Peptide", image: "/images/bpc157.PNG", href: "/products/bpc157" },
    { name: "CJC/IPA Without DAC", desc: "10mg Research Peptide", image: "/images/cjcipa.PNG", href: "/products/cjcipa" },
    { name: "GHK-Cu", desc: "100mg Research Peptide", image: "/images/ghkcu.PNG", href: "/products/ghkcu" },
    { name: "KPV", desc: "10mg Research Peptide", image: "/images/kpv.PNG", href: "/products/kpv" },
    { name: "MOTS-C", desc: "10mg Research Peptide", image: "/images/motsc.PNG", href: "/products/motsc" },
    { name: "PE-22-28", desc: "10mg Research Peptide", image: "/images/pe2228.PNG", href: "/products/pe2228" },
    { name: "Pinealon", desc: "10mg Research Peptide", image: "/images/pinealon.PNG", href: "/products/pinealon" },
    { name: "Selank", desc: "10mg Research Peptide", image: "/images/selank.PNG", href: "/products/selank" },
    { name: "Semax", desc: "10mg Research Peptide", image: "/images/semax.PNG", href: "/products/semax" },
    { name: "TB-500", desc: "10mg Research Peptide", image: "/images/tb500.PNG", href: "/products/tb500" },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setAccepted(false);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const match = products.find((product) =>
      product.name.toLowerCase().includes(search.toLowerCase().trim())
    );

    if (match) {
      window.location.href = match.href;
    }
  };

  if (accepted === null) return null;

  function handleAccept(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
{!accepted && (
  <div className="fixed inset-0 z-[999] overflow-y-auto">

    {/* VIDEO BACKGROUND */}
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source
        src="/videos/disclaimer-bg.mp4"
        type="video/mp4"
      />
    </video>

    {/* LIGHT OVERLAY */}
    <div className="absolute inset-0 bg-[#EAF4FF]/20" />

    {/* DISCLAIMER CONTENT */}
    <div className="relative z-10 flex justify-center px-4 py-8 min-h-screen">

      <div className="w-full max-w-2xl my-auto rounded-[32px] bg-[#DDEEFF]/90 border border-blue-200 p-6 md:p-10 shadow-[0_20px_80px_rgba(59,130,246,0.20)]">

        {/* LOGO */}
        <div className="text-center mb-8">
          <img
            src="/images/logo.png"
            alt="Apexx Biolabs"
            className="h-24 md:h-28 w-auto mx-auto mb-8"
          />

          <p className="uppercase tracking-[0.4em] text-blue-500 text-xs mb-5">
            Research Use Verification
          </p>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-5">
            Welcome to Apexx Biolabs
          </h1>

          <p className="text-slate-700 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Premium research compounds supported by batch documentation,
            analytical review, and research-use transparency.
          </p>
        </div>

        {/* DISCLAIMER BOX */}
        <div className="border border-blue-200 bg-[#F2F8FF] rounded-2xl p-5 mb-8">

          <p className="text-slate-700 text-sm leading-relaxed mb-5">
            Products sold on this website are intended strictly for lawful
            laboratory research use only and are not for human consumption,
            medical use, veterinary use, diagnosis, treatment, cure, or
            prevention of disease.
          </p>

          <label className="flex items-start gap-3 cursor-pointer border border-blue-200 rounded-xl p-4 bg-white">

            <input
              type="checkbox"
              checked={disclaimerChecked}
              onChange={(e) => setDisclaimerChecked(e.target.checked)}
              className="mt-1 accent-blue-500"
            />

            <span className="text-slate-700 text-sm leading-relaxed">
              I confirm that I am at least 21 years of age and understand
              that all products sold by Apexx Biolabs are intended strictly
              for lawful laboratory research use only.
            </span>

          </label>

        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={() => setAccepted(true)}
          disabled={!disclaimerChecked}
          className={`w-full py-4 rounded-xl uppercase tracking-[0.25em] text-sm font-semibold transition-all ${
            disclaimerChecked
              ? "bg-[#6FB6FF] hover:bg-[#5AA9FF] text-white shadow-[0_0_25px_rgba(59,130,246,0.35)]"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          Enter Site
        </button>

      </div>

    </div>

  </div>
)}

      <main className="min-h-screen bg-[#071A2F] text-white">
        {/* HEADER */}
        <header className="fixed top-0 left-0 w-full z-50 bg-[#030A13]/95 backdrop-blur-xl border-b border-blue-900/60">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <a href="/">
              <img src="/images/logo.png" alt="Apexx Biolabs" className="h-14 w-auto" />
            </a>

            <nav className="hidden md:flex items-center gap-10 uppercase tracking-widest text-sm">
              <a href="/" className="text-blue-300">Home</a>
              <a href="/products" className="hover:text-blue-400">Products</a>
              <a href="/coas" className="hover:text-blue-400">COAs</a>
              <a href="/about" className="hover:text-blue-400">About</a>
              <a href="/contact" className="hover:text-blue-400">Contact</a>
            </nav>

            <div className="flex items-center gap-5 relative">
              <button onClick={() => setShowSearch(!showSearch)}>
                {showSearch ? <X size={26} /> : <Search size={26} />}
              </button>

              {showSearch && (
                <form onSubmit={handleSearchSubmit} className="absolute right-14 top-12 z-50 w-72">
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-xl bg-[#0D2746] border border-blue-700 px-5 py-3 outline-none text-sm"
                  />

                  {search && filteredProducts.length > 0 && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-blue-800 bg-[#071A2F]">
                      {filteredProducts.map((product) => (
                        <a
                          key={product.name}
                          href={product.href}
                          className="block px-5 py-3 text-sm hover:bg-blue-900/50"
                        >
                          {product.name}
                        </a>
                      ))}
                    </div>
                  )}
                </form>
              )}

              <a href="/cart" className="relative">
                <ShoppingCart size={30} />
                {cartCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="relative min-h-screen pt-32 px-6 overflow-hidden flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{ backgroundImage: "url('/images/hero-vial-right.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A2F] via-[#071A2F]/90 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <p className="uppercase tracking-[0.4em] text-blue-300 text-sm mb-6">
                Advanced Research Solutions
              </p>

              <h1 className="text-6xl md:text-8xl font-black leading-none">
                Science.
                <br />
                Quality.
                <br />
                <span className="text-blue-400">Results.</span>
              </h1>

              <p className="text-gray-300 text-xl leading-relaxed mt-8 max-w-xl">
                High-purity research peptides and solutions, third-party tested
                and batch documented.
              </p>

              <div className="flex gap-4 mt-10">
                <a href="#shop" className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl uppercase tracking-widest text-sm font-bold">
                  Shop Products
                </a>

                <a href="/coas" className="border border-blue-600 hover:bg-blue-900/40 px-8 py-4 rounded-xl uppercase tracking-widest text-sm font-bold">
                  View COAs
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="px-6 -mt-20 relative z-20">
          <div className="max-w-7xl mx-auto rounded-3xl border border-blue-900/70 bg-[#0D2746]/90 backdrop-blur-xl p-7 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              [ShieldCheck, "Third-Party Tested", "Independent lab verified."],
              [FlaskConical, "Research Use Only", "For laboratory research purposes."],
              [ClipboardCheck, "Batch Documented", "Full transparency with every batch."],
            ].map(([Icon, title, text]: any) => (
              <div key={title} className="flex gap-4 items-start">
                <Icon className="text-blue-400" size={38} />
                <div>
                  <h3 className="text-blue-300 uppercase tracking-widest font-bold">
                    {title}
                  </h3>
                  <p className="text-gray-400 mt-2">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="shop" className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="uppercase tracking-[0.35em] text-blue-400 text-sm mb-4">
                  Research Catalog
                </p>
                <h2 className="text-4xl md:text-6xl font-black">
                  Featured Compounds
                </h2>
              </div>

              <a href="/products" className="text-blue-300 hover:text-blue-200">
                View all →
              </a>
            </div>

            <div ref={productScrollRef} className="flex gap-6 overflow-x-auto pb-4">
              {products.map((product) => (
                <a
                  key={product.name}
                  href={product.href}
                  className="min-w-[260px] rounded-3xl overflow-hidden border border-blue-900/70 bg-[#0D2746] hover:-translate-y-2 transition-all"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[300px] w-full object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-2xl font-black mb-1">{product.name}</h3>
                    <p className="text-gray-400">{product.desc}</p>
                    <div className="mt-5 text-blue-300 font-bold">View Product →</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* SHIPPING / PAYMENT / SUPPORT */}
        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto rounded-3xl border border-blue-900/70 bg-[#0D2746]/80 p-7 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              [Truck, "Fast & Secure Shipping", "Discreet and reliable delivery."],
              [Lock, "Secure Payments", "Safe encrypted checkout."],
              [Headphones, "Customer Support", "Here to help with questions."],
            ].map(([Icon, title, text]: any) => (
              <div key={title} className="flex gap-4">
                <Icon className="text-blue-400" size={38} />
                <div>
                  <h3 className="text-blue-300 uppercase tracking-widest font-bold">
                    {title}
                  </h3>
                  <p className="text-gray-400 mt-2">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="py-24 px-6 bg-[#061426] border-y border-blue-900/60">
          <div className="max-w-5xl mx-auto text-center">
            <p className="uppercase tracking-[0.35em] text-blue-400 text-sm mb-5">
              About Apexx
            </p>

            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Scientific Precision. Trusted Quality.
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed">
              Apexx Biolabs specializes in high-purity research compounds
              supported by batch documentation, third-party testing, and
              research-focused transparency.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#030A13] border-t border-blue-900/70 px-6 py-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
            <div>
              <img src="/images/logo.png" alt="Apexx Biolabs" className="h-14 mb-5" />
              <p className="text-gray-400 max-w-md">
                Premium research-grade peptides built on science, quality, and transparency.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400">
              <a href="/products" className="hover:text-blue-300">Products</a>
              <a href="/coas" className="hover:text-blue-300">COAs</a>
              <a href="/contact" className="hover:text-blue-300">Contact</a>
              <a href="/terms" className="hover:text-blue-300">Terms</a>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-blue-900/70 mt-10 pt-6 text-gray-500 text-sm flex flex-col md:flex-row justify-between gap-4">
            <p>© 2026 Apexx Biolabs. All rights reserved.</p>
            <p>Research Use Only · Not for human or veterinary consumption</p>
          </div>
        </footer>
      </main>
    </>
  );
}