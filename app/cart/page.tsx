"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  ShieldCheck,
  PackageCheck,
  PackageOpen,
  Minus,
  Plus,
  Check,
  Sparkles,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  basePrice?: number;
  quantity: number;
  image?: string;
  path?: string;

  quantityDiscountPercent?: number;
  quantityDiscountTierId?: string | null;
  quantityDiscountTierQuantity?: number | null;

  flashSaleApplied?: boolean;
  flashSaleId?: string | null;
  flashSalePrice?: number | null;
  databaseProductId?: string | null;

  category?: string;
  size?: string;
  color?: string;

  bundleId?: string;
  bundleType?: string;
  bundleDiscountPercent?: number;
  bundleTierQuantity?: number | null;
  bundleBaseUnitPrice?: number;
  bundleDiscountedUnitPrice?: number;
};

type BundleTier = {
  quantity: number;
  discount: number;
};

type RemovedBundleItem = {
  restoreId: string;
  item: CartItem;
  quantity: number;
};

type QuantityDiscountTier = {
  id: string;
  name: string;
  quantity: number;
  discount_percent: number;
  sort_order: number;
};

type FlashSale = {
  id: string;
  product_id: string;
  sale_price: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
};

type StoreProduct = {
  id: string;
  name?: string;
  slug?: string;
  price?: number | string;
  inventory?: number | string;
  active?: boolean;
  category?: string;
  size?: string;
};

const BUNDLE_TIERS: BundleTier[] = [
  { quantity: 3, discount: 5 },
  { quantity: 5, discount: 10 },
  { quantity: 10, discount: 15 },
  { quantity: 20, discount: 20 },
];

const FREE_SHIPPING_THRESHOLD = 200;

const money = (value: number) =>
  Number.isFinite(Number(value))
    ? Number(value).toFixed(2)
    : "0.00";

const getBundleTier = (quantity: number) =>
  [...BUNDLE_TIERS]
    .filter(
      (tier) =>
        quantity >= tier.quantity
    )
    .sort(
      (a, b) =>
        b.quantity - a.quantity
    )[0] || null;

const getBasePrice = (item: CartItem) => {
  const candidates = [
    item.bundleBaseUnitPrice,
    item.basePrice,
    item.price,
  ];

  const valid = candidates.find(
    (value) =>
      Number.isFinite(
        Number(value)
      ) &&
      Number(value) >= 0
  );

  return Number(
    valid ?? 0
  );
};

const isBundleItem = (
  item: CartItem
) =>
  item.bundleType ===
    "build-your-own" &&
  Boolean(item.bundleId);

const recalculateBundlePricing = (
  items: CartItem[]
) => {
  const bundleIds =
    Array.from(
      new Set(
        items
          .filter(
            isBundleItem
          )
          .map(
            (item) =>
              item.bundleId
          )
          .filter(
            Boolean
          ) as string[]
      )
    );

  let updated = [
    ...items,
  ];

  bundleIds.forEach(
    (bundleId) => {
      const bundleQuantity =
        updated
          .filter(
            (item) =>
              item.bundleId ===
                bundleId &&
              item.bundleType ===
                "build-your-own"
          )
          .reduce(
            (
              sum,
              item
            ) =>
              sum +
              Number(
                item.quantity ||
                  0
              ),
            0
          );

      const tier =
        getBundleTier(
          bundleQuantity
        );

      const discount =
        tier?.discount || 0;

      updated =
        updated.map(
          (item) => {
            if (
              item.bundleId !==
                bundleId ||
              item.bundleType !==
                "build-your-own"
            ) {
              return item;
            }

            const basePrice =
              getBasePrice(
                item
              );

            const discountedUnitPrice =
              Number(
                (
                  basePrice *
                  (1 -
                    discount /
                      100)
                ).toFixed(
                  2
                )
              );

            return {
              ...item,

              basePrice,

              price:
                discountedUnitPrice,

              bundleDiscountPercent:
                discount,

              bundleTierQuantity:
                tier?.quantity ||
                null,

              bundleBaseUnitPrice:
                basePrice,

              bundleDiscountedUnitPrice:
                discountedUnitPrice,
            };
          }
        );
    }
  );

  return updated;
};

const normalizeText = (
  value: unknown
) =>
  String(
    value || ""
  )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );

const isQuantityDiscountEligible = (
  item: CartItem,
  product?: StoreProduct
) => {
  if (
    isBundleItem(
      item
    )
  ) {
    return false;
  }

  const category =
    normalizeText(
      product?.category ||
        item.category
    );

  const name =
    normalizeText(
      product?.name ||
        item.name
    );

  const slug =
    normalizeText(
      product?.slug ||
        item.id
    );

  const excludedCategory =
    category.includes(
      "accessor"
    ) ||
    category.includes(
      "apparel"
    ) ||
    category.includes(
      "shirt"
    ) ||
    category.includes(
      "clothing"
    ) ||
    category.includes(
      "merch"
    ) ||
    category.includes(
      "gear"
    );

  const excludedProduct =
    name.includes(
      "shirt"
    ) ||
    name.includes(
      "tee"
    ) ||
    name.includes(
      "vial-storage-case"
    ) ||
    name.includes(
      "storage-case"
    ) ||
    slug.includes(
      "apexx-shirt"
    ) ||
    slug.includes(
      "vial-storage-case"
    );

  return (
    !excludedCategory &&
    !excludedProduct
  );
};

