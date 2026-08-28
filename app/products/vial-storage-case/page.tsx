"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  Package,
  ShieldCheck,
  LayoutGrid,
  BriefcaseBusiness,
} from "lucide-react";

const PRICE = 14.99;

export default function VialStorageCasePage() {
  const [quantity, setQuantity] = useState(1);

  const total = PRICE * quantity;

  const handleAddToCart = () => {
    // CONNECT THIS TO YOUR EXISTING CART FUNCTION
    console.log({
      name: "Vial Storage Case",
      slug: "vial-storage-case",
      price: PRICE,
      quantity,
      image: "/images/vial-case.png",
      category: "Lab Accessories",
    });

    alert(`${quantity} Vial Storage Case added to cart`);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[140px]" />
        <div className="absolute -left-40 top-[500px] h-[500px] w-[500px] rounded-full bg-blue-400/[0.05] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-6 lg:px-8">
        {/* BACK BUTTON */}
        <Link
          href="/products"
          className="group mb-10 inline-flex items-center gap-3 text-sm font-semibold text-white/50 transition hover:text-white"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition group-hover:border-blue-400/40 group-hover:bg-blue-400/10">
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </span>

          Back to Products
        </Link>

        {/* PRODUCT AREA */}
        <section className="grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          {/* LEFT SIDE */}
          <div>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
              {/* top badge */}
              <div className="absolute left-8 top-8 z-20">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#081526]/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200 backdrop-blur-md">
                  <Package size={13} />
                  Lab Accessory
                </span>
              </div>

              {/* PRODUCT IMAGE */}
              <div className="relative overflow-hidden rounded-[2rem] bg-[#93C5FD]">
                <img
                  src="/images/vial-case.png"
                  alt="Apexx Biolabs Vial Storage Case"
                  className="aspect-square h-full w-full object-cover"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081526]/10 via-transparent to-white/5" />
              </div>
            </div>

            {/* SMALL INFO BAR */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-4 text-center">
                <p className="text-lg font-black text-white">14</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Vial Slots
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-4 text-center">
                <p className="text-lg font-black text-white">2 × 7</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Layout
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-4 text-center">
                <p className="text-lg font-black text-white">Apexx</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Branded
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:sticky lg:top-28">
            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm sm:p-8 lg:p-10">
              {/* EYEBROW */}
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-blue-300">
                Apexx Essentials
              </p>

              {/* TITLE */}
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.02]">
                Vial Storage
                <br />
                <span className="text-blue-300">Case.</span>
              </h1>

              {/* PRICE */}
              <div className="mt-6 flex items-end gap-2">
                <p className="text-3xl font-black text-white">$14.99</p>
              </div>

              {/* DESCRIPTION */}
              <p className="mt-7 max-w-xl text-base leading-7 text-white/55">
                Keep your research vials organized in one compact case.
                Designed with two rows of seven vial slots for clean,
                convenient storage.
              </p>

              {/* DIVIDER */}
              <div className="my-8 h-px bg-white/10" />

              {/* FEATURES */}
              <div className="grid gap-3 sm:grid-cols-2">
                <FeatureCard
                  icon={<LayoutGrid size={18} />}
                  title="14 Vial Capacity"
                  text="Two organized rows of seven."
                />

                <FeatureCard
                  icon={<ShieldCheck size={18} />}
                  title="Protective Storage"
                  text="Helps keep vials together and secure."
                />

                <FeatureCard
                  icon={<BriefcaseBusiness size={18} />}
                  title="Compact Case"
                  text="Easy to store and carry."
                />

                <FeatureCard
                  icon={<Package size={18} />}
                  title="Apexx Branded"
                  text="Finished with the Apexx Biolabs logo."
                />
              </div>

              {/* QUANTITY */}
              <div className="mt-9">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                  Quantity
                </p>

                <div className="inline-flex items-center rounded-full border border-white/10 bg-[#06111f]/80 p-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="w-12 text-center text-sm font-bold text-white">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>

              {/* ADD TO CART */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-8 flex w-full items-center justify-between rounded-full bg-white px-6 py-4 text-[#081526] transition hover:bg-blue-100"
              >
                <span className="text-sm font-black uppercase tracking-[0.15em]">
                  Add to Cart
                </span>

                <span className="text-sm font-black">
                  ${total.toFixed(2)}
                </span>
              </button>

              {/* BOTTOM INFO */}
              <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] uppercase tracking-[0.15em] text-white/30">
                <Package size={13} />
                Apexx Biolabs Lab Accessory
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="mt-16">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="p-8 sm:p-10 lg:p-12">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
                  Product Details
                </p>

                <h2 className="mt-4 text-3xl font-black text-white">
                  Organized storage without the clutter.
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-white/50">
                  The Apexx Biolabs Vial Storage Case is designed to keep
                  research vials neatly arranged and easy to access. Its
                  compact layout provides dedicated storage for up to fourteen
                  vials while maintaining a clean, minimal profile.
                </p>
              </div>

              <div className="border-t border-white/10 p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
                <div className="space-y-6">
                  <DetailRow label="Capacity" value="14 vials" />
                  <DetailRow label="Configuration" value="2 rows × 7" />
                  <DetailRow label="Category" value="Lab Accessories" />
                  <DetailRow label="Price" value="$14.99" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#06111f]/45 p-4 transition hover:border-blue-400/25 hover:bg-white/[0.05]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
        {icon}
      </div>

      <p className="text-sm font-bold text-white">{title}</p>

      <p className="mt-1 text-xs leading-5 text-white/40">{text}</p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-5 last:border-0 last:pb-0">
      <p className="text-sm text-white/40">{label}</p>

      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}