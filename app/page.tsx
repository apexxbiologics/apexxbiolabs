"use client";
import {
  Users,
  ShieldCheck,
  Headphones,
  Truck,
  BookOpen,
} from "lucide-react";

import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Reveal from "@/components/Reveal";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { FlaskConical, Microscope } from "lucide-react";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Gift, BadgePercent } from "lucide-react";
import { Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [search, setSearch] = useState("");
const [openFAQ, setOpenFAQ] = useState<number | null>(null);
const [disclaimerChecked, setDisclaimerChecked] = useState(false);

    const [cartCount, setCartCount] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const productScrollRef = useRef<HTMLDivElement | null>(null);
    const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
const [activeQuality, setActiveQuality] = useState("potency");
const [menuOpen, setMenuOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);
const [added, setAdded] = useState(false);
const [quantity, setQuantity] = useState(1);
const [searchTerm, setSearchTerm] = useState("");
const [promoEmail, setPromoEmail] = useState("");
const [promoStatus, setPromoStatus] = useState("");
const [reviews, setReviews] = useState<any[]>([]);

// Prevent the homepage from shifting horizontally on mobile browsers.
useEffect(() => {
  const previousHtmlOverflowX = document.documentElement.style.overflowX;
  const previousBodyOverflowX = document.body.style.overflowX;

  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";

  return () => {
    document.documentElement.style.overflowX = previousHtmlOverflowX;
    document.body.style.overflowX = previousBodyOverflowX;
  };
}, []);
const startProductScroll = (direction: "left" | "right") => {
  stopProductScroll();

  autoScrollRef.current = setInterval(() => {
    productScrollRef.current?.scrollBy({
      left: direction === "left" ? -34 : 34,
    });
  }, 16);
};

const stopProductScroll = () => {
  if (autoScrollRef.current) {
    clearInterval(autoScrollRef.current);
    autoScrollRef.current = null;
  }
};

const products = [
  { name: "APX-3", href: "/products/apx3" },
  { name: "APX-2", href: "/products/apx2" },
  { name: "MITO-X", href: "/products/mitox" },
  { name: "NEURO-X", href: "/products/neurox" },
  { name: "Glutathione", href: "/products/glutathione" },
  { name: "SS-31", href: "/products/ss31" },
  { name: "BPC-157", href: "/products/bpc157" },
  { name: "TB-500", href: "/products/tb500" },
  { name: "KPV", href: "/products/kpv" },
  { name: "GHK-Cu", href: "/products/ghkcu" },
  { name: "Pinealon", href: "/products/pinealon" },
  { name: "Selank", href: "/products/selank" },
  { name: "Semax", href: "/products/semax" },
  { name: "MOTS-C", href: "/products/motsc" },
  { name: "ARA-290", href: "/products/ara290" },
  { name: "PE-22-28", href: "/products/pe2228" },
  { name: "ADAMAX", href: "/products/adamax" },
  { name: "CJC/IPA Without DAC", href: "/products/cjcipa" },
  { name: "Tesamorelin", href: "/products/tesamorelin" },
  { name: "NAD+", href: "/products/nad" },
  { name: "5-Amino-1MQ", href: "/products/5amino1mq" },
  { name: "AOD-9604", href: "/products/aod9604" },
  { name: "Kisspeptin-10", href: "/products/kisspeptin10" },
  { name: "PT-141", href: "/products/pt141" },
  { name: "KLOW", href: "/products/klow" },
  { name: "Wolverine", href: "/products/wolverine" },
];

const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);

  const [accepted, setAccepted] = useState<boolean | null>(null);

useEffect(() => {
  const navEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;

  const isRefresh = navEntry?.type === "reload";

  const cameFromInternalPage =
    document.referrer &&
    document.referrer.includes(window.location.origin) &&
    !document.referrer.endsWith("/");

  if (isRefresh) {
    setAccepted(false);
  } else if (cameFromInternalPage) {
    setAccepted(true);
  } else {
    setAccepted(false);
  }
}, []);

useEffect(() => {
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const count = cart.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );

    setCartCount(count);
  };

  updateCartCount();

  window.addEventListener("storage", updateCartCount);
  window.addEventListener("cartUpdated", updateCartCount);

  return () => {
    window.removeEventListener("storage", updateCartCount);
    window.removeEventListener("cartUpdated", updateCartCount);
  };
}, []);
useEffect(() => {
  const video = videoRef.current;

  if (!video) return;

  video.muted = true;

  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}, [accepted]);

useEffect(() => {
  const video = videoRef.current;

  if (!video) return;

  video.muted = true;

  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}, [accepted]);

useEffect(() => {
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, rating, review")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (!error && data) {
      setReviews(data);
    }
  };

  fetchReviews();
}, []);

const handleAccept = () => {
  setAccepted(true);
};

