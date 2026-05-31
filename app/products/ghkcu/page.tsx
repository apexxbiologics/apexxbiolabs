"use client";

import { useState } from "react";

export default function GHKCUPage() {

      const [added, setAdded] = useState(false);
      const inStock = false;

  const addToCart = () => {
    const product = {
      id: "ghkcu",
      name: "GHK-Cu",
      price: 80,
      quantity: 1,
      image: "/images/ghkcu.PNG",
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = existingCart.find(
      (item: any) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...existingCart, product];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setAdded(true);
  };

    return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-blue-900 bg-black">

        <a
          href="/"
          className="text-sm uppercase tracking-widest text-blue-400 hover:text-blue-300"
        >
          ← Back to Home
        </a>

        <p className="uppercase tracking-[0.3em] text-gray-400 text-xs">
          Apexx Biologics
        </p>

      </header>

      {/* PRODUCT SECTION */}
      <section className="px-10 py-24">

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

          {/* IMAGE */}
          <div className="border border-blue-900 rounded-2xl p-10 bg-[#050505] shadow-[0_0_50px_rgba(37,99,235,0.15)]">

            <img
              src="/images/ghkcu.PNG"
              alt="GHK-Cu"
              className="w-full h-[500px] object-contain drop-shadow-[0_0_40px_rgba(37,99,235,0.3)]"
            />

          </div>

          {/* INFO */}
          <div>

            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-6">
              Research Peptide
            </p>

            <h1 className="text-6xl font-bold mb-6">
              GHK-Cu
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              High-purity GHK-Cu research peptide intended strictly
              for laboratory research applications and analytical use.
            </p>

            <div className="text-3xl font-bold text-blue-400 mb-10">
              $80.00
            </div>

            <div className="space-y-5 mb-10">

              <div className="flex justify-between border-b border-blue-950 pb-4">
                <span className="text-gray-400">Size</span>
                <span>100mg</span>
              </div>

              <div className="flex justify-between border-b border-blue-950 pb-4">
                <span className="text-gray-400">Form</span>
                <span>Lyophilized Powder</span>
              </div>

              <div className="flex justify-between border-b border-blue-950 pb-4">
                <span className="text-gray-400">Purity</span>
                <span>99%+</span>
              </div>

              <div className="flex justify-between border-b border-blue-950 pb-4">
                <span className="text-gray-400">Storage</span>
                <span>2–8°C</span>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-5">

  <div className="flex flex-col sm:flex-row gap-5">
{inStock ? (
  <button
    onClick={addToCart}
    className="bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.45)] px-10 py-5 uppercase tracking-widest text-sm font-semibold transition-all rounded-lg"
  >
    {added ? "Added To Cart" : "Add To Cart"}
  </button>
) : (
  <button
    disabled
    className="bg-gray-800 text-gray-500 cursor-not-allowed px-10 py-5 uppercase tracking-widest text-sm font-semibold rounded-lg border border-gray-700"
  >
    Out of Stock
  </button>
)}

{inStock && added && (    <a
      href="/cart"
      className="text-center border border-blue-700 hover:bg-blue-700 px-10 py-5 uppercase tracking-widest text-sm font-semibold transition-all rounded-lg"
    >
      View Cart
    </a>
  )}

</div>

              <a
                href="/coas"
                className="text-center border border-blue-700 hover:bg-blue-700 px-10 py-5 uppercase tracking-widest text-sm font-semibold transition-all rounded-lg"
              >
                View COA
              </a>
            </div>

            <div className="mt-10 border border-blue-900 rounded-2xl p-6 bg-[#050505]">
  <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">
    FDA Disclaimer
  </h3>

  <p className="text-gray-500 text-sm leading-relaxed">
    These statements have not been evaluated by the U.S. Food and Drug
    Administration. This product is not intended to diagnose, treat, cure, or
    prevent any disease. Products sold by Apexx Biolabs are intended strictly
    for laboratory research use only and are not for human or veterinary
    consumption.
  </p>
</div>

            <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest leading-relaxed">
              For laboratory research use only. Not for human consumption,
              medical use, veterinary use, diagnosis, treatment, or prevention
              of disease.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}