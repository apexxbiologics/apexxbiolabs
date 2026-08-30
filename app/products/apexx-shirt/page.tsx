"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  ShieldCheck,
  Package,
  Shirt,
  Check,
} from "lucide-react";

import FavoriteButton from "@/components/FavoriteButton";

const FALLBACK_PRICE = 29.99;

type Color = "Blue" | "Ivory" | "Olive";
type Size = "S" | "M" | "L" | "XL";

type ShirtColor = {
  name: Color;
  label: string;
  swatch: string;
  images: {
    src: string;
    label: "Front" | "Back";
  }[];
};

const COLORS: ShirtColor[] = [
  {
    name: "Blue",
    label: "Apexx Blue",
    swatch: "#93C5FD",
    images: [
      {
        src: "/images/apexx-shirt-blue-front.png",
        label: "Front",
      },
      {
        src: "/images/apexx-shirt-blue-back.png",
        label: "Back",
      },
    ],
  },
  {
    name: "Ivory",
    label: "Ivory",
    swatch: "#E8E1DA",
    images: [
      {
        src: "/images/apexx-shirt-ivory-front.png",
        label: "Front",
      },
      {
        src: "/images/apexx-shirt-ivory-back.png",
        label: "Back",
      },
    ],
  },
  {
    name: "Olive",
    label: "Olive",
    swatch: "#777863",
    images: [
      {
        src: "/images/apexx-shirt-olive-front.png",
        label: "Front",
      },
      {
        src: "/images/apexx-shirt-olive-back.png",
        label: "Back",
      },
    ],
  },
];

const SIZES: Size[] = ["S", "M", "L", "XL"];

