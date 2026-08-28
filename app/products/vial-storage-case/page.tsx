"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Package,
  ShieldCheck,
  LayoutGrid,
  BriefcaseBusiness,
} from "lucide-react";

const FALLBACK_PRICE = 14.99;

export default function VialStorageCasePage() {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const [productData, setProductData] = useState({
    inventory: 0,
    price: FALLBACK_PRICE,
  });

  const product = {
    id: "vial-storage-case",
    name: "Vial Storage Case",
    image: "/images/vial-case.png",
    path: "/products/vial-storage-case",
  };

  const productImages = [
    {
      src: "/images/vial-case.png",
      alt: "Apexx Biolabs Vial Storage Case Closed",
    },
    {
      src: "/images/vial-case-open.png",
      alt: "Apexx Biolabs Vial Storage Case Open",
    },
  ];

  const isOutOfStock = productData.inventory <= 0;

  const isLimitedStock =
    productData.inventory > 0 && productData.inventory <= 5;

  /* =========================================================
     FETCH PRICE + INVENTORY
  ========================================================= */

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!data.success) return;

        const caseProduct = data.products.find((item: any) => {
          const slug = item.slug?.toLowerCase().trim();
          const name = item.name?.toLowerCase().trim();
          const id = item.id?.toString().toLowerCase().trim();

          return (
            slug === "vial-storage-case" ||
            id === "vial-storage-case" ||
            name === "vial storage case"
          );
        });

        if (!caseProduct) return;

        setProductData({
          inventory: Number(caseProduct.inventory ?? 0),
          price: Number(caseProduct.price ?? FALLBACK_PRICE),
        });
      } catch (error) {
        console.error("Failed to fetch Vial Storage Case data:", error);
      }
    };

    fetchProductData();
  }, []);

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const addToCart = () => {
    if (isOutOfStock) return;

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: productData.price,
      quantity,
      image: product.image,
      path: product.path,
    };

    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingProduct = existingCart.find(
      (item: any) => item.id === cartProduct.id
    );

    const existingQuantity = existingProduct?.quantity || 0;

    const newQuantity = Math.min(
      existingQuantity + quantity,
      productData.inventory
    );

    const updatedCart = existingProduct
      ? existingCart.map((item: any) =>
          item.id === cartProduct.id
            ? {
                ...item,
                quantity: newQuantity,
                price: productData.price,
                image: product.image,
                path: product.path,
              }
            : item
        )
      : [
          ...existingCart,
          {
            ...cartProduct,
            quantity: Math.min(quantity, productData.inventory),
          },
        ];

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));

    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[140px]" />

        <div className="absolute -left-40 top-[500px] h-[500px] w-[500px] rounded-full bg-blue-400/[0.05] blur-[140px]" />
      </div>

      {/* =========================================================
          PRODUCT HERO
      ========================================================= */}

      <section className="relative z-10 px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">

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

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">

            {/* =====================================================
                LEFT SIDE - PRODUCT GALLERY
            ===================================================== */}

            <div>
              {/* MAIN IMAGE */}
              <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[48px] border border-blue-400/10 bg-white/[0.03] p-4 shadow-[0_0_40px_rgba(96,165,250,0.12)]">

                <div className="absolute left-8 top-8 z-20">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#081526]/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200 backdrop-blur-md">
                    <Package size={13} />
                    Lab Accessory
                  </span>
                </div>

                <div className="overflow-hidden rounded-[36px] bg-[#93C5FD]">
                  <img
                    src={productImages[selectedImage].src}
                    alt={productImages[selectedImage].alt}
                    className="aspect-square h-full w-full object-cover transition-all duration-300"
                  />
                </div>
              </div>

              {/* IMAGE THUMBNAILS */}
              <div className="mx-auto mt-5 grid w-full max-w-[560px] grid-cols-2 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`group overflow-hidden rounded-[24px] border p-2 transition-all duration-300 ${
                      selectedImage === index
                        ? "border-blue-300 bg-blue-400/10 shadow-[0_0_25px_rgba(96,165,250,0.15)]"
                        : "border-white/10 bg-white/[0.04] hover:border-blue-400/40"
                    }`}
                  >
                    <div className="overflow-hidden rounded-[18px] bg-[#93C5FD]">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="aspect-[16/10] h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* SPECS */}
              <div className="mx-auto mt-5 grid w-full max-w-[560px] grid-cols-3 gap-3">

                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-center">
                  <p className="text-xl font-black">
                    14
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                    Vial Slots
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-center">
                  <p className="text-xl font-black">
                    2 × 7
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                    Layout
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-center">
                  <p className="text-xl font-black text-blue-300">
                    Apexx
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                    Branded
                  </p>
                </div>

              </div>
            </div>

            {/* =====================================================
                RIGHT SIDE - PRODUCT INFO
            ===================================================== */}

            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm md:p-10">

              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#A5D8FF]">
                Apexx Lab Accessories
              </p>

              <h1 className="text-5xl font-black leading-[0.95] text-white md:text-6xl">
                Vial Storage
                <br />

                <span className="text-blue-300">
                  Case.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/65">
                A compact storage case designed to keep your research vials
                organized, protected, and easy to access.
              </p>

              {/* PRICE */}
              <p className="mt-7 text-5xl font-black text-white">
                ${productData.price.toFixed(2)}
              </p>

              {/* STOCK */}
              {isLimitedStock && (
                <div className="mt-3 font-semibold text-yellow-300">
                  Limited Stock
                </div>
              )}

              {isOutOfStock && (
                <div className="mt-3 font-semibold text-red-300">
                  Out of Stock
                </div>
              )}

              {!isLimitedStock && !isOutOfStock && (
                <div className="mt-3 text-sm font-semibold text-green-300">
                  In Stock
                </div>
              )}

              <div className="my-8 h-px bg-white/10" />

              {/* FEATURES */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <FeatureCard
                  icon={<LayoutGrid size={19} />}
                  title="14 Vial Capacity"
                  text="Two rows with seven dedicated vial slots."
                />

                <FeatureCard
                  icon={<ShieldCheck size={19} />}
                  title="Protective Storage"
                  text="Keeps your research vials together and organized."
                />

                <FeatureCard
                  icon={<BriefcaseBusiness size={19} />}
                  title="Compact Design"
                  text="A clean storage solution without unnecessary bulk."
                />

                <FeatureCard
                  icon={<Package size={19} />}
                  title="Apexx Branded"
                  text="Finished with Apexx Biolabs branding."
                />

              </div>

              {/* QUANTITY */}
              <div className="mt-9">
                <p className="mb-4 text-sm uppercase tracking-widest text-white/50">
                  Quantity
                </p>

                <div className="flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] p-2">

                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((prev) =>
                        Math.max(1, prev - 1)
                      );

                      setAdded(false);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-[#A5D8FF] transition hover:bg-white/[0.08]"
                  >
                    <Minus size={19} />
                  </button>

                  <div className="flex h-11 w-12 items-center justify-center text-lg font-bold">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((prev) =>
                        Math.min(
                          productData.inventory || 1,
                          prev + 1
                        )
                      );

                      setAdded(false);
                    }}
                    disabled={isOutOfStock}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-[#A5D8FF] transition hover:bg-white/[0.08] disabled:opacity-40"
                  >
                    <Plus size={19} />
                  </button>

                </div>
              </div>

              {/* CART BUTTONS */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

                {isOutOfStock ? (
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-full bg-white/[0.06] py-5 text-sm font-semibold uppercase tracking-widest text-white/30"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={addToCart}
                    className="flex items-center justify-center gap-3 rounded-full bg-white py-5 text-sm font-semibold uppercase tracking-widest text-[#081526] transition-all hover:bg-blue-100"
                  >
                    <ShoppingCart size={21} />

                    {added
                      ? "Added To Cart"
                      : "Add To Cart"}
                  </button>
                )}

                <a
                  href="/cart"
                  className="rounded-full border border-white/10 bg-white/[0.04] py-5 text-center text-sm font-semibold uppercase tracking-widest transition-all hover:border-blue-400/50 hover:bg-white/[0.07]"
                >
                  View Cart
                </a>
              </div>

              <Link
                href="/products"
                className="mt-4 block w-full rounded-full border border-white/10 bg-white/[0.04] py-5 text-center text-sm font-semibold uppercase tracking-widest text-white/70 transition-all hover:border-blue-400/50 hover:bg-white/[0.07] hover:text-white"
              >
                Continue Shopping
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT DETAILS
      ========================================================= */}

      <section className="relative z-10 px-6 pb-16 md:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04]">

          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">

            <div className="p-8 md:p-10">
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#A5D8FF]">
                Product Details
              </p>

              <h2 className="text-3xl font-black text-white md:text-4xl">
                Simple. Organized. Protected.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">
                The Apexx Biolabs Vial Storage Case features fourteen
                dedicated vial slots arranged across two rows. Its compact
                profile provides a clean and convenient way to keep research
                vials together and organized.
              </p>
            </div>

            <div className="border-t border-white/10 p-8 md:p-10 lg:border-l lg:border-t-0">
              <DetailRow
                label="Capacity"
                value="14 Vials"
              />

              <DetailRow
                label="Configuration"
                value="2 Rows × 7"
              />

              <DetailRow
                label="Category"
                value="Lab Accessories"
              />

              <DetailRow
                label="Price"
                value={`$${productData.price.toFixed(2)}`}
              />
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

/* =============================================================
   FEATURE CARD
============================================================= */

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
    <div className="rounded-[22px] border border-white/10 bg-[#06111f]/45 p-4 transition hover:border-blue-400/30">

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
        {icon}
      </div>

      <p className="text-sm font-bold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-white/40">
        {text}
      </p>

    </div>
  );
}

/* =============================================================
   DETAIL ROW
============================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-white/10 py-5 first:pt-0 last:border-0 last:pb-0">

      <span className="text-sm text-white/40">
        {label}
      </span>

      <span className="text-sm font-bold text-white">
        {value}
      </span>

    </div>
  );
}