if (accepted === null) {
  return null;
}
const handlePromoSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!promoEmail.trim()) return;

  const response = await fetch("/api/promo-signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: promoEmail.trim().toLowerCase(),
    }),
  });

  const data = await response.json();

  setPromoStatus(data.message);

  if (data.success) {
    setPromoEmail("");
  }
};

  return (
    <>
{!accepted && (
  <div className="fixed inset-0 z-[9999] w-full max-w-[100vw] overflow-x-hidden overflow-y-auto bg-[#020817] px-4 py-8">

    <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_55%)]" />

    <div className="relative flex min-h-screen w-full min-w-0 items-start justify-center md:items-center">

      <div className="w-full min-w-0 max-w-3xl overflow-hidden rounded-[36px] border border-blue-400/20 bg-gradient-to-b from-[#0f1d33] to-[#081526] shadow-[0_0_80px_rgba(59,130,246,0.22)]">

        {/* Glow */}
<div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_55%)]" />
        {/* Header */}
        <div className="text-center px-8 md:px-14 pt-12 pb-8">

          <img
            src="/images/logo.png"
            alt="Apexx Biolabs"
            className="h-20 w-auto mx-auto mb-8"
          />

          <p className="uppercase tracking-[0.45em] text-blue-300 text-xs mb-5">
            Research Use Verification
          </p>

          <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tight text-white mb-6">
            Welcome to
            <span className="block bg-gradient-to-r from-blue-200 via-white to-blue-300 bg-clip-text text-transparent">
              Apexx Biolabs
            </span>
          </h1>

          <div className="h-px w-40 mx-auto bg-gradient-to-r from-transparent via-blue-400 to-transparent mb-8" />

          <p className="text-blue-100/75 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Before entering, please acknowledge that all products offered by
            Apexx Biolabs are intended strictly for lawful laboratory research
            and analytical purposes.
          </p>
        </div>

        {/* Main Content */}
        <div className="px-8 md:px-14 pb-10">

          <div className="rounded-3xl border border-blue-400/15 bg-white/[0.03] p-6 md:p-8 mb-8">

            <div className="flex items-start gap-4">

<div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0">
  <FlaskConical
    size={24}
    strokeWidth={2.25}
    className="text-blue-300"
  />
