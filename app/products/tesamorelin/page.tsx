"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";

import FavoriteButton from "@/components/FavoriteButton";

export default function TesamorelinPage() {
  const [added, setAdded] = useState(false);
  const [selectedMg, setSelectedMg] = useState<"5mg" | "10mg">("5mg");
  const [quantity, setQuantity] = useState(1);

  const [productData, setProductData] = useState({
    "5mg": {
      inventory: 0,
      price: 45,
    },
    "10mg": {
      inventory: 0,
      price: 85,
    },
  });

  const productOptions = {
    "5mg": {
      id: "tesamorelin-5mg",
      name: "Tesamorelin 5mg",
      image: "/images/tesa5blue.png",
      path: "/products/tesamorelin",
    },
    "10mg": {
      id: "tesamorelin-10mg",
      name: "Tesamorelin 10mg",
      image: "/images/tesa10blue.png",
      path: "/products/tesamorelin",
    },
  };

  const selectedProduct = productOptions[selectedMg];
  const selectedInventory = productData[selectedMg].inventory;
  const selectedPrice = productData[selectedMg].price;

  const isOutOfStock = selectedInventory <= 0;
  const isLimitedStock = selectedInventory > 0 && selectedInventory <= 5;

  const favoriteProduct = {
    id: selectedProduct.id,
    name: selectedProduct.name,
    price: selectedPrice,
    image: selectedProduct.image,
    path: selectedProduct.path,
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!data.success) return;

        const tesa5 = data.products.find((item: any) => {
          const slug = item.slug?.toLowerCase().trim();
          const name = item.name?.toLowerCase().trim();
          const size = item.size?.toLowerCase().trim();

          return (
            slug === "tesamorelin-5mg" ||
            slug === "tesa-5mg" ||
            item.id === "tesamorelin-5mg" ||
            item.id === "TESAMORELIN-5mg" ||
            (name?.includes("tesamorelin") && size === "5mg") ||
            name?.includes("tesamorelin 5")
          );
        });

        const tesa10 = data.products.find((item: any) => {
          const slug = item.slug?.toLowerCase().trim();
          const name = item.name?.toLowerCase().trim();
          const size = item.size?.toLowerCase().trim();

          return (
            slug === "tesamorelin-10mg" ||
            slug === "tesa-10mg" ||
            item.id === "tesamorelin-10mg" ||
            item.id === "TESAMORELIN-10mg" ||
            (name?.includes("tesamorelin") && size === "10mg") ||
            name?.includes("tesamorelin 10")
          );
        });

        setProductData({
          "5mg": {
            inventory: Number(tesa5?.inventory ?? 0),
            price: Number(tesa5?.price ?? 45),
          },
          "10mg": {
            inventory: Number(tesa10?.inventory ?? 0),
            price: Number(tesa10?.price ?? 85),
          },
        });
      } catch (error) {
        console.error("Failed to fetch Tesamorelin data:", error);
      }
    };

    fetchProductData();
  }, []);

  const addToCart = () => {
    if (isOutOfStock) return;

    const cartProduct = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedPrice,
      quantity,
      image: selectedProduct.image,
      path: selectedProduct.path,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = existingCart.find(
      (item: any) => item.id === cartProduct.id
    );

    const updatedCart = existingProduct
      ? existingCart.map((item: any) =>
          item.id === cartProduct.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                price: selectedPrice,
                path: selectedProduct.path,
              }
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 items-start">
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[520px] h-[520px] rounded-[48px] overflow-hidden border border-blue-400/10 bg-white/[0.03] backdrop-blur-sm shadow-[0_0_30px_rgba(96,165,250,0.15)]">
                <FavoriteButton product={favoriteProduct} />

                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-4">
                Research Peptide
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                {selectedProduct.name}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                High-purity Tesamorelin research peptide studied in laboratory
                models involving growth hormone-releasing hormone receptor
                pathways, GH signaling, IGF-1 response pathways, and metabolic
                regulation.
              </p>

              <p className="text-5xl font-black text-white mb-3">
                ${selectedPrice.toFixed(2)}
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
                    Select Size
                  </p>

                  <div className="flex gap-3">
                    {(["5mg", "10mg"] as const).map((mg) => (
                      <button
                        key={mg}
                        onClick={() => {
                          setSelectedMg(mg);
                          setAdded(false);
                          setQuantity(1);
                        }}
                        className={`px-7 py-4 rounded-full border uppercase tracking-widest text-sm font-semibold transition-all ${
                          selectedMg === mg
                            ? "bg-white text-[#081526] border-white"
                            : "border-white/10 bg-white/[0.04] text-white/70 hover:border-blue-400/50 hover:text-white"
                        }`}
                      >
                        {mg}
                      </button>
                    ))}
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
                      className="w-11 h-11 rounded-full text-2xl text-[#A5D8FF] hover:bg-white/[0.08]"
                    >
                      −
                    </button>

                    <div className="w-12 h-11 flex items-center justify-center text-lg font-bold">
                      {quantity}
                    </div>

                    <button
                      onClick={() => {
                        setQuantity((prev) =>
                          Math.min(selectedInventory || 1, prev + 1)
                        );
                        setAdded(false);
                      }}
                      disabled={isOutOfStock}
                      className="w-11 h-11 rounded-full text-2xl text-[#A5D8FF] hover:bg-white/[0.08] disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 mb-6">
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider text-center">
                  FREE BACTERIOSTATIC WATER WITH PURCHASE OF ANY 4 VIALS
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
                  href="/coas"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  View COA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* COA Summary */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-xs mb-2">
                Freedom Diagnostics
              </p>

              <h3 className="text-2xl font-black text-white mb-5">
                Latest Certificate of Analysis
              </h3>

              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="text-green-400 font-semibold">
                    ✓ Identity Confirmed
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    99.89% Purity
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    5.48mg Content
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white/70">
                    Lot: Red Cap-1
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="text-5xl font-black text-[#A5D8FF]">
                99.89%
              </div>

              <div className="uppercase tracking-widest text-white/40 text-xs mt-1">
                Purity
              </div>

              <a
                href="/images/coas/tesamorelincoa7-10-26.pdf"
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
            [
              FlaskConical,
              "Research Use Only",
              "Strictly for laboratory research.",
            ],
            [
              ShieldCheck,
              "Third-Party Tested",
              "Independent lab verified when available.",
            ],
            [
              ClipboardCheck,
              "Batch Documented",
              "Documentation available for verified lots.",
            ],
            [ShieldCheck, "Quality Target", "99%+ purity target."],
          ].map(([Icon, title, text]: any) => (
            <div key={title} className="flex gap-4">
              <Icon className="text-[#A5D8FF]" size={34} />

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
          <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
            Research Profile
          </p>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            GH-Releasing Pathway Overview
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            Tesamorelin is studied in laboratory research for its interaction
            with growth hormone-releasing hormone receptor pathways, commonly
            evaluated in endocrine signaling, IGF-1 response, and metabolic
            research models.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              [
                "GHRH Pathway",
                "Studied for growth hormone-releasing hormone receptor signaling.",
              ],
              [
                "IGF-1 Response",
                "Evaluated in research models involving downstream IGF-1 activity.",
              ],
              [
                "Metabolic Research",
                "Used in laboratory studies involving body composition and metabolic pathways.",
              ],
              [
                "Storage",
                "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use.",
              ],
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

      {/* Frequently Researched Together */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
              Related Research
            </p>

            <h2 className="text-3xl md:text-4xl font-black text-white">
              Frequently Researched Together
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/products/cjcipa"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/cjcipablue.png"
                  alt="CJC/IPA"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">CJC/IPA</h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Research involving growth hormone signaling pathways and
                endocrine response models.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>

            <a
              href="/products/motsc"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/motscblue.png"
                  alt="MOTS-C"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">MOTS-C</h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Studied in laboratory models involving mitochondrial signaling
                and metabolic research.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>

            <a
              href="/products/apx3"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/apx310blue.png"
                  alt="APX-3"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">APX-3</h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Research involving metabolic signaling, energy regulation, and
                body composition models.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>
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
            <h3 className="text-[#A5D8FF] font-bold uppercase tracking-[0.25em] text-sm mb-4">
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