"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  FlaskConical,
  Shirt,
  Archive,
  BadgePercent,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  size: string | null;
  price: number;
  inventory: number;
  active: boolean;
};

type QuantityDiscountTier = {
  id: string;
  name: string;
  quantity: number;
  discount_percent: number;
  active: boolean;
  sort_order: number;
};

type ProductGroup =
  | "peptides"
  | "shirts"
  | "vialCases";

export default function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [
    quantityDiscounts,
    setQuantityDiscounts,
  ] = useState<
    QuantityDiscountTier[]
  >([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    discountLoading,
    setDiscountLoading,
  ] = useState(true);

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [
    savingDiscountId,
    setSavingDiscountId,
  ] = useState<string | null>(
    null
  );

  const [
    statusMessage,
    setStatusMessage,
  ] = useState("");

  const getStatus = (
    inventory: number
  ) => {
    if (inventory <= 0) {
      return "Out of Stock";
    }

    if (inventory <= 5) {
      return "Low Stock";
    }

    return "In Stock";
  };

  const getProductGroup = (
    product: Product
  ): ProductGroup => {
    const slug = (
      product.slug || ""
    ).toLowerCase();

    const name = (
      product.name || ""
    ).toLowerCase();

    if (
      slug.startsWith(
        "apexx-shirt-"
      ) ||
      name.includes(
        "signature tee"
      ) ||
      name.includes("shirt")
    ) {
      return "shirts";
    }

    if (
      slug ===
        "vial-storage-case" ||
      name.includes(
        "vial storage case"
      )
    ) {
      return "vialCases";
    }

    return "peptides";
  };

  const fetchProducts =
    async () => {
      setLoading(true);
      setStatusMessage("");

      try {
        const response =
          await fetch(
            "/api/products",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          setStatusMessage(
            `❌ ${
              data.error ||
              "Failed to load products."
            }`
          );

          return;
        }

        setProducts(
          data.products || []
        );
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setStatusMessage(
          "❌ Something went wrong loading products."
        );
      } finally {
        setLoading(false);
      }
    };

  const fetchQuantityDiscounts =
    async () => {
      setDiscountLoading(true);

      try {
        const response =
          await fetch(
            "/api/admin/quantity-discounts",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          setStatusMessage(
            `❌ ${
              data.error ||
              "Failed to load quantity discounts."
            }`
          );

          return;
        }

        const tiers = (
          data.tiers || []
        ).map(
          (tier: any) => ({
            id: String(
              tier.id
            ),

            name: String(
              tier.name || ""
            ),

            quantity: Number(
              tier.quantity ||
                0
            ),

            discount_percent:
              Number(
                tier.discount_percent ||
                  0
              ),

            active:
              tier.active !==
              false,

            sort_order:
              Number(
                tier.sort_order ||
                  0
              ),
          })
        );

        setQuantityDiscounts(
          tiers
        );
      } catch (error) {
        console.error(
          "Failed to load quantity discounts:",
          error
        );

        setStatusMessage(
          "❌ Something went wrong loading quantity discounts."
        );
      } finally {
        setDiscountLoading(
          false
        );
      }
    };

  const refreshAll =
    async () => {
      setStatusMessage("");

      await Promise.all([
        fetchProducts(),
        fetchQuantityDiscounts(),
      ]);
    };

  useEffect(() => {
    fetchProducts();
    fetchQuantityDiscounts();
  }, []);

  const updateLocalInventory = (
    id: string,
    inventory: number
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              inventory,
            }
          : product
      )
    );
  };

  const updateLocalPrice = (
    id: string,
    price: number
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              price,
            }
          : product
      )
    );
  };

  const updateLocalDiscountTier =
    (
      id: string,
      field:
        keyof QuantityDiscountTier,
      value:
        | string
        | number
        | boolean
    ) => {
      setQuantityDiscounts(
        (prev) =>
          prev.map((tier) =>
            tier.id === id
              ? {
                  ...tier,
                  [field]:
                    value,
                }
              : tier
          )
      );
    };

  const saveInventory = async (
    id: string,
    inventory: number,
    price: number
  ) => {
    setSavingId(id);
    setStatusMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/products/update-inventory",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            cache:
              "no-store",

            body: JSON.stringify(
              {
                id,
                inventory:
                  Number(
                    inventory
                  ),

                price:
                  Number(price),
              }
            ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setStatusMessage(
          `❌ ${
            data.error ||
            "Product update failed."
          }`
        );

        return;
      }

      setStatusMessage(
        "✓ Product updated successfully."
      );

      await fetchProducts();
    } catch (error) {
      console.error(
        "Product save error:",
        error
      );

      setStatusMessage(
        "❌ Something went wrong saving product."
      );
    } finally {
      setSavingId(null);
    }
  };

  const saveQuantityDiscount =
    async (
      tier: QuantityDiscountTier
    ) => {
      setSavingDiscountId(
        tier.id
      );

      setStatusMessage("");

      try {
        const quantity =
          Number(
            tier.quantity
          );

        const discountPercent =
          Number(
            tier.discount_percent
          );

        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity <= 1
        ) {
          setStatusMessage(
            "❌ Quantity must be a whole number greater than 1."
          );

          return;
        }

        if (
          !Number.isFinite(
            discountPercent
          ) ||
          discountPercent <
            0 ||
          discountPercent >
            100
        ) {
          setStatusMessage(
            "❌ Discount must be between 0% and 100%."
          );

          return;
        }

        const payload = {
          id: tier.id,

          name: `${quantity} Vials`,

          quantity,

          discount_percent:
            discountPercent,

          active:
            tier.active ===
            true,

          sort_order:
            Number(
              tier.sort_order ||
                0
            ),
        };

        console.log(
          "Saving quantity discount:",
          payload
        );

        const response =
          await fetch(
            "/api/admin/quantity-discounts",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              cache:
                "no-store",

              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        const data =
          await response.json();

        console.log(
          "Quantity discount save response:",
          data
        );

        if (
          !response.ok ||
          !data.success
        ) {
          setStatusMessage(
            `❌ ${
              data.error ||
              "Quantity discount update failed."
            }`
          );

          return;
        }

        /*
         * IMPORTANT:
         * Reload the tiers from
         * the database after
         * saving so the Admin
         * page shows what
         * Supabase actually
         * contains.
         */
        await fetchQuantityDiscounts();

        setStatusMessage(
          `✓ Saved: ${quantity} vials = ${discountPercent}% off`
        );
      } catch (error) {
        console.error(
          "Quantity discount save error:",
          error
        );

        setStatusMessage(
          "❌ Something went wrong saving quantity discount."
        );
      } finally {
        setSavingDiscountId(
          null
        );
      }
    };

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .toLowerCase()
          .trim();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          `${product.name} ${product.slug} ${
            product.size ||
            ""
          }`
            .toLowerCase()
            .includes(
              query
            )
      );
    }, [
      products,
      search,
    ]);

  const peptideProducts =
    filteredProducts.filter(
      (product) =>
        getProductGroup(
          product
        ) === "peptides"
    );

  const sizeOrder: Record<
    string,
    number
  > = {
    S: 0,
    M: 1,
    L: 2,
    XL: 3,
  };

  const shirtProducts =
    filteredProducts
      .filter(
        (product) =>
          getProductGroup(
            product
          ) === "shirts"
      )
      .sort((a, b) => {
        const getColor = (
          product: Product
        ) => {
          const slug = (
            product.slug ||
            ""
          ).toLowerCase();

          if (
            slug.includes(
              "-blue-"
            )
          ) {
            return "Blue";
          }

          if (
            slug.includes(
              "-ivory-"
            )
          ) {
            return "Ivory";
          }

          if (
            slug.includes(
              "-olive-"
            )
          ) {
            return "Olive";
          }

          return product.name;
        };

        const colorCompare =
          getColor(
            a
          ).localeCompare(
            getColor(b)
          );

        if (
          colorCompare !==
          0
        ) {
          return colorCompare;
        }

        return (
          (sizeOrder[
            (
              a.size || ""
            ).toUpperCase()
          ] ?? 99) -
          (sizeOrder[
            (
              b.size || ""
            ).toUpperCase()
          ] ?? 99)
        );
      });

  const vialCaseProducts =
    filteredProducts.filter(
      (product) =>
        getProductGroup(
          product
        ) === "vialCases"
    );

  const totalInventory =
    products.reduce(
      (sum, product) =>
        sum +
        Number(
          product.inventory ||
            0
        ),
      0
    );

  const lowStockCount =
    products.filter(
      (product) =>
        product.inventory >
          0 &&
        product.inventory <=
          5
    ).length;

  const outOfStockCount =
    products.filter(
      (product) =>
        product.inventory <=
        0
    ).length;

  const renderProductTable = (
    sectionProducts: Product[]
  ) => {
    if (
      sectionProducts.length ===
      0
    ) {
      return (
        <div className="py-10 text-center text-white/40">
          No products found
          in this section.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-4 text-white/50 text-xs uppercase tracking-widest">
                Product
              </th>

              <th className="pb-4 text-white/50 text-xs uppercase tracking-widest">
                Size
              </th>

              <th className="pb-4 text-white/50 text-xs uppercase tracking-widest">
                Price
              </th>

              <th className="pb-4 text-white/50 text-xs uppercase tracking-widest">
                Inventory
              </th>

              <th className="pb-4 text-white/50 text-xs uppercase tracking-widest">
                Status
              </th>

              <th className="pb-4 text-white/50 text-xs uppercase tracking-widest text-right">
                Save
              </th>
            </tr>
          </thead>

          <tbody>
            {sectionProducts.map(
              (product) => {
                const stockStatus =
                  getStatus(
                    product.inventory
                  );

                return (
                  <tr
                    key={
                      product.id
                    }
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                  >
                    <td className="py-5">
                      <p className="font-bold text-white">
                        {
                          product.name
                        }
                      </p>

                      <p className="text-white/40 text-sm">
                        {
                          product.slug
                        }
                      </p>
                    </td>

                    <td className="py-5 text-white/80">
                      {product.size ||
                        "—"}
                    </td>

                    <td className="py-5">
                      <div className="relative w-28">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                          $
                        </span>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            product.price
                          }
                          onChange={(
                            e
                          ) =>
                            updateLocalPrice(
                              product.id,

                              Math.max(
                                0,

                                Number(
                                  e
                                    .target
                                    .value
                                )
                              )
                            )
                          }
                          className="w-full rounded-full bg-white/[0.06] border border-white/10 py-3 pl-8 pr-3 text-sm font-bold text-white outline-none focus:border-blue-400"
                        />
                      </div>
                    </td>

                    <td className="py-5">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={
                          product.inventory
                        }
                        onChange={(
                          e
                        ) =>
                          updateLocalInventory(
                            product.id,

                            Math.max(
                              0,

                              Math.floor(
                                Number(
                                  e
                                    .target
                                    .value
                                )
                              )
                            )
                          )
                        }
                        className="w-28 rounded-full bg-white/[0.06] border border-white/10 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-400"
                      />
                    </td>

                    <td className="py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                          stockStatus ===
                          "In Stock"
                            ? "bg-green-500/10 text-green-200 border border-green-400/20"
                            : stockStatus ===
                              "Low Stock"
                            ? "bg-yellow-500/10 text-yellow-200 border border-yellow-400/20"
                            : "bg-red-500/10 text-red-200 border border-red-400/20"
                        }`}
                      >
                        {stockStatus ===
                        "In Stock" ? (
                          <CheckCircle
                            size={
                              15
                            }
                          />
                        ) : (
                          <AlertTriangle
                            size={
                              15
                            }
                          />
                        )}

                        {
                          stockStatus
                        }
                      </span>
                    </td>

                    <td className="py-5">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            saveInventory(
                              product.id,

                              Number(
                                product.inventory
                              ),

                              Number(
                                product.price
                              )
                            )
                          }
                          disabled={
                            savingId ===
                            product.id
                          }
                          className="rounded-full bg-white text-[#081526] px-5 py-3 font-bold uppercase tracking-widest text-xs hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          <Save
                            size={
                              15
                            }
                          />

                          {savingId ===
                          product.id
                            ? "Saving"
                            : "Save"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <a
          href="/admin"
          className="inline-flex mb-8 text-blue-300 hover:text-white text-sm uppercase tracking-widest transition-all"
        >
          ← Back to Dashboard
        </a>

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border border-blue-400/20 bg-blue-500/10 flex items-center justify-center">
              <Package className="text-blue-300" />
            </div>

            <div>
              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-2">
                Admin
              </p>

              <h1 className="text-5xl font-black">
                Products
              </h1>

              <p className="text-white/45 mt-2">
                Manage product
                pricing, inventory,
                and quantity
                discounts.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={
                refreshAll
              }
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw
                size={16}
              />

              Refresh
            </button>

            <div className="relative w-full sm:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />

              <input
                value={search}
                onChange={(
                  e
                ) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search all products..."
                className="w-full rounded-full bg-white/[0.04] border border-white/10 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-400/60"
              />
            </div>
          </div>
        </div>

        {/* INVENTORY SUMMARY */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest mb-2">
              Total Inventory
            </p>

            <h2 className="text-4xl font-black">
              {
                totalInventory
              }
            </h2>
          </div>

          <div className="rounded-[28px] border border-yellow-400/20 bg-yellow-500/10 p-6">
            <p className="text-yellow-200/70 text-sm uppercase tracking-widest mb-2">
              Low Stock
            </p>

            <h2 className="text-4xl font-black text-yellow-100">
              {
                lowStockCount
              }
            </h2>
          </div>

          <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 p-6">
            <p className="text-red-200/70 text-sm uppercase tracking-widest mb-2">
              Out of Stock
            </p>

            <h2 className="text-4xl font-black text-red-100">
              {
                outOfStockCount
              }
            </h2>
          </div>
        </div>

        {/* STATUS */}
        {statusMessage && (
          <div
            className={`rounded-2xl p-4 mb-8 border ${
              statusMessage.startsWith(
                "❌"
              )
                ? "border-red-400/20 bg-red-500/10"
                : "border-blue-400/20 bg-blue-500/10"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                statusMessage.startsWith(
                  "❌"
                )
                  ? "text-red-100"
                  : "text-blue-100"
              }`}
            >
              {statusMessage}
            </p>
          </div>
        )}

        <div className="space-y-8">

          {/* QUANTITY DISCOUNTS */}
          <section className="rounded-[36px] border border-blue-400/20 bg-blue-500/[0.06] backdrop-blur-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl border border-blue-400/20 bg-blue-500/10 flex items-center justify-center">
                    <BadgePercent
                      size={22}
                      className="text-blue-300"
                    />
                  </div>

                  <div>
                    <p className="text-blue-300 text-xs uppercase tracking-[0.3em] mb-1">
                      Bulk Pricing
                    </p>

                    <h2 className="text-2xl font-black">
                      Quantity
                      Discounts
                    </h2>

                    <p className="text-white/45 text-sm mt-2 max-w-2xl">
                      Set the
                      automatic
                      discount
                      customers
                      receive when
                      purchasing
                      multiple vials
                      of the same
                      product.
                    </p>
                  </div>
                </div>

                <span className="inline-flex self-start md:self-auto rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-200">
                  Global Settings
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {discountLoading ? (
                <div className="py-10 text-center text-white/40">
                  Loading quantity
                  discounts...
                </div>
              ) : quantityDiscounts.length ===
                0 ? (
                <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-5">
                  <p className="text-yellow-100 font-semibold">
                    No quantity
                    discount tiers
                    were found.
                  </p>

                  <p className="text-yellow-100/60 text-sm mt-1">
                    Make sure the
                    quantity_discount_tiers
                    table was
                    created
                    successfully
                    in Supabase.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quantityDiscounts.map(
                    (tier) => (
                      <div
                        key={
                          tier.id
                        }
                        className="rounded-[26px] border border-white/10 bg-[#081526]/60 p-5 md:p-6"
                      >
                        <div className="grid lg:grid-cols-[1fr_1fr_1fr_auto] gap-5 lg:items-end">
                          {/* QUANTITY */}
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                              Quantity
                            </label>

                            <div className="relative">
                              <input
                                type="number"
                                min="2"
                                step="1"
                                value={
                                  tier.quantity
                                }
                                onChange={(
                                  e
                                ) => {
                                  const value =
                                    Math.max(
                                      2,

                                      Math.floor(
                                        Number(
                                          e
                                            .target
                                            .value
                                        ) ||
                                          2
                                      )
                                    );

                                  updateLocalDiscountTier(
                                    tier.id,

                                    "quantity",

                                    value
                                  );
                                }}
                                className="w-full rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3.5 pr-16 text-white font-bold outline-none focus:border-blue-400"
                              />

                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                                vials
                              </span>
                            </div>
                          </div>

                          {/* DISCOUNT */}
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                              Discount
                            </label>

                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={
                                  tier.discount_percent
                                }
                                onChange={(
                                  e
                                ) => {
                                  const value =
                                    Math.min(
                                      100,

                                      Math.max(
                                        0,

                                        Number(
                                          e
                                            .target
                                            .value
                                        ) ||
                                          0
                                      )
                                    );

                                  updateLocalDiscountTier(
                                    tier.id,

                                    "discount_percent",

                                    value
                                  );
                                }}
                                className="w-full rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3.5 pr-12 text-white font-bold outline-none focus:border-blue-400"
                              />

                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                                %
                              </span>
                            </div>
                          </div>

                          {/* STATUS */}
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                              Status
                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                updateLocalDiscountTier(
                                  tier.id,

                                  "active",

                                  !tier.active
                                )
                              }
                              className={`w-full rounded-2xl border px-4 py-3.5 font-bold transition-all ${
                                tier.active
                                  ? "border-green-400/25 bg-green-500/10 text-green-200"
                                  : "border-white/10 bg-white/[0.04] text-white/45"
                              }`}
                            >
                              {tier.active
                                ? "Active"
                                : "Disabled"}
                            </button>
                          </div>

                          {/* SAVE */}
                          <button
                            type="button"
                            onClick={() =>
                              saveQuantityDiscount(
                                tier
                              )
                            }
                            disabled={
                              savingDiscountId ===
                              tier.id
                            }
                            className="rounded-full bg-white text-[#081526] px-6 py-3.5 font-bold uppercase tracking-widest text-xs hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <Save
                              size={
                                15
                              }
                            />

                            {savingDiscountId ===
                            tier.id
                              ? "Saving"
                              : "Save"}
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3 text-sm">
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white/55">
                            Customer
                            buys{" "}
                            <strong className="text-white">
                              {
                                tier.quantity
                              }{" "}
                              vials
                            </strong>
                          </span>

                          <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-blue-200">
                            Receives{" "}
                            <strong>
                              {Number(
                                tier.discount_percent
                              ).toFixed(
                                2
                              )}
                              % off
                            </strong>
                          </span>
                        </div>
                      </div>
                    )
                  )}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-white/65 text-sm leading-6">
                      Customers
                      purchasing one
                      vial continue
                      paying the
                      normal product
                      price. These
                      tiers only
                      control
                      discounted
                      multi-vial
                      purchases.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* PRODUCTS */}
          {loading ? (
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] py-20 text-center text-white/50">
              Loading
              products...
            </div>
          ) : (
            <>
              {/* RESEARCH PRODUCTS */}
              <section className="rounded-[36px] border border-blue-400/15 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-white/10 bg-blue-500/[0.05]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl border border-blue-400/20 bg-blue-500/10 flex items-center justify-center">
                        <FlaskConical
                          size={
                            21
                          }
                          className="text-blue-300"
                        />
                      </div>

                      <div>
                        <p className="text-blue-300 text-xs uppercase tracking-[0.3em] mb-1">
                          Research
                          Products
                        </p>

                        <h2 className="text-2xl font-black">
                          Peptide
                          Products
                        </h2>
                      </div>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70">
                      {
                        peptideProducts.length
                      }{" "}
                      products
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {renderProductTable(
                    peptideProducts
                  )}
                </div>
              </section>

              {/* APPAREL */}
              <section className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center">
                        <Shirt
                          size={
                            21
                          }
                          className="text-blue-200"
                        />
                      </div>

                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">
                          Apparel
                        </p>

                        <h2 className="text-2xl font-black">
                          Apexx Shirts
                        </h2>
                      </div>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70">
                      {
                        shirtProducts.length
                      }{" "}
                      variants
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {renderProductTable(
                    shirtProducts
                  )}
                </div>
              </section>

              {/* ACCESSORY */}
              <section className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center">
                        <Archive
                          size={
                            21
                          }
                          className="text-blue-200"
                        />
                      </div>

                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">
                          Accessory
                        </p>

                        <h2 className="text-2xl font-black">
                          Vial Storage
                          Case
                        </h2>
                      </div>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70">
                      {
                        vialCaseProducts.length
                      }{" "}
                      product
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {renderProductTable(
                    vialCaseProducts
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}