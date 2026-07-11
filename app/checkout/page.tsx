"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  Award,
  Gift,
  Lock,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  UserCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type PointTransaction = {
  points: number;
};

type ReservedOrder = {
  redeemed_points: number | null;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState("venmo");
  const [loading, setLoading] = useState(false);
  const [accountLoading, setAccountLoading] =
    useState(true);
  const [showSuccess, setShowSuccess] =
    useState(false);
  const [
    successOrderNumber,
    setSuccessOrderNumber,
  ] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const [loggedInEmail, setLoggedInEmail] =
    useState("");
  const [
    loggedInUsername,
    setLoggedInUsername,
  ] = useState("");
  const [accessToken, setAccessToken] =
    useState("");

  const [recordedPoints, setRecordedPoints] =
    useState(0);
  const [reservedPoints, setReservedPoints] =
    useState(0);
  const [redeemedPoints, setRedeemedPoints] =
    useState(0);

  const [customerEmail, setCustomerEmail] =
    useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] =
    useState("");
  const [zipCode, setZipCode] = useState("");
  const [marketingConsent, setMarketingConsent] =
    useState(true);

  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(
      null
    );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env
        .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);

    async function loadCustomer() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user;

        if (!user?.email) {
          setAccountLoading(false);
          return;
        }

        const normalizedEmail = user.email
          .trim()
          .toLowerCase();

        setLoggedInEmail(normalizedEmail);
        setCustomerEmail(normalizedEmail);
