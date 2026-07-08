"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
  Mail,
} from "lucide-react";

import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function BacWaterPage() {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [inventory, setInventory] = useState<number | null>(null);

  const product = {
    id: "bacwater",
    name: "Bacteriostatic Water",
    price: 20,
    image: "/images/bacwaterblue.png",
  };

  const isOutOfStock = inventory !== null && inventory <= 0;
  const isLimitedStock = inventory !== null && inventory > 0 && inventory <= 5;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!data.success) return;

        const bacwater = data.products.find(
          (product: any) =>
            product.slug === "bacwater" ||
            product.slug === "bac-water" ||
            product.slug === "bacteriostatic-water" ||
            product.id === "bacwater" ||
            product.id === "bac-water" ||
            product.name?.toLowerCase().includes("bacteriostatic") ||
            product.name?.toLowerCase().includes("bac water")
        );

        if (bacwater) {
          setInventory(bacwater.inventory ?? 0);
        } else {
          setInventory(null);
        }
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        setInventory(null);
      }
    };

    fetchInventory();
  }, []);

  const addToCart = () => {
    if (isOutOfStock) return;

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = existingCart.find(
      (item: any) => item.id === cartProduct.id
    );

    const updatedCart = existingProduct
      ? existingCart.map((item: any) =>
          item.id === cartProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...existingCart, cartProduct];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      <section className="relative px-6 md:px-10 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 items-start">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[520px] h-[520px] rounded-[48px] overflow-hidden border border-blue-400/10 bg-white/[0.03] backdrop-blur-sm shadow-[0_0_30px_rgba(96,165,250,0.15)]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
                Research Reconstitution Solution
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                {product.name}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                30mL bacteriostatic reconstitution solution intended strictly
                for laboratory research applications and analytical preparation
                use.
              </p>

              <p className="text-5xl font-black text-white mb-3">
                ${product.price}.00
              </p>

              {isLimitedStock && (
                <div className="font-semibold mb-8 text-yellow-300">
                  Limited Stock
                </div>
              )}

              {isOutOfStock && (
                <div className="font-semibold mb-8 text-red-300">
                  Out of Stock
                </div>
              )}

              {!isLimitedStock && !isOutOfStock && <div className="mb-8" />}

              <div className="h-px bg-white/10 mb-8" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Volume
                  </p>

                  <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white">
                    30mL
                  </div>
                </div>

                <div>
                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Quantity
                  </p>

                  <div className="flex items-center w-fit rounded-full border border-white/10 bg-white/[0.04] p-2">
                    <button
                      onClick={() => {
                        setQuantity((prev) => Math.max(1, prev - 1));
                        setAdded(false);
                      }}
                      className="w-11 h-11 rounded-full text-2xl text-blue-300 hover:bg-white/[0.08]"
                    >
                      −
                    </button>

                    <div className="w-12 h-11 flex items-center justify-center text-lg font-bold">
                      {quantity}
                    </div>

                    <button
                      onClick={() => {
                        setQuantity((prev) =>
                          inventory === null
                            ? prev + 1
                            : Math.min(inventory, prev + 1)
                        );
                        setAdded(false);
                      }}
                      disabled={isOutOfStock}
                      className="w-11 h-11 rounded-full text-2xl text-blue-300 hover:bg-white/[0.08] disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="bg-white/[0.06] text-white/30 cursor-not-allowed rounded-full py-5 uppercase tracking-widest text-sm font-semibold"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    onClick={addToCart}
                    className="bg-white text-[#081526] hover:bg-blue-100 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={22} />
                    {added ? "Added To Cart" : "Add To Cart"}
                  </button>
                )}

                <a
                  href="/cart"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  View Cart
                </a>

                <a
                  href="/products"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  Continue Shopping
                </a>

                <a
                  href="/images/coas/bacwater-coa.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  View COA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="uppercase tracking-[0.35em] text-blue-300 text-xs mb-2">
                Parrox
              </p>

              <h3 className="text-2xl font-black text-white mb-5">
                Latest Certificate of Analysis
              </h3>

              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="text-green-400 font-semibold">
                    ✓ pH Pass
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    0.85% Benzyl Alcohol
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    99.10% Recovery
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white/70">
                    Lot: PRX-2026-04-A
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="text-5xl font-black text-[#A5D8FF]">Pass</div>

              <div className="uppercase tracking-widest text-white/40 text-xs mt-1">
                QC Status
              </div>

              <a
                href="/images/coas/bacwater-coa.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 rounded-full border border-blue-400/20 bg-blue-400/10 px-6 py-3 text-blue-300 font-semibold hover:bg-blue-400/20 transition-all"
              >
                View Full COA
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            [FlaskConical, "Research Use Only", "Strictly for laboratory research."],
            [ShieldCheck, "Third-Party Tested", "Analytical documentation available."],
            [ClipboardCheck, "Batch Documented", "Lot PRX-2026-04-A verified."],
            [ShieldCheck, "QC Status", "pH, BA content, and recovery passed."],
          ].map(([Icon, title, text]: any) => (
            <div key={title} className="flex gap-4">
              <Icon className="text-blue-300" size={34} />

              <div>
                <h3 className="text-white uppercase tracking-widest font-bold text-sm">
                  {title}
                </h3>

                <p className="text-white/50 text-sm mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-3">
            Research Profile
          </p>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Reconstitution Solution Overview
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            Bacteriostatic water is used in laboratory research workflows as a
            sterile reconstitution solution for research preparation and
            analytical handling.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              ["Volume", "30mL research-use reconstitution solution."],
              ["pH Testing", "pH result of 7.0 within specification range."],
              ["Benzyl Alcohol", "0.85% benzyl alcohol content verified by testing."],
              ["Storage", "Store as directed on product label. Keep sealed and protected from contamination."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 hover:border-blue-400/50 transition-all"
              >
                <h3 className="text-white text-lg font-bold mb-3">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {[
        {
          title: "FDA Disclaimer",
          text:
            "These statements have not been evaluated by the U.S. Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only and are not for human or veterinary consumption.",
        },
        {
          title: "Customer Acknowledgment",
          text:
            "By purchasing this product, the customer acknowledges that this material is intended solely for lawful laboratory research purposes and will not be used for human consumption, veterinary use, medical use, diagnosis, treatment, cure, or prevention of disease. Apexx Biolabs does not provide dosing instructions, treatment recommendations, medical advice, or guidance regarding human use of any product.",
        },
      ].map((section) => (
        <section key={section.title} className="px-6 md:px-10 pb-16">
          <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
            <h3 className="text-blue-300 font-bold uppercase tracking-[0.25em] text-sm mb-4">
              {section.title}
            </h3>

            <p className="text-white/60 text-sm leading-relaxed">
              {section.text}
            </p>
          </div>
        </section>
      ))}

    </main>
  );
}