const getQuantityDiscountTier = (
  quantity: number,
  tiers: QuantityDiscountTier[]
) =>
  [...tiers]
    .filter(
      (tier) =>
        quantity >=
        tier.quantity
    )
    .sort(
      (a, b) =>
        b.quantity -
        a.quantity
    )[0] || null;

const findStoreProductForCartItem = (
  item: CartItem,
  products: StoreProduct[]
) => {
  if (
    item.databaseProductId
  ) {
    const direct =
      products.find(
        (product) =>
          String(
            product.id
          ) ===
          String(
            item.databaseProductId
          )
      );

    if (direct) {
      return direct;
    }
  }

  const itemId =
    normalizeText(
      item.id
    );

  const itemName =
    normalizeText(
      item.name
    );

  const itemSize =
    normalizeText(
      item.size
    );

  return (
    products.find(
      (product) => {
        const productId =
          normalizeText(
            product.id
          );

        const productSlug =
          normalizeText(
            product.slug
          );

        const productName =
          normalizeText(
            product.name
          );

        const productSize =
          normalizeText(
            product.size
          );

        if (
          productId ===
            itemId ||
          productSlug ===
            itemId
        ) {
          return true;
        }

        if (
          itemName &&
          productName ===
            itemName
        ) {
          if (
            !itemSize ||
            !productSize ||
            itemSize ===
              productSize
          ) {
            return true;
          }
        }

        return false;
      }
    ) || null
  );
};

const getActiveFlashSale = (
  databaseProductId: string,
  regularPrice: number,
  sales: FlashSale[]
) => {
  const now =
    Date.now();

  return (
    sales.find(
      (sale) => {
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
          ) ===
            String(
              databaseProductId
            ) &&
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
    ) || null
  );
};

const normalizeCartItems = (
  savedCart: unknown
): CartItem[] =>
  Array.isArray(
    savedCart
  )
    ? savedCart.map(
        (
          item: CartItem
        ) => ({
          ...item,

          id: String(
            item.id || ""
          ),

          name: String(
            item.name || ""
          ),

          price: Number(
            item.price || 0
          ),

          basePrice:
            item.basePrice ===
            undefined
              ? undefined
              : Number(
                  item.basePrice
                ),

          quantity:
            Math.max(
              1,
              Number(
                item.quantity ||
                  1
              )
            ),

          flashSaleApplied:
            Boolean(
              item.flashSaleApplied
            ),

          flashSaleId:
            item.flashSaleId ||
            null,

          flashSalePrice:
            item.flashSalePrice ===
              undefined ||
            item.flashSalePrice ===
              null
              ? null
              : Number(
                  item.flashSalePrice
                ),

          databaseProductId:
            item.databaseProductId ||
            null,
        })
      )
    : [];

const fetchLivePricingData =
  async () => {
    const [
      productsResponse,
      salesResponse,
      tiersResponse,
    ] =
      await Promise.all(
        [
          fetch(
            "/api/products",
            {
              cache:
                "no-store",
            }
          ),

          fetch(
            "/api/flash-sales",
            {
              cache:
                "no-store",
            }
          ),

          fetch(
            "/api/quantity-discounts",
            {
              cache:
                "no-store",
            }
          ),
        ]
      );

    const productsData =
      await productsResponse.json();

    const salesData =
      await salesResponse
        .json()
        .catch(
          () => ({
            success:
              false,
            sales: [],
          })
        );

    const tiersData =
      await tiersResponse
        .json()
        .catch(
          () => ({
            success:
              false,
            tiers: [],
          })
        );

    if (
      !productsData.success ||
      !Array.isArray(
        productsData.products
      )
    ) {
      throw new Error(
        "Unable to load current product pricing."
      );
    }

    const products: StoreProduct[] =
      productsData.products;

    const sales: FlashSale[] =
      Array.isArray(
        salesData.sales
      )
        ? salesData.sales
        : [];

    const tiers: QuantityDiscountTier[] =
      Array.isArray(
        tiersData.tiers
      )
        ? tiersData.tiers
            .map(
              (
                tier: any
              ) => ({
                id: String(
                  tier.id
                ),

                name: String(
                  tier.name ||
                    ""
                ),

                quantity:
                  Number(
                    tier.quantity ||
                      0
                  ),

                discount_percent:
                  Number(
                    tier.discount_percent ||
                      0
                  ),

                sort_order:
                  Number(
                    tier.sort_order ||
                      0
                  ),
              })
            )
            .filter(
              (
                tier: QuantityDiscountTier
              ) =>
                tier.quantity >
                  1 &&
                Number.isFinite(
                  tier.discount_percent
                ) &&
                tier.discount_percent >=
                  0
            )
            .sort(
              (
                a: QuantityDiscountTier,
                b: QuantityDiscountTier
              ) => {
                if (
                  a.sort_order !==
                  b.sort_order
                ) {
                  return (
                    a.sort_order -
                    b.sort_order
                  );
                }

                return (
                  a.quantity -
                  b.quantity
                );
              }
            )
        : [];

    return {
      products,
      sales,
      tiers,
    };
  };