setAccessToken(
  session?.access_token || ""
);

        const [
          profileResult,
          pointsResult,
          reservedOrdersResult,
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select(
              "username, first_name, last_name"
            )
            .eq("id", user.id)
            .maybeSingle(),

          supabase
            .from("point_transactions")
            .select("points")
            .eq("user_id", user.id),

          supabase
            .from("orders")
            .select("redeemed_points")
            .eq(
              "customer_email",
              normalizedEmail
            )
            .in("status", [
              "awaiting_payment",
              "paid",
              "processing",
            ]),
        ]);

        if (profileResult.error) {
          console.error(
            "Profile loading error:",
            profileResult.error
          );
        }

        if (pointsResult.error) {
          console.error(
            "Points loading error:",
            pointsResult.error
          );
        }

        if (reservedOrdersResult.error) {
          console.error(
            "Reserved rewards loading error:",
            reservedOrdersResult.error
          );
        }

        const profile = profileResult.data;

        if (profile?.username) {
          setLoggedInUsername(
            profile.username
          );
        }

        if (profile?.first_name) {
          setFirstName(profile.first_name);
        }

        if (profile?.last_name) {
          setLastName(profile.last_name);
        }

        const transactions =
          (pointsResult.data ||
            []) as PointTransaction[];

        const totalRecordedPoints =
          transactions.reduce(
            (sum, transaction) =>
              sum +
              Number(
                transaction.points || 0
              ),
            0
          );

        const activeOrders =
          (reservedOrdersResult.data ||
            []) as ReservedOrder[];

        const totalReservedPoints =
          activeOrders.reduce(
            (sum, order) =>
              sum +
              Number(
                order.redeemed_points || 0
              ),
            0
          );

        setRecordedPoints(
          Math.max(0, totalRecordedPoints)
        );

        setReservedPoints(
          Math.max(0, totalReservedPoints)
        );
      } catch (error) {
        console.error(
          "Customer checkout loading error:",
          error
        );
      } finally {
        setAccountLoading(false);
      }
    }

    loadCustomer();
  }, []);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
            Number(item.quantity || 0),
        0
      ),
    [cart]
  );

  const freeShippingThreshold = 200;
  const standardShipping = 5.99;

  const qualifiesForFreeShipping =
    subtotal >= freeShippingThreshold;

  const amountLeftForFreeShipping =
    Math.max(
      0,
      freeShippingThreshold - subtotal
    );

  const shipping =
    subtotal > 0 &&
    !qualifiesForFreeShipping
      ? standardShipping
      : 0;

  const normalizedPromoCode = promoCode
    .trim()
    .toUpperCase();

  /*
   * These values match the secure server route.
   */
  const promoDiscounts: Record<
    string,
    number
  > = {
    FREEDOM10: 0.1,
    PEPTIDEALS: 0.15,
  };

  const discountRate =
    promoDiscounts[normalizedPromoCode] || 0;

  const discount = Number(
    (subtotal * discountRate).toFixed(2)
  );

  const availablePoints = Math.max(
    0,
    recordedPoints - reservedPoints
  );

  /*
   * Rewards apply after the promotional
   * discount and cannot pay for shipping.
   */
  const merchandiseAfterPromo = Math.max(
    0,
    subtotal - discount
  );

  const maximumPointsBasedOnOrder =
    Math.floor(
      merchandiseAfterPromo / 10
    ) * 100;

  const maximumPointsBasedOnBalance =
    Math.floor(availablePoints / 100) *
    100;

  const maximumRedeemablePoints = Math.min(
    maximumPointsBasedOnOrder,
    maximumPointsBasedOnBalance
  );

  const rewardOptions = useMemo(() => {
    const options: number[] = [];

    for (
      let points = 100;
      points <= maximumRedeemablePoints;
      points += 100
    ) {
      options.push(points);
    }

    return options;
  }, [maximumRedeemablePoints]);

  /*
   * Reset the selected reward if a promo or
   * cart change makes it invalid.
   */
  useEffect(() => {
    if (
      redeemedPoints >
      maximumRedeemablePoints
    ) {
      setRedeemedPoints(0);
    }
  }, [
    redeemedPoints,
    maximumRedeemablePoints,
  ]);

  const rewardDiscount = Number(
    (redeemedPoints / 10).toFixed(2)
  );

  const total = Number(
    Math.max(
      0,
      subtotal -
        discount -
        rewardDiscount +
        shipping
    ).toFixed(2)
  );

  const vialCount = cart.reduce(
    (count, item) => {
      const isBacWater = item.name
        .toLowerCase()
        .includes("bac");

      return isBacWater
        ? count
        : count + item.quantity;
    },
    0
  );

  const qualifiesForFreeBacWater =
    vialCount >= 4;

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
    const place =
      autocompleteRef.current?.getPlace();

    if (!place?.address_components) return;

    let streetNumber = "";
    let route = "";
    let cityName = "";
    let stateCode = "";
    let zip = "";

    place.address_components.forEach(
      (component) => {
        const types = component.types;

        if (types.includes("street_number")) {
          streetNumber =
            component.long_name;
        }

        if (types.includes("route")) {
          route = component.long_name;
        }

        if (types.includes("locality")) {
          cityName =
            component.long_name;
        }

        if (
          types.includes(
            "administrative_area_level_1"
          )
        ) {
          stateCode =
            component.short_name;
        }

        if (types.includes("postal_code")) {
          zip = component.long_name;
        }
      }
    );

    setAddress(
      `${streetNumber} ${route}`.trim()
    );
    setCity(cityName);
    setStateValue(stateCode);
    setZipCode(zip);
  };

  const handlePlaceOrder = async () => {
    if (
      !isCheckoutComplete ||
      loading
    ) {
      return;
    }

    if (
      redeemedPoints > 0 &&
      (!loggedInEmail || !accessToken)
    ) {
      alert(
        "Please log in again before redeeming rewards."
      );
      return;
    }

    setLoading(true);

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (
        redeemedPoints > 0 &&
        accessToken
      ) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        "/api/send-order-email",
        {
          method: "POST",
          headers,
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
            promoCode:
              discountRate > 0
                ? normalizedPromoCode
                : "",
            redeemedPoints,
            marketingConsent,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Order submission failed."
        );
      }

      localStorage.removeItem("cart");
      window.dispatchEvent(
        new Event("cartUpdated")
      );

      setCart([]);
      setSuccessOrderNumber(
        data.orderNumber
      );
      setShowSuccess(true);
    } catch (error: unknown) {
      console.error(
        "Checkout error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong submitting your order.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#081526] text-white">
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <a
                href="/cart"
                className="mb-8 inline-flex text-sm uppercase tracking-widest text-blue-300 transition-all hover:text-white"
              >
                ← Return to Cart
              </a>

              <p className="mb-6 text-sm uppercase tracking-[0.35em] text-blue-300">
                Checkout
              </p>

              <h1 className="mb-6 text-5xl font-black leading-[0.95] text-white md:text-7xl">
                Complete Your Order
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
                Enter your shipping details,
                confirm research-use terms,
                and receive secure payment
                instructions by email.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-white/70">
              <ShoppingCart
                size={20}
                className="text-blue-300"
              />

              <span className="text-sm uppercase tracking-widest">
                Total Due: $
                {total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_430px]">
            <div className="space-y-8">
              {/* ACCOUNT */}
              <section className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-8 backdrop-blur-sm">
                {accountLoading ? (
                  <p className="text-sm text-white/60">
                    Loading account...
                  </p>
                ) : loggedInEmail ? (
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full border border-blue-300/30 bg-blue-400/10 p-3">
                        <UserCircle
                          className="text-blue-300"
                          size={28}
                        />
                      </div>

                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.35em] text-blue-300">
                          Signed In
                        </p>

                        <h2 className="text-2xl font-black text-white">
                          Welcome back
                          {loggedInUsername
                            ? `, ${loggedInUsername}`
                            : ""}
                        </h2>

                        <p className="mt-2 text-sm text-white/60">
                          Your email has been
                          filled automatically.
                          This order will appear
                          in your customer portal.
                        </p>

                        <p className="mt-3 text-sm font-semibold text-blue-200">
                          {loggedInEmail}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/account"
                      className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-white hover:border-blue-300/50"
                    >
                      My Account
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300">
                        Returning Customer
                      </p>

                      <h2 className="mb-3 text-3xl font-black text-white">
                        Log in for rewards
                      </h2>

                      <p className="text-sm leading-relaxed text-white/60">
                        Log in to connect this
                        order to your customer
                        portal, earn rewards, and
                        redeem existing points.
                        You can also continue as a
                        guest.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                      <Link
                        href="/account/login"
                        className="rounded-full bg-white px-7 py-4 text-center text-xs font-black uppercase tracking-[0.25em] text-[#081526] hover:bg-blue-100"
                      >
                        Log In
                      </Link>

                      <Link
                        href="/account/signup"
                        className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-center text-xs font-black uppercase tracking-[0.25em] text-white hover:border-blue-300/50"
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                )}
              </section>

              {/* REWARDS */}
              {loggedInEmail && (
                <section className="relative overflow-hidden rounded-[2rem] border border-blue-300/20 bg-gradient-to-br from-blue-500/15 via-white/[0.05] to-white/[0.03] p-8 backdrop-blur-sm">
                  <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />

                  <div className="relative z-10">
                    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/10 text-blue-300">
                          <Award size={24} />
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                            Apexx Rewards
                          </p>

                          <h2 className="text-3xl font-black text-white">
                            Use rewards on this
                            order
                          </h2>

                          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
                            Redeem points in
                            increments of 100.
                            Every 100 points gives
                            you $10 off.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-blue-300/20 bg-[#081526]/50 px-5 py-4 text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Available
                        </p>

                        <p className="mt-1 text-2xl font-black text-blue-300">
                          {availablePoints} pts
                        </p>
                      </div>
                    </div>

                    {reservedPoints > 0 && (
                      <div className="mb-5 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-4">
                        <p className="text-sm font-semibold text-yellow-100">
                          {reservedPoints} points
                          are currently reserved
                          on another active order.
                        </p>
                      </div>
                    )}

                    {maximumRedeemablePoints <
                    100 ? (
                      <div className="rounded-2xl border border-white/10 bg-[#081526]/50 p-5">
                        <p className="font-bold text-white">
                          No reward is available
                          for this order yet.
                        </p>

                        <p className="mt-2 text-sm leading-relaxed text-white/50">
                          You need at least 100
                          available points and
                          enough merchandise value
                          to apply a $10 reward.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() =>
                            setRedeemedPoints(0)
                          }
                          className={`flex w-full items-center justify-between rounded-2xl border p-5 text-left transition ${
                            redeemedPoints === 0
                              ? "border-blue-300/50 bg-blue-400/10"
                              : "border-white/10 bg-[#081526]/50 hover:border-blue-300/30"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-white">
                              Do not use rewards
                            </p>

                            <p className="mt-1 text-sm text-white/50">
                              Save your points for
                              another order
                            </p>
                          </div>

                          <div
                            className={`h-5 w-5 rounded-full border ${
                              redeemedPoints === 0
                                ? "border-blue-300 bg-blue-300 shadow-[inset_0_0_0_4px_#081526]"
                                : "border-white/30"
                            }`}
                          />
                        </button>

                        {rewardOptions.map(
                          (points) => {
                            const dollars =
                              points / 10;

                            const selected =
                              redeemedPoints ===
                              points;

                            return (
                              <button
                                key={points}
                                type="button"
                                onClick={() =>
                                  setRedeemedPoints(
                                    points
                                  )
                                }
                                className={`flex w-full items-center justify-between rounded-2xl border p-5 text-left transition ${
                                  selected
                                    ? "border-blue-300/50 bg-blue-400/10"
                                    : "border-white/10 bg-[#081526]/50 hover:border-blue-300/30"
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                                    <Gift
                                      size={20}
                                    />
                                  </div>

                                  <div>
                                    <p className="font-bold text-white">
                                      Redeem{" "}
                                      {points}{" "}
                                      points
                                    </p>

                                    <p className="mt-1 text-sm text-green-300">
                                      $
                                      {dollars.toFixed(
                                        2
                                      )}{" "}
                                      off
                                    </p>
                                  </div>
                                </div>

                                <div
                                  className={`h-5 w-5 rounded-full border ${
                                    selected
                                      ? "border-blue-300 bg-blue-300 shadow-[inset_0_0_0_4px_#081526]"
                                      : "border-white/30"
                                  }`}
                                />
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}

                    {redeemedPoints > 0 && (
                      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-green-300/20 bg-green-400/10 p-4">
                        <Sparkles
                          className="shrink-0 text-green-300"
                          size={20}
                        />

                        <p className="text-sm font-semibold text-green-100">
                          {redeemedPoints} points
                          selected. You will save $
                          {rewardDiscount.toFixed(
                            2
                          )}{" "}
                          on this order.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* CONTACT */}
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
                <h2 className="mb-6 text-3xl font-black text-white">
                  Contact Information
                </h2>

                <input
                  type="email"
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(event) =>
                    setCustomerEmail(
                      event.target.value
                    )
                  }
                  className="checkout-input w-full"
                  readOnly={!!loggedInEmail}
                />

                {loggedInEmail && (
                  <p className="mt-3 text-xs text-blue-200/70">
                    Email is connected to your
                    signed-in account.
                  </p>
                )}
              </section>

              {/* DELIVERY */}
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
                <h2 className="mb-2 text-3xl font-black text-white">
                  Delivery
                </h2>

                <p className="mb-6 text-white/50">
                  Shipping address
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    className="checkout-input md:col-span-2"
                    value="United States"
                    readOnly
                  />

                  <input
                    className="checkout-input"
                    placeholder="First name"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value
                      )
                    }
                  />

                  <input
                    className="checkout-input"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value
                      )
                    }
                  />

                  {isLoaded ? (
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        autocompleteRef.current =
                          autocomplete;
                      }}
                      onPlaceChanged={
                        handlePlaceChanged
                      }
                    >
                      <input
                        className="checkout-input w-full md:col-span-2"
                        placeholder="Start typing your address..."
                        value={address}
                        onChange={(event) =>
                          setAddress(
                            event.target.value
                          )
                        }
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
                    onChange={(event) =>
                      setApartment(
                        event.target.value
                      )
                    }
                  />

                  <input
                    className="checkout-input"
                    placeholder="City"
                    value={city}
                    onChange={(event) =>
                      setCity(
                        event.target.value
                      )
                    }
                  />

                  <select
                    className="checkout-input"
                    value={stateValue}
                    onChange={(event) =>
                      setStateValue(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select State
                    </option>
                    <option value="AL">
                      Alabama
                    </option>
                    <option value="AK">
                      Alaska
                    </option>
                    <option value="AZ">
                      Arizona
                    </option>
                    <option value="AR">
                      Arkansas
                    </option>
                    <option value="CA">
                      California
                    </option>
                    <option value="CO">
                      Colorado
                    </option>
                    <option value="CT">
                      Connecticut
                    </option>
                    <option value="DE">
                      Delaware
                    </option>
                    <option value="FL">
                      Florida
                    </option>
                    <option value="GA">
                      Georgia
                    </option>
                    <option value="HI">
                      Hawaii
                    </option>
                    <option value="ID">
                      Idaho
                    </option>
                    <option value="IL">
                      Illinois
                    </option>
                    <option value="IN">
                      Indiana
                    </option>
                    <option value="IA">
                      Iowa
                    </option>
                    <option value="KS">
                      Kansas
                    </option>
                    <option value="KY">
                      Kentucky
                    </option>
                    <option value="LA">
                      Louisiana
                    </option>
                    <option value="ME">
                      Maine
                    </option>
                    <option value="MD">
                      Maryland
                    </option>
                    <option value="MA">
                      Massachusetts
                    </option>
                    <option value="MI">
                      Michigan
                    </option>
                    <option value="MN">
                      Minnesota
                    </option>
                    <option value="MS">
                      Mississippi
                    </option>
                    <option value="MO">
                      Missouri
                    </option>
                    <option value="MT">
                      Montana
                    </option>
                    <option value="NE">
                      Nebraska
                    </option>
                    <option value="NV">
                      Nevada
                    </option>
                    <option value="NH">
                      New Hampshire
                    </option>
                    <option value="NJ">
                      New Jersey
                    </option>
                    <option value="NM">
                      New Mexico
                    </option>
                    <option value="NY">
                      New York
                    </option>
                    <option value="NC">
                      North Carolina
                    </option>
                    <option value="ND">
                      North Dakota
                    </option>
                    <option value="OH">
                      Ohio
                    </option>
                    <option value="OK">
                      Oklahoma
                    </option>
                    <option value="OR">
                      Oregon
                    </option>
                    <option value="PA">
                      Pennsylvania
                    </option>
                    <option value="RI">
                      Rhode Island
                    </option>
                    <option value="SC">
                      South Carolina
                    </option>
                    <option value="SD">
                      South Dakota
                    </option>
                    <option value="TN">
                      Tennessee
                    </option>
                    <option value="TX">
                      Texas
                    </option>
                    <option value="UT">
                      Utah
                    </option>
                    <option value="VT">
                      Vermont
                    </option>
                    <option value="VA">
                      Virginia
                    </option>
                    <option value="WA">
                      Washington
                    </option>
                    <option value="WV">
                      West Virginia
                    </option>
                    <option value="WI">
                      Wisconsin
                    </option>
                    <option value="WY">
                      Wyoming
                    </option>
                    <option value="DC">
                      District of Columbia
                    </option>
                  </select>

                  <input
                    className="checkout-input"
                    placeholder="ZIP code"
                    value={zipCode}
                    onChange={(event) =>
                      setZipCode(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 5)
                      )
                    }
                  />
                </div>

                <p className="mt-4 text-xs text-white/40">
                  ZIP code must be 5 digits.
                  State must be selected from the
                  dropdown.
                </p>
              </section>

              {/* TERMS */}
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-black text-white">
                  Research Use Acknowledgment
                </h3>

                <p className="mb-5 text-sm leading-relaxed text-white/60">
                  By placing this order, I confirm
                  that I am at least 21 years of
                  age and understand that all
                  products are intended strictly
                  for lawful laboratory research
                  use only. Products are not
                  intended for human consumption,
                  medical use, veterinary use,
                  diagnosis, treatment, cure, or
                  prevention of disease.
                </p>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-[#081526]/50 p-4">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) =>
                      setAgreed(
                        event.target.checked
                      )
                    }
                    className="mt-1"
                  />

                  <span className="text-sm text-white/70">
                    I agree to the
                    research-use-only terms and
                    website policies.
                  </span>
                </label>
              </section>
            </div>

            <aside className="space-y-6">
              {/* ORDER SUMMARY */}
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
                <div className="mb-8 flex items-center justify-between gap-4">
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

                <div className="mb-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-white/50">
                      Your cart is empty.
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-[#081526]/50 p-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-[24px] object-contain"
                        />

                        <div className="flex-1">
                          <h3 className="font-black text-white">
                            {item.name}
                          </h3>

                          <p className="text-sm text-white/50">
                            Quantity:{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="font-black text-blue-300">
                          $
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mb-8 space-y-4 border-t border-white/10 pt-6">
                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      Promo Code
                    </label>

                    <input
                      type="text"
                      value={promoCode}
                      onChange={(event) =>
                        setPromoCode(
                          event.target.value
                        )
                      }
                      placeholder="Enter promo code"
                      className="checkout-input"
                    />

                    {discountRate > 0 && (
                      <p className="mt-2 text-sm font-semibold text-green-300">
                        ✓ {normalizedPromoCode}{" "}
                        Applied (
                        {Math.round(
                          discountRate * 100
                        )}
                        % Off)
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between gap-4 font-semibold text-green-300">
                      <span>
                        {normalizedPromoCode}{" "}
                        discount
                      </span>

                      <span>
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {rewardDiscount > 0 && (
                    <div className="flex justify-between gap-4 font-semibold text-green-300">
                      <span>
                        Apexx Rewards (
                        {redeemedPoints} pts)
                      </span>

                      <span>
                        -$
                        {rewardDiscount.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>

                    {qualifiesForFreeShipping ? (
                      <span className="font-semibold text-green-300">
                        FREE
                      </span>
                    ) : (
                      <span>
                        ${shipping.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {cart.length > 0 &&
                    (qualifiesForFreeShipping ? (
                      <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-4">
                        <p className="text-sm font-semibold text-green-200">
                          🎉 Free shipping
                          unlocked.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                        <p className="text-sm text-blue-100">
                          Add $
                          {amountLeftForFreeShipping.toFixed(
                            2
                          )}{" "}
                          more to receive free
                          shipping.
                        </p>
                      </div>
                    ))}

                  {qualifiesForFreeBacWater && (
                    <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-4">
                      <p className="text-sm font-bold text-green-300">
                        ✓ Complimentary Bac Water
                        Included
                      </p>

                      <p className="mt-1 text-sm text-white/60">
                        Orders with 4 or more vials
                        receive one complimentary
                        bacteriostatic water.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-white/10 pt-4 text-2xl font-black text-white">
                    <span>Total Due</span>

                    <span className="text-blue-300">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </section>

              {/* PAYMENT */}
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
                <h2 className="mb-3 text-2xl font-black text-white">
                  Payment Method
                </h2>

                <p className="mb-6 text-sm text-white/60">
                  Select a payment method.
                  Payment instructions will be
                  sent by email after your order
                  is submitted.
                </p>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  {[
                    {
                      id: "venmo",
                      label: "Venmo",
                    },
                    {
                      id: "zelle",
                      label: "Zelle",
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          method.id
                        )
                      }
                      className={`rounded-2xl p-5 text-left transition-all ${
                        paymentMethod ===
                        method.id
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

                <div className="mb-6 rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-6">
                  <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-100">
                    Payment Amount
                  </p>

                  <p className="mb-2 text-4xl font-black text-white">
                    ${total.toFixed(2)}
                  </p>

                  {discount > 0 && (
                    <p className="mb-2 text-sm font-semibold text-green-300">
                      {normalizedPromoCode}{" "}
                      applied — $
                      {discount.toFixed(2)} off
                    </p>
                  )}

                  {rewardDiscount > 0 && (
                    <p className="mb-2 text-sm font-semibold text-green-300">
                      {redeemedPoints} reward
                      points applied — $
                      {rewardDiscount.toFixed(2)}{" "}
                      off
                    </p>
                  )}

                  <p className="text-sm text-blue-100/70">
                    Please send exactly $
                    {total.toFixed(2)} via{" "}
                    {paymentMethod === "venmo"
                      ? "Venmo"
                      : "Zelle"}{" "}
                    after your order is
                    submitted.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-[#081526]/50 p-6">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-300">
                    Payment Instructions
                  </h3>

                  <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-white/60">
                    <li>
                      Payment instructions will
                      be sent to your email after
                      checkout.
                    </li>

                    <li>
                      Submit the exact payment
                      amount shown above.
                    </li>

                    <li>
                      Include ONLY your order
                      number in the payment notes.
                    </li>

                    <li>
                      Do not include product names
                      or descriptions.
                    </li>

                    <li>
                      Orders not paid within 24
                      hours may be cancelled.
                    </li>
                  </ul>
                </div>
              </section>

              {/* MARKETING */}
              <div className="mb-6 rounded-2xl border border-blue-300/20 bg-blue-500/10 p-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(event) =>
                      setMarketingConsent(
                        event.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4"
                  />

                  <span className="text-sm leading-relaxed text-white/70">
                    Yes, I'd like to receive
                    early access to new releases,
                    restock alerts, and exclusive
                    offers from Apexx Biolabs.
                  </span>
                </label>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={
                  !isCheckoutComplete ||
                  loading
                }
                className={`w-full rounded-full py-5 font-bold uppercase tracking-widest transition-all ${
                  isCheckoutComplete &&
                  !loading
                    ? "bg-white text-[#081526] hover:bg-blue-100"
                    : "cursor-not-allowed bg-white/[0.06] text-white/30"
                }`}
              >
                {loading
                  ? "Submitting Order..."
                  : "Place Order & Receive Payment Instructions"}
              </button>

              <div className="grid grid-cols-2 gap-4 text-center text-xs text-white/50">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <ShieldCheck className="mx-auto mb-2 text-blue-300" />
                  Secure Checkout
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Lock className="mx-auto mb-2 text-blue-300" />
                  Encrypted
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Package className="mx-auto mb-2 text-blue-300" />
                  Discreet Packaging
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Star className="mx-auto mb-2 text-blue-300" />
                  Trusted Support
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-5 text-xs text-blue-300">
                <a href="/refunds">
                  Refund Policy
                </a>
                <a href="/shipping">
                  Shipping
                </a>
                <a href="/privacy">
                  Privacy Policy
                </a>
                <a href="/terms">
                  Terms of Service
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020817]/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-[36px] border border-blue-300/30 bg-gradient-to-br from-[#eef7ff] via-white to-[#dbeafe] shadow-[0_0_70px_rgba(96,165,250,0.35)]">
            <div className="p-8 text-center md:p-10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10">
                <svg
                  className="h-10 w-10 text-blue-500"
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

              <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-500">
                Order Received
              </p>

              <h2 className="mb-4 text-4xl font-black text-[#081526]">
                Thank You
              </h2>

              <p className="mb-7 leading-relaxed text-slate-600">
                Your order has been
                successfully submitted. Payment
                instructions have been sent to
                your email.
              </p>

              <div className="mb-7 rounded-[24px] border border-blue-200 bg-white/80 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
                  Order Number
                </p>

                <p className="break-all text-lg font-black text-[#081526]">
                  {successOrderNumber}
                </p>
              </div>

              {redeemedPoints > 0 && (
                <div className="mb-7 rounded-[24px] border border-green-200 bg-green-50 p-5">
                  <p className="text-sm font-bold text-green-700">
                    {redeemedPoints} reward
                    points were reserved for this
                    order, saving you $
                    {rewardDiscount.toFixed(2)}.
                  </p>
                </div>
              )}

              <div className="mb-7 rounded-[24px] bg-[#081526] p-5">
                <p className="text-sm leading-relaxed text-blue-200">
                  Please check your email for
                  your payment instructions.
                  Include only your order number
                  in the payment note.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowSuccess(false);

                  window.location.href =
                    loggedInEmail
                      ? "/account"
                      : "/";
                }}
                className="w-full rounded-full bg-[#081526] py-4 font-bold uppercase tracking-widest text-white transition-all hover:bg-blue-900"
              >
                {loggedInEmail
                  ? "View My Account"
                  : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .checkout-input {
          width: 100%;
          background: rgba(
            255,
            255,
            255,
            0.04
          );
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          padding: 1rem 1.25rem;
          outline: none;
          color: white;
          backdrop-filter: blur(12px);
        }

        .checkout-input::placeholder {
          color: rgba(
            255,
            255,
            255,
            0.4
          );
        }

        .checkout-input:focus {
          border-color: rgba(
            96,
            165,
            250,
            0.5
          );
        }

        select.checkout-input {
          appearance: none;
        }

        select.checkout-input option {
          color: #081526;
        }
      `}</style>
    </main>
  );
}