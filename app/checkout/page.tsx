"use client";

import { useEffect, useState } from "react";
import { Lock, ShoppingCart, ShieldCheck, Package, Star } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sameBilling, setSameBilling] = useState(true);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-blue-900 bg-black">
        <div className="relative h-40 flex items-center justify-center overflow-hidden">
          <img
            src="/images/biglogo.PNG"
            alt="Apexx Biolabs"
            className="h-32 object-contain"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="px-6 md:px-12 py-10 border-r border-blue-950">
          <div className="flex items-center justify-between mb-10">
            <a href="/cart" className="text-blue-400 hover:text-blue-300">
              ← Return to cart
            </a>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Lock size={16} />
              Secure checkout
            </div>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-5">CONTACT</h2>

              <input
                type="email"
                placeholder="Email"
                className="w-full bg-[#050505] border border-blue-900 rounded-lg px-4 py-4 outline-none focus:border-blue-400"
              />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-5">
                DELIVERY <span className="text-gray-400 text-base">(SHIPPING ADDRESS)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="checkout-input md:col-span-2" placeholder="Country/Region" defaultValue="United States" />
                <input className="checkout-input" placeholder="First name" />
                <input className="checkout-input" placeholder="Last name" />
                <input className="checkout-input md:col-span-2" placeholder="Address" />
                <input className="checkout-input md:col-span-2" placeholder="Apartment, suite, etc. (optional)" />
                <input className="checkout-input" placeholder="City" />
                <input className="checkout-input" placeholder="State" />
                <input className="checkout-input" placeholder="ZIP code" />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-5">BILLING ADDRESS</h2>

              <label className="flex items-center gap-3 border border-blue-900 rounded-lg px-4 py-4 mb-3 cursor-pointer">
                <input
                  type="radio"
                  checked={sameBilling}
                  onChange={() => setSameBilling(true)}
                />
                Same as shipping address
              </label>

              <label className="flex items-center gap-3 border border-blue-900 rounded-lg px-4 py-4 cursor-pointer">
                <input
                  type="radio"
                  checked={!sameBilling}
                  onChange={() => setSameBilling(false)}
                />
                Use a different billing address
              </label>
            </section>

            <section className="border border-blue-900 rounded-xl p-5 bg-[#050505]">
              <h3 className="text-blue-400 font-bold mb-3">
                Research Use Acknowledgment
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                By placing this order, I confirm that I am at least 21 years of
                age and understand that all products are intended strictly for
                lawful laboratory research use only. Products are not intended
                for human consumption, medical use, veterinary use, diagnosis,
                treatment, cure, or prevention of disease.
              </p>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-300">
                  I agree to the research-use-only terms and website policies.
                </span>
              </label>
            </section>
          </div>
        </div>

        <div className="px-6 md:px-12 py-10 bg-[#020202]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-blue-400">
              <ShoppingCart />
              <h2 className="text-2xl font-bold">Order Summary</h2>
            </div>

            <p className="text-3xl font-bold">${total.toFixed(2)}</p>
          </div>

          <div className="space-y-5 mb-10">
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border border-blue-950 rounded-xl p-4 bg-black"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain border border-blue-900 rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="text-blue-400 font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-blue-950 pt-6 space-y-4 mb-8">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-2xl font-bold text-white pt-4 border-t border-blue-950">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={!agreed || cart.length === 0}
            className={`w-full py-5 rounded-lg uppercase tracking-widest font-bold transition-all ${
              agreed && cart.length > 0
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_25px_rgba(37,99,235,0.45)]"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            Proceed to Secure Payment
          </button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 text-center text-xs text-gray-500">
            <div>
              <ShieldCheck className="mx-auto text-blue-400 mb-2" />
              Secure Checkout
            </div>

            <div>
              <Lock className="mx-auto text-blue-400 mb-2" />
              Encrypted
            </div>

            <div>
              <Package className="mx-auto text-blue-400 mb-2" />
              Discreet Packaging
            </div>

            <div>
              <Star className="mx-auto text-blue-400 mb-2" />
              Trusted Support
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-10 text-xs text-blue-400">
            <a href="/refunds">Refund Policy</a>
            <a href="/shipping">Shipping</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .checkout-input {
          background: #050505;
          border: 1px solid #1e3a8a;
          border-radius: 0.5rem;
          padding: 1rem;
          outline: none;
          color: white;
        }

        .checkout-input:focus {
          border-color: #60a5fa;
        }
      `}</style>
    </main>
  );
}