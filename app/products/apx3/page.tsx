"use client";

import { useState } from "react";

export default function APX3Page() {
  const [added, setAdded] = useState(false);
  const [selectedMg, setSelectedMg] = useState<"10mg" | "20mg">("10mg");

  const productOptions = {
    "10mg": {
      id: "APX-3-10mg",
      name: "APX-3 10mg",
      price: 80,
      quantityLabel: "10mg",
      image: "/images/retatrutide.PNG",
    },
    "20mg": {
      id: "APX-3-20mg",
      name: "APX-3 20mg",
      price: 150,
      quantityLabel: "20mg",
      image: "/images/retatrutide20.PNG",
    },
  };

  const selectedProduct = productOptions[selectedMg];

  const addToCart = () => {
    const product = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: 1,
      image: selectedProduct.image,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = existingCart.find((item: any) => item.id === product.id);

    const updatedCart = existingProduct
      ? existingCart.map((item: any) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...existingCart, product];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[#061426] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-12 py-6 border-b border-blue-900/70 bg-[#04101f]/95 backdrop-blur-xl">
        <a href="/">
          <img src="/images/logo.png" alt="Apexx Biolabs" className="h-14 w-auto" />
        </a>

        <nav className="flex items-center gap-4 text-sm uppercase tracking-widest">
          <a href="/" className="border border-blue-700 px-5 py-3 rounded-xl text-blue-300 hover:bg-blue-700 hover:text-white">
            Home
          </a>
          <a href="/products" className="border border-blue-700 px-5 py-3 rounded-xl text-blue-300 hover:bg-blue-700 hover:text-white">
            Products
          </a>
        </nav>
      </header>

      {/* PRODUCT HERO */}
      <section className="px-6 md:px-10 pt-16 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          
          {/* Horizontal Product Image */}
          <div className="relative rounded-[2rem] overflow-hidden border border-blue-800/70 bg-[#081b33] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-[520px] object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="rounded-[2rem] border border-blue-800/60 bg-[#081b33]/70 p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
            <p className="uppercase tracking-[0.35em] text-blue-400 text-sm mb-5">
              Research Peptide
            </p>

            <h1 className="text-5xl md:text-6xl font-black mb-5">
              {selectedProduct.name}
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              High-purity lyophilized research peptide intended strictly for laboratory
              research and analytical applications.
            </p>

            <div className="text-4xl font-black text-blue-400 mb-8">
              ${selectedProduct.price}.00
            </div>

            <div className="mb-8">
              <p className="text-gray-400 uppercase tracking-widest text-sm mb-4">
                Select Quantity
              </p>

              <div className="flex gap-4">
                {(["10mg", "20mg"] as const).map((mg) => (
                  <button
                    key={mg}
                    onClick={() => {
                      setSelectedMg(mg);
                      setAdded(false);
                    }}
                    className={`px-7 py-4 rounded-xl border uppercase tracking-widest text-sm font-semibold transition-all ${
                      selectedMg === mg
                        ? "border-blue-400 bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.45)]"
                        : "border-blue-800 text-blue-300 hover:border-blue-400"
                    }`}
                  >
                    {mg}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 mb-10">
              {[
                ["Size", selectedMg],
                ["Form", "Lyophilized Powder"],
                ["Purity", "99%+"],
                ["Storage", "2–8°C"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-blue-900/80 pb-4">
                  <span className="text-gray-400">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={addToCart}
                className="bg-blue-600 hover:bg-blue-500 px-8 py-5 uppercase tracking-widest text-sm font-semibold rounded-xl"
              >
                {added ? "Added" : "Add To Cart"}
              </button>

              <a
                href="/#shop"
                className="text-center border border-blue-700 hover:bg-blue-700 px-8 py-5 uppercase tracking-widest text-sm font-semibold rounded-xl"
              >
                Continue Shopping
              </a>

              <a
                href="/coas"
                className="text-center border border-blue-700 hover:bg-blue-700 px-8 py-5 uppercase tracking-widest text-sm font-semibold rounded-xl"
              >
                View COA
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-8">Compound Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-blue-900 bg-[#081b33] p-7">
              <h3 className="text-blue-300 font-bold uppercase tracking-widest mb-4">
                Molecular Profile
              </h3>
              <p className="text-gray-300 leading-relaxed">
                APX-3 is supplied as a lyophilized research peptide for laboratory research use only.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-900 bg-[#081b33] p-7">
              <h3 className="text-blue-300 font-bold uppercase tracking-widest mb-4">
                Storage Requirements
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Store refrigerated at 2–8°C. Protect from light and avoid repeated freeze-thaw cycles.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-900 bg-[#081b33] p-7">
              <h3 className="text-blue-300 font-bold uppercase tracking-widest mb-4">
                Documentation
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Batch documentation and COA access are provided for quality transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto rounded-2xl border border-yellow-500/50 bg-[#1f2937] p-7">
          <h3 className="text-yellow-300 font-bold uppercase tracking-widest text-sm mb-3">
            FDA Disclaimer
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            These statements have not been evaluated by the U.S. Food and Drug Administration.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
            Products sold by Apexx Biolabs are intended strictly for laboratory research use only
            and are not for human or veterinary consumption.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#081b33] border-t border-blue-900 px-6 pt-20 pb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div>
            <img src="/images/logo.png" alt="Apexx Biolabs" className="h-14 w-auto mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium research materials built on science, quality, and transparency.
              Third-party tested with batch documentation.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-5">Shop</h4>
            <div className="space-y-3 text-gray-400">
              <a href="/products" className="block hover:text-blue-300">All Products</a>
              <a href="/coas" className="block hover:text-blue-300">Certificates of Analysis</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-5">Resources</h4>
            <div className="space-y-3 text-gray-400">
              <a href="/peptide-info" className="block hover:text-blue-300">Peptide Info</a>
              <a href="/faq" className="block hover:text-blue-300">FAQ</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-5">Support</h4>
            <div className="space-y-3 text-gray-400">
              <a href="/contact" className="block hover:text-blue-300">Contact Us</a>
              <a href="/shipping" className="block hover:text-blue-300">Shipping Info</a>
              <a href="/refunds" className="block hover:text-blue-300">Returns & Refunds</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-5">Legal</h4>
            <div className="space-y-3 text-gray-400">
              <a href="/privacy" className="block hover:text-blue-300">Privacy Policy</a>
              <a href="/terms" className="block hover:text-blue-300">Terms & Conditions</a>
              <a href="/shipping" className="block hover:text-blue-300">Shipping Info</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between gap-4 text-gray-500 text-sm">
          <p>© 2026 Apexx Biolabs. All rights reserved.</p>
          <p>SSL Secured · 99%+ Purity · Research Use Only</p>
        </div>
      </footer>
    </main>
  );
}