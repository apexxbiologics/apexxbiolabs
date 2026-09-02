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

type FlashSale = {
  id: string;
  product_id: string;
  sale_price: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
};

type ShirtProductData = {
  inventory: number;
  price: number;
  databaseProductId: string | null;
  flashSale: FlashSale | null;
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
  const [selectedColor, setSelectedColor] =
    useState<Color>("Blue");

  const [selectedSize, setSelectedSize] =
    useState<Size>("M");

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] =
    useState(false);

  const [productData, setProductData] =
    useState<ShirtProductData>({
      inventory: 0,
      price: FALLBACK_PRICE,
      databaseProductId: null,
      flashSale: null,
    });

  const selectedColorData =
    COLORS.find(
      (color) =>
        color.name === selectedColor
    )!;

  const selectedSlug =
    `apexx-shirt-${selectedColor.toLowerCase()}-${selectedSize.toLowerCase()}`;

  const product = {
    id: selectedSlug,

    name:
      `Apexx Biolabs Signature Tee - ${selectedColor} / ${selectedSize}`,

    image:
      selectedColorData.images[0].src,

    path:
      "/products/apexx-shirt",
  };

  const flashSalePrice =
    productData.flashSale !== null
      ? Number(
          productData.flashSale.sale_price
        )
      : null;

  const isFlashSaleActive =
    flashSalePrice !== null &&
    Number.isFinite(
      flashSalePrice
    ) &&
    flashSalePrice > 0 &&
    flashSalePrice <
      productData.price;

  const effectiveUnitPrice =
    isFlashSaleActive
      ? flashSalePrice
      : productData.price;

  const selectedTotal =
    effectiveUnitPrice *
    quantity;

  const regularTotal =
    productData.price *
    quantity;

  const isOutOfStock =
    productData.inventory <= 0;

  const isLowStock =
    productData.inventory > 0 &&
    productData.inventory <= 5;

  const favoriteProduct = {
    id: product.id,
    name: product.name,
    price: effectiveUnitPrice,
    image: product.image,
    path: product.path,
  };

  const formatMoney = (
    amount: number
  ) =>
    Number(
      amount
    ).toFixed(2);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [
          productResponse,
          saleResponse,
        ] = await Promise.all([
          fetch("/api/products", {
            cache: "no-store",
          }),

          fetch("/api/flash-sales", {
            cache: "no-store",
          }),
        ]);

        const productResponseData =
          await productResponse.json();

        const saleResponseData =
          await saleResponse
            .json()
            .catch(() => ({
              success: false,
              sales: [],
            }));

        if (
          !productResponseData.success
        ) {
          return;
        }

        const products =
          productResponseData.products ||
          [];

        const shirtProduct =
          products.find(
            (item: any) => {
              const slug =
                String(
                  item.slug || ""
                )
                  .toLowerCase()
                  .trim();

              const id =
                String(
                  item.id || ""
                )
                  .toLowerCase()
                  .trim();

              return (
                slug ===
                  selectedSlug ||
                id ===
                  selectedSlug
              );
            }
          );

        if (!shirtProduct) {
          setProductData({
            inventory: 0,
            price:
              FALLBACK_PRICE,
            databaseProductId:
              null,
            flashSale: null,
          });

          return;
        }

        const dbId =
          String(
            shirtProduct.id
          );

        const regularPrice =
          Number(
            shirtProduct.price ??
              FALLBACK_PRICE
          );

        const now =
          Date.now();

        const sales =
          Array.isArray(
            saleResponseData.sales
          )
            ? saleResponseData.sales
            : [];

        const matchingSale =
          sales.find(
            (
              sale: FlashSale
            ) => {
              const starts =
                new Date(
                  sale.starts_at
                ).getTime();

              const ends =
                new Date(
                  sale.ends_at
                ).getTime();

              const salePrice =
                Number(
                  sale.sale_price
                );

              return (
                sale.active ===
                  true &&
                String(
                  sale.product_id
                ) === dbId &&
                Number.isFinite(
                  starts
                ) &&
                Number.isFinite(
                  ends
                ) &&
                starts <= now &&
                ends > now &&
                Number.isFinite(
                  salePrice
                ) &&
                salePrice > 0 &&
                salePrice <
                  regularPrice
              );
            }
          ) || null;

        setProductData({
          inventory: Number(
            shirtProduct.inventory ??
              0
          ),

          price:
            regularPrice,

          databaseProductId:
            dbId,

          flashSale:
            matchingSale,
        });
      } catch (error) {
        console.error(
          "Failed to fetch shirt:",
          error
        );

        setProductData({
          inventory: 0,
          price:
            FALLBACK_PRICE,
          databaseProductId:
            null,
          flashSale: null,
        });
      }
    };

    fetchProductData();

    const flashSaleRefresh =
      window.setInterval(
        fetchProductData,
        30_000
      );

    return () => {
      window.clearInterval(
        flashSaleRefresh
      );
    };
  }, [selectedSlug]);

  const changeColor = (
    color: Color
  ) => {
    setSelectedColor(color);
    setSelectedImage(0);
    setQuantity(1);
    setAdded(false);
  };

  const changeSize = (
    size: Size
  ) => {
    setSelectedSize(size);
    setQuantity(1);
    setAdded(false);
  };

  const decreaseQuantity =
    () => {
      setQuantity(
        (previous) =>
          Math.max(
            1,
            previous - 1
          )
      );

      setAdded(false);
    };

  const increaseQuantity =
    () => {
      if (
        isOutOfStock
      ) {
        return;
      }

      setQuantity(
        (previous) =>
          Math.min(
            productData.inventory,
            previous + 1
          )
      );

      setAdded(false);
    };

  const addToCart = () => {
    if (isOutOfStock) {
      return;
    }

    const existingCart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        ) || "[]"
      );

    const existingProduct =
      existingCart.find(
        (item: any) =>
          item.id ===
          product.id
      );

    const existingQuantity =
      existingProduct
        ? Number(
            existingProduct.quantity ||
              0
          )
        : 0;

    const newQuantity =
      existingQuantity +
      quantity;

    if (
      newQuantity >
      productData.inventory
    ) {
      alert(
        `Only ${productData.inventory} shirt${
          productData.inventory ===
          1
            ? ""
            : "s"
        } of ${selectedColor} / ${selectedSize} are currently available.`
      );

      return;
    }

    const cartProduct = {
      id:
        product.id,

      name:
        product.name,

      price:
        effectiveUnitPrice,

      basePrice:
        productData.price,

      quantity:
        newQuantity,

      image:
        product.image,

      path:
        product.path,

      color:
        selectedColor,

      size:
        selectedSize,

      flashSaleApplied:
        isFlashSaleActive,

      flashSaleId:
        isFlashSaleActive
          ? productData
              .flashSale?.id ||
            null
          : null,

      flashSalePrice:
        isFlashSaleActive
          ? effectiveUnitPrice
          : null,

      databaseProductId:
        productData.databaseProductId,

      /*
       * Shirts do not participate in
       * the vial quantity-discount
       * system.
       */
      quantityDiscountPercent:
        0,

      quantityDiscountTierId:
        null,

      quantityDiscountTierQuantity:
        null,
    };

    const updatedCart =
      existingProduct
        ? existingCart.map(
            (item: any) =>
              item.id ===
              product.id
                ? {
                    ...item,
                    ...cartProduct,
                  }
                : item
          )
        : [
            ...existingCart,
            cartProduct,
          ];

    localStorage.setItem(
      "cart",
      JSON.stringify(
        updatedCart
      )
    );

    window.dispatchEvent(
      new Event(
        "cartUpdated"
      )
    );

    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      {/* PRODUCT HERO */}
      <section className="relative px-6 md:px-10 py-16 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 items-start">

            {/* PRODUCT IMAGE */}
            <div>

              <div className="flex items-center justify-center">

                <div className="relative w-full max-w-[520px] aspect-square rounded-[48px] overflow-hidden border border-blue-400/10 bg-[#93C5FD] backdrop-blur-sm shadow-[0_0_30px_rgba(96,165,250,0.15)]">

                  <FavoriteButton
                    product={
                      favoriteProduct
                    }
                  />

                  <img
                    src={
                      selectedColorData
                        .images[
                        selectedImage
                      ].src
                    }
                    alt={`${selectedColorData.label} Apexx Biolabs Signature Tee ${selectedColorData.images[selectedImage].label}`}
                    className="w-full h-full object-contain p-3 sm:p-4"
                  />

                </div>
              </div>

              {/* IMAGE THUMBNAILS */}
              <div className="grid grid-cols-2 gap-4 max-w-[520px] mx-auto mt-5">

                {selectedColorData.images.map(
                  (
                    image,
                    index
                  ) => (

                    <button
                      key={
                        image.src
                      }
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      className={`rounded-[24px] overflow-hidden border p-2 transition-all ${
                        selectedImage ===
                        index
                          ? "border-blue-300 bg-blue-400/10"
                          : "border-white/10 bg-white/[0.04] hover:border-blue-400/50"
                      }`}
                    >

                      <div className="relative rounded-[18px] overflow-hidden bg-[#93C5FD] aspect-[4/3]">

                        <img
                          src={
                            image.src
                          }
                          alt={
                            image.label
                          }
                          className="w-full h-full object-contain p-2"
                        />

                        {selectedImage ===
                          index && (
                          <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#081526]">

                            <Check
                              size={
                                12
                              }
                              strokeWidth={
                                3
                              }
                            />

                          </div>
                        )}

                      </div>

                    </button>
                  )
                )}

              </div>

            </div>

            {/* PRODUCT INFORMATION */}
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
                A clean 100% cotton
                short sleeve tee
                featuring minimal
                Apexx Biolabs
                branding on the
                front and our
                signature vertical
                Apexx graphic on
                the back.
              </p>

              {/* PRICE */}
              <div className="mb-3">

                <div className="flex flex-wrap items-end gap-3">

                  <p className="text-5xl font-black text-white">
                    $
                    {formatMoney(
                      selectedTotal
                    )}
                  </p>

                  {isFlashSaleActive && (
                    <p className="text-xl text-white/35 line-through mb-1">
                      $
                      {formatMoney(
                        regularTotal
                      )}
                    </p>
                  )}

                </div>

                {quantity > 1 && (
                  <p className="text-white/45 text-sm mt-2">
                    $
                    {formatMoney(
                      effectiveUnitPrice
                    )}{" "}
                    each
                  </p>
                )}

              </div>

              {/* FLASH SALE */}
              {isFlashSaleActive && (
                <div className="inline-flex rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#A5D8FF] mb-5">
                  Flash Sale · $
                  {formatMoney(
                    effectiveUnitPrice
                  )}{" "}
                  each
                </div>
              )}

              {/* STOCK */}
              {isLowStock && (
                <div className="font-semibold mb-8 text-yellow-300">
                  Only{" "}
                  {
                    productData.inventory
                  }{" "}
                  left
                </div>
              )}

              {isOutOfStock && (
                <div className="font-semibold mb-8 text-red-300">
                  Out of Stock
                </div>
              )}

              {!isLowStock &&
                !isOutOfStock && (
                <div className="mb-8 text-green-300 font-semibold">
                  In Stock
                </div>
              )}

              <div className="h-px bg-white/10 mb-8" />

              {/* COLOR */}
              <div className="mb-8">

                <div className="flex items-center justify-between mb-4">

                  <p className="uppercase tracking-widest text-white/50 text-sm">
                    Select Color
                  </p>

                  <span className="text-sm text-white/45">
                    {
                      selectedColorData.label
                    }
                  </span>

                </div>

                <div className="flex flex-wrap gap-4">

                  {COLORS.map(
                    (color) => {
                      const active =
                        selectedColor ===
                        color.name;

                      return (
                        <button
                          key={
                            color.name
                          }
                          type="button"
                          onClick={() =>
                            changeColor(
                              color.name
                            )
                          }
                          aria-label={
                            color.label
                          }
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
                            {
                              color.label
                            }
                          </p>

                        </button>
                      );
                    }
                  )}

                </div>

              </div>

              {/* SIZE + QUANTITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">

                {/* SIZE */}
                <div>

                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Select Size
                  </p>

                  <div className="grid grid-cols-4 gap-2">

                    {SIZES.map(
                      (size) => {
                        const active =
                          selectedSize ===
                          size;

                        return (
                          <button
                            key={
                              size
                            }
                            type="button"
                            onClick={() =>
                              changeSize(
                                size
                              )
                            }
                            className={`h-12 rounded-xl border text-sm font-bold transition ${
                              active
                                ? "border-white bg-white text-[#081526]"
                                : "border-white/15 bg-white/[0.02] text-white hover:border-white/40"
                            }`}
                          >
                            {
                              size
                            }
                          </button>
                        );
                      }
                    )}

                  </div>

                </div>

                {/* QUANTITY */}
                <div>

                  <p className="uppercase tracking-widest text-white/50 text-sm mb-4">
                    Quantity
                  </p>

                  <div className="flex items-center w-fit rounded-full border border-white/10 bg-white/[0.04] p-2">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      className="w-11 h-11 rounded-full text-2xl text-[#A5D8FF] hover:bg-white/[0.08]"
                    >
                      −
                    </button>

                    <div className="w-12 h-11 flex items-center justify-center text-lg font-bold">
                      {
                        quantity
                      }
                    </div>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        isOutOfStock ||
                        quantity >=
                          productData.inventory
                      }
                      className="w-11 h-11 rounded-full text-2xl text-[#A5D8FF] hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>

                  </div>

                </div>

              </div>

              {/* SELECTED VARIANT */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 mb-6">

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div>

                    <p className="text-white/40 text-[10px] uppercase tracking-widest">
                      Selected
                    </p>

                    <p className="text-white font-semibold mt-1">
                      {
                        selectedColorData.label
                      }{" "}
                      /{" "}
                      {
                        selectedSize
                      }
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-white/40 text-[10px] uppercase tracking-widest">
                      Price
                    </p>

                    <p className="text-[#A5D8FF] font-black mt-1">
                      $
                      {formatMoney(
                        effectiveUnitPrice
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* BUTTONS */}
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
                    onClick={
                      addToCart
                    }
                    className="bg-white text-[#081526] hover:bg-blue-100 rounded-full py-5 uppercase tracking-widest text-sm font-semibold transition-all flex items-center justify-center gap-3"
                  >

                    <ShoppingBag
                      size={
                        22
                      }
                    />

                    {added
                      ? "Added To Cart"
                      : `Add ${quantity} ${
                          quantity === 1
                            ? "Shirt"
                            : "Shirts"
                        } To Cart`}

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
                Apexx Biolabs
                Signature Tee
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
          ].map(
            (
              [
                Icon,
                title,
                text,
              ]: any
            ) => (

              <div
                key={
                  title
                }
                className="flex gap-4"
              >

                <Icon
                  className="text-[#A5D8FF]"
                  size={
                    34
                  }
                />

                <div>

                  <h3 className="text-white uppercase tracking-widest font-bold text-sm">
                    {
                      title
                    }
                  </h3>

                  <p className="text-white/50 text-sm mt-1">
                    {
                      text
                    }
                  </p>

                </div>

              </div>
            )
          )}

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
            Made from 100% cotton
            and designed with a
            clean everyday
            silhouette. Minimal
            Apexx Biolabs branding
            on the front is paired
            with our statement
            vertical Apexx graphic
            across the back.
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
            ].map(
              (
                [
                  title,
                  text,
                ]
              ) => (

                <div
                  key={
                    title
                  }
                  className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 hover:border-blue-400/50 transition-all"
                >

                  <h3 className="text-white text-lg font-bold mb-3">
                    {
                      title
                    }
                  </h3>

                  <p className="text-white/60 text-sm leading-relaxed">
                    {
                      text
                    }
                  </p>

                </div>
              )
            )}

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
                Compact Apexx
                branded storage
                for up to fourteen
                research vials.
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
                Metabolic research
                peptide available
                through the Apexx
                catalog.
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
                Cellular research
                product available
                through the Apexx
                catalog.
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
            Color appearance may
            vary slightly depending
            on screen settings and
            lighting. Please select
            your preferred color
            and size before adding
            the item to your cart.
          </p>

        </div>

      </section>

    </main>
  );
}