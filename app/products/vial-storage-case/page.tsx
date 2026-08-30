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
  Check,
} from "lucide-react";

const FALLBACK_PRICE = 14.99;

type ProductApiItem = {
  id?: string | number;
  slug?: string;
  name?: string;
  inventory?: number | string | null;
  price?: number | string | null;
};

export default function VialStorageCasePage() {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const isOutOfStock = !loading && productData.inventory <= 0;
  const isLimitedStock =
    !loading && productData.inventory > 0 && productData.inventory <= 5;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!data?.success || !Array.isArray(data.products)) return;

        const caseProduct = data.products.find((item: ProductApiItem) => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  useEffect(() => {
    if (productData.inventory > 0 && quantity > productData.inventory) {
      setQuantity(productData.inventory);
    }
  }, [productData.inventory, quantity]);

  const addToCart = () => {
    if (isOutOfStock || loading) return;

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: productData.price,
      quantity,
      image: product.image,
      path: product.path,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

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
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[120px]" />
      </div>

      <section className="relative z-10 px-5 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/products"
            className="group mb-7 inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition group-hover:border-blue-300/30 group-hover:bg-blue-400/10">
              <ArrowLeft size={15} />
            </span>
            Back to Products
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div>
              <div className="relative mx-auto max-w-[520px] overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03] p-3">
                <div className="absolute left-6 top-6 z-20">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#081526]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200 backdrop-blur-md">
                    <Package size={12} />
                    Lab Accessory
                  </span>
                </div>

                <div className="overflow-hidden rounded-[20px] bg-[#93C5FD]">
                  <img
                    src={productImages[selectedImage].src}
                    alt={productImages[selectedImage].alt}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </div>

              <div className="mx-auto mt-3 grid max-w-[520px] grid-cols-2 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-[18px] border p-1.5 transition ${
                      selectedImage === index
                        ? "border-blue-300 bg-blue-400/10"
                        : "border-white/10 bg-white/[0.03] hover:border-blue-300/30"
                    }`}
                  >
                    <div className="overflow-hidden rounded-[13px] bg-[#93C5FD]">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="aspect-[16/9] w-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mx-auto mt-3 grid max-w-[520px] grid-cols-3 gap-3">
                <MiniStat value="14" label="Vial Slots" />
                <MiniStat value="2 × 7" label="Layout" />
                <MiniStat value="Apexx" label="Branded" accent />
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">
                Apexx Lab Accessories
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                Vial Storage Case
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/55">
                Compact protective storage designed to keep research vials
                organized, secure, and easy to access.
              </p>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <p className="text-3xl font-black md:text-4xl">
                    ${productData.price.toFixed(2)}
                  </p>

                  <div className="mt-2">
                    {loading ? (
                      <span className="text-sm font-medium text-white/40">
                        Checking inventory...
                      </span>
                    ) : isOutOfStock ? (
                      <span className="text-sm font-semibold text-red-300">
                        Out of Stock
                      </span>
                    ) : isLimitedStock ? (
                      <span className="text-sm font-semibold text-yellow-300">
                        Limited Stock · {productData.inventory} left
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-green-300">
                        In Stock
                      </span>
                    )}
                  </div>
                </div>

                {!loading && productData.inventory > 0 && (
                  <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-white/45">
                    {productData.inventory} available
                  </span>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <FeatureCard
                  icon={<LayoutGrid size={17} />}
                  title="14 Vial Capacity"
                  text="Two rows of seven dedicated vial slots."
                />
                <FeatureCard
                  icon={<ShieldCheck size={17} />}
                  title="Protective Storage"
                  text="Keeps research vials together and organized."
                />
                <FeatureCard
                  icon={<BriefcaseBusiness size={17} />}
                  title="Compact Design"
                  text="Clean storage without unnecessary bulk."
                />
                <FeatureCard
                  icon={<Package size={17} />}
                  title="Apexx Branded"
                  text="Finished with Apexx Biolabs branding."
                />
              </div>

              <div className="mt-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Quantity
                </p>

                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.035] p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((prev) => Math.max(1, prev - 1));
                      setAdded(false);
                    }}
                    disabled={loading || isOutOfStock}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-blue-200 transition hover:bg-white/[0.07] disabled:opacity-30"
                  >
                    <Minus size={16} />
                  </button>

                  <div className="flex h-9 w-10 items-center justify-center text-sm font-bold">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((prev) =>
                        Math.min(productData.inventory || 1, prev + 1)
                      );
                      setAdded(false);
                    }}
                    disabled={
                      loading ||
                      isOutOfStock ||
                      quantity >= productData.inventory
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full text-blue-200 transition hover:bg-white/[0.07] disabled:opacity-30"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={loading || isOutOfStock}
                  className={`flex items-center justify-center gap-2 rounded-full py-4 text-sm font-bold uppercase tracking-[0.12em] transition ${
                    loading || isOutOfStock
                      ? "cursor-not-allowed bg-white/[0.06] text-white/30"
                      : added
                      ? "bg-green-200 text-[#081526]"
                      : "bg-white text-[#081526] hover:bg-blue-100"
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      Added To Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      {isOutOfStock ? "Out of Stock" : "Add To Cart"}
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="rounded-full border border-white/10 bg-white/[0.035] py-4 text-center text-sm font-bold uppercase tracking-[0.12em] text-white/80 transition hover:border-blue-300/30 hover:bg-white/[0.06] hover:text-white"
                >
                  View Cart
                </Link>
              </div>

              <Link
                href="/products"
                className="mt-3 block text-center text-sm text-white/40 transition hover:text-white/70"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-12 md:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
                Product Details
              </p>

              <h2 className="mt-3 text-2xl font-black md:text-3xl">
                Simple. Organized. Protected.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50 md:text-base">
                The Apexx Biolabs Vial Storage Case features fourteen dedicated
                vial slots arranged across two rows. Its compact profile provides
                a clean and convenient way to keep research vials together and
                organized.
              </p>
            </div>

            <div className="border-t border-white/10 p-6 md:p-8 lg:border-l lg:border-t-0">
              <DetailRow label="Capacity" value="14 Vials" />
              <DetailRow label="Configuration" value="2 Rows × 7" />
              <DetailRow label="Category" value="Lab Accessories" />
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

function MiniStat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[16px] border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
      <p className={`text-base font-black ${accent ? "text-blue-300" : "text-white"}`}>
        {value}
      </p>
      <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/35">
        {label}
      </p>
    </div>
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
    <div className="rounded-[16px] border border-white/10 bg-[#06111f]/35 p-3.5">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10 text-blue-300">
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
    <div className="flex items-center justify-between gap-6 border-b border-white/10 py-4 first:pt-0 last:border-0 last:pb-0">
      <span className="text-sm text-white/40">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}
