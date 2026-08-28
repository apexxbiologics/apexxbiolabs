"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";

import FavoriteButton from "@/components/FavoriteButton";

export default function MitoXPage() {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [inventory, setInventory] = useState<number | null>(null);
  const [price, setPrice] = useState(70);

  const product = {
    id: "mitox-120mg",
    name: "MITO-X 120mg",
    image: "/images/mitox120blue.png",
    path: "/products/mitox",
  };

  const isOutOfStock = inventory !== null && inventory <= 0;

  const isLimitedStock =
    inventory !== null && inventory > 0 && inventory <= 5;

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

        const mitoX = data.products.find((item: any) => {
          const slug = item.slug?.toLowerCase().trim();
          const id = item.id?.toLowerCase().trim();
          const name = item.name?.toLowerCase().trim();
          const size = item.size?.toLowerCase().trim();

          return (
            slug === "mitox" ||
            slug === "mito-x" ||
            slug === "mitox-120mg" ||
            slug === "mito-x-120mg" ||
            id === "mitox-120mg" ||
            id === "mito-x-120mg" ||
            (name?.includes("mito-x") && size === "120mg") ||
            (name?.includes("mitox") && size === "120mg") ||
            name?.includes("mito-x 120") ||
            name?.includes("mitox 120")
          );
        });

        if (mitoX) {
          setInventory(Number(mitoX.inventory ?? 0));
          setPrice(Number(mitoX.price ?? 70));
        } else {
          setInventory(null);
          setPrice(70);
        }
      } catch (error) {
        console.error("Failed to fetch MITO-X product data:", error);

        setInventory(null);
        setPrice(70);
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

    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

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

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));

    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      {/* PRODUCT HERO */}
      <section className="relative px-6 md:px-10 py-16 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 items-start">

            {/* PRODUCT IMAGE */}
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

            {/* PRODUCT INFORMATION */}
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">

              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-4">
                Research Blend
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                {product.name}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                MITO-X is a multi-component research blend containing
                NAD+, MOTS-c, and 5-Amino-1MQ for laboratory investigation
                of mitochondrial, metabolic, redox, and cellular signaling
                pathways and associated molecular mechanisms.
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

              {!isLimitedStock && !isOutOfStock && (
                <div className="mb-8" />
              )}

              <div className="h-px bg-white/10 mb-8" />

              {/* SIZE + QUANTITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">

                <div>
                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Size
                  </p>

                  <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white">
                    120mg
                  </div>
                </div>

                <div>
                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Quantity
                  </p>

                  <div className="flex items-center w-fit rounded-full border border-white/10 bg-white/[0.04] p-2">

                    <button
                      onClick={() => {
                        setQuantity((prev) =>
                          Math.max(1, prev - 1)
                        );
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

              {/* RESEARCH FORMULATION */}
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 mb-6">

                <p className="text-xs uppercase tracking-[0.3em] text-[#A5D8FF] mb-4">
                  Research Formulation
                </p>

                <div className="space-y-3">

                  <div className="flex items-center justify-between gap-5">
                    <span className="text-white/60">
                      NAD+
                    </span>

                    <span className="font-semibold text-white">
                      100mg
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between gap-5">
                    <span className="text-white/60">
                      MOTS-c
                    </span>

                    <span className="font-semibold text-white">
                      10mg
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between gap-5">
                    <span className="text-white/60">
                      5-Amino-1MQ
                    </span>

                    <span className="font-semibold text-white">
                      10mg
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between gap-5">
                    <span className="text-white/60">
                      Total Content
                    </span>

                    <span className="font-semibold text-[#A5D8FF]">
                      120mg
                    </span>
                  </div>

                </div>
              </div>

              {/* COMPLIMENTARY GIFT */}
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 mb-6">

                <div className="flex items-center justify-center gap-2">

                  <svg
                    className="w-5 h-5 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7m16 0H4m16 0V8a1 1 0 00-1-1h-3.5M4 12V8a1 1 0 011-1h3.5m0 0a1.5 1.5 0 113 0m-3 0h3m0 0a1.5 1.5 0 113 0"
                    />
                  </svg>

                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                    Receive a Complimentary Gift With Any 8 Vials
                  </p>

                </div>
              </div>

              {/* BUTTONS */}
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

                    {added
                      ? "Added To Cart"
                      : "Add To Cart"}
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
                  View All COAs
                </a>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COA */}
      <section className="px-6 md:px-10 pb-16">

        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6">

          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">

            <div>

              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-xs mb-2">
                Quality Verification
              </p>

              <h3 className="text-2xl font-black text-white mb-5">
                Certificate of Analysis
              </h3>

              <div className="flex flex-wrap gap-3">

                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white/60 font-semibold">
                    Testing Pending
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white/60">
                    120mg Blend
                  </span>
                </div>

              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">

              <div className="uppercase tracking-widest text-white/40 text-xs">
                Laboratory Verification
              </div>

              <button
                type="button"
                disabled
                className="mt-4 cursor-not-allowed rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-white/40 font-semibold"
              >
                COA Coming Soon
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* QUALITY CARDS */}
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
              "Third-Party Testing",
              "Independent analytical testing when available.",
            ],

            [
              ClipboardCheck,
              "Batch Documented",
              "Batch-specific documentation maintained for verified lots.",
            ],

            [
              ShieldCheck,
              "Quality Focused",
              "Research formulation with documented component quantities.",
            ],
          ].map(([Icon, title, text]: any) => (

            <div
              key={title}
              className="flex gap-4"
            >

              <Icon
                className="text-[#A5D8FF]"
                size={34}
              />

              <div>

                <h3 className="text-white uppercase tracking-widest font-bold text-sm">
                  {title}
                </h3>

                <p className="text-white/50 text-sm mt-1">
                  {text}
                </p>

              </div>
            </div>
          ))}

        </div>
      </section>

      {/* RESEARCH PROFILE */}
      <section className="px-6 md:px-10 pb-16">

        <div className="max-w-7xl mx-auto rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">

          <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
            Research Profile
          </p>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Multi-Pathway Research Overview
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            MITO-X is studied in laboratory research involving multiple
            biochemical and cellular pathways associated with NAD+,
            MOTS-c, and 5-Amino-1MQ, including investigation of
            mitochondrial signaling, redox processes, metabolic
            mechanisms, and cellular regulation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            {[
              [
                "NAD+ Research",
                "Studied in biochemical models involving redox reactions, coenzyme activity, and cellular metabolic pathways.",
              ],

              [
                "MOTS-c Research",
                "Evaluated in laboratory models involving mitochondrial-derived signaling and associated molecular mechanisms.",
              ],

              [
                "5-Amino-1MQ Research",
                "Investigated in experimental models involving NNMT-associated biochemical pathways and cellular metabolic signaling.",
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

                <h3 className="text-white text-lg font-bold mb-3">
                  {title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed">
                  {text}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* RELATED RESEARCH */}
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

            {/* NAD+ */}
            <a
              href="/products/nad"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >

              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">

                <img
                  src="/images/nadblue.png"
                  alt="NAD+"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />

              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                NAD+
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Laboratory research involving cellular redox,
                coenzyme, and metabolic pathways.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>

            </a>

            {/* MOTS-C */}
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

              <h3 className="text-2xl font-black text-white mb-2">
                MOTS-C
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Studied in laboratory models involving mitochondrial
                signaling and metabolic research.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>

            </a>

            {/* 5-AMINO-1MQ */}
            <a
              href="/products/5amino1mq"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >

              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">

                <img
                  src="/images/5amino1mqblue.png"
                  alt="5-Amino-1MQ"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />

              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                5-Amino-1MQ
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Laboratory research involving NNMT-associated pathways
                and cellular metabolic signaling.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>

            </a>

          </div>
        </div>
      </section>

      {/* DISCLAIMERS */}
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

        <section
          key={section.title}
          className="px-6 md:px-10 pb-16"
        >

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