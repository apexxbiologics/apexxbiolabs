"use client";

import { useEffect, useState } from "react";

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
  };

  const increaseQuantity = (id: string) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (id: string) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white px-10 py-24">
      <a href="/" className="text-blue-400 uppercase tracking-widest text-sm">
        ← Back to Home
      </a>

      <section className="max-w-5xl mx-auto mt-20">
        <h1 className="text-6xl font-bold mb-8">Cart</h1>

        <div className="border border-blue-900 rounded-2xl p-10 bg-[#050505]">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-lg">
              Your cart is currently empty.
            </p>
          ) : (
            <div className="space-y-8">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-blue-950 pb-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    <div className="flex items-center gap-6">
                      <img
                        src={item.image || "/images/logo.PNG"}
                        alt={item.name}
                        className="w-24 h-24 object-contain border border-blue-900 rounded-xl p-2 bg-[#050505]"
                      />

                      <div>
                        <p className="text-2xl font-semibold">
                          {item.name}
                        </p>

                        <p className="text-gray-400">
                          ${item.price} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="border border-blue-700 px-4 py-2 hover:bg-blue-700 rounded-lg"
                      >
                        -
                      </button>

                      <span className="text-xl font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="border border-blue-700 px-4 py-2 hover:bg-blue-700 rounded-lg"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="border border-red-700 text-red-400 px-4 py-2 hover:bg-red-900/40 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="text-blue-400 font-bold text-xl">
                      ${item.price * item.quantity}
                    </p>

                  </div>
                </div>
              ))}

              <div className="flex justify-between text-3xl font-bold pt-6">
                <span>Total</span>
                <span className="text-blue-400">${total}</span>
              </div>
              <div className="border border-blue-900 rounded-xl p-6 bg-[#050505] mt-8">
  <h3 className="text-lg font-semibold text-blue-400 mb-4">
    Research Use Disclaimer
  </h3>

  <p className="text-gray-400 text-sm leading-relaxed mb-4">
    By placing an order, you acknowledge that all products sold by Apexx
    Biologics are intended strictly for laboratory research use only and
    are not intended for human consumption, medical use, veterinary use,
    diagnosis, treatment, cure, or prevention of disease.
  </p>

  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
      className="mt-1"
    />

    <span className="text-sm text-gray-300">
      I certify that I am at least 21 years old and understand these
      products are purchased solely for lawful research purposes.
    </span>
  </label>
</div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mt-8">

  <a
    href="/#shop"
    className="bg-blue-600 hover:bg-blue-500 px-8 py-4 uppercase tracking-widest text-sm font-semibold rounded-lg text-center"
  >
    Continue Shopping
  </a>

  <button
    disabled={!agreed}
    className={`px-8 py-4 uppercase tracking-widest text-sm font-semibold rounded-lg transition-all ${
      agreed
        ? "bg-green-600 hover:bg-green-500"
        : "bg-gray-800 text-gray-500 cursor-not-allowed"
    }`}
  >
    Proceed To Checkout
  </button>

</div>
        </div>
      </section>
    </main>
  );
}