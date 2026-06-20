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
  <div className="fixed inset-0 z-[999] h-[100dvh] w-full overflow-hidden">

    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/videos/disclaimer-bg.mp4" type="video/mp4" />
    </video>

    <div className="absolute inset-0 bg-[#EAF4FF]/15" />

    <div className="relative z-10 h-[100dvh] w-full overflow-y-auto px-4 py-6">
      <div className="min-h-full flex items-start md:items-center justify-center">
        <div className="w-full max-w-xl rounded-[32px] bg-[#DDEEFF]/98 border border-blue-200 p-6 md:p-8 shadow-[0_20px_80px_rgba(59,130,246,0.15)]">

          <div className="text-center mb-5">
            <img
              src="/images/logo.png"
              alt="Apexx Biolabs"
              className="h-14 md:h-20 w-auto mx-auto mb-4"
            />

            <p className="uppercase tracking-[0.3em] text-blue-500 text-[10px] md:text-xs mb-3">
              Research Use Verification
            </p>

            <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-3">
              Welcome to Apexx Biolabs
            </h1>

            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              Premium research compounds supported by batch documentation,
              analytical review, and research-use transparency.
            </p>
          </div>

          <div className="border border-blue-200 bg-[#F5FAFF] rounded-2xl p-4 md:p-5 mb-5">
            <p className="text-slate-700 text-xs md:text-sm leading-relaxed mb-4">
              Products sold on this website are intended strictly for lawful
              laboratory research use only and are not for human consumption,
              medical use, veterinary use, diagnosis, treatment, cure, or
              prevention of disease.
            </p>

            <label className="flex items-start gap-3 cursor-pointer border border-blue-200 rounded-xl p-3 md:p-4 bg-white">
              <input
                type="checkbox"
                checked={disclaimerChecked}
                onChange={(e) => setDisclaimerChecked(e.target.checked)}
                className="mt-1 accent-blue-500 shrink-0"
              />

              <span className="text-slate-700 text-xs md:text-sm leading-relaxed">
                I confirm that I am at least 21 years of age and understand
                that all products sold by Apexx Biolabs are intended strictly
                for lawful laboratory research use only.
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => setAccepted(true)}
            disabled={!disclaimerChecked}
            className={`w-full py-3 md:py-4 rounded-xl uppercase tracking-[0.2em] text-xs md:text-sm font-semibold transition-all ${
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
  </div>
)}

      <main className="min-h-screen bg-[#071A2F] text-white">
        {/* HEADER */}
  <div className="flex h-24 items-center justify-between bg-[#f3f9ff] px-10 shadow-sm">
    <a href="/" className="flex items-center">
      <img
        src="/logo.png"
        alt="APEXX BIOLABS"
        className="h-16 w-auto"
      />
    </a>

    <nav className="hidden md:flex items-center gap-12 text-sm font-bold uppercase tracking-[0.22em] text-slate-900">
      <a href="/" className="border-b-2 border-blue-600 pb-2 text-blue-600">
        Home
      </a>
      <a href="/products" className="hover:text-blue-600 transition">
        Products
      </a>
      <a href="/coas" className="hover:text-blue-600 transition">
        COAs
      </a>
      <a href="/about" className="hover:text-blue-600 transition">
        About
      </a>
      <a href="/contact" className="hover:text-blue-600 transition">
        Contact
      </a>
    </nav>

    <div className="flex items-center gap-6 text-slate-900">
      <button className="text-3xl hover:text-blue-600 transition">
        ⌕
      </button>

      <a href="/cart" className="relative text-3xl hover:text-blue-600 transition">
        🛒
        <span className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          10
        </span>
      </a>
    </div>
  </div>

<section className="relative overflow-hidden bg-[#061a33]">
  {/* Background image smaller / better positioned */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: "url('/hero-bg.png')",
    }}
  />

  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#061a33] via-[#061a33]/85 to-[#061a33]/30" />

  <div className="relative z-10 mx-auto max-w-7xl px-8 pt-20 pb-16">
    <div className="grid min-h-[640px] items-center gap-10 lg:grid-cols-2">
      
      {/* Text */}
      <div>
        <h1 className="text-6xl font-extrabold leading-[0.95] tracking-tight text-white md:text-8xl">
          Science.
          <br />
          Quality.
          <br />
          <span className="text-blue-400">Results.</span>
        </h1>

        <p className="mt-8 max-w-xl text-xl leading-relaxed text-blue-50">
          High-purity research peptides and solutions,
          third-party tested and batch documented.
        </p>

        <div className="mt-10 flex flex-wrap gap-6">
          <a
            href="/products"
            className="rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition"
          >
            Shop Products →
          </a>

          <a
            href="/coas"
            className="rounded-xl border border-blue-400 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-blue-500/20 transition"
          >
            View COAs →
          </a>
        </div>
      </div>

      {/* Smaller product image */}
      <div className="hidden lg:flex justify-center">
        <img
          src="/hero-vial.png"
          alt="APEXX BIOLABS research vial"
          className="max-h-[520px] w-auto object-contain drop-shadow-2xl"
        />
      </div>
    </div>

    {/* Bottom info bar */}
    <div className="grid gap-0 overflow-hidden rounded-2xl border border-blue-400/20 bg-[#071f3d]/85 backdrop-blur-xl md:grid-cols-3">
      <div className="flex items-center gap-6 p-8">
        <div className="text-5xl text-blue-400">♢</div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-blue-200">
            Third-Party Tested
          </h3>
          <p className="mt-2 text-blue-100/80">
            Independent lab verified.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 border-blue-400/20 p-8 md:border-l">
        <div className="text-5xl text-blue-400">⚗</div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-blue-200">
            Research Use Only
          </h3>
          <p className="mt-2 text-blue-100/80">
            For laboratory research purposes.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 border-blue-400/20 p-8 md:border-l">
        <div className="text-5xl text-blue-400">☑</div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-blue-200">
            Batch Documented
          </h3>
          <p className="mt-2 text-blue-100/80">
            Full transparency with every batch.
          </p>
        </div>
      </div>
    </div>
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