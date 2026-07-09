"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";

import FavoriteButton from "@/components/FavoriteButton";

export default function FiveAmino1MQPage() {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [inventory, setInventory] = useState<number | null>(null);
  const [price, setPrice] = useState(55);

  const product = {
    id: "5amino1mq-50mg",
    name: "5-Amino-1MQ 50mg",
    image: "/images/5amino1mqblue.png",
    path: "/products/5amino1mq",
  };

  const isOutOfStock = inventory !== null && inventory <= 0;
  const isLimitedStock = inventory !== null && inventory > 0 && inventory <= 5;

  const favoriteProduct = {
    id: product.id,
    name: product.name,
    price,
    image: product.image,
    path: product.path,
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!data.success) return;

        const fiveAmino = data.products.find(
          (item: any) =>
            item.slug === "5amino1mq" ||
            item.slug === "5amino1mq-50mg" ||
            item.id === "5amino1mq" ||
            item.id === "5amino1mq-50mg" ||
            item.id === "5-AMINO-1MQ-50mg" ||
            item.name?.toLowerCase().includes("5-amino") ||
            item.name?.toLowerCase().includes("5amino")
        );

        if (fiveAmino) {
          setInventory(Number(fiveAmino.inventory ?? 0));
          setPrice(Number(fiveAmino.price ?? 55));
        } else {
          setInventory(null);
          setPrice(55);
        }
      } catch (error) {
        console.error("Failed to fetch 5-Amino-1MQ data:", error);
        setInventory(null);
        setPrice(55);
      }
    };

    fetchProductData();
  }, []);

  const addToCart = () => {
    if (isOutOfStock) return;

    const cartProduct = {
      id: product.id,
      name: product.name,
      price,
      quantity,
      image: product.image,
      path: product.path,
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
                price,
                path: product.path,
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
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-4">
                Research Compound
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                {product.name}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                High-purity 5-Amino-1MQ produced for laboratory research
                involving NNMT-related pathways, cellular metabolism, adipocyte
                signaling, metabolic regulation, and energy balance research
                models.
              </p>

              <p className="text-5xl font-black text-white mb-3">
                ${price.toFixed(2)}
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
                    Size
                  </p>

                  <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white">
                    50mg
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
                          inventory === null
                            ? prev + 1
                            : Math.min(inventory, prev + 1)
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

      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            [FlaskConical, "Research Use Only", "Strictly for laboratory research."],
            [ShieldCheck, "Third-Party Tested", "Independent lab verified when available."],
            [ClipboardCheck, "Batch Documented", "Documentation available for verified lots."],
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
            5-Amino-1MQ Research Overview
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            5-Amino-1MQ is studied in laboratory research for its relationship
            to NNMT-associated pathways and metabolic signaling. Research models
            commonly evaluate its role in cellular energy balance, adipocyte
            biology, and metabolic regulation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              [
                "NNMT Pathways",
                "Studied for activity involving nicotinamide N-methyltransferase-related pathways.",
              ],
              [
                "Metabolic Signaling",
                "Evaluated in models involving energy balance and metabolic regulation.",
              ],
              [
                "Adipocyte Research",
                "Frequently researched in adipocyte biology and body composition models.",
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

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
              Frequently Researched Together
            </p>

            <h2 className="text-3xl md:text-4xl font-black text-white">
              Pair With Related Research Compounds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "MOTS-C 10mg",
                image: "/images/motscblue.png",
                path: "/products/mots-c",
                text: "Often researched in models involving mitochondrial signaling, metabolic regulation, and cellular energy pathways.",
              },
              {
                name: "Tesamorelin 5mg",
                image: "/images/tesa5.png",
                path: "/products/tesamorelin-5mg",
                text: "Studied in research models involving GH-axis signaling, body composition, and metabolic pathway regulation.",
              },
              {
                name: "CJC/Ipamorelin 10mg",
                image: "/images/cjcipa.png",
                path: "/products/cjc-ipa",
                text: "Commonly evaluated in research involving growth hormone secretagogue pathways and recovery-related models.",
              },
            ].map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="group rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 hover:border-blue-400/50 hover:bg-white/[0.06] transition-all"
              >
                <div className="mb-5 h-[260px] rounded-[28px] overflow-hidden border border-blue-400/10 bg-white/[0.03] flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="text-white text-2xl font-black mb-3">
                  {item.name}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed mb-5">
                  {item.text}
                </p>

                <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#A5D8FF] group-hover:bg-blue-500/10 transition-all">
                  View Product
                </div>
              </a>
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