</div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  Research Use Only
                </h3>

                <p className="text-blue-100/70 leading-relaxed">
                  Products sold on this website are not intended for human
                  consumption, medical use, veterinary use, diagnosis,
                  treatment, cure, or prevention of disease. No information
                  provided by Apexx Biolabs should be interpreted as medical
                  advice.
                </p>
              </div>

            </div>
          </div>

          {/* Checkbox */}
          <label className="group flex items-start gap-4 p-6 rounded-3xl border border-blue-400/15 bg-white/[0.03] cursor-pointer hover:border-blue-400/30 transition-all">

            <input
              type="checkbox"
              checked={disclaimerChecked}
              onChange={(e) => setDisclaimerChecked(e.target.checked)}
              className="mt-1 w-5 h-5 accent-blue-500"
            />

            <span className="text-blue-100/80 leading-relaxed">
              I confirm that I am at least <strong>21 years of age</strong> and
              understand that all products sold by Apexx Biolabs are intended
              exclusively for lawful laboratory research use.
            </span>

          </label>

          {/* Button */}
          <button
            onClick={handleAccept}
            disabled={!disclaimerChecked}
            className={`w-full mt-8 py-5 rounded-2xl uppercase tracking-[0.25em] text-sm font-bold transition-all ${
              disclaimerChecked
                ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] hover:scale-[1.01]"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            Enter Apexx Biolabs
          </button>

          <p className="text-center text-xs text-blue-100/40 uppercase tracking-[0.25em] mt-6">
            Laboratory Research Use Only
          </p>

        </div>
      </div>
    </div>
  </div>
)}

<div className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[#081526] text-white">

{/* HERO */}
<section className="relative w-full max-w-full overflow-hidden bg-[#081526] px-4 pb-24 pt-8 sm:px-6">
  {/* Free Shipping Banner */}
  <div className="relative z-20 mb-4 rounded-full border border-blue-400/30 bg-blue-500/10 px-6 py-4 text-center backdrop-blur-sm max-w-5xl mx-auto">
    <p className="text-blue-100 font-bold uppercase tracking-[0.25em] text-xs md:text-sm">
      Free Shipping On Orders Over $200
    </p>
  </div>

  {/* Promo Banners */}
  <div className="relative z-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
    <div className="rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm px-8 py-5 text-center">
      <p className="text-white font-bold uppercase tracking-[0.25em] text-xs md:text-sm">
        JOIN THE LIST
      </p>
      <p className="text-blue-100 text-xs mt-1">
        Exclusive promos, product updates & promo codes.
      </p>
    </div>

    <div className="rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm px-8 py-5 text-center">
      <p className="text-white font-bold uppercase tracking-[0.25em] text-xs md:text-sm">
        FREE GIFT
      </p>
      <p className="text-blue-100 text-xs mt-1">
Receive a Complimentary Gift With Any 8 Vials
      </p>
    </div>
  </div>

  {/* Background Image */}
  <div
    className="absolute right-0 top-0 h-full w-full lg:w-[75%] bg-cover opacity-90"
    style={{
      backgroundImage: "url('/images/hero-vial-right.png')",
      backgroundPosition: "75% center",
    }}
  />

  <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#081526] via-[#081526]/92 to-transparent" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_55%)]" />

  <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-7xl items-center py-14">
    <Reveal>
      <div className="w-full min-w-0 max-w-3xl">
        <p className="uppercase tracking-[0.3em] text-blue-300 text-xs mb-4">
          Research. Quality. Confidence.
        </p>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
          Research
          <br />
          <span className="text-blue-300">Without Limits.</span>
        </h1>

        <p className="mt-8 text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">
          High-purity research compounds supported by analytical verification,
          batch documentation, and research-use transparency.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <a
            href="/products"
            className="bg-white text-[#081526] px-9 py-4 rounded-full text-sm uppercase tracking-widest font-semibold text-center hover:bg-blue-100 transition-all"
          >
            Shop Products
          </a>

          <a
            href="/coas"
            className="border border-white/10 bg-white/[0.04] backdrop-blur-sm px-9 py-4 rounded-full text-sm uppercase tracking-widest font-semibold text-center hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
          >
            View COAs
          </a>
        </div>

<div className="grid grid-cols-2 items-stretch gap-4 mt-14 md:grid-cols-4">
  {[
    "99%+ Purity",
    "Third-Party Tested",
    "COA Included",
    "Fast Shipping",
  ].map((item, index) => (
    <Reveal key={item} delay={index * 100}>
      <div className="h-full min-h-[108px] rounded-[1.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 transition-all hover:border-blue-400/50 hover:bg-white/[0.07]">
        <p className="mb-3 text-xl text-blue-300">✓</p>
        <p className="text-xs uppercase leading-relaxed tracking-widest text-white/70">
          {item}
        </p>
      </div>
    </Reveal>
  ))}
</div>
      </div>
    </Reveal>
  </div>
</section>

{/* BUILD YOUR OWN BUNDLE */}
<Reveal>
  <section className="w-full bg-[#081526] px-4 py-7 sm:px-6 md:py-8">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-6 rounded-3xl border border-blue-300/20 bg-white/[0.035] px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8 md:px-10">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300 sm:text-base">
              Build Your Own Bundle
            </p>

            <span className="text-sm text-white/45 sm:text-base">
              Mix & match eligible research vials
            </span>
          </div>

          <p className="mt-3 text-sm text-white/60 sm:text-base">
            3 vials · 5% off &nbsp; / &nbsp; 5 · 10% &nbsp; / &nbsp; 10 · 15% &nbsp; / &nbsp; 20 · 20%
          </p>
        </div>

        <Link
          href="/build-a-bundle"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.15em] text-[#081526] transition hover:bg-blue-100 sm:px-8 sm:text-sm"
        >
          Build Bundle
          <span className="text-sm leading-none">→</span>
        </Link>
      </div>
    </div>
  </section>
</Reveal>

{/* PRODUCTS */}
<section className="relative w-full max-w-full overflow-hidden px-4 py-12 sm:px-6 md:py-14">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

  <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl">

    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
      <div>
        <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
          Research Catalog
        </p>

        <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[0.95]">
          Featured Compounds
        </h3>

        <p className="text-white/60 text-base md:text-lg leading-relaxed mt-4 max-w-2xl">
          Research peptides, third-party identity tested, and batch documented.
        </p>
      </div>

      <a
        href="/products"
        className="hidden md:inline-flex border border-white/10 bg-white/[0.04] text-white rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
      >
        View all
      </a>
    </div>

    <div className="relative w-full min-w-0 max-w-full overflow-hidden">

      <button
        onMouseEnter={() => startProductScroll("left")}
        onMouseLeave={stopProductScroll}
        onClick={() =>
          productScrollRef.current?.scrollBy({
            left: -360,
            behavior: "smooth",
          })
        }
        className="hidden md:flex absolute left-0 top-[42%] -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-white/10 bg-[#102A4A]/80 backdrop-blur items-center justify-center text-3xl text-white hover:border-blue-400/50 hover:bg-[#16365d] transition-all"
      >
        ‹
      </button>

      <div
        ref={productScrollRef}
        className="no-scrollbar flex w-full max-w-full touch-pan-x gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-1 pb-6 md:gap-7 md:px-20"
      >
        {[
          {
            name: "APX-3",
            desc: "10–20mg Research Peptide",
            image: "/images/retatrutide.PNG",
            href: "/products/apx3",
          },
          {
            name: "APX-2",
            desc: "30mg Research Peptide",
            image: "/images/apx230.png",
            href: "/products/apx2",
          },
                    {
            name: "Wolverine",
            desc: "20mg Research Peptide",
            image: "/images/wolverine.png",
            href: "/products/wolverine",
          },
                    {
            name: "BPC-157",
            desc: "10mg Research Peptide",
            image: "/images/bpc157.PNG",
            href: "/products/bpc157",
          },
          {
            name: "TB-500",
            desc: "10mg Research Peptide",
            image: "/images/tb500.PNG",
            href: "/products/tb500",
          },
                    {
            name: "KLOW",
            desc: "80mg Research Peptide",
            image: "/images/klow.png",
            href: "/products/klow",
          },
                    {
            name: "Glutathione",
            desc: "1500mg Research Compound",
            image: "/images/glutathione1500.png",
            href: "/products/glutathione",
          },
                    {
            name: "KPV",
            desc: "10mg Research Peptide",
            image: "/images/kpv.PNG",
            href: "/products/kpv",
          },
                    {
            name: "GHK-Cu",
            desc: "100mg Research Peptide",
            image: "/images/ghkcu.PNG",
            href: "/products/ghkcu",
          },
                    {
            name: "Tesamorelin",
            desc: "5mg • 10mg Research Peptide",
            image: "/images/tesa5.png",
            href: "/products/tesamorelin",
          },
          {
            name: "CJC/IPA Without DAC",
            desc: "10mg Research Peptide",
            image: "/images/cjcipa.PNG",
            href: "/products/cjcipa",
          },
          {
            name: "MITO-X",
            desc: "120mg Research Blend",
            image: "/images/mitox120.png",
            href: "/products/mitox",
          },
                    {
            name: "NAD+",
            desc: "1000mg Research Compound",
            image: "/images/nad.png",
            href: "/products/nad",
          },
                    {
            name: "MOTS-C",
            desc: "10mg Research Peptide",
            image: "/images/motsc.PNG",
            href: "/products/motsc",
          },
          {
            name: "5-Amino-1MQ",
            desc: "50mg Research Compound",
            image: "/images/5amino1mq.png",
            href: "/products/5amino1mq",
          },
                    {
            name: "SS-31",
            desc: "10mg Research Peptide",
            image: "/images/ss3110.png",
            href: "/products/ss31",
          },
                    {
            name: "ARA-290",
            desc: "10mg Research Peptide",
            image: "/images/ara290.PNG",
            href: "/products/ara290",
          },
                    {
            name: "AOD-9604",
            desc: "5mg Research Peptide",
            image: "/images/aod9604.png",
            href: "/products/aod9604",
          },
                    {
            name: "ADAMAX",
            desc: "10mg Research Peptide",
            image: "/images/adamax.PNG",
            href: "/products/adamax",
          },
          {
            name: "NEURO-X",
            desc: "48mg Research Peptide Blend",
            image: "/images/neurox48.png",
            href: "/products/neurox",
          },
          {
            name: "Semax",
            desc: "10mg Research Peptide",
            image: "/images/semax.PNG",
            href: "/products/semax",
          },
          {
            name: "Selank",
            desc: "10mg Research Peptide",
            image: "/images/selank.PNG",
            href: "/products/selank",
          },
          {
            name: "Pinealon",
            desc: "10mg Research Peptide",
            image: "/images/pinealon.PNG",
            href: "/products/pinealon",
          },
          {
            name: "PE-22-28",
            desc: "10mg Research Peptide",
            image: "/images/pe2228.PNG",
            href: "/products/pe2228",
          },
          {
            name: "Kisspeptin-10",
            desc: "10mg Research Peptide",
            image: "/images/kisspeptin10.png",
            href: "/products/kisspeptin10",
          },
          {
            name: "PT-141",
            desc: "10mg Research Peptide",
            image: "/images/pt141.png",
            href: "/products/pt141",
          },

        ].map((product) => (
          <div
            key={product.name}
            className="group w-[82vw] min-w-[82vw] max-w-[290px] sm:w-[290px] sm:min-w-[290px] md:w-[340px] md:min-w-[340px] md:max-w-[340px]"
          >
            <a href={product.href} className="block">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[430px] object-cover rounded-[1.6rem] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </a>

            <div className="pt-6 px-1">
              <h4 className="text-2xl font-black text-white mb-3">
                {product.name}
              </h4>

              <p className="text-white/60 mb-8">
                {product.desc}
              </p>

              <div className="flex gap-3">
                <a
                  href="/coas"
                  className="flex-1 border border-white/10 bg-white/[0.04] text-white rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
                >
                  COA
                </a>

                <a
                  href={product.href}
                  className="flex-1 bg-white text-[#081526] rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-blue-100 transition-all"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onMouseEnter={() => startProductScroll("right")}
        onMouseLeave={stopProductScroll}
        onClick={() =>
          productScrollRef.current?.scrollBy({
            left: 360,
            behavior: "smooth",
          })
        }
        className="hidden md:flex absolute right-0 top-[42%] -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-white/10 bg-[#102A4A]/80 backdrop-blur items-center justify-center text-3xl text-white hover:border-blue-400/50 hover:bg-[#16365d] transition-all"
      >
        ›
      </button>

    </div>

  </div>
</section>

{/* QUALITY VERIFICATION */}

<section className="relative py-24 px-6 bg-[#081526] border-b border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

  <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

    <div>
      <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
        Quality Verification
      </p>

      <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.95] mb-8">
        Quality You Can Verify.
      </h2>

      <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
        Every batch is supported by documentation and analytical review for
        research-focused consistency, purity, and transparency.
      </p>

      <div className="mb-10 grid min-w-0 grid-cols-3 gap-3 border-y border-white/10 py-8 sm:gap-6">

        <div>
          <p className="text-2xl font-black text-white sm:text-4xl">99%+</p>
          <p className="text-white/50 text-sm mt-2">Purity Target</p>
        </div>

        <div>
          <p className="text-2xl font-black text-white sm:text-4xl">HPLC</p>
          <p className="text-white/50 text-sm mt-2">Analysis</p>
        </div>

        <div>
          <p className="text-2xl font-black text-white sm:text-4xl">COA</p>
          <p className="text-white/50 text-sm mt-2">Batch Records</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { id: "potency", label: "Potency" },
          { id: "purity", label: "Purity" },
          { id: "stability", label: "Stability" },
          { id: "safety", label: "Safety" },
          { id: "consistency", label: "Consistency" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveQuality(item.id)}
            className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-widest transition-all ${
              activeQuality === item.id
                ? "bg-blue-500 text-white shadow-[0_0_25px_rgba(96,165,250,0.35)]"
                : "bg-white/[0.04] border border-white/10 text-white/60 hover:border-blue-400/50 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
        {activeQuality === "potency" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Verified Potency
            </h3>

            <p className="text-white/70 leading-relaxed mb-6">
              Analytical testing helps confirm that each batch aligns with the
              stated research concentration and identity specifications.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
              <strong className="text-white">Why it matters:</strong> Supports
              consistent research preparation and batch-to-batch confidence.
            </div>
          </div>
        )}

        {activeQuality === "purity" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Purity Documentation
            </h3>

            <p className="text-white/70 leading-relaxed mb-6">
              COAs provide batch-level information so researchers can review
              purity data before use in laboratory settings.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
              <strong className="text-white">Why it matters:</strong> Clear
              documentation helps support transparency and trust.
            </div>
          </div>
        )}

        {activeQuality === "stability" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Stability-Focused Handling
            </h3>

            <p className="text-white/70 leading-relaxed mb-6">
              Products are packaged with research storage and handling standards
              in mind to help preserve batch integrity.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
              <strong className="text-white">Why it matters:</strong> Proper
              handling supports reliable research workflows.
            </div>
          </div>
        )}

        {activeQuality === "safety" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Research-Use Standards
            </h3>

            <p className="text-white/70 leading-relaxed mb-6">
              Apexx Biolabs products are intended strictly for lawful laboratory
              research use only and are not for human or veterinary use.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
              <strong className="text-white">Why it matters:</strong> Clear
              use limitations keep the catalog research-focused.
            </div>
          </div>
        )}

        {activeQuality === "consistency" && (
          <div>
            <h3 className="text-2xl font-black mb-4 text-white">
              Batch Consistency
            </h3>

            <p className="text-white/70 leading-relaxed mb-6">
              Batch records and testing documentation help support consistency
              across research materials.
            </p>

            <div className="border-l-4 border-blue-400 bg-[#102A4A] rounded-xl p-5 text-white/70">
              <strong className="text-white">Why it matters:</strong> Consistent
              records help researchers compare and track batches.
            </div>
          </div>
          
        )}
        
      </div>
    </div>

    <div className="relative min-h-[520px] w-full min-w-0 max-w-full overflow-hidden rounded-[40px] sm:min-h-[650px]">
      <img
        src="/images/tb500hex.png"
        alt="TB-500"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute top-8 right-8 z-20 text-right">
        <p className="text-white text-3xl font-black">99%+ Purity</p>
        <p className="text-white/80 text-lg">Verified by HPLC</p>
      </div>

      <a
        href="/coas"
className="absolute bottom-2 left-3 right-3 z-20 flex min-w-0 items-center justify-between gap-4 rounded-[28px] bg-[#04111f]/90 px-5 py-5 sm:left-8 sm:right-8 sm:px-8 sm:py-6"      >
        <div>
          <p className="text-white text-2xl font-bold">See the Proof</p>
          <p className="text-white/70">View batch documentation</p>
        </div>

        <span className="text-blue-300 text-4xl">›</span>
      </a>
    </div>

  </div>
</section>

{/* ABOUT APEXX */}
<Reveal>
  <section className="relative overflow-hidden border-y border-white/10 bg-[#081526] px-4 py-20 sm:px-6 md:py-24">
    {/* Background glow */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_58%)]" />

    <div className="relative z-10 mx-auto max-w-7xl">

      {/* HEADER */}
      <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.32em] text-blue-300">
            About Apexx
          </p>

          <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl md:text-7xl">
            Research Built
            <span className="block text-blue-300">
              Around Confidence.
            </span>
          </h2>
        </div>

        <div className="max-w-2xl lg:pb-1">
          <p className="text-base leading-8 text-white/65 sm:text-lg">
            Apexx Biolabs provides research compounds with a focus on
            transparent documentation, dependable fulfillment, careful
            packaging, and straightforward customer support.
          </p>

          <p className="mt-4 text-sm leading-7 text-white/45 sm:text-base">
            From reviewing available batch documentation to receiving your
            order, our goal is to make every part of the research purchasing
            experience clear, efficient, and dependable.
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" />

      {/* FOUR BENEFITS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* FAST FULFILLMENT */}
        <div className="group rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.055]">

          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[14px] border border-blue-300/20 bg-blue-400/[0.08] text-blue-300">
            <Truck size={22} strokeWidth={2.2} />
          </div>

          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-300/70">
            Efficient
          </p>

          <h3 className="text-xl font-black text-white">
            Fast Fulfillment
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/50">
            Orders placed before our daily cutoff are typically processed
            the same business day for fast, efficient fulfillment.
          </p>
        </div>

        {/* BATCH DOCUMENTATION */}
        <div className="group rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.055]">

          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[14px] border border-blue-300/20 bg-blue-400/[0.08] text-blue-300">
            <ShieldCheck size={22} strokeWidth={2.2} />
          </div>

          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-300/70">
            Transparent
          </p>

          <h3 className="text-xl font-black text-white">
            Batch Documentation
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/50">
            Available COAs and analytical documentation provide clear,
            batch-specific information for verified products.
          </p>
        </div>

        {/* SECURE PACKAGING */}
        <div className="group rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.055]">

          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[14px] border border-blue-300/20 bg-blue-400/[0.08] text-blue-300">
            <FlaskConical size={22} strokeWidth={2.2} />
          </div>

          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-300/70">
            Carefully Prepared
          </p>

          <h3 className="text-xl font-black text-white">
            Secure Packaging
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/50">
            Every order is prepared and packaged carefully to help protect
            products throughout the fulfillment and shipping process.
          </p>
        </div>

        {/* RESPONSIVE SUPPORT */}
        <div className="group rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.055]">

          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[14px] border border-blue-300/20 bg-blue-400/[0.08] text-blue-300">
            <Headphones size={22} strokeWidth={2.2} />
          </div>

          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-300/70">
            Here to Help
          </p>

          <h3 className="text-xl font-black text-white">
            Responsive Support
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/50">
            Get assistance with orders, shipping, product information,
            and available documentation from our support team.
          </p>
        </div>
      </div>

      {/* BOTTOM LINKS */}
      <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[22px] border border-white/[0.07] bg-white/[0.025] px-6 py-5 sm:flex-row sm:px-7">

        <p className="text-center text-sm leading-6 text-white/45 sm:text-left">
          Research-focused products. Clear documentation. Dependable support.
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/coas"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white transition-all hover:border-blue-400/40 hover:bg-white/[0.07]"
          >
            View COAs
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#081526] transition-all hover:bg-blue-100"
          >
            Contact Support
          </Link>
        </div>
      </div>

    </div>
  </section>
</Reveal>

  {/* CUSTOMER REVIEWS */}
<section className="relative py-24 px-6 bg-[#081526] border-b border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

  <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl">
    <div className="text-center mb-14">
      <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
        Customer Experiences
      </p>

      <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.95] mb-6">
        Verified Customer Reviews
      </h2>

      <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
        Feedback from Apexx customers about ordering, support, shipping,
        packaging, and product quality.
      </p>
    </div>

    {reviews.length > 0 ? (
      <>
        <div className="rounded-[2.5rem] border border-blue-400/20 bg-white/[0.04] backdrop-blur-sm p-8 md:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
            <div className="text-center lg:text-left">
              <p className="uppercase tracking-[0.3em] text-blue-300 text-xs mb-4">
                Overall Rating
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-2 mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={30}
                    className="fill-blue-300 text-blue-300"
                  />
                ))}
              </div>

              <div className="flex items-end justify-center lg:justify-start gap-3">
                <span className="text-6xl md:text-7xl font-black text-white">
                  5.0
                </span>

                <span className="text-white/50 text-xl pb-3">/ 5</span>
              </div>

              <p className="text-white/50 mt-4">
                Based on approved customer reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Product Quality",
                "Packaging",
                "Shipping",
                "Ordering Experience",
                "Customer Support",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-white/10 bg-[#081526]/60 p-5"
                >
                  <p className="text-white/70 text-sm uppercase tracking-widest mb-3">
                    {item}
                  </p>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className="fill-blue-300 text-blue-300"
                      />
                    ))}
                  </div>
                </div>
              ))}

              <a
                href="/reviews"
                className="rounded-[1.5rem] border border-blue-400/30 bg-blue-500/10 p-5 flex items-center justify-between text-blue-100 hover:bg-blue-500/20 transition-all"
              >
                <span className="font-bold uppercase tracking-widest text-sm">
                  View All Reviews
                </span>

                <span className="text-2xl">→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/40 transition-all"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className="fill-blue-300 text-blue-300"
                  />
                ))}
              </div>

              <p className="text-white/70 leading-relaxed mb-8">
                “{item.review}”
              </p>

              <div className="border-t border-white/10 pt-5">
                <p className="text-white font-bold">{item.name}</p>

                <p className="text-blue-300 text-xs uppercase tracking-widest mt-1">
                  Verified Customer
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/reviews"
            className="inline-flex justify-center rounded-full border border-blue-400/30 bg-blue-500/10 px-8 py-4 text-sm font-bold uppercase tracking-widest text-blue-100 hover:bg-blue-500/20 transition-all"
          >
            View All Reviews
          </a>

          <a
            href="/reviews#leave-review"
            className="inline-flex justify-center rounded-full bg-white text-[#081526] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-100 transition-all"
          >
            Leave a Review
          </a>
        </div>
      </>
    ) : (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 text-center max-w-3xl mx-auto">
        <p className="text-white/60 mb-6">
          Customer reviews will appear here once approved.
        </p>

        <a
          href="/reviews#leave-review"
          className="inline-flex rounded-full bg-white text-[#081526] px-8 py-4 font-bold uppercase tracking-widest hover:bg-blue-100 transition-all"
        >
          Leave a Review
        </a>
      </div>
    )}
  </div>
</section>

{/* RESEARCH REFERRAL PROGRAM */}
<Reveal>
  <section className="relative w-full overflow-hidden bg-[#081526] px-4 py-8 sm:px-6 md:py-10">
    <div className="mx-auto max-w-6xl">

      <div className="relative overflow-hidden rounded-[2rem] border border-blue-400/20 bg-gradient-to-r from-[#0b1d33] via-[#102a49] to-[#0b1d33] px-6 py-7 shadow-[0_18px_55px_rgba(59,130,246,0.10)] sm:px-8 md:px-10">

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(96,165,250,0.16),transparent_45%)]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-3xl">

            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
              Apexx Research Referral Program
            </p>

            <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
              Partner With Apexx
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Refer qualified research customers to Apexx Biolabs
              and earn commission on eligible research purchases
              made through your unique referral code.
            </p>

          </div>

          <div className="shrink-0">

<Link
  href="/research-referral"
  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-center text-xs font-black uppercase tracking-[0.2em] text-[#081526] transition hover:bg-blue-100 sm:w-auto"
>
  Learn More
  <span className="text-lg leading-none">→</span>
</Link>

          </div>

        </div>

        <div className="relative z-10 mt-6 border-t border-white/10 pt-5">
          <p className="text-[11px] leading-relaxed text-white/35">
            Products are intended strictly for lawful laboratory
            research use only and are not for human or veterinary use.
            Research partners may not promote products for personal use
            or make medical, therapeutic, or human-use claims.
          </p>
        </div>

      </div>

    </div>
  </section>
</Reveal>

{/* CREATE ACCOUNT + REWARDS */}
<Reveal>
  <section className="relative overflow-hidden bg-[#081526] px-4 py-14 sm:px-6 md:py-16">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_60%)]" />

    <div className="relative z-10 mx-auto max-w-6xl">

      <div className="overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.025]">

        {/* MAIN REWARDS AREA */}
        <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">

          {/* LEFT */}
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[13px] border border-blue-300/20 bg-blue-400/[0.08] text-blue-300">
                <Gift size={20} />
              </div>

              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-300">
                Apexx Rewards
              </p>
            </div>

            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Create an account.
              <span className="ml-2 text-blue-300">
                Earn rewards.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              Earn points on eligible purchases, track your orders, save
              favorites, and manage everything from your Apexx account.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
            <Link
              href="/account/signup"
              className="inline-flex min-w-[190px] items-center justify-center rounded-full bg-white px-7 py-3.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#081526] transition-all hover:bg-blue-100"
            >
              Create Free Account
            </Link>

            <Link
              href="/account/login"
              className="inline-flex min-w-[190px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-[10px] font-black uppercase tracking-[0.16em] text-white transition-all hover:border-blue-400/30 hover:bg-white/[0.06]"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="border-t border-white/[0.07] px-6 py-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-4">

            {[
              {
                title: "1 Point / $1",
                text: "Earn on eligible purchases",
              },
              {
                title: "$10 Rewards",
                text: "Redeem every 100 points",
              },
              {
                title: "Order Tracking",
                text: "Manage orders in one place",
              },
              {
                title: "Saved Favorites",
                text: "Keep products easy to find",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="min-w-0"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-blue-300">
                    <Check size={12} strokeWidth={3} />
                  </div>

                  <p className="text-xs font-black text-white sm:text-sm">
                    {item.title}
                  </p>
                </div>

                <p className="pl-7 text-[11px] leading-5 text-white/40">
                  {item.text}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* HOW REWARDS WORK */}
        <div className="border-t border-white/[0.07] bg-[#081526]/35 px-6 py-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-blue-300/70">
                How Rewards Work
              </p>

              <p className="mt-2 text-xs leading-6 text-white/45 sm:text-sm">
                Create an account, place eligible orders using the same
                account email, earn points after fulfillment, and redeem
                available points on future eligible purchases.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
              <span>1</span>
              <span className="h-px w-5 bg-white/15" />
              <span>Earn</span>
              <span className="h-px w-5 bg-white/15" />
              <span>Redeem</span>
            </div>

          </div>

          <p className="mt-4 text-[10px] leading-5 text-white/25">
            Rewards have no cash value and may be adjusted for canceled,
            refunded, duplicate, fraudulent, or otherwise ineligible
            transactions. Additional rewards terms may apply.
          </p>
        </div>

      </div>

    </div>
  </section>
</Reveal>

{/* HOMEPAGE FAQ */}
<section className="relative overflow-hidden border-y border-white/[0.07] bg-[#081526] px-4 py-14 sm:px-6 md:py-16">
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.08),transparent_60%)]" />

  <div className="relative z-10 mx-auto max-w-4xl">

    {/* HEADER */}
    <div className="mb-8 text-center">
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-blue-300">
        FAQ
      </p>

      <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
        Common Questions
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/45">
        Quick answers about products, orders, shipping, COAs, and
        research-use policies.
      </p>
    </div>

    {/* QUESTIONS */}
    <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.025]">

      {[
        {
          question: "What are your products?",
          answer:
            "We provide premium research compounds intended strictly for laboratory and analytical research purposes only.",
        },
        {
          question: "Are COAs available?",
          answer:
            "Yes. Available Certificates of Analysis and batch documentation can be reviewed on our COA page.",
        },
        {
          question: "How quickly are orders processed?",
          answer:
            "Orders are processed as quickly as possible during normal business days. Processing times may vary during periods of high order volume, weekends, or holidays.",
        },
        {
          question: "How can I track my order?",
          answer:
            "Once tracking information is available, you can follow your shipment using the tracking details associated with your order.",
        },
        {
          question: "How can I contact support?",
          answer:
            "Visit our Contact page for assistance with orders, shipping, product information, COAs, and general support questions.",
        },
      ].map((item, index) => {
        const isOpen = openFAQ === index;

        return (
          <div
            key={item.question}
            className={
              index !== 0
                ? "border-t border-white/[0.07]"
                : ""
            }
          >
            <button
              type="button"
              onClick={() =>
                setOpenFAQ(isOpen ? null : index)
              }
              className="group flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-white/[0.025] sm:px-6"
            >
              <span className="text-sm font-bold text-white/80 transition-colors group-hover:text-white sm:text-[15px]">
                {item.question}
              </span>

              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-all duration-300 ${
                  isOpen
                    ? "rotate-45 border-blue-300/30 bg-blue-400/10 text-blue-300"
                    : "border-white/10 bg-white/[0.03] text-white/40"
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ${
                isOpen
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl px-5 pb-5 pr-14 text-sm leading-6 text-white/45 sm:px-6 sm:pr-16">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}

    </div>

    {/* BOTTOM LINK */}
    <div className="mt-6 text-center">
      <Link
        href="/faq"
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-300/70 transition-colors hover:text-blue-300"
      >
        View All FAQs
        <span>→</span>
      </Link>
    </div>

  </div>
</section>

<Reveal>
  <section className="relative px-6 md:px-10 py-24 bg-[#081526] overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

  <div className="relative z-10 max-w-5xl mx-auto rounded-[42px] border border-blue-300/20 bg-gradient-to-br from-[#102743] via-[#12345A] to-[#0B1B30] p-8 md:p-12 shadow-[0_0_60px_rgba(96,165,250,0.12)]">

    <div className="text-center max-w-3xl mx-auto">
      <p className="uppercase tracking-[0.35em] text-blue-300 text-xs mb-5">
        Exclusive Access
      </p>

      <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
        Join The Apexx List
      </h2>

      <p className="text-blue-100/70 text-base md:text-lg leading-relaxed mb-9">
        Get first access to promo codes, product launches, restock alerts, and Apexx updates.
      </p>
    </div>

<form onSubmit={handlePromoSignup} className="max-w-2xl mx-auto">      <div className="flex flex-col sm:flex-row gap-3 rounded-full sm:bg-[#081526]/70 sm:border sm:border-blue-300/15 sm:p-2">
<input
  type="email"
  value={promoEmail}
  onChange={(e) => setPromoEmail(e.target.value)}
  placeholder="Enter your email address"
  className="flex-1 rounded-full bg-[#081526]/70 sm:bg-transparent border border-blue-300/15 sm:border-0 px-6 py-4 text-white placeholder:text-blue-100/35 outline-none"
/>

        <button
          type="submit"
          className="rounded-full bg-white text-[#081526] px-9 py-4 font-bold uppercase tracking-widest hover:bg-blue-100 transition-all"
        >
          Join List
        </button>
      </div>

      <p className="text-center text-blue-100/40 text-xs mt-5">
        Promo updates only. No spam.
      </p>
    </form>

{promoStatus && (
  <div className="max-w-md mx-auto mt-5 rounded-full border border-blue-300/20 bg-blue-500/10 px-5 py-3">
    <p className="text-center text-blue-100 text-sm font-semibold">
      {promoStatus}
    </p>
  </div>
)}

  </div>
  </section>
</Reveal>

</div>
</>
);
}