const repriceCartItems =
  async (
    items: CartItem[]
  ) => {
    const {
      products,
      sales,
      tiers,
    } =
      await fetchLivePricingData();

    const repriced =
      items.map(
        (item) => {
          const storeProduct =
            findStoreProductForCartItem(
              item,
              products
            );

          if (
            !storeProduct
          ) {
            return item;
          }

          const regularPrice =
            Number(
              storeProduct.price ??
                item.basePrice ??
                item.price
            );

          const dbId =
            String(
              storeProduct.id
            );

          if (
            !Number.isFinite(
              regularPrice
            ) ||
            regularPrice < 0
          ) {
            return item;
          }

          /*
           * BUILD YOUR OWN BUNDLE
           *
           * Never use Flash Sale
           * pricing on bundle
           * items.
           *
           * We still refresh the
           * regular Supabase base
           * price before the
           * bundle discount is
           * recalculated.
           */
          if (
            isBundleItem(
              item
            )
          ) {
            return {
              ...item,

              basePrice:
                regularPrice,

              bundleBaseUnitPrice:
                regularPrice,

              databaseProductId:
                dbId,

              category:
                storeProduct.category ||
                item.category,

              flashSaleApplied:
                false,

              flashSaleId:
                null,

              flashSalePrice:
                null,

              quantityDiscountPercent:
                0,

              quantityDiscountTierId:
                null,

              quantityDiscountTierQuantity:
                null,
            };
          }

          /*
           * FLASH SALE
           *
           * Active Flash Sale wins
           * over normal quantity
           * pricing.
           */
          const activeSale =
            getActiveFlashSale(
              dbId,
              regularPrice,
              sales
            );

          if (
            activeSale
          ) {
            const salePrice =
              Number(
                activeSale.sale_price
              );

            return {
              ...item,

              price:
                salePrice,

              basePrice:
                regularPrice,

              databaseProductId:
                dbId,

              category:
                storeProduct.category ||
                item.category,

              flashSaleApplied:
                true,

              flashSaleId:
                activeSale.id,

              flashSalePrice:
                salePrice,

              quantityDiscountPercent:
                0,

              quantityDiscountTierId:
                null,

              quantityDiscountTierQuantity:
                null,
            };
          }

          /*
           * FLASH SALE IS OVER
           *
           * Restore normal
           * quantity pricing if
           * this is an eligible
           * research vial.
           */
          if (
            isQuantityDiscountEligible(
              item,
              storeProduct
            )
          ) {
            const tier =
              getQuantityDiscountTier(
                item.quantity,
                tiers
              );

            const discountPercent =
              tier?.discount_percent ||
              0;

            const discountedUnitPrice =
              Number(
                (
                  regularPrice *
                  (1 -
                    discountPercent /
                      100)
                ).toFixed(
                  2
                )
              );

            return {
              ...item,

              price:
                discountedUnitPrice,

              basePrice:
                regularPrice,

              databaseProductId:
                dbId,

              category:
                storeProduct.category ||
                item.category,

              flashSaleApplied:
                false,

              flashSaleId:
                null,

              flashSalePrice:
                null,

              quantityDiscountPercent:
                discountPercent,

              quantityDiscountTierId:
                tier?.id ||
                null,

              quantityDiscountTierQuantity:
                tier?.quantity ||
                null,
            };
          }

          /*
           * SHIRTS / ACCESSORIES /
           * OTHER NON-VIAL ITEMS
           *
           * Restore regular price.
           */
          return {
            ...item,

            price:
              regularPrice,

            basePrice:
              regularPrice,

            databaseProductId:
              dbId,

            category:
              storeProduct.category ||
              item.category,

            flashSaleApplied:
              false,

            flashSaleId:
              null,

            flashSalePrice:
              null,

            quantityDiscountPercent:
              0,

            quantityDiscountTierId:
              null,

            quantityDiscountTierQuantity:
              null,
          };
        }
      );

    return recalculateBundlePricing(
      repriced
    );
  };