export default function ApexxShirtPage() {
  const [selectedColor, setSelectedColor] = useState<Color>("Blue");
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [productData, setProductData] = useState({
    inventory: 0,
    price: FALLBACK_PRICE,
  });

  const selectedColorData = COLORS.find(
    (color) => color.name === selectedColor
  )!;

  const selectedSlug = `apexx-shirt-${selectedColor.toLowerCase()}-${selectedSize.toLowerCase()}`;

  const product = {
    id: selectedSlug,
    name: `Apexx Biolabs Signature Tee - ${selectedColor} / ${selectedSize}`,
    image: selectedColorData.images[0].src,
    path: "/products/apexx-shirt",
  };

  const isOutOfStock = productData.inventory <= 0;
  const isLowStock =
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

        const shirtProduct = data.products.find((item: any) => {
          const slug = item.slug?.toLowerCase().trim();
          return slug === selectedSlug;
        });

        if (!shirtProduct) {
          setProductData({
            inventory: 0,
            price: FALLBACK_PRICE,
          });

          return;
        }

        setProductData({
          inventory: Number(shirtProduct.inventory ?? 0),
          price: Number(shirtProduct.price ?? FALLBACK_PRICE),
        });
      } catch (error) {
        console.error("Failed to fetch shirt:", error);
      }
    };

    fetchProductData();
  }, [selectedSlug]);

  const changeColor = (color: Color) => {
    setSelectedColor(color);
    setSelectedImage(0);
    setQuantity(1);
    setAdded(false);
  };

  const changeSize = (size: Size) => {
    setSelectedSize(size);
    setQuantity(1);
    setAdded(false);
  };

  const addToCart = () => {
    if (isOutOfStock) return;

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: productData.price,
      quantity,
      image: product.image,
      path: product.path,
      color: selectedColor,
      size: selectedSize,
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
                color: selectedColor,
                size: selectedSize,
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
                <div className="relative w-full max-w-[520px] h-[520px] rounded-[48px] overflow-hidden border border-blue-400/10 bg-[#93C5FD] backdrop-blur-sm shadow-[0_0_30px_rgba(96,165,250,0.15)]">
                  <FavoriteButton product={favoriteProduct} />

                  <img
                    src={selectedColorData.images[selectedImage].src}
                    alt={`${selectedColorData.label} Apexx Biolabs Signature Tee ${selectedColorData.images[selectedImage].label}`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-2 gap-4 max-w-[520px] mx-auto mt-5">
                {selectedColorData.images.map((image, index) => (
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
                    <div className="relative rounded-[18px] overflow-hidden bg-[#93C5FD]">
                      <img
                        src={image.src}
                        alt={image.label}
                        className="w-full h-[150px] object-cover object-top"
                      />

                      {selectedImage === index && (
                        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#081526]">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
              <p className="uppercase tracking-[0.35em] text-[#A5D8FF] text-sm mb-4">
                Apexx Apparel
              </p>

              <h1 className="text-5xl md:text-6xl font-black mb-5 text-white">
                Apexx Biolabs
                <br />
                Signature Tee
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
                A clean 100% cotton short sleeve tee featuring minimal Apexx
                Biolabs branding on the front and our signature vertical Apexx
                graphic on the back.
              </p>

              <p className="text-5xl font-black text-white mb-3">
                ${productData.price.toFixed(2)}
              </p>

              {isLowStock && (
                <div className="font-semibold mb-8 text-yellow-300">
                  Only {productData.inventory} left
                </div>
              )}

              {isOutOfStock && (
                <div className="font-semibold mb-8 text-red-300">
                  Out of Stock
                </div>
              )}

              {!isLowStock && !isOutOfStock && (
                <div className="mb-8 text-green-300 font-semibold">
                  In Stock
                </div>
              )}

              <div className="h-px bg-white/10 mb-8" />

              {/* Color */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="uppercase tracking-widest text-white/50 text-sm">
                    Select Color
                  </p>

                  <span className="text-sm text-white/45">
                    {selectedColorData.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4">
                  {COLORS.map((color) => {
                    const active = selectedColor === color.name;

                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => changeColor(color.name)}
                        aria-label={color.label}
                        className="group"
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                            active
                              ? "border-white"
                              : "border-transparent group-hover:border-white/30"
                          }`}
                        >
                          <span
                            className="h-9 w-9 rounded-full border border-black/10"
                            style={{
                              backgroundColor: color.swatch,
                            }}
                          />
                        </div>

                        <p
                          className={`mt-2 text-xs ${
                            active
                              ? "text-white"
                              : "text-white/40"
                          }`}
                        >
                          {color.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size + Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Select Size
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    {SIZES.map((size) => {
                      const active = selectedSize === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => changeSize(size)}
                          className={`h-12 rounded-xl border text-sm font-bold transition ${
                            active
                              ? "border-white bg-white text-[#081526]"
                              : "border-white/15 bg-white/[0.02] text-white hover:border-white/40"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
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
                    <ShoppingBag size={22} />

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
                  className="sm:col-span-2 border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-400/50 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all text-center"
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
                Signature Collection
              </p>

              <h3 className="text-2xl font-black text-white mb-5">
                Apexx Biolabs Signature Tee
              </h3>

              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    100% Cotton
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[#A5D8FF] font-semibold">
                    Sizes S–XL
                  </span>
                </div>

                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white/70">
                    3 Color Options
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="text-4xl font-black text-[#A5D8FF]">
                3
              </div>

              <div className="uppercase tracking-widest text-white/40 text-xs mt-1">
                Colors
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT FEATURES */}
      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            [
              Shirt,
              "100% Cotton",
              "Soft cotton construction for everyday wear.",
            ],
            [
              ShieldCheck,
              "Signature Design",
              "Minimal front branding with a statement back graphic.",
            ],
            [
              Package,
              "Three Colors",
              "Available in Apexx Blue, Ivory, and Olive.",
            ],
            [
              Check,
              "Sizes S–XL",
              "Offered in Small, Medium, Large, and XL.",
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
            Apexx, Front to Back.
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-4xl mb-8">
            Made from 100% cotton and designed with a clean everyday silhouette.
            Minimal Apexx Biolabs branding on the front is paired with our
            statement vertical Apexx graphic across the back.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              [
                "Material",
                "100% cotton short sleeve construction.",
              ],
              [
                "Colors",
                "Apexx Blue, Ivory, and Olive colorways.",
              ],
              [
                "Sizing",
                "Available in S, M, L, and XL.",
              ],
              [
                "Design",
                "Minimal front branding with signature vertical back artwork.",
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
              More From Apexx
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/products/vial-storage-case"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/vial-case.png"
                  alt="Vial Storage Case"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                Vial Storage Case
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Compact Apexx branded storage for up to fourteen research vials.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>

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
              href="/products/glutathione"
              className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-5 hover:border-blue-400/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="rounded-[28px] overflow-hidden mb-5 bg-[#93C5FD] h-[230px] flex items-center justify-center">
                <img
                  src="/images/glutathione1500blue.png"
                  alt="Glutathione"
                  className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                Glutathione
              </h3>

              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Cellular research product available through the Apexx catalog.
              </p>

              <span className="text-[#A5D8FF] font-semibold">
                View Product →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCT INFORMATION */}
      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8">
          <h3 className="text-[#A5D8FF] font-bold uppercase tracking-[0.25em] text-sm mb-4">
            Product Information
          </h3>

          <p className="text-white/60 text-sm leading-relaxed">
            Color appearance may vary slightly depending on screen settings and
            lighting. Please select your preferred color and size before adding
            the item to your cart.
          </p>
        </div>
      </section>
    </main>
  );
}