"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, ShieldCheck, PackageCheck } from "lucide-react";

import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (id: string) => {
    saveCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    saveCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const freeShippingThreshold = 200;
  const amountLeftForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
            Secure Cart
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-6">
                Review Your Cart
              </h1>

              <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">
                Confirm your research materials, review documentation terms, and
                proceed to checkout securely.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-white/70 w-fit">
              <ShoppingCart size={20} className="text-blue-300" />
              <span className="text-sm uppercase tracking-widest">
                {totalItems} Item{totalItems === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 text-center">
              <ShoppingCart size={48} className="mx-auto text-blue-300 mb-6" />

              <h2 className="text-3xl font-black text-white mb-4">
                Your cart is empty.
              </h2>

              <p className="text-white/60 mb-8">
                Add research materials to your cart to continue.
              </p>

              <a
                href="/products"
                className="inline-flex bg-white text-[#081526] px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-blue-100 transition-all"
              >
                Shop Products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 md:p-8">
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.6rem] border border-white/10 bg-[#081526]/50 p-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-6 items-center">
                        <div className="flex items-center justify-center">
                          <img
                            src={item.image || "/images/logo.png"}
                            alt={item.name}
                            className="w-28 h-28 object-contain rounded-[28px]"
                          />
                        </div>

                        <div>
                          <p className="text-2xl font-black text-white mb-2">
                            {item.name}
                          </p>

                          <p className="text-white/50 text-sm mb-4">
                            ${item.price.toFixed(2)} each
                          </p>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center gap-2 text-red-300 hover:text-red-200 text-sm transition-all"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between gap-5">
                          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] p-2">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-9 h-9 rounded-full border border-white/10 hover:bg-white/[0.08] flex items-center justify-center"
                            >
                              -
                            </button>

                            <span className="w-8 text-center text-lg font-bold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="w-9 h-9 rounded-full border border-white/10 hover:bg-white/[0.08] flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-2xl font-black text-blue-300">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
                  <h2 className="text-3xl font-black text-white mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 text-white/60 mb-6">
                    <div className="flex justify-between border-b border-white/10 pb-4">
                      <span>Subtotal</span>
                      <span className="text-white">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/10 pb-4">
                      <span>Shipping</span>
                      <span
                        className={
                          qualifiesForFreeShipping
                            ? "text-green-300 font-semibold"
                            : "text-white/50"
                        }
                      >
                        {qualifiesForFreeShipping
                          ? "Free"
                          : "Calculated at checkout"}
                      </span>
                    </div>

                    {qualifiesForFreeShipping ? (
                      <div className="rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm text-green-200">
                        🎉 You qualify for free shipping.
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 px-4 py-3 text-sm text-blue-100">
                        You are ${amountLeftForFreeShipping.toFixed(2)} away
                        from free shipping.
                      </div>
                    )}

                  </div>

                  <div className="flex justify-between text-3xl font-black mb-8">
                    <span>Total</span>
                    <span className="text-blue-300">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className={`block w-full py-4 rounded-full uppercase tracking-widest text-sm font-semibold text-center transition-all ${
                      agreed
                        ? "bg-white text-[#081526] hover:bg-blue-100"
                        : "bg-white/[0.06] text-white/30 pointer-events-none"
                    }`}
                  >
                    Proceed To Checkout
                  </Link>

                  {!agreed && (
                    <p className="text-white/40 text-xs text-center mt-4">
                      Please confirm the research-use terms before checkout.
                    </p>
                  )}
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-blue-300" size={24} />

                    <h3 className="text-xl font-black text-white">
                      Research Use Disclaimer
                    </h3>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-5">
                    By placing an order, you acknowledge that all products sold
                    by Apexx Biolabs are intended strictly for lawful laboratory
                    research use only and are not intended for human consumption,
                    medical use, veterinary use, diagnosis, treatment, cure, or
                    prevention of disease.
                  </p>

                  <label className="flex items-start gap-3 cursor-pointer rounded-2xl border border-white/10 bg-[#081526]/50 p-4">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1"
                    />

                    <span className="text-sm text-white/70 leading-relaxed">
                      I certify that I am at least 21 years old and understand
                      these products are purchased solely for lawful research
                      purposes.
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <PackageCheck className="text-blue-300" size={22} />

                    <div>
                      <p className="text-white font-bold">
                        Quality Documentation
                      </p>
                      <p className="text-white/50 text-sm">
                        COAs available for verified batches.
                      </p>
                    </div>
                  </div>

                  <a
                    href="/products"
                    className="block border border-white/10 bg-white/[0.04] text-white rounded-full px-8 py-4 text-sm uppercase tracking-widest font-semibold text-center hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
                  >
                    Continue Shopping
                  </a>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

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