export default function CartPage() {
  const [
    cart,
    setCart,
  ] =
    useState<
      CartItem[]
    >([]);

  const [
    agreed,
    setAgreed,
  ] =
    useState(
      false
    );

  const [
    removedBundleItems,
    setRemovedBundleItems,
  ] = useState<
    RemovedBundleItem[]
  >([]);

  const persistCart = (
    updatedCart: CartItem[]
  ) => {
    setCart(
      updatedCart
    );

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
  };

  const refreshCartPricing =
    async (
      sourceCart?: CartItem[]
    ) => {
      try {
        const rawCart =
          sourceCart ??
          normalizeCartItems(
            JSON.parse(
              localStorage.getItem(
                "cart"
              ) ||
                "[]"
            )
          );

        const normalized =
          normalizeCartItems(
            rawCart
          );

        if (
          normalized.length ===
          0
        ) {
          persistCart(
            []
          );

          return;
        }

        const repriced =
          await repriceCartItems(
            normalized
          );

        persistCart(
          repriced
        );
      } catch (
        error
      ) {
        console.error(
          "Unable to refresh cart pricing:",
          error
        );

        if (
          sourceCart
        ) {
          const fallback =
            recalculateBundlePricing(
              normalizeCartItems(
                sourceCart
              )
            );

          persistCart(
            fallback
          );

          return;
        }

        try {
          const savedCart =
            normalizeCartItems(
              JSON.parse(
                localStorage.getItem(
                  "cart"
                ) ||
                  "[]"
              )
            );

          setCart(
            recalculateBundlePricing(
              savedCart
            )
          );
        } catch {
          setCart(
            []
          );
        }
      }
    };

  useEffect(
    () => {
      /*
       * Revalidate immediately
       * when the cart opens.
       */
      void refreshCartPricing();

      /*
       * Revalidate every
       * 30 seconds so expired
       * sales automatically
       * disappear.
       */
      const interval =
        window.setInterval(
          () => {
            void refreshCartPricing();
          },
          30_000
        );

      /*
       * Revalidate immediately
       * when the customer returns
       * to the browser window.
       */
      const handleFocus =
        () => {
          void refreshCartPricing();
        };

      /*
       * Revalidate when the tab
       * becomes visible again.
       */
      const handleVisibilityChange =
        () => {
          if (
            document.visibilityState ===
            "visible"
          ) {
            void refreshCartPricing();
          }
        };

      window.addEventListener(
        "focus",
        handleFocus
      );

      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      return () => {
        window.clearInterval(
          interval
        );

        window.removeEventListener(
          "focus",
          handleFocus
        );

        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    },
    []
  );

  const saveCart = (
    updatedCart: CartItem[]
  ) => {
    /*
     * Immediately update the UI,
     * then revalidate live pricing.
     *
     * This means changing qty from
     * 2 -> 3 or 4 -> 5 immediately
     * triggers the correct Admin
     * quantity tier.
     */
    const recalculated =
      recalculateBundlePricing(
        normalizeCartItems(
          updatedCart
        )
      );

    persistCart(
      recalculated
    );

    void refreshCartPricing(
      recalculated
    );
  };

  const rememberRemovedBundleItem = (
    item: CartItem,
    quantity: number
  ) => {
    if (
      !isBundleItem(
        item
      ) ||
      !item.bundleId ||
      quantity <= 0
    ) {
      return;
    }

    const restoreId =
      `${item.bundleId}-${item.id}-${Date.now()}-${Math.random()}`;

    setRemovedBundleItems(
      (
        current
      ) => [
        {
          restoreId,

          item: {
            ...item,
            quantity,
          },

          quantity,
        },

        ...current,
      ]
    );
  };

  const updateLineQuantity = (
    index: number,
    direction:
      | "increase"
      | "decrease"
  ) => {
    const target =
      cart[index];

    if (!target) {
      return;
    }

    if (
      direction ===
        "decrease" &&
      isBundleItem(
        target
      )
    ) {
      rememberRemovedBundleItem(
        target,
        1
      );
    }

    const updated =
      cart
        .map(
          (
            item,
            itemIndex
          ) => {
            if (
              itemIndex !==
              index
            ) {
              return item;
            }

            const nextQuantity =
              direction ===
              "increase"
                ? item.quantity +
                  1
                : item.quantity -
                  1;

            return {
              ...item,

              quantity:
                nextQuantity,
            };
          }
        )
        .filter(
          (item) =>
            item.quantity >
            0
        );

    saveCart(
      updated
    );
  };

  const removeLine = (
    index: number
  ) => {
    const target =
      cart[index];

    if (
      target &&
      isBundleItem(
        target
      )
    ) {
      rememberRemovedBundleItem(
        target,
        target.quantity
      );
    }

    saveCart(
      cart.filter(
        (
          _,
          itemIndex
        ) =>
          itemIndex !==
          index
      )
    );
  };

  const addRemovedBundleItemBack = (
    restoreId: string
  ) => {
    const removed =
      removedBundleItems.find(
        (entry) =>
          entry.restoreId ===
          restoreId
      );

    if (
      !removed
    ) {
      return;
    }

    const restoredItem =
      removed.item;

    const existingIndex =
      cart.findIndex(
        (item) =>
          item.bundleId ===
            restoredItem.bundleId &&
          item.bundleType ===
            "build-your-own" &&
          item.id ===
            restoredItem.id
      );

    let updatedCart: CartItem[];

    if (
      existingIndex >=
      0
    ) {
      updatedCart =
        cart.map(
          (
            item,
            index
          ) =>
            index ===
            existingIndex
              ? {
                  ...item,

                  quantity:
                    item.quantity +
                    removed.quantity,
                }
              : item
        );
    } else {
      updatedCart = [
        ...cart,

        {
          ...restoredItem,

          quantity:
            removed.quantity,
        },
      ];
    }

    setRemovedBundleItems(
      (
        current
      ) =>
        current.filter(
          (entry) =>
            entry.restoreId !==
            restoreId
        )
    );

    saveCart(
      updatedCart
    );
  };

  const dismissRemovedBundleItem = (
    restoreId: string
  ) => {
    setRemovedBundleItems(
      (
        current
      ) =>
        current.filter(
          (entry) =>
            entry.restoreId !==
            restoreId
        )
    );
  };

  const removeBundle = (
    bundleId: string
  ) => {
    saveCart(
      cart.filter(
        (item) =>
          !(
            item.bundleId ===
              bundleId &&
            item.bundleType ===
              "build-your-own"
          )
      )
    );

    setRemovedBundleItems(
      (
        current
      ) =>
        current.filter(
          (entry) =>
            entry.item.bundleId !==
            bundleId
        )
    );
  };

  const subtotal =
    useMemo(
      () =>
        cart.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.price ||
                0
            ) *
              Number(
                item.quantity ||
                  0
              ),
          0
        ),
      [
        cart,
      ]
    );

  const amountLeftForFreeShipping =
    Math.max(
      0,
      FREE_SHIPPING_THRESHOLD -
        subtotal
    );

  const qualifiesForFreeShipping =
    subtotal >=
    FREE_SHIPPING_THRESHOLD;

  const totalItems =
    useMemo(
      () =>
        cart.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.quantity ||
                0
            ),
          0
        ),
      [
        cart,
      ]
    );

  const bundleGroups =
    useMemo(
      () => {
        const groups =
          new Map<
            string,
            {
              bundleId: string;

              items: Array<{
                item: CartItem;
                index: number;
              }>;
            }
          >();

        cart.forEach(
          (
            item,
            index
          ) => {
            if (
              !isBundleItem(
                item
              ) ||
              !item.bundleId
            ) {
              return;
            }

            const existing =
              groups.get(
                item.bundleId
              );

            if (
              existing
            ) {
              existing.items.push(
                {
                  item,
                  index,
                }
              );
            } else {
              groups.set(
                item.bundleId,
                {
                  bundleId:
                    item.bundleId,

                  items: [
                    {
                      item,
                      index,
                    },
                  ],
                }
              );
            }
          }
        );

        return Array.from(
          groups.values()
        );
      },
      [
        cart,
      ]
    );

  const regularItems =
    useMemo(
      () =>
        cart
          .map(
            (
              item,
              index
            ) => ({
              item,
              index,
            })
          )
          .filter(
            ({
              item,
            }) =>
              !isBundleItem(
                item
              )
          ),
      [
        cart,
      ]
    );

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      <section className="relative px-5 md:px-10 py-14 md:py-20 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">

          <p className="uppercase tracking-[0.32em] text-[#A5D8FF] text-[10px] md:text-xs mb-4">
            Secure Cart
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-9">

            <div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.96] tracking-[-0.035em] mb-4">
                Review Your Cart
              </h1>

              <p className="text-white/55 text-sm md:text-base leading-7 max-w-2xl">
                Confirm your research materials, review documentation
                terms, and proceed to checkout securely.
              </p>

            </div>

            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-5 py-2.5 text-white/60 w-fit">

              <ShoppingCart
                size={17}
                className="text-[#A5D8FF]"
              />

              <span className="text-[10px] uppercase tracking-[0.18em]">
                {totalItems} Item
                {totalItems ===
                1
                  ? ""
                  : "s"}
              </span>

            </div>

          </div>

          {cart.length ===
          0 ? (

            <div className="rounded-[26px] border border-white/[0.08] bg-white/[0.03] p-10 text-center">

              <ShoppingCart
                size={40}
                className="mx-auto text-[#A5D8FF] mb-5"
              />

              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                Your cart is empty.
              </h2>

              <p className="text-white/45 text-sm mb-7">
                Add research materials to your cart to continue.
              </p>

              <Link
                href="/products"
                className="inline-flex bg-white text-[#081526] px-7 py-3.5 rounded-full text-[10px] uppercase tracking-[0.16em] font-black hover:bg-[#DCEEFF] transition-all"
              >
                Shop Products
              </Link>

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_370px] gap-7 items-start">

              <div className="space-y-5">

                {/* BUILD YOUR OWN BUNDLES */}
                {bundleGroups.map(
                  (
                    group
                  ) => {
                    const bundleQuantity =
                      group.items.reduce(
                        (
                          sum,
                          {
                            item,
                          }
                        ) =>
                          sum +
                          item.quantity,
                        0
                      );

                    const tier =
                      getBundleTier(
                        bundleQuantity
                      );

                    const discount =
                      tier?.discount ||
                      0;

                    const bundleBaseSubtotal =
                      group.items.reduce(
                        (
                          sum,
                          {
                            item,
                          }
                        ) =>
                          sum +
                          getBasePrice(
                            item
                          ) *
                            item.quantity,
                        0
                      );

                    const bundleSubtotal =
                      group.items.reduce(
                        (
                          sum,
                          {
                            item,
                          }
                        ) =>
                          sum +
                          item.price *
                            item.quantity,
                        0
                      );

                    const bundleSavings =
                      bundleBaseSubtotal -
                      bundleSubtotal;

                    const nextTier =
                      BUNDLE_TIERS.find(
                        (
                          bundleTier
                        ) =>
                          bundleQuantity <
                          bundleTier.quantity
                      ) ||
                      null;

                    return (
                      <section
                        key={
                          group.bundleId
                        }
                        className="overflow-hidden rounded-[26px] border border-[#93C5FD]/25 bg-[#0C1B2E]"
                      >

                        <div className="border-b border-white/[0.07] bg-[#93C5FD]/[0.06] px-5 md:px-6 py-5">

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                            <div className="flex items-start gap-3">

                              <div className="w-10 h-10 rounded-[14px] bg-[#93C5FD]/10 flex items-center justify-center shrink-0">

                                <PackageOpen
                                  size={19}
                                  className="text-[#A5D8FF]"
                                />

                              </div>

                              <div>

                                <p className="text-[9px] uppercase tracking-[0.24em] text-[#A5D8FF]">
                                  Build Your Own Bundle
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-2">

                                  <h2 className="text-xl font-black">
                                    {bundleQuantity}{" "}
                                    {bundleQuantity ===
                                    1
                                      ? "Vial"
                                      : "Vials"}
                                  </h2>

                                  {discount >
                                    0 && (

                                    <span className="rounded-full bg-[#93C5FD]/10 px-2.5 py-1 text-[9px] font-black text-[#A5D8FF]">
                                      {discount}% OFF
                                    </span>

                                  )}

                                </div>

                              </div>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeBundle(
                                  group.bundleId
                                )
                              }
                              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-white/30 hover:text-red-300 transition"
                            >

                              <Trash2
                                size={13}
                              />

                              Remove Bundle

                            </button>

                          </div>

                          {bundleQuantity <
                          3 ? (

                            <div className="mt-4 rounded-[14px] border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-[11px] leading-5 text-amber-100/75">
                              This bundle now has fewer than 3 vials and
                              no longer qualifies for bundle pricing. Add
                              more vials from the bundle builder or remove
                              the bundle before checkout.
                            </div>

                          ) : nextTier ? (

                            <div className="mt-4 flex items-center gap-2 text-[10px] text-white/40">

                              <Sparkles
                                size={13}
                                className="text-[#A5D8FF]"
                              />

                              Add{" "}

                              <span className="font-bold text-white/70">
                                {nextTier.quantity -
                                  bundleQuantity}{" "}
                                more
                              </span>{" "}

                              to unlock{" "}

                              <span className="font-bold text-[#A5D8FF]">
                                {nextTier.discount}% off
                              </span>

                            </div>

                          ) : (

                            <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-[#A5D8FF]">

                              <Check
                                size={13}
                              />

                              Maximum bundle savings unlocked.

                            </div>

                          )}

                        </div>

                        <div className="divide-y divide-white/[0.06]">

                          {group.items.map(
                            ({
                              item,
                              index,
                            }) => (

                              <div
                                key={`${group.bundleId}-${item.id}-${index}`}
                                className="p-4 md:p-5"
                              >

                                <div className="grid grid-cols-[68px_minmax(0,1fr)] sm:grid-cols-[72px_minmax(0,1fr)_auto] gap-4 items-center">

                                  <div className="w-[68px] h-[68px] sm:w-[72px] sm:h-[72px] rounded-[16px] overflow-hidden bg-[#93C5FD]">

                                    <img
                                      src={
                                        item.image ||
                                        "/images/logo.png"
                                      }
                                      alt={
                                        item.name
                                      }
                                      className="w-full h-full object-contain p-1.5"
                                    />

                                  </div>

                                  <div className="min-w-0">

                                    <p className="font-bold text-sm md:text-[15px] leading-snug">
                                      {item.name}
                                    </p>

                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">

                                      {discount >
                                        0 &&
                                      getBasePrice(
                                        item
                                      ) >
                                        item.price ? (

                                        <>

                                          <span className="text-[11px] text-white/25 line-through">
                                            $
                                            {money(
                                              getBasePrice(
                                                item
                                              )
                                            )}
                                          </span>

                                          <span className="text-xs font-semibold text-[#C9E2FF]">
                                            $
                                            {money(
                                              item.price
                                            )}{" "}
                                            each
                                          </span>

                                        </>

                                      ) : (

                                        <span className="text-xs text-white/45">
                                          $
                                          {money(
                                            item.price
                                          )}{" "}
                                          each
                                        </span>

                                      )}

                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeLine(
                                          index
                                        )
                                      }
                                      className="mt-2 text-[9px] uppercase tracking-[0.12em] text-white/25 hover:text-red-300"
                                    >
                                      Remove
                                    </button>

                                  </div>

                                  <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:flex-col sm:items-end gap-3">

                                    <div className="flex items-center rounded-full border border-white/[0.09] bg-[#071321] p-1">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateLineQuantity(
                                            index,
                                            "decrease"
                                          )
                                        }
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/55 hover:bg-white/[0.07] hover:text-white"
                                        aria-label={`Decrease ${item.name}`}
                                      >

                                        <Minus
                                          size={13}
                                        />

                                      </button>

                                      <span className="w-8 text-center text-xs font-black">
                                        {item.quantity}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateLineQuantity(
                                            index,
                                            "increase"
                                          )
                                        }
                                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-[#081526] hover:bg-[#DCEEFF]"
                                        aria-label={`Increase ${item.name}`}
                                      >

                                        <Plus
                                          size={13}
                                        />

                                      </button>

                                    </div>

                                    <p className="text-base font-black text-[#A5D8FF]">
                                      $
                                      {money(
                                        item.price *
                                          item.quantity
                                      )}
                                    </p>

                                  </div>

                                </div>

                              </div>

                            )
                          )}

                        </div>

                        {removedBundleItems.filter(
                          (
                            entry
                          ) =>
                            entry.item.bundleId ===
                            group.bundleId
                        ).length >
                          0 && (

                          <div className="border-t border-white/[0.07] px-4 md:px-5 py-4 bg-[#93C5FD]/[0.035]">

                            <p className="mb-2.5 text-[9px] uppercase tracking-[0.18em] text-white/30">
                              Recently Removed
                            </p>

                            <div className="space-y-2">

                              {removedBundleItems
                                .filter(
                                  (
                                    entry
                                  ) =>
                                    entry.item.bundleId ===
                                    group.bundleId
                                )
                                .map(
                                  (
                                    entry
                                  ) => (

                                    <div
                                      key={
                                        entry.restoreId
                                      }
                                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-[15px] border border-[#93C5FD]/15 bg-[#081526]/55 px-3.5 py-3"
                                    >

                                      <div className="flex items-center gap-3 min-w-0">

                                        <div className="w-10 h-10 shrink-0 overflow-hidden rounded-xl bg-[#93C5FD]">

                                          <img
                                            src={
                                              entry.item.image ||
                                              "/images/logo.png"
                                            }
                                            alt={
                                              entry.item.name
                                            }
                                            className="w-full h-full object-contain p-1"
                                          />

                                        </div>

                                        <div className="min-w-0">

                                          <p className="truncate text-xs font-bold text-white/80">
                                            {entry.item.name}
                                          </p>

                                          <p className="mt-0.5 text-[10px] text-white/35">
                                            {entry.quantity}{" "}
                                            {entry.quantity ===
                                            1
                                              ? "vial"
                                              : "vials"}{" "}
                                            removed
                                          </p>

                                        </div>

                                      </div>

                                      <div className="flex items-center gap-2 self-end sm:self-auto">

                                        <button
                                          type="button"
                                          onClick={() =>
                                            dismissRemovedBundleItem(
                                              entry.restoreId
                                            )
                                          }
                                          className="px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-white/25 hover:text-white/50"
                                        >
                                          Dismiss
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            addRemovedBundleItemBack(
                                              entry.restoreId
                                            )
                                          }
                                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.13em] text-[#081526] hover:bg-[#DCEEFF] transition"
                                        >

                                          <Plus
                                            size={12}
                                          />

                                          Add Back

                                        </button>

                                      </div>

                                    </div>

                                  )
                                )}

                            </div>

                          </div>

                        )}

                        <div className="border-t border-white/[0.07] px-5 md:px-6 py-4 bg-white/[0.018]">

                          <div className="flex flex-wrap items-center justify-between gap-3">

                            <div className="text-[10px] text-white/35">

                              {discount >
                                0 && (

                                <>

                                  Bundle savings{" "}

                                  <span className="font-bold text-[#A5D8FF]">
                                    -$
                                    {money(
                                      bundleSavings
                                    )}
                                  </span>

                                </>

                              )}

                            </div>

                            <div className="text-right">

                              <p className="text-[9px] uppercase tracking-[0.16em] text-white/30">
                                Bundle Total
                              </p>

                              <p className="mt-0.5 text-xl font-black">
                                $
                                {money(
                                  bundleSubtotal
                                )}
                              </p>

                            </div>

                          </div>

                        </div>

                      </section>
                    );
                  }
                )}

                {/* REGULAR CART ITEMS */}
                {regularItems.length >
                  0 && (

                  <section className="rounded-[26px] border border-white/[0.08] bg-white/[0.03] p-4 md:p-5">

                    {bundleGroups.length >
                      0 && (

                      <div className="px-1 pb-4">

                        <p className="text-[9px] uppercase tracking-[0.24em] text-white/35">
                          Other Cart Items
                        </p>

                      </div>

                    )}

                    <div className="space-y-3">

                      {regularItems.map(
                        ({
                          item,
                          index,
                        }) => (

                          <div
                            key={`regular-${item.id}-${index}`}
                            className="rounded-[20px] border border-white/[0.07] bg-[#081526]/50 p-4"
                          >

                            <div className="grid grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[82px_minmax(0,1fr)_auto] gap-4 items-center">

                              <div className="w-[72px] h-[72px] sm:w-[82px] sm:h-[82px] rounded-[16px] overflow-hidden bg-[#93C5FD]">

                                <img
                                  src={
                                    item.image ||
                                    "/images/logo.png"
                                  }
                                  alt={
                                    item.name
                                  }
                                  className="w-full h-full object-contain p-1.5"
                                />

                              </div>

                              <div className="min-w-0">

                                <p className="font-bold text-sm md:text-[15px]">
                                  {item.name}
                                </p>

                                <div className="mt-1.5 flex flex-wrap items-center gap-2">

                                  {item.flashSaleApplied &&
                                  Number(
                                    item.basePrice ||
                                      0
                                  ) >
                                    Number(
                                      item.price ||
                                        0
                                    ) ? (

                                    <>

                                      <span className="text-[11px] text-white/25 line-through">
                                        $
                                        {money(
                                          item.basePrice ||
                                            0
                                        )}
                                      </span>

                                      <span className="text-xs font-semibold text-[#C9E2FF]">
                                        $
                                        {money(
                                          item.price
                                        )}{" "}
                                        each
                                      </span>

                                      <span className="rounded-full border border-blue-300/20 bg-blue-400/[0.08] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#A5D8FF]">
                                        Flash Sale
                                      </span>

                                    </>

                                  ) : (

                                    <span className="text-xs text-white/45">
                                      $
                                      {money(
                                        item.price
                                      )}{" "}
                                      each
                                    </span>

                                  )}

                                </div>

                                {Number(
                                  item.quantityDiscountPercent ||
                                    0
                                ) >
                                  0 && (

                                  <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#A5D8FF]">
                                    Save{" "}
                                    {
                                      item.quantityDiscountPercent
                                    }
                                    % with quantity pricing
                                  </p>

                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeLine(
                                      index
                                    )
                                  }
                                  className="mt-2 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-white/25 hover:text-red-300"
                                >

                                  <Trash2
                                    size={11}
                                  />

                                  Remove

                                </button>

                              </div>

                              <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:flex-col sm:items-end gap-3">

                                <div className="flex items-center rounded-full border border-white/[0.09] bg-[#071321] p-1">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateLineQuantity(
                                        index,
                                        "decrease"
                                      )
                                    }
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/55 hover:bg-white/[0.07]"
                                    aria-label={`Decrease ${item.name}`}
                                  >

                                    <Minus
                                      size={13}
                                    />

                                  </button>

                                  <span className="w-8 text-center text-xs font-black">
                                    {item.quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateLineQuantity(
                                        index,
                                        "increase"
                                      )
                                    }
                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-[#081526] hover:bg-[#DCEEFF]"
                                    aria-label={`Increase ${item.name}`}
                                  >

                                    <Plus
                                      size={13}
                                    />

                                  </button>

                                </div>

                                <p className="text-base font-black text-[#A5D8FF]">
                                  $
                                  {money(
                                    item.price *
                                      item.quantity
                                  )}
                                </p>

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </section>

                )}

              </div>

              {/* ORDER SUMMARY */}
              <aside className="lg:sticky lg:top-24 space-y-5">

                <div className="rounded-[26px] border border-white/[0.08] bg-[#0C1B2E] p-5 md:p-6">

                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#A5D8FF]">
                    Order Summary
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-white">
                    Your Order
                  </h2>

                  <div className="mt-6 space-y-3 text-xs text-white/45">

                    <div className="flex justify-between border-b border-white/[0.07] pb-3">

                      <span>
                        Items
                      </span>

                      <span className="text-white/70">
                        {
                          totalItems
                        }
                      </span>

                    </div>

                    <div className="flex justify-between border-b border-white/[0.07] pb-3">

                      <span>
                        Subtotal
                      </span>

                      <span className="text-white/70">
                        $
                        {money(
                          subtotal
                        )}
                      </span>

                    </div>

                    <div className="flex justify-between border-b border-white/[0.07] pb-3">

                      <span>
                        Shipping
                      </span>

                      <span
                        className={
                          qualifiesForFreeShipping
                            ? "text-green-300 font-semibold"
                            : "text-white/50"
                        }
                      >

                        {qualifiesForFreeShipping
                          ? "Free"
                          : "Calculated at checkout"}

                      </span>

                    </div>

                    {qualifiesForFreeShipping ? (

                      <div className="rounded-[14px] border border-green-400/20 bg-green-400/[0.07] px-4 py-3 text-[11px] text-green-200">
                        You qualify for free shipping.
                      </div>

                    ) : (

                      <div className="rounded-[14px] border border-[#93C5FD]/20 bg-[#93C5FD]/[0.07] px-4 py-3 text-[11px] text-blue-100">
                        You are $
                        {money(
                          amountLeftForFreeShipping
                        )}{" "}
                        away from free shipping.
                      </div>

                    )}

                  </div>

                  <div className="my-5 h-px bg-white/[0.07]" />

                  <div className="flex items-end justify-between gap-3 mb-6">

                    <div>

                      <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                        Cart Total
                      </p>

                      <p className="mt-1 text-3xl font-black">
                        $
                        {money(
                          subtotal
                        )}
                      </p>

                    </div>

                  </div>

                  <Link
                    href="/checkout"
                    className={`block w-full py-3.5 rounded-full uppercase tracking-[0.16em] text-[10px] font-black text-center transition-all ${
                      agreed
                        ? "bg-white text-[#081526] hover:bg-[#DCEEFF]"
                        : "bg-white/[0.06] text-white/25 pointer-events-none"
                    }`}
                  >
                    Proceed To Checkout
                  </Link>

                  {!agreed && (

                    <p className="text-white/30 text-[10px] text-center mt-3">
                      Confirm the research-use terms before checkout.
                    </p>

                  )}

                </div>

                {/* DISCLAIMER */}
                <div className="rounded-[26px] border border-white/[0.08] bg-white/[0.03] p-5 md:p-6">

                  <div className="flex items-center gap-2.5 mb-3">

                    <ShieldCheck
                      className="text-[#A5D8FF]"
                      size={20}
                    />

                    <h3 className="text-lg font-black text-white">
                      Research Use Disclaimer
                    </h3>

                  </div>

                  <p className="text-white/50 text-xs leading-6 mb-4">
                    By placing an order, you acknowledge that all
                    products sold by Apexx Biolabs are intended strictly
                    for lawful laboratory research use only and are not
                    intended for human consumption, medical use,
                    veterinary use, diagnosis, treatment, cure, or
                    prevention of disease.
                  </p>

                  <label className="flex items-start gap-3 cursor-pointer rounded-[16px] border border-white/[0.08] bg-[#081526]/50 p-4">

                    <input
                      type="checkbox"
                      checked={
                        agreed
                      }
                      onChange={(
                        e
                      ) =>
                        setAgreed(
                          e.target.checked
                        )
                      }
                      className="mt-1"
                    />

                    <span className="text-xs text-white/60 leading-5">
                      I certify that I am at least 21 years old and
                      understand these products are purchased solely
                      for lawful research purposes.
                    </span>

                  </label>

                </div>

                <div className="flex items-center gap-3 rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-4">

                  <PackageCheck
                    className="text-[#A5D8FF]"
                    size={20}
                  />

                  <div>

                    <p className="text-sm text-white font-bold">
                      Quality Documentation
                    </p>

                    <p className="text-white/40 text-xs">
                      COAs available for verified batches.
                    </p>

                  </div>

                </div>

                <Link
                  href="/products"
                  className="block border border-white/[0.09] bg-white/[0.025] text-white rounded-full px-7 py-3.5 text-[10px] uppercase tracking-[0.16em] font-bold text-center hover:border-[#93C5FD]/40 hover:bg-white/[0.05] transition-all"
                >
                  Continue Shopping
                </Link>

              </aside>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}