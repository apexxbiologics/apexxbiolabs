"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Search,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
  Mail,
} from "lucide-react";

export default function APX3Page() {
  const [added, setAdded] = useState(false);
  const [selectedMg, setSelectedMg] = useState<"10mg" | "20mg">("10mg");
  const [quantity, setQuantity] = useState(1);

  const productOptions = {
    "10mg": {
      id: "APX-3-10mg",
      name: "APX-3 10mg",
      price: 80,
      image: "/images/retatrutide.PNG",
    },
    "20mg": {
      id: "APX-3-20mg",
      name: "APX-3 20mg",
      price: 150,
      image: "/images/retatrutide20.PNG",
    },
  };

  const selectedProduct = productOptions[selectedMg];

  const addToCart = () => {
    const product = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
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
    <main className="min-h-screen bg-[#061426] text-white">
      <header className="sticky top-0 z-50 border-b border-blue-900/60 bg-[#04101f]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <a href="/">
            <img src="/images/logo.png" alt="Apexx Biolabs" className="h-14 w-auto" />
          </a>

          <nav className="hidden md:flex items-center gap-10 uppercase tracking-widest text-sm">
            <a href="/" className="hover:text-blue-400 transition-all">Home</a>
            <a href="/products" className="text-white border-b border-blue-500 pb-2">Products</a>
            <a href="/coas" className="hover:text-blue-400 transition-all">COAs</a>
            <a href="/about" className="hover:text-blue-400 transition-all">About</a>
            <a href="/contact" className="hover:text-blue-400 transition-all">Contact</a>
          </nav>

          <div className="flex items-center gap-5">
            <Search size={26} className="text-white" />
            <a href="/cart" className="relative">
              <ShoppingCart size={30} />
              <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {quantity}
              </span>
            </a>
          </div>
        </div>
      </header>

      <section className="px-6 md:px-10 pt-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-gray-400 text-sm mb-8 flex gap-3">
            <a href="/" className="hover:text-blue-300">Home</a>
            <span>›</span>
            <a href="/products" className="hover:text-blue-300">Products</a>
            <span>›</span>
            <span>Research Peptides</span>
            <span>›</span>
            <span>{selectedProduct.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">
            <div className="rounded-[28px] overflow-hidden border border-blue-700/70 bg-[#0a2b5c] shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="h-[520px] flex items-center justify-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-[35%] h-auto object-contain"
                />
              </div>
            </div>

            <div className="pt-2">
              <p className="uppercase tracking-[0.35em] text-blue-400 text-sm mb-4">
                Research Peptide
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5">
                {selectedProduct.name}
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-5">
                A high-purity, triple-agonist research peptide studied for its interaction
                with GIP, GLP-1, and glucagon receptor pathways. Extensively studied in
                metabolic regulation and body composition research.
              </p>

              <div className="mb-8 rounded-xl border border-blue-900/60 bg-[#081b33]/50 p-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Research Use Only. Products offered by Apexx Biolabs are intended
                  exclusively for lawful laboratory research and analytical applications.
                  These statements have not been evaluated by the U.S. Food and Drug
                  Administration. This product is not intended to diagnose, treat, cure,
                  or prevent any disease and is not for human or veterinary consumption.
                </p>
              </div>

              <p className="text-4xl font-black text-blue-400 mb-8">
                ${selectedProduct.price}.00
              </p>

              <div className="h-px bg-blue-900/70 mb-7" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-7">
                <div>
                  <p className="uppercase tracking-widest text-gray-400 text-sm mb-4">
                    Select Quantity (mg)
                  </p>

                  <div className="flex gap-3">
                    {(["10mg", "20mg"] as const).map((mg) => (
                      <button
                        key={mg}
                        onClick={() => {
                          setSelectedMg(mg);
                          setAdded(false);
                        }}
                        className={`px-7 py-4 rounded-xl border uppercase tracking-widest text-sm font-semibold transition-all ${
                          selectedMg === mg
                            ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_25px_rgba(37,99,235,0.45)]"
                            : "border-blue-800 text-blue-300 hover:border-blue-400"
                        }`}
                      >
                        {mg}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="uppercase tracking-widest text-gray-400 text-sm mb-4">
                    Quantity
                  </p>

                  <div className="flex items-center w-fit rounded-xl border border-blue-700 overflow-hidden">
                    <button
                      onClick={() => {
                        setQuantity((prev) => Math.max(1, prev - 1));
                        setAdded(false);
                      }}
                      className="w-16 h-14 text-2xl text-blue-300 hover:bg-blue-900/50"
                    >
                      −
                    </button>

                    <div className="w-16 h-14 flex items-center justify-center text-lg font-bold">
                      {quantity}
                    </div>

                    <button
                      onClick={() => {
                        setQuantity((prev) => prev + 1);
                        setAdded(false);
                      }}
                      className="w-16 h-14 text-2xl text-blue-300 hover:bg-blue-900/50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
                <button
                  onClick={addToCart}
                  className="bg-blue-600 hover:bg-blue-500 rounded-xl py-5 uppercase tracking-widest text-sm font-semibold transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={22} />
                  {added ? "Added" : "Add To Cart"}
                </button>

                <a href="/cart" className="border border-blue-700 hover:bg-blue-700 rounded-xl py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center">
                  Buy Now
                </a>

                <a href="/coas" className="border border-blue-700 hover:bg-blue-700 rounded-xl py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center">
                  View COA
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  ["Size", selectedMg],
                  ["Form", "Lyophilized Powder"],
                  ["Purity", "99%+"],
                  ["Storage", "2–8°C"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-blue-900/80 bg-[#081b33]/70 p-5">
                    <p className="uppercase tracking-widest text-gray-400 text-xs mb-2">
                      {label}
                    </p>
                    <p className="text-white text-base font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-8">
        <div className="max-w-7xl mx-auto rounded-2xl border border-blue-900 bg-[#081b33]/70 p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            [FlaskConical, "Research Use Only", "Strictly for laboratory research."],
            [ShieldCheck, "Third-Party Tested", "Independent lab verified."],
            [ClipboardCheck, "Batch Documented", "Full transparency."],
            [ShieldCheck, "Quality Guaranteed", "99%+ purity target."],
          ].map(([Icon, title, text]: any) => (
            <div key={title} className="flex gap-4">
              <Icon className="text-blue-400" size={34} />
              <div>
                <h3 className="text-blue-300 uppercase tracking-widest font-bold text-sm">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-2xl border border-blue-900/80 bg-[#081b33]/70 p-7">
          <h3 className="text-blue-400 font-bold uppercase tracking-[0.25em] text-sm mb-4">
            FDA Disclaimer
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            These statements have not been evaluated by the U.S. Food and Drug
            Administration. This product is not intended to diagnose, treat, cure,
            or prevent any disease. Products sold by Apexx Biolabs are intended
            strictly for lawful laboratory research use only and are not for human
            or veterinary consumption.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-2xl border border-blue-900/80 bg-[#081b33]/70 p-7">
          <h3 className="text-blue-400 font-bold uppercase tracking-[0.25em] text-sm mb-4">
            Customer Acknowledgment
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            By purchasing this product, the customer acknowledges that this material
            is intended solely for lawful laboratory research purposes and will not
            be used for human consumption, veterinary use, medical use, diagnosis,
            treatment, cure, or prevention of disease. Apexx Biolabs does not
            provide dosing instructions, treatment recommendations, medical advice,
            or guidance regarding human use of any product.
          </p>
        </div>
      </section>
    </main>
  );
}