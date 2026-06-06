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
  const [paymentMethod, setPaymentMethod] = useState("cashapp");
  const [loading, setLoading] = useState(false);

  const [customerEmail, setCustomerEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [zipCode, setZipCode] = useState("");

  const autocompleteRef =
  useRef<google.maps.places.Autocomplete | null>(null);

const { isLoaded } = useJsApiLoader({
  googleMapsApiKey:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
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

  const shipping = subtotal > 0 ? 5.99 : 0;
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

    if (types.includes("street_number")) {
      streetNumber = component.long_name;
    }

    if (types.includes("route")) {
      route = component.long_name;
    }

    if (types.includes("locality")) {
      cityName = component.long_name;
    }

    if (types.includes("administrative_area_level_1")) {
      stateCode = component.short_name;
    }

    if (types.includes("postal_code")) {
      zip = component.long_name;
    }
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
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Order submission failed");
      }

      localStorage.removeItem("cart");
      alert(`Order submitted successfully. Order Number: ${data.orderNumber}`);
      window.location.href = "/";
    } catch (error) {
      alert("Something went wrong submitting your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-blue-900 bg-black">
        <div className="relative h-32 sm:h-40 flex items-center justify-center overflow-hidden px-4">
          <img
            src="/images/biglogo.PNG"
            alt="Apexx Biolabs"
            className="h-20 sm:h-28 md:h-32 object-contain"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 min-h-screen">
        <div className="px-4 sm:px-6 md:px-10 py-8 xl:border-r border-blue-950">
          <div className="flex items-center justify-between gap-4 mb-10">
            <a href="/cart" className="text-blue-400 hover:text-blue-300 text-sm">
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
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="checkout-input w-full"
              />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-5">
                DELIVERY{" "}
                <span className="text-gray-400 text-base">
                  (SHIPPING ADDRESS)
                </span>
              </h2>

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

              <p className="mt-3 text-xs text-gray-500">
                ZIP code must be 5 digits. State must be selected from the dropdown.
              </p>
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

        <div className="px-4 sm:px-6 md:px-10 py-8 bg-[#020202] border-t xl:border-t-0 border-blue-950">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 text-blue-400">
              <ShoppingCart />
              <h2 className="text-xl sm:text-2xl font-bold">Order Summary</h2>
            </div>

            <p className="text-2xl sm:text-3xl font-bold">
              ${total.toFixed(2)}
            </p>
          </div>

          <div className="space-y-5 mb-10">
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 border border-blue-950 rounded-xl p-4 bg-black"
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

          <section className="border border-blue-900 rounded-2xl p-5 sm:p-6 bg-[#050505] mb-8">
            <h2 className="text-2xl font-bold mb-2">PAYMENT METHOD</h2>

            <p className="text-gray-400 text-sm mb-6">
              Select a payment method. Payment instructions will be sent by
              email after your order is submitted.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { id: "cashapp", label: "Cash App" },
                { id: "venmo", label: "Venmo" },
                { id: "zelle", label: "Zelle" },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`border rounded-xl p-5 text-left transition-all ${
                    paymentMethod === method.id
                      ? "border-blue-400 bg-blue-950/30"
                      : "border-blue-900 bg-black hover:border-blue-500"
                  }`}
                >
                  <span className="text-lg font-bold">{method.label}</span>
                </button>
              ))}
            </div>

            <div className="border border-blue-900 rounded-xl p-5 sm:p-6 bg-black/50">
              <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">
                Payment Instructions
              </h3>

              <ul className="list-disc pl-5 space-y-3 text-gray-300 text-sm leading-relaxed">
                <li>
                  Payment instructions will be sent to your email after
                  checkout.
                </li>
                <li>Submit the exact payment amount.</li>
                <li>Include ONLY your order number in the payment notes.</li>
                <li>Do not include product names or descriptions.</li>
                <li>Orders not paid within 24 hours may be cancelled.</li>
              </ul>
            </div>
          </section>

          <button
            onClick={handlePlaceOrder}
            disabled={!isCheckoutComplete || loading}
            className={`w-full py-5 rounded-lg uppercase tracking-widest font-bold transition-all ${
              isCheckoutComplete && !loading
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_25px_rgba(37,99,235,0.45)]"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading
              ? "Submitting Order..."
              : "Place Order & Receive Payment Instructions"}
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
          border-radius: 0.5rem;
        }

        .checkout-input:focus {
          border-color: #60a5fa;
        }

        select.checkout-input {
          appearance: none;
        }
      `}</style>
    </main>
  );
}