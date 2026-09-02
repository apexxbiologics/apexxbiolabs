"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Check,
  PackageOpen,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  inventory: number;
  image?: string;
  category?: string;
  size?: string;
  active?: boolean;
};

type BundleItem = Product & {
  quantity: number;
};

const bundleTiers = [
  {
    quantity: 3,
    discount: 5,
  },
  {
    quantity: 5,
    discount: 10,
  },
  {
    quantity: 10,
    discount: 15,
  },
  {
    quantity: 20,
    discount: 20,
  },
];

export default function BuildABundlePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundle, setBundle] = useState<BundleItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!data.success) {
          console.error("Failed to load products:", data);
          return;
        }

        const normalizedProducts = (data.products || [])
          .map((product: any) => ({
            id: String(product.id),
            name: String(product.name || ""),
            slug: product.slug
              ? String(product.slug)
              : undefined,
            price: Number(product.price || 0),
            inventory: Number(product.inventory || 0),
            image: product.image
              ? String(product.image)
              : product.image_url
              ? String(product.image_url)
              : "",
            category: product.category
              ? String(product.category)
              : "",
            size: product.size
              ? String(product.size)
              : "",
            active:
              product.active === undefined
                ? true
                : Boolean(product.active),
          }))
          .filter((product: Product) => {
            const category =
              product.category?.toLowerCase() || "";

            const name =
              product.name?.toLowerCase() || "";

            const isPhysicalProduct =
              category.includes("accessor") ||
              category.includes("shirt") ||
              category.includes("apparel") ||
              name.includes("shirt") ||
              name.includes("vial case") ||
              name.includes("storage case");

            return (
              product.active !== false &&
              product.price > 0 &&
              !isPhysicalProduct
            );
          })
          .sort((a: Product, b: Product) =>
            a.name.localeCompare(b.name)
          );

        setProducts(normalizedProducts);
      } catch (error) {
        console.error(
          "Failed to fetch bundle products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalVials = useMemo(() => {
    return bundle.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [bundle]);

  const subtotal = useMemo(() => {
    return bundle.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [bundle]);

  const currentTier = useMemo(() => {
    return (
      [...bundleTiers]
        .filter(
          (tier) =>
            totalVials >=
            tier.quantity
        )
        .sort(
          (a, b) =>
            b.quantity -
            a.quantity
        )[0] || null
    );
  }, [totalVials]);

  const currentDiscount =
    currentTier?.discount || 0;

  const savings =
    subtotal *
    (currentDiscount / 100);

  const bundleTotal =
    subtotal - savings;

  const nextTier = useMemo(() => {
    return (
      bundleTiers.find(
        (tier) =>
          totalVials <
          tier.quantity
      ) || null
    );
  }, [totalVials]);

  const vialsUntilNextTier =
    nextTier
      ? Math.max(
          0,
          nextTier.quantity -
            totalVials
        )
      : 0;

  const maxTier =
    bundleTiers[
      bundleTiers.length - 1
    ];

  const progressPercent =
    nextTier
      ? Math.min(
          100,
          (totalVials /
            nextTier.quantity) *
            100
        )
      : 100;

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) return products;

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(query) ||
          product.size
            ?.toLowerCase()
            .includes(query)
      );
    }, [products, search]);

  const getBundleQuantity = (
    productId: string
  ) => {
    return (
      bundle.find(
        (item) =>
          item.id === productId
      )?.quantity || 0
    );
  };

  const addProduct = (
    product: Product
  ) => {
    if (product.inventory <= 0)
      return;

    const currentQuantity =
      getBundleQuantity(
        product.id
      );

    if (
      currentQuantity >=
      product.inventory
    ) {
      return;
    }

    setBundle((current) => {
      const existing =
        current.find(
          (item) =>
            item.id ===
            product.id
        );

      if (existing) {
        return current.map(
          (item) =>
            item.id ===
            product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    1,
                }
              : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setAddedToCart(false);
  };

  const removeProduct = (
    productId: string
  ) => {
    setBundle((current) =>
      current
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  item.quantity -
                  1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );

    setAddedToCart(false);
  };

  const removeAllProduct = (
    productId: string
  ) => {
    setBundle((current) =>
      current.filter(
        (item) =>
          item.id !== productId
      )
    );

    setAddedToCart(false);
  };

  const clearBundle = () => {
    setBundle([]);
    setAddedToCart(false);
  };

  const formatMoney = (
    amount: number
  ) =>
    Number(amount).toFixed(2);

  const addBundleToCart = () => {
    if (totalVials < 3) {
      return;
    }

    const existingCart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        ) || "[]"
      );

    const bundleId = `bundle-${Date.now()}`;

    const newBundleItems =
      bundle.map((item) => {
        const discountedUnitPrice =
          item.price *
          (1 -
            currentDiscount /
              100);

        return {
          id: item.id,
          name: item.name,
          price:
            discountedUnitPrice,
          basePrice:
            item.price,
          quantity:
            item.quantity,
          image:
            item.image || "",
          path:
            item.slug
              ? `/products/${item.slug}`
              : "/products",

          bundleId,
          bundleType:
            "build-your-own",

          bundleDiscountPercent:
            currentDiscount,

          bundleTierQuantity:
            currentTier?.quantity ||
            null,

          bundleBaseUnitPrice:
            item.price,

          bundleDiscountedUnitPrice:
            discountedUnitPrice,
        };
      });

    /*
     * TEMPORARY FIRST VERSION:
     *
     * Keep bundle items separate from
     * ordinary cart items so we preserve
     * bundle metadata.
     *
     * We'll improve cart grouping next.
     */
    const updatedCart = [
      ...existingCart,
      ...newBundleItems,
    ];

    localStorage.setItem(
      "cart",
      JSON.stringify(
        updatedCart
      )
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setAddedToCart(true);
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white">

      {/* HERO */}
      <section className="relative px-5 md:px-10 pt-10 md:pt-14 pb-8 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.13),transparent_55%)]" />

        <div className="relative max-w-7xl mx-auto">

          <div className="max-w-3xl">

            <p className="uppercase tracking-[0.3em] text-[#A5D8FF] text-xs font-semibold mb-3">
              Build Your Own Bundle
            </p>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Mix. Match. Save More.
            </h1>

            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl">
              Build your own research
              bundle and unlock bigger
              savings as you add more
              vials.
            </p>

          </div>

        </div>
      </section>

      {/* MILESTONES */}
      <section className="px-5 md:px-10 pb-8">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

            {bundleTiers.map(
              (tier) => {
                const unlocked =
                  totalVials >=
                  tier.quantity;

                const active =
                  currentTier
                    ?.quantity ===
                  tier.quantity;

                return (
                  <div
                    key={
                      tier.quantity
                    }
                    className={`relative rounded-2xl border px-4 py-4 transition-all ${
                      unlocked
                        ? "border-blue-300/60 bg-blue-400/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >

                    {unlocked && (
                      <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-300 text-[#081526] flex items-center justify-center">
                        <Check
                          size={14}
                          strokeWidth={3}
                        />
                      </span>
                    )}

                    <p className="text-white/45 text-[10px] uppercase tracking-[0.22em] mb-1">
                      {
                        tier.quantity
                      }
                      + Vials
                    </p>

                    <p className="text-2xl font-black text-white">
                      {
                        tier.discount
                      }
                      % Off
                    </p>

                    <p className="text-xs text-white/45 mt-1">
                      {active
                        ? "Current savings tier"
                        : unlocked
                        ? "Unlocked"
                        : "Bundle milestone"}
                    </p>

                  </div>
                );
              }
            )}

          </div>

        </div>
      </section>

      {/* BUNDLE PROGRESS */}
      <section className="px-5 md:px-10 pb-8">

        <div className="max-w-7xl mx-auto rounded-[26px] border border-white/10 bg-white/[0.04] p-5 md:p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-white/45 text-xs uppercase tracking-[0.2em] mb-1">
                Your Bundle
              </p>

              <p className="text-2xl md:text-3xl font-black">
                {totalVials}{" "}
                {totalVials === 1
                  ? "Vial"
                  : "Vials"}{" "}
                Selected
              </p>

            </div>

            <div className="md:text-right">

              {nextTier ? (
                <>
                  <p className="text-[#A5D8FF] font-bold">
                    Add{" "}
                    {
                      vialsUntilNextTier
                    }{" "}
                    more{" "}
                    {vialsUntilNextTier ===
                    1
                      ? "vial"
                      : "vials"}{" "}
                    to unlock{" "}
                    {
                      nextTier.discount
                    }
                    % off
                  </p>

                  {currentDiscount >
                    0 && (
                    <p className="text-green-300 text-sm mt-1">
                      ✓{" "}
                      {
                        currentDiscount
                      }
                      % savings currently
                      unlocked
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-green-300 font-black">
                    Maximum Bundle
                    Savings Unlocked
                  </p>

                  <p className="text-white/55 text-sm">
                    {
                      maxTier.discount
                    }
                    % off your eligible
                    bundle
                  </p>
                </>
              )}

            </div>

          </div>

          <div className="mt-5 h-2.5 rounded-full overflow-hidden bg-white/[0.07]">

            <div
              className="h-full rounded-full bg-blue-300 transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
              }}
            />

          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="px-5 md:px-10 pb-16">

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* PRODUCTS */}
          <div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

              <div>

                <p className="uppercase tracking-[0.25em] text-[#A5D8FF] text-xs mb-1">
                  Choose Your Products
                </p>

                <h2 className="text-2xl md:text-3xl font-black">
                  Research Vials
                </h2>

              </div>

              <div className="relative w-full sm:max-w-[320px]">

                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search products..."
                  className="w-full rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-4 py-3 text-base text-white placeholder:text-white/30 outline-none focus:border-blue-300/50"
                />

              </div>

            </div>

            {loading ? (
              <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-8 text-center text-white/50">
                Loading products...
              </div>
            ) : filteredProducts.length ===
              0 ? (
              <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-8 text-center text-white/50">
                No matching products.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {filteredProducts.map(
                  (product) => {
                    const selectedQty =
                      getBundleQuantity(
                        product.id
                      );

                    const outOfStock =
                      product.inventory <=
                      0;

                    const atInventoryLimit =
                      selectedQty >=
                      product.inventory;

                    return (
                      <div
                        key={
                          product.id
                        }
                        className="rounded-[24px] border border-white/10 bg-white/[0.04] overflow-hidden flex flex-col"
                      >

                        <div className="aspect-square bg-[#93C5FD] overflow-hidden">

                          {product.image ? (
                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.name
                              }
                              className="w-full h-full object-contain p-3"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#081526]/50">
                              <PackageOpen
                                size={44}
                              />
                            </div>
                          )}

                        </div>

                        <div className="p-4 flex flex-col flex-1">

                          <div className="flex-1">

                            <h3 className="text-sm md:text-base font-black text-white leading-tight">
                              {
                                product.name
                              }
                            </h3>

                            {product.size && (
                              <p className="text-white/40 text-xs mt-1">
                                {
                                  product.size
                                }
                              </p>
                            )}

                            <p className="text-lg font-black mt-2">
                              $
                              {formatMoney(
                                product.price
                              )}
                            </p>

                            {outOfStock && (
                              <p className="text-red-300 text-[10px] uppercase tracking-widest mt-2">
                                Out of Stock
                              </p>
                            )}

                          </div>

                          {selectedQty >
                          0 ? (
                            <div className="mt-4 flex items-center justify-between rounded-full border border-blue-300/30 bg-blue-400/10 p-1">

                              <button
                                type="button"
                                onClick={() =>
                                  removeProduct(
                                    product.id
                                  )
                                }
                                className="w-10 h-10 rounded-full hover:bg-white/[0.08] flex items-center justify-center text-[#A5D8FF]"
                              >
                                <Minus
                                  size={
                                    17
                                  }
                                />
                              </button>

                              <span className="font-black">
                                {
                                  selectedQty
                                }
                              </span>

                              <button
                                type="button"
                                disabled={
                                  atInventoryLimit
                                }
                                onClick={() =>
                                  addProduct(
                                    product
                                  )
                                }
                                className="w-10 h-10 rounded-full hover:bg-white/[0.08] flex items-center justify-center text-[#A5D8FF] disabled:opacity-30"
                              >
                                <Plus
                                  size={
                                    17
                                  }
                                />
                              </button>

                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                outOfStock
                              }
                              onClick={() =>
                                addProduct(
                                  product
                                )
                              }
                              className="mt-4 w-full rounded-full border border-white/10 bg-white/[0.05] hover:bg-white/[0.09] py-3 text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-30"
                            >
                              + Add
                            </button>
                          )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* SUMMARY */}
          <aside className="lg:sticky lg:top-24 rounded-[28px] border border-white/10 bg-white/[0.05] p-5 md:p-6">

            <div className="flex items-start justify-between gap-4 mb-5">

              <div>

                <p className="uppercase tracking-[0.25em] text-[#A5D8FF] text-xs mb-1">
                  Bundle Summary
                </p>

                <h2 className="text-2xl font-black">
                  Your Bundle
                </h2>

              </div>

              {bundle.length > 0 && (
                <button
                  type="button"
                  onClick={
                    clearBundle
                  }
                  className="text-white/35 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}

            </div>

            {bundle.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">

                <PackageOpen
                  size={32}
                  className="mx-auto text-white/25 mb-3"
                />

                <p className="text-white/45 text-sm">
                  Add research vials
                  to start building
                  your bundle.
                </p>

              </div>
            ) : (
              <div className="space-y-3">

                {bundle.map(
                  (item) => (

                    <div
                      key={
                        item.id
                      }
                      className="flex gap-3 items-center"
                    >

                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#93C5FD] shrink-0">

                        {item.image && (
                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            className="w-full h-full object-contain p-1"
                          />
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="font-bold text-sm truncate">
                          {
                            item.name
                          }
                        </p>

                        <p className="text-white/40 text-xs">
                          $
                          {formatMoney(
                            item.price
                          )}{" "}
                          ×{" "}
                          {
                            item.quantity
                          }
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-bold text-sm">
                          $
                          {formatMoney(
                            item.price *
                              item.quantity
                          )}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removeAllProduct(
                              item.id
                            )
                          }
                          className="text-[10px] uppercase tracking-widest text-white/30 hover:text-red-300"
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

            <div className="h-px bg-white/10 my-5" />

            <div className="space-y-3 text-sm">

              <div className="flex justify-between text-white/55">
                <span>
                  Vials Selected
                </span>

                <span>
                  {totalVials}
                </span>
              </div>

              <div className="flex justify-between text-white/55">
                <span>
                  Subtotal
                </span>

                <span>
                  $
                  {formatMoney(
                    subtotal
                  )}
                </span>
              </div>

              <div className="flex justify-between text-green-300">
                <span>
                  Bundle Discount
                  {currentDiscount >
                    0 &&
                    ` (${currentDiscount}%)`}
                </span>

                <span>
                  -
                  $
                  {formatMoney(
                    savings
                  )}
                </span>
              </div>

            </div>

            <div className="h-px bg-white/10 my-5" />

            <div className="flex items-end justify-between mb-5">

              <div>

                <p className="text-white/40 text-xs uppercase tracking-widest">
                  Bundle Total
                </p>

                <p className="text-3xl font-black mt-1">
                  $
                  {formatMoney(
                    bundleTotal
                  )}
                </p>

              </div>

              {currentDiscount >
                0 && (
                <div className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-2 text-green-300 text-xs font-bold">
                  Save{" "}
                  {
                    currentDiscount
                  }
                  %
                </div>
              )}

            </div>

            {nextTier && (
              <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 mb-4">

                <div className="flex gap-2 items-start">

                  <Sparkles
                    size={16}
                    className="text-blue-300 mt-0.5 shrink-0"
                  />

                  <p className="text-blue-100 text-xs leading-relaxed">
                    Add{" "}
                    <strong>
                      {
                        vialsUntilNextTier
                      }{" "}
                      more{" "}
                      {vialsUntilNextTier ===
                      1
                        ? "vial"
                        : "vials"}
                    </strong>{" "}
                    to unlock{" "}
                    <strong>
                      {
                        nextTier.discount
                      }
                      % off
                    </strong>
                    .
                  </p>

                </div>

              </div>
            )}

            {totalVials < 3 ? (
              <button
                type="button"
                disabled
                className="w-full rounded-full bg-white/[0.07] py-4 text-white/35 uppercase tracking-widest text-xs font-bold cursor-not-allowed"
              >
                Add{" "}
                {3 -
                  totalVials}{" "}
                More{" "}
                {3 -
                  totalVials ===
                1
                  ? "Vial"
                  : "Vials"}{" "}
                To Unlock Bundle
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  addBundleToCart
                }
                className="w-full rounded-full bg-white text-[#081526] hover:bg-blue-100 py-4 uppercase tracking-widest text-xs font-black transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart
                  size={17}
                />

                {addedToCart
                  ? "Bundle Added To Cart"
                  : "Add Bundle To Cart"}
              </button>
            )}

            {addedToCart && (
              <a
                href="/cart"
                className="block text-center mt-4 text-xs uppercase tracking-widest text-[#A5D8FF] hover:text-white"
              >
                View Cart →
              </a>
            )}

          </aside>

        </div>
      </section>

    </main>
  );
}