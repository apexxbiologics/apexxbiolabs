"use client";

import { useState } from "react";

export default function RetatrutidePage() {
  const [added, setAdded] = useState(false);
  const [selectedMg, setSelectedMg] = useState<"10mg" | "20mg">("10mg");

  const productOptions = {
    "10mg": {
      id: "retatrutide-10mg",
      name: "Retatrutide 10mg",
      price: 80,
      quantityLabel: "10mg",
      image: "/images/retatrutide.PNG",
    },
    "20mg": {
      id: "retatrutide-20mg",
      name: "Retatrutide 20mg",
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
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-10 py-6 border-b border-blue-900 bg-black">
        <a
          href="/"
          className="text-sm uppercase tracking-widest text-blue-400 hover:text-blue-300"
        >
          ← Back to Home
        </a>

        <p className="uppercase tracking-[0.3em] text-gray-400 text-xs">
          Apexx Biolabs
        </p>
      </header>

      <section className="px-10 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="border border-blue-900 rounded-2xl p-10 bg-[#050505] shadow-[0_0_50px_rgba(37,99,235,0.15)]">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-[500px] object-contain"
            />
          </div>

          <div>
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-6">
              Research Peptide
            </p>

            <h1 className="text-6xl font-bold mb-6">
              {selectedProduct.name}
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              High-purity lyophilized research peptide intended strictly for
              laboratory research and analytical applications.
            </p>

            <div className="text-3xl font-bold text-blue-400 mb-8">
              ${selectedProduct.price}.00
            </div>

            <div className="mb-10">
              <p className="text-gray-400 uppercase tracking-widest text-sm mb-4">
                Select Quantity
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedMg("10mg");
                    setAdded(false);
                  }}
                  className={`px-6 py-3 rounded-lg border uppercase tracking-widest text-sm font-semibold transition-all ${
                    selectedMg === "10mg"
                      ? "border-blue-400 bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.35)]"
                      : "border-blue-900 text-blue-400 hover:border-blue-500"
                  }`}
                >
                  10mg
                </button>

                <button
                  onClick={() => {
                    setSelectedMg("20mg");
                    setAdded(false);
                  }}
                  className={`px-6 py-3 rounded-lg border uppercase tracking-widest text-sm font-semibold transition-all ${
                    selectedMg === "20mg"
                      ? "border-blue-400 bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.35)]"
                      : "border-blue-900 text-blue-400 hover:border-blue-500"
                  }`}
                >
                  20mg
                </button>
              </div>
            </div>

            <div className="space-y-5 mb-10">
              <div className="flex justify-between border-b border-blue-950 pb-4">
                <span className="text-gray-400">Quantity</span>
                <span>{selectedProduct.quantityLabel}</span>
              </div>

              <div className="flex justify-between border-b border-blue-950 pb-4">
                <span className="text-gray-400">Form</span>
                <span>Lyophilized Powder</span>
              </div>

              <div className="flex justify-between border-b border-blue-950 pb-4">
                <span className="text-gray-400">Testing</span>
                <span>HPLC Verified</span>
              </div>

              <div className="flex justify-between border-b border-blue-950 pb-4">
                <span className="text-gray-400">Storage</span>
                <span>2–8°C</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={addToCart}
                className="bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.45)] px-10 py-5 uppercase tracking-widest text-sm font-semibold transition-all rounded-lg"
              >
                {added ? "Added To Cart" : "Add To Cart"}
              </button>

              {added && (
                <a
                  href="/cart"
                  className="text-center border border-blue-700 hover:bg-blue-700 px-10 py-5 uppercase tracking-widest text-sm font-semibold transition-all rounded-lg"
                >
                  View Cart
                </a>
              )}

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

<div className="mt-6 border border-blue-900 rounded-2xl p-6 bg-[#050505]">
  <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">
    Customer Acknowledgment
  </h3>

  <p className="text-gray-500 text-sm leading-relaxed">
    By purchasing this product, the customer acknowledges that this material is
    intended solely for lawful laboratory research purposes and will not be used
    for human consumption, veterinary use, medical use, diagnosis, treatment,
    cure, or prevention of disease. Apexx Biolabs does not provide dosing
    instructions, treatment recommendations, medical advice, or guidance
    regarding human use of any product.
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