"use client";

import { useEffect, useRef, useState } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
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
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("venmo");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
const [successOrderNumber, setSuccessOrderNumber] = useState("");

  const [customerEmail, setCustomerEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [zipCode, setZipCode] = useState("");

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const freeShippingThreshold = 200;
  const standardShipping = 5.99;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
  const amountLeftForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  const shipping =
    subtotal > 0 && !qualifiesForFreeShipping ? standardShipping : 0;

  const total = subtotal + shipping;

  const isCheckoutComplete =
    customerEmail.trim() !== "" &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    address.trim() !== "" &&
    city.trim() !== "" &&
    stateValue.trim() !== "" &&
    /^\d{5}$/.test(zipCode) &&
    agreed &&
    cart.length > 0;

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();

    if (!place?.address_components) return;

    let streetNumber = "";
    let route = "";
    let cityName = "";
    let stateCode = "";
    let zip = "";

    place.address_components.forEach((component) => {
      const types = component.types;

      if (types.includes("street_number")) streetNumber = component.long_name;
      if (types.includes("route")) route = component.long_name;
      if (types.includes("locality")) cityName = component.long_name;
      if (types.includes("administrative_area_level_1"))
        stateCode = component.short_name;
      if (types.includes("postal_code")) zip = component.long_name;
    });

    setAddress(`${streetNumber} ${route}`.trim());
    setCity(cityName);
    setStateValue(stateCode);
    setZipCode(zip);
  };

  const handlePlaceOrder = async () => {
    if (!isCheckoutComplete || loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail,
          firstName,
          lastName,
          address,
          apartment,
          city,
          state: stateValue,
          zipCode,
          paymentMethod,
          cart,
          subtotal,
          shipping,
          total,
          freeShipping: qualifiesForFreeShipping,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Order submission failed");
      }

localStorage.removeItem("cart");
window.dispatchEvent(new Event("cartUpdated"));
setCart([]);
setSuccessOrderNumber(data.orderNumber);
setShowSuccess(true);
    } catch (error) {
      alert("Something went wrong submitting your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">
      <header className="border-b border-white/10 bg-[#081526]/95 backdrop-blur-xl px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/">
            <img
              src="/images/logo.png"
              alt="Apexx Biolabs"
              className="h-12 w-auto"
            />
          </a>

          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Lock size={16} className="text-blue-300" />
            Secure Checkout
          </div>
        </div>
      </header>

      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <a
                href="/cart"
                className="inline-flex mb-8 text-blue-300 hover:text-white text-sm uppercase tracking-widest transition-all"
              >
                ← Return to Cart
              </a>

              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
                Checkout
              </p>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-6">
                Complete Your Order
              </h1>

              <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">
                Enter your shipping details, confirm research-use terms, and
                receive secure payment instructions by email.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-white/70 w-fit">
              <ShoppingCart size={20} className="text-blue-300" />
              <span className="text-sm uppercase tracking-widest">
                Total Due: ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_430px] gap-8">
            <div className="space-y-8">
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
                <h2 className="text-3xl font-black text-white mb-6">
                  Contact
                </h2>

                <input
                  type="email"
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="checkout-input w-full"
                />
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
                <h2 className="text-3xl font-black text-white mb-2">
                  Delivery
                </h2>

                <p className="text-white/50 mb-6">Shipping address</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="checkout-input md:col-span-2"
                    value="United States"
                    readOnly
                  />

                  <input
                    className="checkout-input"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />

                  <input
                    className="checkout-input"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />

                  {isLoaded ? (
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        autocompleteRef.current = autocomplete;
                      }}
                      onPlaceChanged={handlePlaceChanged}
                    >
                      <input
                        className="checkout-input md:col-span-2 w-full"
                        placeholder="Start typing your address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Autocomplete>
                  ) : (
                    <input
                      className="checkout-input md:col-span-2"
                      placeholder="Loading address lookup..."
                      disabled
                    />
                  )}

                  <input
                    className="checkout-input md:col-span-2"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  />

                  <input
                    className="checkout-input"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />

                  <select
                    className="checkout-input"
                    value={stateValue}
                    onChange={(e) => setStateValue(e.target.value)}
                  >
                    <option value="">Select State</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                    <option value="DC">District of Columbia</option>
                  </select>

                  <input
                    className="checkout-input"
                    placeholder="ZIP code"
                    value={zipCode}
                    onChange={(e) =>
                      setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))
                    }
                  />
                </div>

                <p className="mt-4 text-xs text-white/40">
                  ZIP code must be 5 digits. State must be selected from the
                  dropdown.
                </p>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
                <h3 className="text-2xl font-black text-white mb-4">
                  Research Use Acknowledgment
                </h3>

                <p className="text-white/60 text-sm leading-relaxed mb-5">
                  By placing this order, I confirm that I am at least 21 years of
                  age and understand that all products are intended strictly for
                  lawful laboratory research use only. Products are not intended
                  for human consumption, medical use, veterinary use, diagnosis,
                  treatment, cure, or prevention of disease.
                </p>

                <label className="flex items-start gap-3 cursor-pointer rounded-2xl border border-white/10 bg-[#081526]/50 p-4">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1"
                  />

                  <span className="text-sm text-white/70">
                    I agree to the research-use-only terms and website policies.
                  </span>
                </label>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3 text-blue-300">
                    <ShoppingCart />
                    <h2 className="text-2xl font-black text-white">
                      Order Summary
                    </h2>
                  </div>

                  <p className="text-3xl font-black text-blue-300">
                    ${total.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {cart.length === 0 ? (
                    <p className="text-white/50">Your cart is empty.</p>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-[#081526]/50 p-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded-[24px]"
                        />

                        <div className="flex-1">
                          <h3 className="font-black text-white">
                            {item.name}
                          </h3>

                          <p className="text-white/50 text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="text-blue-300 font-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-white/10 pt-6 space-y-4 mb-8">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    {qualifiesForFreeShipping ? (
                      <span className="text-green-300 font-semibold">
                        FREE
                      </span>
                    ) : (
                      <span>${shipping.toFixed(2)}</span>
                    )}
                  </div>

                  {cart.length > 0 &&
                    (qualifiesForFreeShipping ? (
                      <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-4">
                        <p className="text-green-200 text-sm font-semibold">
                          🎉 Free shipping unlocked.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                        <p className="text-blue-100 text-sm">
                          Add ${amountLeftForFreeShipping.toFixed(2)} more to
                          receive free shipping.
                        </p>
                      </div>
                    ))}

                  <div className="flex justify-between text-2xl font-black text-white pt-4 border-t border-white/10">
                    <span>Total Due</span>
                    <span className="text-blue-300">${total.toFixed(2)}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
                <h2 className="text-2xl font-black text-white mb-3">
                  Payment Method
                </h2>

                <p className="text-white/60 text-sm mb-6">
                  Select a payment method. Payment instructions will be sent by
                  email after your order is submitted.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: "venmo", label: "Venmo" },
                    { id: "zelle", label: "Zelle" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`rounded-2xl p-5 text-left transition-all ${
                        paymentMethod === method.id
                          ? "border border-blue-400/50 bg-white/[0.08] text-white"
                          : "border border-white/10 bg-white/[0.04] text-white/60 hover:border-blue-400/50 hover:text-white"
                      }`}
                    >
                      <span className="text-lg font-black">
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-6 mb-6">
                  <p className="text-blue-100 font-bold uppercase tracking-widest mb-3 text-sm">
                    Payment Amount
                  </p>

                  <p className="text-4xl font-black text-white mb-2">
                    ${total.toFixed(2)}
                  </p>

                  <p className="text-blue-100/70 text-sm">
                    Please send exactly this amount via{" "}
                    {paymentMethod === "venmo" ? "Venmo" : "Zelle"} after your
                    order is submitted.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-[#081526]/50 p-6">
                  <h3 className="text-blue-300 font-bold uppercase tracking-widest text-sm mb-4">
                    Payment Instructions
                  </h3>

                  <ul className="list-disc pl-5 space-y-3 text-white/60 text-sm leading-relaxed">
                    <li>
                      Payment instructions will be sent to your email after
                      checkout.
                    </li>
                    <li>Submit the exact payment amount shown above.</li>
                    <li>Include ONLY your order number in the payment notes.</li>
                    <li>Do not include product names or descriptions.</li>
                    <li>Orders not paid within 24 hours may be cancelled.</li>
                  </ul>
                </div>
              </section>

              <button
                onClick={handlePlaceOrder}
                disabled={!isCheckoutComplete || loading}
                className={`w-full py-5 rounded-full uppercase tracking-widest font-bold transition-all ${
                  isCheckoutComplete && !loading
                    ? "bg-white text-[#081526] hover:bg-blue-100"
                    : "bg-white/[0.06] text-white/30 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "Submitting Order..."
                  : "Place Order & Receive Payment Instructions"}
              </button>

              <div className="grid grid-cols-2 gap-4 text-center text-xs text-white/50">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <ShieldCheck className="mx-auto text-blue-300 mb-2" />
                  Secure Checkout
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Lock className="mx-auto text-blue-300 mb-2" />
                  Encrypted
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Package className="mx-auto text-blue-300 mb-2" />
                  Discreet Packaging
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Star className="mx-auto text-blue-300 mb-2" />
                  Trusted Support
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-5 text-xs text-blue-300">
                <a href="/refunds">Refund Policy</a>
                <a href="/shipping">Shipping</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {showSuccess && (
  <div className="fixed inset-0 z-[9999] bg-[#020817]/80 backdrop-blur-md flex items-center justify-center px-4">
    <div className="w-full max-w-lg rounded-[36px] border border-blue-300/30 bg-gradient-to-br from-[#eef7ff] via-white to-[#dbeafe] shadow-[0_0_70px_rgba(96,165,250,0.35)] overflow-hidden">
      
      <div className="p-8 md:p-10 text-center">

        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <p className="uppercase tracking-[0.35em] text-blue-500 text-xs mb-4">
          Order Received
        </p>

        <h2 className="text-4xl font-black text-[#081526] mb-4">
          Thank You
        </h2>

        <p className="text-slate-600 leading-relaxed mb-7">
          Your order has been successfully submitted. Payment instructions have
          been sent to your email.
        </p>

        <div className="rounded-[24px] border border-blue-200 bg-white/80 p-5 mb-7">
          <p className="text-blue-500 text-xs uppercase tracking-[0.25em] mb-2 font-bold">
            Order Number
          </p>

          <p className="text-[#081526] font-black text-lg break-all">
            {successOrderNumber}
          </p>
        </div>

        <div className="rounded-[24px] bg-[#081526] p-5 mb-7">
          <p className="text-blue-200 text-sm leading-relaxed">
            Please check your email for your payment instructions. Include only
            your order number in the payment note.
          </p>
        </div>

        <button
          onClick={() => {
            setShowSuccess(false);
            window.location.href = "/";
          }}
          className="w-full rounded-full bg-[#081526] text-white font-bold py-4 uppercase tracking-widest hover:bg-blue-900 transition-all"
        >
          Continue
        </button>

      </div>
    </div>
  </div>
)}

      <style jsx>{`
        .checkout-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          padding: 1rem 1.25rem;
          outline: none;
          color: white;
          backdrop-filter: blur(12px);
        }

        .checkout-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .checkout-input:focus {
          border-color: rgba(96, 165, 250, 0.5);
        }

        select.checkout-input {
          appearance: none;
        }
      `}</style>

      <footer className="bg-[#081526] border-t border-blue-900/40 px-6 pt-24 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div>
              <img
                src="/images/logo.png"
                alt="Apexx Biolabs"
                className="h-12 w-auto mb-6"
              />

              <p className="text-white/70 leading-relaxed text-sm">
                High-purity research compounds supported by batch documentation,
                analytical testing, and research-use transparency.
              </p>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
                Company
              </h4>

              <div className="space-y-4">
                <a
                  href="/"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Home
                </a>

                <a
                  href="/products"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Products
                </a>

                <a
                  href="/coas"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  COAs
                </a>

                <a
                  href="/contact"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
                Resources
              </h4>

              <div className="space-y-4">
                <a
                  href="/peptide-info"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Peptide Info
                </a>

                <a
                  href="/faq"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  FAQ
                </a>

                <a
                  href="/shipping"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Shipping
                </a>

                <a
                  href="/refunds"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Refunds
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
                Contact
              </h4>

              <div className="space-y-4">
                <a
                  href="mailto:support@apexxbiolabs.com"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  support@apexxbiolabs.com
                </a>

                <a
                  href="https://www.tiktok.com/@apexx.nyc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10">
            <p className="text-white/40 text-xs uppercase tracking-[0.18em] leading-relaxed max-w-5xl">
              FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION. NOT
              FOR MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
            </p>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">
              <p className="text-white/40 text-sm">
                © 2026 Apexx Biolabs. All Rights Reserved.
              </p>

              <div className="flex gap-8 text-sm text-white/40">
                <a href="/privacy" className="hover:text-white transition-all">
                  Privacy
                </a>

                <a href="/terms" className="hover:text-white transition-all">
                  Terms
                </a>

                <a href="/shipping" className="hover:text-white transition-all">
                  Shipping
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}