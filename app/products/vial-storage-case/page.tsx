"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  FlaskConical,
  ShieldCheck,
  ClipboardCheck,
  Package,
  LayoutGrid,
  BriefcaseBusiness,
} from "lucide-react";

import FavoriteButton from "@/components/FavoriteButton";

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

  const favoriteProduct = {
    id: product.id,
    name: product.name,
    price: productData.price,
    image: product.image,
    path: product.path,
  };

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
      {/* PRODUCT HERO */}
      <section className="relative px-6 md:px-10 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 items-start">
            {/* Product Image */}
            <div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[520px] h-[520px] rounded-[48px] overflow-hidden border border-blue-400/10 bg-white/[0.03] backdrop-blur-sm shadow-[0_0_30px_rgba(96,165,250,0.15)]">
                  <FavoriteButton product={favoriteProduct} />

                  <img
                    src={productImages[selectedImage].src}
                    alt={productImages[selectedImage].alt}
                    className="w-full h-full object-cover bg-[#93C5FD]"
                  />
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-2 gap-4 max-w-[520px] mx-auto mt-5">
                {productImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-[24px] overflow-hidden border p-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-300 bg-blue-400/10"
                        : "border-white/10 bg-white/[0.04] hover:border-blue-400/50"
                    }`}
                  >
                    <div className="rounded-[18px] overflow-hidden bg-[#93C5FD]">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-[150px] object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-4">
                Lab Accessory
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                Vial Storage Case
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                Compact Apexx Biolabs storage case designed to keep research
                vials organized, protected, and easy to access in one clean
                portable case.
              </p>

              <p className="text-5xl font-black text-white mb-3">
                ${productData.price.toFixed(2)}
              </p>

              {isLimitedStock && (
                <div className="font-semibold mb-8 text-yellow-300">
                  Limited Stock
                </div>
              )}

              {isOutOfStock && (
                <div className="font-semibold mb-8 text-red-300">
                  Out of Stock
                </div>
              )}

              {!isLimitedStock && !isOutOfStock && (
                <div className="mb-8 text-green-300 font-semibold">
                  In Stock
                </div>
              )}

              <div className="h-px bg-white/10 mb-8" />

              {/* Quantity */}
              <div className="mb-8">
                <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                  Quantity
                </p>

                <div className="flex items-center w-fit rounded-full border border-white/10 bg-white/[0.04] p-2">
                  <button
                    onClick={() => {
                      setQuantity((prev) => Math.max(1, prev - 1));
                      setAdded(false);
                    }}
                    className="w-11 h-11 rounded-full text-2xl text-[#A5D8FF] hover:bg-white/[0.08]"
                  >
                    −
                  </button>

                  <div className="w-12 h-11 flex items-center justify-center text-lg font-bold">
                    {quantity}
                  </div>

                  <button
                    onClick={() => {
                      setQuantity((prev) =>
                        Math.min(productData.inventory || 1, prev + 1)
                      );

                      setAdded(false);
                    }}
                    disabled={isOutOfStock}
                    className="w-11 h-11 rounded-full text-2xl text-[#A5D8FF] hover:bg-white/[0.08] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="bg-white/[0.06] text-white/30 cursor-not-allowed rounded-full py-5 uppercase tracking-widest text-sm font-semibold"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    onClick={addToCart}
                    className="bg-white text-[#081526] hover:bg-blue-100 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={22} />

                    {added ? "Added To Cart" : "Add To Cart"}
                  </button>
                )}

                <a
                  href="/cart"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  View Cart
                </a>

                <a
                  href="/products"
                  className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
                >
                  Continue Shopping
                </a>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SUMMARY */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-xs mb-2">
                Apexx Lab Accessories
              </p>

              <h3 className="text-2xl font-black text-white mb-5">
                Vial Storage Case
              </h3>

              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    14 Vial Capacity
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    2 × 7 Layout
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white/70">
                    Protective Storage
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="text-4xl font-black text-[#A5D8FF]">
                14
              </div>

              <div className="uppercase tracking-widest text-white/40 text-xs mt-1">
                Vial Slots
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUALITY CARDS */}
      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            [
              LayoutGrid,
              "14 Vial Capacity",
              "Two rows with seven dedicated vial slots.",
            ],
            [
              ShieldCheck,
              "Protective Storage",
              "Helps keep research vials together and organized.",
            ],
            [
              BriefcaseBusiness,
              "Compact Design",
              "Portable storage without unnecessary bulk.",
            ],
            [
              Package,
              "Apexx Branded",
              "Finished with Apexx Biolabs branding.",
            ],
          ].map(([Icon, title, text]: any) => (
            <div key={title} className="flex gap-4">
              <Icon
                className="text-[#A5D8FF]"
                size={34}
              />

              <div>
                <h3 className="text-white uppercase tracking-widest font-bold text-sm">
                  {title}
                </h3>

                <p className="text-white/50 text-sm mt-1">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT PROFILE */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
          <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
            Product Profile
          </p>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Compact Research Vial Storage
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            The Apexx Biolabs Vial Storage Case is designed for organized
            storage of research vials. The interior includes fourteen dedicated
            vial positions arranged in two rows of seven.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              [
                "Capacity",
                "Designed to hold up to fourteen research vials.",
              ],
              [
                "Configuration",
                "Two organized rows with seven vial positions per row.",
              ],
              [
                "Storage",
                "Compact format designed to keep vials together and protected.",
              ],
              [
                "Design",
                "Clean Apexx Biolabs branded exterior and organized interior layout.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 hover:border-blue-400/50 transition-all"
              >
                <h3 className="text-white text-lg font-bold mb-3">
                  {title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-3">
              Related Products
            </p>

            <h2 className="text-3xl md:text-4xl font-black text-white">
              Complete Your Research Setup
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/products/apx3"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/apx310blue.png"
                  alt="APX-3"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                APX-3
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Metabolic research peptide available through the Apexx catalog.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>

            <a
              href="/products/bpc157"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/bpc157blue.png"
                  alt="BPC-157"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                BPC-157
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Tissue research peptide available through the Apexx catalog.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>

            <a
              href="/products/ghkcu"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/ghkcublue.png"
                  alt="GHK-Cu"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                GHK-Cu
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Dermal research peptide available through the Apexx catalog.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
          <h3 className="text-[#A5D8FF] font-bold uppercase tracking-[0.25em] text-sm mb-4">
            Product Information
          </h3>

          <p className="text-white/60 text-sm leading-relaxed">
            This storage case is sold as a laboratory accessory intended for
            organization and storage of research materials.
          </p>
        </div>
      </section>
    </main>
  );
}
