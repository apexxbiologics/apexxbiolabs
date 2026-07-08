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

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { FlaskConical, Microscope } from "lucide-react";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Gift, BadgePercent } from "lucide-react";
import { Star } from "lucide-react";
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
const startProductScroll = (direction: "left" | "right") => {
  stopProductScroll();

  autoScrollRef.current = setInterval(() => {
    productScrollRef.current?.scrollBy({
      left: direction === "left" ? -18 : 18,
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
  { name: "BPC-157", href: "/products/bpc157" },
  { name: "TB-500", href: "/products/tb500" },
  { name: "Bacteriostatic Water", href: "/products/bacwater" },
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
  <div className="fixed inset-0 z-[9999] bg-[#020817] overflow-y-auto px-4 py-8">

    <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_55%)]" />

    <div className="relative min-h-screen flex items-start md:items-center justify-center">

      <div className="w-full max-w-3xl rounded-[36px] border border-blue-400/20 bg-gradient-to-b from-[#0f1d33] to-[#081526] shadow-[0_0_80px_rgba(59,130,246,0.22)] overflow-hidden">

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

<div className="min-h-screen bg-[#081526] text-white">

  {/* HERO */}
  <section className="relative pt-8 pb-24 px-6 bg-[#081526] overflow-hidden">

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
      FREE BAC WATER
    </p>
    <p className="text-blue-100 text-xs mt-1">
      Buy Any 4 Vials & Receive Complimentary Bac Water
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

  {/* Navy Overlay */}
<div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#081526] via-[#081526]/92 to-transparent" />
  {/* Luxury Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_55%)]"></div>

  <div className="relative z-10 max-w-7xl mx-auto py-20 flex items-center">

    <div className="max-w-3xl">

      <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
        Research. Quality. Confidence.
      </p>

      <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
        Research
        <br />

        <span className="text-blue-300">
          Without Limits.
        </span>
      </h1>

      <p className="mt-8 text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">
        High-purity research compounds supported by analytical verification,
        batch documentation, and research-use transparency.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">

        <a
          href="#shop"
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">

        {[
          "99%+ Purity",
          "Third-Party Tested",
          "COA Included",
          "Fast Shipping",
        ].map((item) => (
          <div
            key={item}
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all"
          >
            <p className="text-blue-300 text-xl mb-3">✓</p>

            <p className="text-white/70 text-xs uppercase tracking-widest leading-relaxed">
              {item}
            </p>
          </div>
        ))}

      </div>

    </div>

  </div>
</section>

{/* PRODUCTS */}
<section
  id="shop"
  className="relative py-24 px-6 bg-[#081526] border-b border-white/10 overflow-hidden"
>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

  <div className="relative z-10 max-w-7xl mx-auto">

    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
      <div>
        <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
          Research Catalog
        </p>

        <h3 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.95]">
          Featured Compounds
        </h3>

        <p className="text-white/70 text-lg md:text-xl leading-relaxed mt-6 max-w-2xl">
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

    <div className="relative">

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
        className="flex gap-7 overflow-x-auto scroll-smooth pb-6 px-1 md:px-20 no-scrollbar"
      >
        {[
          {
            name: "APX-3",
            desc: "10–20mg Research Peptide",
            image: "/images/retatrutide.PNG",
            href: "/products/apx3",
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
            name: "KPV",
            desc: "10mg Research Peptide",
            image: "/images/kpv.PNG",
            href: "/products/kpv",
          },
                    {
            name: "MOTS-C",
            desc: "10mg Research Peptide",
            image: "/images/motsc.PNG",
            href: "/products/motsc",
          },
          {
            name: "GHK-Cu",
            desc: "100mg Research Peptide",
            image: "/images/ghkcu.PNG",
            href: "/products/ghkcu",
          },
                    {
            name: "CJC/IPA Without DAC",
            desc: "10mg Research Peptide",
            image: "/images/cjcipa.PNG",
            href: "/products/cjcipa",
          },
                    {
  name: "Tesamorelin",
  desc: "5mg • 10mg Research Peptide",
  image: "/images/tesa5.png",
  href: "/products/tesamorelin",
},
          {
            name: "ADAMAX",
            desc: "10mg Research Peptide",
            image: "/images/adamax.PNG",
            href: "/products/adamax",
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
            name: "ARA-290",
            desc: "10mg Research Peptide",
            image: "/images/ara290.PNG",
            href: "/products/ara290",
          },
          {
  name: "NAD+",
desc: "1000mg Research Peptide",  
price: "$45.00",
  image: "/images/nad.png",
  href: "/products/nad",
},
{
  name: "AOD-9604",
desc: "5mg Research Peptide",  
price: "$50.00",
  image: "/images/aod9604.png",
  href: "/products/aod9604",
},
{
  name: "PT-141",
desc: "10mg Research Peptide",  
price: "$55.00",
  image: "/images/pt141.png",
  href: "/products/pt141",
},
{
  name: "Acetic Acid",
  description: "Research solution for laboratory preparation and peptide handling workflows.",
  price: "$15.00",
  image: "/images/aceticacid.png",
  href: "/products/aceticacid",
},
{
  name: "5-Amino-1MQ",
desc: "50mg Research Peptide",  
price: "$55.00",
  image: "/images/5amino1mq.png",
  href: "/products/5amino1mq",
},
{
  name: "Kisspeptin-10",
desc: "10mg Research Peptide",  
price: "$55.00",
  image: "/images/kisspeptin10.png",
  href: "/products/kisspeptin10",
},
{
  name: "KLOW",
desc: "80mg Research Peptide",  
price: "$55.00",
  image: "/images/klow.png",
  href: "/products/klow",
},
{
  name: "Wolverine",
desc: "20mg Research Peptide",  
price: "$75.00",
  image: "/images/wolverine.png",
  href: "/products/wolverine",
},
          {
            name: "Bacteriostatic Water",
            desc: "Research Reconstitution Solution",
            image: "/images/bacwater.PNG",
            href: "/products/bacwater",
          },
        ].map((product) => (
          <div
            key={product.name}
            className="min-w-[290px] md:min-w-[340px] group"
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

{/* WHY CHOOSE APEXX */}
<section className="relative py-20 px-6 bg-[#081526] border-y border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

  <div className="relative z-10 max-w-7xl mx-auto">
    <div className="text-center mb-10">
      <p className="uppercase tracking-[0.35em] text-blue-300 text-xs mb-4">
        Why Researchers Choose Apexx Biolabs
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="rounded-[2rem] border border-blue-400/25 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10 hover:bg-white/[0.07] transition-all">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
            <Users size={30} strokeWidth={2.2} />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Built for Research Customers
            </h2>

            <p className="text-white/70 leading-relaxed mb-6">
              Apexx Biolabs is focused on providing research-use products with
              clear documentation, responsive support, and a straightforward
              ordering experience.
            </p>

            <a
              href="/products"
              className="inline-flex rounded-full border border-blue-400/30 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white/[0.08] transition-all"
            >
              Shop Products
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-blue-400/25 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10 hover:bg-white/[0.07] transition-all">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
            <ShieldCheck size={30} strokeWidth={2.2} />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Batch Documentation & Quality Review
            </h2>

            <p className="text-white/70 leading-relaxed mb-6">
              Products are supported by analytical review and batch
              documentation when available, helping researchers verify product
              identity and purity before use.
            </p>

            <a
              href="/coas"
              className="inline-flex rounded-full border border-blue-400/30 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white/[0.08] transition-all"
            >
              View COAs
            </a>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="rounded-[2rem] border border-blue-400/25 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10 hover:bg-white/[0.07] transition-all">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
            <Headphones size={30} strokeWidth={2.2} />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Support When You Need It
            </h2>

            <p className="text-white/70 leading-relaxed">
              Have a question about an order, COA, product page, or shipment?
              Our support team typically responds within 24–48 business hours.
            </p>
            <a
  href="/contact"
  className="inline-flex mt-8 rounded-full border border-blue-400/30 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white/[0.08] transition-all"
>
  Contact Support
</a>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-blue-400/25 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10 hover:bg-white/[0.07] transition-all">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
            <BookOpen size={30} strokeWidth={2.2} />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Research Information Available
            </h2>

            <p className="text-white/70 leading-relaxed mb-6">
              Access product information, research-use disclaimers, policies,
              FAQs, and educational resources before placing an order.
            </p>

            <a
              href="/peptide-info"
              className="inline-flex rounded-full border border-blue-400/30 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white/[0.08] transition-all"
            >
              Peptide Info
            </a>
          </div>
        </div>
      </div>
    </div>

    <div className="rounded-[2rem] border border-blue-400/25 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 flex items-center justify-center shrink-0">
            <Truck size={30} strokeWidth={2.2} />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Order Protection on Every Shipment
            </h2>

            <p className="text-white/70 leading-relaxed max-w-3xl">
              If your order arrives damaged, incorrect, or incomplete, contact
              us within 48 hours. We will review the issue and work toward a
              fair resolution when the claim falls within our policy.
            </p>
          </div>
        </div>

        <a
          href="/refunds"
          className="inline-flex justify-center rounded-full bg-white text-[#081526] px-8 py-4 font-bold uppercase tracking-widest hover:bg-blue-100 transition-all"
        >
          Shop With Confidence
        </a>
      </div>
    </div>
  </div>
</section>

{/* CUSTOMER REVIEWS */}
<section className="relative py-24 px-6 bg-[#081526] border-b border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

  <div className="relative z-10 max-w-7xl mx-auto">
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

      <div className="grid grid-cols-3 gap-6 mb-10 border-y border-white/10 py-8">

        <div>
          <p className="text-4xl font-black text-white">99%+</p>
          <p className="text-white/50 text-sm mt-2">Purity Target</p>
        </div>

        <div>
          <p className="text-4xl font-black text-white">HPLC</p>
          <p className="text-white/50 text-sm mt-2">Analysis</p>
        </div>

        <div>
          <p className="text-4xl font-black text-white">COA</p>
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

    <div className="relative rounded-[40px] overflow-hidden min-h-[650px]">
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
className="absolute bottom-2 left-8 right-8 z-20 flex items-center justify-between bg-[#04111f]/90 rounded-[28px] px-8 py-6"      >
        <div>
          <p className="text-white text-2xl font-bold">See the Proof</p>
          <p className="text-white/70">View batch documentation</p>
        </div>

        <span className="text-blue-300 text-4xl">›</span>
      </a>
    </div>

  </div>
</section>
    
    <section className="relative py-24 px-6 bg-[#081526] border-y border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_55%)]"></div>

  <div className="relative z-10 max-w-7xl mx-auto">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16">

      <div>
        <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
          About Apexx
        </p>

        <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.95] mb-8">
          Scientific Precision.
          <br />
          Trusted Quality.
        </h2>
      </div>

      <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">
        Apexx Biolabs specializes in high-purity research compounds
        manufactured under strict analytical standards. Every batch undergoes
        rigorous verification to support purity, consistency, and reliability
        for laboratory research applications.
      </p>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all">
<div className="w-12 h-12 rounded-full bg-blue-400/10 border border-blue-300/30 flex items-center justify-center mb-8">
  <Check
    size={24}
    strokeWidth={3}
    className="text-blue-300"
  />
</div>

        <h3 className="text-2xl font-bold text-white mb-4">
          Third-Party Testing
        </h3>

        <p className="text-white/60 leading-relaxed">
          Independent analytical verification supporting transparency and consistency.
        </p>
      </div>

      <div className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all">
<div className="w-12 h-12 rounded-full bg-blue-400/10 border border-blue-300/30 flex items-center justify-center mb-8">
  <FlaskConical
    size={24}
    strokeWidth={2.25}
    className="text-blue-300"
  />
</div>

        <h3 className="text-2xl font-bold text-white mb-4">
          Research Standards
        </h3>

        <p className="text-white/60 leading-relaxed">
          Manufactured and handled according to strict laboratory quality practices.
        </p>
      </div>

      <div className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all">
<div className="w-12 h-12 rounded-full bg-blue-400/10 border border-blue-300/30 flex items-center justify-center mb-8">
  <Microscope
    size={24}
    strokeWidth={2.25}
    className="text-blue-300"
  />
</div>

        <h3 className="text-2xl font-bold text-white mb-4">
          Batch Transparency
        </h3>

        <p className="text-white/60 leading-relaxed">
          COAs and supporting documentation available for verified batches.
        </p>
      </div>

    </div>

  </div>
</section>

{/* HOMEPAGE FAQ */}
<section className="relative py-24 px-6 bg-[#081526] border-y border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

  <div className="relative z-10 max-w-5xl mx-auto">
    <div className="text-center mb-14">
      <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
        Frequently Asked Questions
      </p>

      <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-6">
        Common Questions
      </h2>

      <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
        Quick answers about our products, shipping, COAs, and laboratory
        research standards.
      </p>
    </div>

    <div className="space-y-5">
      {[
        {
          question: "What are your products?",
          answer:
            "We provide premium research compounds intended strictly for laboratory and analytical research purposes only.",
        },
        {
          question: "Are your products tested?",
          answer:
            "Yes. Products are batch tested and COA verified when available to support consistency, quality, and transparency.",
        },
        {
          question: "How long does shipping take?",
          answer:
            "Orders typically ship within 1–2 business days. Delivery time depends on your location and carrier.",
        },
        {
          question: "Do you provide COAs?",
          answer:
            "Yes. Certificates of Analysis are available when batch testing has been completed and uploaded.",
        },
        {
          question: "Are these products for human use?",
          answer:
            "No. All Apexx Biolabs products are sold strictly for laboratory research use only and are not intended for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.",
        },
      ].map((faq, index) => (
        <div
          key={faq.question}
          className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden hover:bg-white/[0.07] hover:border-blue-400/50 transition-all duration-300"
        >
          <button
            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            className="w-full flex justify-between items-center text-left p-7 gap-6"
          >
            <span className="text-xl md:text-2xl font-black text-white">
              {faq.question}
            </span>

            <span className="text-3xl text-blue-300 shrink-0">
              {openFAQ === index ? "−" : "+"}
            </span>
          </button>

          {openFAQ === index && (
            <div className="px-7 pb-7 pt-5 border-t border-white/10">
              <p className="text-white/60 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>

    <div className="text-center mt-12">
      <a
        href="/faq"
        className="inline-flex rounded-full bg-white text-[#081526] px-8 py-4 font-bold uppercase tracking-widest hover:bg-blue-100 transition-all"
      >
        View Full FAQ
      </a>
    </div>
  </div>
</section>

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

</div>
</>
);
}