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

export default function GHKCUPage() {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [inventory, setInventory] = useState<number | null>(null);

  const product = {
    id: "ghkcu",
    name: "GHK-Cu",
    price: 55,
    image: "/images/ghkcublue.png",
  };

  const isOutOfStock = inventory !== null && inventory <= 0;
  const isLimitedStock = inventory !== null && inventory > 0 && inventory <= 5;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!data.success) return;

        const ghkcu = data.products.find(
          (product: any) =>
            product.slug === "ghkcu" ||
            product.slug === "ghk-cu" ||
            product.slug === "ghkcu-100mg" ||
            product.slug === "ghk-cu-100mg" ||
            product.id === "ghkcu" ||
            product.id === "ghk-cu" ||
            product.name?.toLowerCase().includes("ghk")
        );

        if (ghkcu) {
          setInventory(ghkcu.inventory ?? 0);
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
              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-4">
                Research Peptide
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                {product.name}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                High-purity GHK-Cu research peptide intended strictly for
                laboratory research applications and analytical use.
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
                    Size
                  </p>

                  <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white">
                    100mg
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
                    FREE BACTERIOSTATIC WATER WITH PURCHASE OF ANY 4 VIALS
                  </p>
                </div>
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
            Copper Peptide Research Overview
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            GHK-Cu is a naturally occurring copper-binding peptide studied in
            laboratory research involving cellular signaling, extracellular
            matrix interactions, tissue remodeling pathways, and
            peptide-mediated biological processes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              ["Copper Peptide Research", "Studied for peptide-copper interactions and cellular signaling pathways."],
              ["Cellular Models", "Evaluated in laboratory models involving extracellular matrix and tissue remodeling mechanisms."],
              ["Peptide Signaling", "Research focuses on peptide-mediated communication and regenerative biological pathways."],
              ["Storage", "Store refrigerated at 2–8°C. Keep sealed and protected from light until research use."],
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

      {/* BPC-157 */}
      <a
        href="/products/bpc157"
        className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
          <img
            src="/images/bpc157blue.png"
            alt="BPC-157"
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h3 className="text-2xl font-black text-white mb-2">BPC-157</h3>

        <p className="text-white/60 text-sm leading-relaxed mb-4">
          Research involving tissue repair pathways and cellular response mechanisms.
        </p>

        <span className="text-[#A5D8FF] font-semibold">View Product →</span>
      </a>

      {/* TB-500 */}
      <a
        href="/products/tb500"
        className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
          <img
            src="/images/tb500blue.png"
            alt="TB-500"
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h3 className="text-2xl font-black text-white mb-2">TB-500</h3>

        <p className="text-white/60 text-sm leading-relaxed mb-4">
          Research focused on recovery pathways and cellular migration models.
        </p>

        <span className="text-[#A5D8FF] font-semibold">View Product →</span>
      </a>

      {/* Pinealon */}
      <a
        href="/products/pinealon"
        className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
          <img
            src="/images/pinealonblue.png"
            alt="Pinealon"
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h3 className="text-2xl font-black text-white mb-2">Pinealon</h3>

        <p className="text-white/60 text-sm leading-relaxed mb-4">
          Studied in laboratory models involving neuroregulation and cellular signaling pathways.
        </p>

        <span className="text-[#A5D8FF] font-semibold">View Product →</span>
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

            <footer className="bg-[#081526] border-t border-white/10 px-6 md:px-10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
          <div>
            <img
              src="/images/logo.png"
              alt="Apexx Biolabs"
              className="h-12 w-auto mb-5"
            />

            <p className="text-white/60 text-sm leading-relaxed">
              Premium research-grade peptides built on science, quality, and transparency.
            </p>

<div className="flex gap-3 mt-6">
  <a
    href="https://www.tiktok.com/@apexx.nyc"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="TikTok"
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
  >
    <FaTiktok size={18} />
  </a>

  <a
    href="https://x.com/ApexxBiolabsLLC"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="X"
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
  >
    <FaXTwitter size={18} />
  </a>

  <a
    href="mailto:support@apexxbiolabs.com"
    aria-label="Email"
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
  >
    <HiOutlineMail size={18} />
  </a>
</div>
          </div>

          {[
            ["Shop", [["All Products", "/products"], ["Certificates of Analysis", "/coas"]]],
            ["Resources", [["Research Library", "/peptide-info"], ["FAQ", "/faq"]]],
            ["Support", [["Contact Us", "/contact"], ["Shipping Info", "/shipping"], ["Returns & Refunds", "/refunds"]]],
            ["Legal", [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]]],
          ].map(([title, links]: any) => (
            <div key={title}>
              <h4 className="text-white font-bold uppercase tracking-widest mb-5 text-sm">
                {title}
              </h4>

              <div className="space-y-3 text-white/50">
                {links.map(([label, href]: any) => (
                  <a key={label} href={href} className="block hover:text-blue-300">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-4 text-white/40 text-sm">
          <p>© 2026 Apexx Biolabs. All rights reserved.</p>
          <p>SSL Secured · 99%+ Purity · Research Use Only</p>
        </div>
      </footer>
    </main>
  );
}