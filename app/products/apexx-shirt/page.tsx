"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Shirt,
  Check,
} from "lucide-react";

const FALLBACK_PRICE = 29.99;

type Color = "Blue" | "Ivory" | "Olive";
type Size = "S" | "M" | "L" | "XL";

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

  const colors: {
    name: Color;
    label: string;
    swatch: string;
    images: {
      src: string;
      label: string;
    }[];
  }[] = [
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
      swatch: "#666A59",
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

  const sizes: Size[] = ["S", "M", "L", "XL"];

  const selectedColorData = colors.find(
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
        console.error("Failed to fetch shirt data:", error);
      }
    };

    fetchProductData();
  }, [selectedSlug]);

  /* =========================================================
     CHANGE COLOR
  ========================================================= */

  const changeColor = (color: Color) => {
    setSelectedColor(color);
    setSelectedImage(0);
    setQuantity(1);
    setAdded(false);
  };

  /* =========================================================
     CHANGE SIZE
  ========================================================= */

  const changeSize = (size: Size) => {
    setSelectedSize(size);
    setQuantity(1);
    setAdded(false);
  };

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
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[650px] w-[950px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[150px]" />

        <div className="absolute -right-40 top-[600px] h-[500px] w-[500px] rounded-full bg-blue-400/[0.04] blur-[140px]" />
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
              <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[48px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_0_40px_rgba(96,165,250,0.10)]">
                <div className="absolute left-8 top-8 z-20">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#081526]/85 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200 backdrop-blur-md">
                    <Shirt size={13} />
                    Apexx Apparel
                  </span>
                </div>

                <div className="overflow-hidden rounded-[36px] bg-black">
                  <img
                    src={selectedColorData.images[selectedImage].src}
                    alt={`${selectedColor} Apexx Biolabs Shirt ${selectedColorData.images[selectedImage].label}`}
                    className="aspect-square h-full w-full object-cover transition-all duration-300"
                  />
                </div>
              </div>

              {/* FRONT / BACK THUMBNAILS */}
              <div className="mx-auto mt-4 grid w-full max-w-[560px] grid-cols-2 gap-4">
                {selectedColorData.images.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`group overflow-hidden rounded-[24px] border p-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-300 bg-blue-400/10 shadow-[0_0_25px_rgba(96,165,250,0.15)]"
                        : "border-white/10 bg-white/[0.04] hover:border-blue-400/40"
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-[18px] bg-black">
                      <img
                        src={image.src}
                        alt={`${selectedColor} ${image.label}`}
                        className="aspect-[16/10] h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />

                      <div className="absolute bottom-3 left-3 rounded-full bg-[#081526]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                        {image.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* COLOR PREVIEWS */}
              <div className="mx-auto mt-5 w-full max-w-[560px]">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                  Available Colors
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {colors.map((color) => {
                    const active = selectedColor === color.name;

                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => changeColor(color.name)}
                        className={`relative overflow-hidden rounded-[22px] border p-2 transition-all ${
                          active
                            ? "border-blue-300 bg-blue-400/10"
                            : "border-white/10 bg-white/[0.04] hover:border-blue-400/40"
                        }`}
                      >
                        <div className="relative overflow-hidden rounded-[16px] bg-black">
                          <img
                            src={color.images[0].src}
                            alt={color.label}
                            className="aspect-square w-full object-cover"
                          />

                          {active && (
                            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#081526]">
                              <Check size={15} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-2 py-3">
                          <span
                            className="h-3 w-3 rounded-full border border-white/20"
                            style={{
                              backgroundColor: color.swatch,
                            }}
                          />

                          <span
                            className={`text-xs font-bold ${
                              active
                                ? "text-white"
                                : "text-white/55"
                            }`}
                          >
                            {color.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* =====================================================
                RIGHT SIDE - PRODUCT INFO
            ===================================================== */}

            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm md:p-10">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#A5D8FF]">
                Apexx Apparel
              </p>

              <h1 className="text-5xl font-black leading-[0.95] text-white md:text-6xl">
                Apexx Biolabs
                <br />

                <span className="text-blue-300">
                  Signature Tee.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/65">
                A clean Apexx Biolabs tee featuring understated front
                branding and our signature vertical Apexx design across
                the back.
              </p>

              {/* PRICE */}
              <p className="mt-7 text-5xl font-black text-white">
                ${productData.price.toFixed(2)}
              </p>

              {/* STOCK */}
              {isLimitedStock && (
                <div className="mt-3 font-semibold text-yellow-300">
                  Limited Stock — {productData.inventory} Remaining
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

              {/* =================================================
                  COLOR SELECTOR
              ================================================= */}

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm uppercase tracking-widest text-white/50">
                    Select Color
                  </p>

                  <p className="text-sm font-bold text-white">
                    {selectedColorData.label}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {colors.map((color) => {
                    const active = selectedColor === color.name;

                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => changeColor(color.name)}
                        className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-sm font-bold transition-all ${
                          active
                            ? "border-blue-300 bg-blue-400/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-white/50 hover:border-blue-400/40 hover:text-white"
                        }`}
                      >
                        <span
                          className="h-5 w-5 rounded-full border border-white/20 shadow-sm"
                          style={{
                            backgroundColor: color.swatch,
                          }}
                        />

                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =================================================
                  SIZE SELECTOR
              ================================================= */}

              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm uppercase tracking-widest text-white/50">
                    Select Size
                  </p>

                  <span className="text-xs text-white/35">
                    S – XL
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {sizes.map((size) => {
                    const active = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => changeSize(size)}
                        className={`h-14 rounded-2xl border text-sm font-black transition-all ${
                          active
                            ? "border-white bg-white text-[#081526]"
                            : "border-white/10 bg-white/[0.03] text-white/60 hover:border-blue-400/50 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SELECTED VARIANT */}
              <div className="mt-5 rounded-2xl border border-blue-400/15 bg-blue-500/[0.07] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Your Selection
                </p>

                <p className="mt-1 font-bold text-blue-200">
                  {selectedColorData.label} • Size {selectedSize}
                </p>
              </div>

              {/* =================================================
                  QUANTITY
              ================================================= */}

              <div className="mt-8">
                <p className="mb-4 text-sm uppercase tracking-widest text-white/50">
                  Quantity
                </p>

                <div className="flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((prev) => Math.max(1, prev - 1));
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

              {/* =================================================
                  CART BUTTONS
              ================================================= */}

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

                <Link
                  href="/cart"
                  className="rounded-full border border-white/10 bg-white/[0.04] py-5 text-center text-sm font-semibold uppercase tracking-widest transition-all hover:border-blue-400/50 hover:bg-white/[0.07]"
                >
                  View Cart
                </Link>
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
          DETAILS
      ========================================================= */}

      <section className="relative z-10 px-6 pb-20 md:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 md:p-10">
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#A5D8FF]">
                Signature Collection
              </p>

              <h2 className="text-3xl font-black md:text-4xl">
                Apexx, front to back.
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-white/60">
                Minimal Apexx Biolabs branding across the chest is paired
                with a statement vertical Apexx graphic on the back.
                Available in Apexx Blue, Ivory, and Olive.
              </p>
            </div>

            <div className="border-t border-white/10 p-8 md:p-10 lg:border-l lg:border-t-0">
              <DetailRow
                label="Colors"
                value="Blue / Ivory / Olive"
              />

              <DetailRow
                label="Sizes"
                value="S / M / L / XL"
              />

              <DetailRow
                label="Style"
                value="Short Sleeve Tee"
              />

              <DetailRow
                label="Price"
                value="$29.99"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
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

      <span className="text-right text-sm font-bold text-white">
        {value}
      </span>
    </div>
  );
}