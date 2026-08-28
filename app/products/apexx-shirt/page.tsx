"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Minus,
  Plus,
  Check,
  ChevronRight,
} from "lucide-react";

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

  /* =========================================================
     FETCH VARIANT
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
        console.error("Failed to fetch shirt:", error);
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
    <main className="min-h-screen bg-[#081526] text-white">
      {/* =========================================================
          BREADCRUMB
      ========================================================= */}

      <div className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-5 text-xs text-white/40 md:text-sm">
          <Link
            href="/products"
            className="transition hover:text-white"
          >
            Products
          </Link>

          <ChevronRight size={14} />

          <span>Apparel</span>

          <ChevronRight size={14} />

          <span className="text-white/75">
            Signature Tee
          </span>
        </div>
      </div>

      {/* =========================================================
          PRODUCT
      ========================================================= */}

      <section className="px-6 py-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/products"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/45 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] xl:gap-20">
            {/* =====================================================
                LEFT - PRODUCT IMAGE
            ===================================================== */}

            <div>
              {/* MAIN PHOTO */}
              <div className="mx-auto max-w-[590px]">
                <div className="overflow-hidden rounded-[28px] bg-[#93C5FD]">
                  <img
                    src={selectedColorData.images[selectedImage].src}
                    alt={`${selectedColorData.label} Apexx Biolabs Signature Tee ${selectedColorData.images[selectedImage].label}`}
                    className="aspect-[4/5] w-full object-cover object-top"
                  />
                </div>

                {/* FRONT / BACK */}
                <div className="mt-4 flex gap-3">
                  {selectedColorData.images.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative overflow-hidden rounded-xl border p-1 transition ${
                        selectedImage === index
                          ? "border-blue-300"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="h-24 w-20 overflow-hidden rounded-lg bg-[#93C5FD] sm:h-28 sm:w-24">
                        <img
                          src={image.src}
                          alt={image.label}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>

                      {selectedImage === index && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#081526]">
                          <Check
                            size={11}
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* =====================================================
                RIGHT - PRODUCT DETAILS
            ===================================================== */}

            <div className="lg:sticky lg:top-8 lg:self-start">
              {/* COLLECTION */}
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-300">
                Apexx Apparel
              </p>

              {/* TITLE */}
              <h1 className="mt-4 text-4xl font-black leading-[0.98] md:text-5xl xl:text-6xl">
                Apexx Biolabs
                <br />
                Signature Tee
              </h1>

              {/* PRICE */}
              <p className="mt-6 text-3xl font-black md:text-4xl">
                ${productData.price.toFixed(2)}
              </p>

              {/* DESCRIPTION */}
              <p className="mt-5 max-w-xl text-base leading-7 text-white/55">
                A clean 100% cotton short sleeve tee featuring minimal
                Apexx Biolabs branding across the front and our signature
                vertical Apexx graphic on the back.
              </p>

              {/* STOCK */}
              <div className="mt-5">
                {isOutOfStock ? (
                  <span className="text-sm font-semibold text-red-300">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-sm font-semibold text-amber-300">
                    Only {productData.inventory} left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-300">
                    <span className="h-2 w-2 rounded-full bg-green-300" />
                    In Stock
                  </span>
                )}
              </div>

              <div className="my-8 h-px bg-white/10" />

              {/* =================================================
                  COLOR
              ================================================= */}

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    Color
                  </p>

                  <span className="text-sm text-white/45">
                    {selectedColorData.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4">
                  {COLORS.map((color) => {
                    const active =
                      selectedColor === color.name;

                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() =>
                          changeColor(color.name)
                        }
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
                              backgroundColor:
                                color.swatch,
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

              {/* =================================================
                  SIZE
              ================================================= */}

              <div className="mt-9">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    Size
                  </p>

                  <span className="text-xs uppercase tracking-widest text-white/35">
                    S – XL
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {SIZES.map((size) => {
                    const active =
                      selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          changeSize(size)
                        }
                        className={`h-14 rounded-xl border text-sm font-bold transition ${
                          active
                            ? "border-white bg-white text-[#081526]"
                            : "border-white/15 bg-transparent text-white hover:border-white/40"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =================================================
                  QUANTITY
              ================================================= */}

              <div className="mt-9">
                <p className="mb-4 text-sm font-semibold">
                  Quantity
                </p>

                <div className="inline-flex items-center rounded-xl border border-white/15">
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((prev) =>
                        Math.max(1, prev - 1)
                      );

                      setAdded(false);
                    }}
                    className="flex h-12 w-12 items-center justify-center text-white/60 transition hover:text-white"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="w-10 text-center font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      setQuantity((prev) =>
                        Math.min(
                          productData.inventory || 1,
                          prev + 1
                        )
                      );

                      setAdded(false);
                    }}
                    className="flex h-12 w-12 items-center justify-center text-white/60 transition hover:text-white disabled:opacity-30"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>

              {/* =================================================
                  ADD TO CART
              ================================================= */}

              <button
                type="button"
                onClick={addToCart}
                disabled={isOutOfStock}
                className={`mt-9 flex w-full items-center justify-center gap-3 rounded-full py-5 text-sm font-bold uppercase tracking-[0.16em] transition ${
                  isOutOfStock
                    ? "cursor-not-allowed bg-white/[0.08] text-white/25"
                    : added
                    ? "bg-blue-200 text-[#081526]"
                    : "bg-white text-[#081526] hover:bg-blue-100"
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />

                    {isOutOfStock
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="mt-3 block w-full rounded-full border border-white/15 py-4 text-center text-sm font-semibold text-white/60 transition hover:border-white/35 hover:text-white"
              >
                View Cart
              </Link>

              {/* =================================================
                  PRODUCT INFORMATION
              ================================================= */}

              <div className="mt-10 border-t border-white/10 pt-7">
                <ProductDetail
                  label="Material"
                  value="100% Cotton"
                />

                <ProductDetail
                  label="Colors"
                  value="Apexx Blue, Ivory, Olive"
                />

                <ProductDetail
                  label="Sizes"
                  value="S, M, L, XL"
                />

                <ProductDetail
                  label="Style"
                  value="Short Sleeve Tee"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          DETAILS
      ========================================================= */}

      <section className="border-t border-white/[0.07] px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-300">
              Signature Collection
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Apexx, front to back.
            </h2>
          </div>

          <div>
            <p className="max-w-xl leading-7 text-white/50">
              Made from 100% cotton and designed with a clean everyday
              silhouette. Minimal Apexx Biolabs branding on the front is
              paired with our statement vertical Apexx graphic across the
              back.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/55">
                100% Cotton
              </span>

              <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/55">
                Short Sleeve
              </span>

              <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/55">
                S – XL
              </span>

              <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/55">
                3 Colors
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =============================================================
   PRODUCT DETAIL
============================================================= */

function ProductDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-white/[0.08] py-4 first:pt-0 last:border-0">
      <span className="text-sm text-white/35">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-white/80">
        {value}
      </span>
    </div>
  );
}