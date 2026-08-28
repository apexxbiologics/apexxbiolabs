"use client";

import { useState } from "react";
import Link from "next/link";

const PRICE = 14.99;

export default function VialStorageCasePage() {
  const [quantity, setQuantity] = useState(1);

  const total = PRICE * quantity;

  const handleAddToCart = () => {
    // CONNECT THIS TO YOUR EXISTING CART FUNCTION
    console.log({
      name: "Vial Storage Case",
      slug: "vial-storage-case",
      price: PRICE,
      quantity,
      image: "/products/vial-case.png",
      category: "Accessories",
    });

    alert(`${quantity} Vial Storage Case added to cart`);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        
        {/* BACK BUTTON */}
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          ← Back to Products
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          
          {/* PRODUCT IMAGE */}
          <div>
            <div className="overflow-hidden rounded-[28px] bg-[#93C5FD]">
              <img
                src="/products/vial-case.png"
                alt="Apexx Biolabs Vial Storage Case"
                className="aspect-square h-full w-full object-cover"
              />
            </div>
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-4">
              <span className="rounded-full bg-[#93C5FD]/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                Lab Accessory
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Vial Storage Case
            </h1>

            <p className="mt-4 text-2xl font-semibold text-slate-950">
              $14.99
            </p>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
              Keep your research vials organized and protected with the
              Apexx Biolabs Vial Storage Case. Designed for convenient,
              compact storage with a clean laboratory-inspired design.
            </p>

            {/* FEATURES */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Organized Storage
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Keeps vials securely arranged.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Protective Case
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Helps protect stored vials.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Compact Design
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Easy to store and transport.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Apexx Design
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Matches your laboratory setup.
                </p>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mt-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-full border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-12 w-12 items-center justify-center text-xl text-slate-800 transition hover:bg-slate-100"
                >
                  −
                </button>

                <span className="w-12 text-center text-sm font-semibold text-slate-950">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-12 w-12 items-center justify-center text-xl text-slate-800 transition hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 w-full rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-slate-800"
            >
              Add to Cart — ${total.toFixed(2)}
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Laboratory storage accessory.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}