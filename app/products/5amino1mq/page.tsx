"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";

import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import FavoriteButton from "@/components/FavoriteButton";

export default function FiveAmino1MQPage() {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [productData, setProductData] = useState({
    inventory: 0,
    price: 55,
  });

  const product = {
    id: "5-AMINO-1MQ-50mg",
    name: "5-Amino-1MQ 50mg",
    image: "/images/5amino1mqblue.png",
  };

  const selectedInventory = productData.inventory;
  const selectedPrice = productData.price;
  const inStock = selectedInventory > 0;
const favoriteProduct = {
  id: product.id,
  name: product.name,
  price: selectedPrice,
  image: product.image,
};

  const products = [
    { name: "5-Amino-1MQ", keywords: ["5amino", "5 amino", "5-amino", "5amino1mq", "5-amino-1mq"], path: "/products/5amino1mq" },
    { name: "Acetic Acid", keywords: ["acetic", "acetic acid"], path: "/products/aceticacid" },
    { name: "APX-3", keywords: ["apx", "apx3", "apx-3"], path: "/products/apx3" },
    { name: "Adamax", keywords: ["adamax"], path: "/products/adamax" },
    { name: "AOD-9604", keywords: ["aod", "aod9604", "aod-9604"], path: "/products/aod9604" },
    { name: "ARA-290", keywords: ["ara", "ara290", "ara-290"], path: "/products/ara290" },
    { name: "Bacteriostatic Water", keywords: ["bac water", "water", "bacteriostatic"], path: "/products/bacwater" },
    { name: "BPC-157", keywords: ["bpc", "bpc157", "bpc-157"], path: "/products/bpc157" },
    { name: "CJC/IPA", keywords: ["cjc", "ipa", "cjc ipa", "cjc/ipa"], path: "/products/cjcipa" },
    { name: "GHK-Cu", keywords: ["ghk", "ghkcu", "ghk-cu"], path: "/products/ghkcu" },
    { name: "KPV", keywords: ["kpv"], path: "/products/kpv" },
    { name: "MOTS-C", keywords: ["mots", "motsc", "mots-c"], path: "/products/motsc" },
    { name: "NAD+", keywords: ["nad", "nad+", "nicotinamide adenine dinucleotide"], path: "/products/nad" },
    { name: "PE-22-28", keywords: ["pe", "pe2228", "pe-22-28"], path: "/products/pe2228" },
    { name: "Pinealon", keywords: ["pinealon"], path: "/products/pinealon" },
    { name: "PT-141", keywords: ["pt", "pt141", "pt-141", "bremelanotide"], path: "/products/pt141" },
    { name: "Selank", keywords: ["selank"], path: "/products/selank" },
    { name: "Semax", keywords: ["semax"], path: "/products/semax" },
    { name: "TB-500", keywords: ["tb", "tb500", "tb-500"], path: "/products/tb500" },
    { name: "Tesamorelin", keywords: ["tesa", "tesamorelin"], path: "/products/tesamorelin" },
  ];

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!data.success) return;

        const fiveAmino = data.products.find(
          (product: any) => product.slug === "5amino1mq-50mg"
        );

        setProductData({
          inventory: Number(fiveAmino?.inventory ?? 0),
          price: Number(fiveAmino?.price ?? 55),
        });
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };

    fetchProductData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchTerm.toLowerCase().trim();

    const match = products.find(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.keywords.some((keyword) => keyword.includes(query))
    );

    if (match) {
      window.location.href = match.path;
    }
  };

  const addToCart = () => {
    if (!inStock) return;

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: selectedPrice,
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
              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
                Research Compound
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                {product.name}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                High-purity 5-Amino-1MQ produced for laboratory research involving
                NNMT-related pathways, cellular metabolism, adipocyte signaling,
                metabolic regulation, and energy balance research models.
              </p>

              <p className="text-5xl font-black text-white mb-3">
                ${selectedPrice.toFixed(2)}
              </p>

              <div className={`font-semibold mb-8 ${inStock ? "text-blue-300" : "text-red-300"}`}>
                {selectedInventory <= 5 && (
                  <div className={`font-semibold mb-8 ${selectedInventory <= 0 ? "text-red-300" : "text-yellow-300"}`}>
                    {selectedInventory <= 0 ? "Out of Stock" : "Limited Stock"}
                  </div>
                )}
              </div>

              <div className="h-px bg-white/10 mb-8" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Size
                  </p>

                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 w-fit uppercase tracking-widest text-sm font-semibold text-white">
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
                      className="w-11 h-11 rounded-full text-2xl text-blue-300 hover:bg-white/[0.08]"
                    >
                      −
                    </button>

                    <div className="w-12 h-11 flex items-center justify-center text-lg font-bold">
                      {quantity}
                    </div>

                    <button
                      onClick={() => {
                        setQuantity((prev) => Math.min(selectedInventory || 1, prev + 1));
                        setAdded(false);
                      }}
                      disabled={!inStock}
                      className="w-11 h-11 rounded-full text-2xl text-blue-300 hover:bg-white/[0.08] disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                    FREE Bacteriostatic Water With Purchase of Any 4 Vials
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inStock ? (
                  <button
                    onClick={addToCart}
                    className="bg-white text-[#081526] hover:bg-blue-100 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={22} />
                    {added ? "Added To Cart" : "Add To Cart"}
                  </button>
                ) : (
                  <button disabled className="bg-white/[0.06] text-white/30 cursor-not-allowed rounded-full py-5 uppercase tracking-widest text-sm font-semibold">
                    Out of Stock
                  </button>
                )}

                <a href="/cart" className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center">
                  View Cart
                </a>

                <a href="/products" className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center">
                  Continue Shopping
                </a>

                <a href="/coas" className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center">
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
            [ShieldCheck, "Third-Party Tested", "Independent lab verified."],
            [ClipboardCheck, "Batch Documented", "Full transparency."],
            [ShieldCheck, "Quality Target", "99%+ purity target."],
          ].map(([Icon, title, text]: any) => (
            <div key={title} className="flex gap-4">
              <Icon className="text-blue-300" size={34} />
              <div>
                <h3 className="text-white uppercase tracking-widest font-bold text-sm">{title}</h3>
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
            5-Amino-1MQ Research Overview
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            5-Amino-1MQ is studied in laboratory research for its relationship to
            NNMT-associated pathways and metabolic signaling. Research models
            commonly evaluate its role in cellular energy balance, adipocyte
            biology, and metabolic regulation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              ["NNMT Pathways", "Studied for activity involving nicotinamide N-methyltransferase-related pathways."],
              ["Metabolic Signaling", "Evaluated in models involving energy balance and metabolic regulation."],
              ["Adipocyte Research", "Frequently researched in adipocyte biology and body composition models."],
              ["Storage", "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 hover:border-blue-400/50 transition-all">
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
            <p className="text-white/60 text-sm leading-relaxed">{section.text}</p>
          </div>
        </section>
      ))}

    </main>
  );
}