"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  BadgePercent,
  CalendarClock,
  Clock3,
  RefreshCw,
  Tag,
  Zap,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug?: string | null;
  price: number;
  size?: string | null;
  category?: string | null;
  active?: boolean | null;
};

type FlashSale = {
  id: string;
  product_id: string;
  sale_price: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
  created_at?: string;
  product_name?: string;
  product_size?: string | null;
  regular_price?: number;
};

type FlashSaleForm = {
  productId: string;
  salePrice: string;
  startsAt: string;
  endsAt: string;
};

const initialForm: FlashSaleForm = {
  productId: "",
  salePrice: "",
  startsAt: "",
  endsAt: "",
};

function formatMoney(value: number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDateTime(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "—";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getSaleState(sale: FlashSale) {
  const now = Date.now();
  const startsAt = new Date(
    sale.starts_at
  ).getTime();
  const endsAt = new Date(
    sale.ends_at
  ).getTime();

  if (!sale.active) {
    return {
      label: "Ended",
      className:
        "border-white/10 bg-white/[0.04] text-white/50",
    };
  }

  if (now < startsAt) {
    return {
      label: "Scheduled",
      className:
        "border-yellow-400/20 bg-yellow-500/[0.08] text-yellow-200",
    };
  }

  if (now >= startsAt && now < endsAt) {
    return {
      label: "Live",
      className:
        "border-emerald-400/20 bg-emerald-500/[0.08] text-emerald-200",
    };
  }

  return {
    label: "Expired",
    className:
      "border-white/10 bg-white/[0.04] text-white/50",
  };
}

export default function AdminPromosPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [sales, setSales] =
    useState<FlashSale[]>([]);

  const [form, setForm] =
    useState<FlashSaleForm>(
      initialForm
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [endingId, setEndingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) =>
          String(product.id) ===
          form.productId
      ) || null,
    [products, form.productId]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/flash-sales",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to load promos."
        );
      }

      setSales(
        Array.isArray(data.sales)
          ? data.sales
          : []
      );

      setProducts(
        Array.isArray(data.products)
          ? data.products
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load promos."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createFlashSale = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (!form.productId) {
        throw new Error(
          "Choose a product."
        );
      }

      const salePrice = Number(
        form.salePrice
      );

      if (
        !Number.isFinite(salePrice) ||
        salePrice <= 0
      ) {
        throw new Error(
          "Enter a valid sale price."
        );
      }

      if (
        selectedProduct &&
        salePrice >=
          Number(
            selectedProduct.price || 0
          )
      ) {
        throw new Error(
          `Sale price must be lower than ${formatMoney(
            Number(
              selectedProduct.price || 0
            )
          )}.`
        );
      }

      if (
        !form.startsAt ||
        !form.endsAt
      ) {
        throw new Error(
          "Choose a start and end time."
        );
      }

      const startDate = new Date(
        form.startsAt
      );

      const endDate = new Date(
        form.endsAt
      );

      if (
        !Number.isFinite(
          startDate.getTime()
        ) ||
        !Number.isFinite(
          endDate.getTime()
        )
      ) {
        throw new Error(
          "Enter valid sale dates."
        );
      }

      if (endDate <= startDate) {
        throw new Error(
          "End time must be after start time."
        );
      }

      const response = await fetch(
        "/api/admin/flash-sales",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            product_id:
              form.productId,
            sale_price: salePrice,
            starts_at:
              startDate.toISOString(),
            ends_at:
              endDate.toISOString(),
            active: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to create flash sale."
        );
      }

      setMessage(
        "Flash sale created successfully."
      );

      setForm(initialForm);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create flash sale."
      );
    } finally {
      setSaving(false);
    }
  };

  const endFlashSale = async (
    saleId: string
  ) => {
    try {
      setEndingId(saleId);
      setMessage("");
      setError("");

      const response = await fetch(
        "/api/admin/flash-sales",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: saleId,
            active: false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to end flash sale."
        );
      }

      setMessage(
        "Flash sale ended."
      );

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to end flash sale."
      );
    } finally {
      setEndingId(null);
    }
  };

  const liveSales = sales.filter(
    (sale) =>
      getSaleState(sale).label === "Live"
  );

  const scheduledSales = sales.filter(
    (sale) =>
      getSaleState(sale).label ===
      "Scheduled"
  );

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <a
              href="/admin"
              className="mb-5 inline-flex items-center gap-2 text-sm text-blue-300 transition hover:text-blue-200"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </a>

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-blue-300">
              Apexx Admin
            </p>

            <h1 className="text-5xl font-black md:text-6xl">
              Promos
            </h1>

            <p className="mt-4 max-w-2xl text-white/55">
              Manage flash sales and
              limited-time promotional
              pricing without changing a
              product&apos;s regular price.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-200 transition hover:bg-blue-500/20 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-[28px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">
              Live Sales
            </p>
            <p className="mt-3 text-4xl font-black text-emerald-300">
              {liveSales.length}
            </p>
          </div>

          <div className="rounded-[28px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">
              Scheduled
            </p>
            <p className="mt-3 text-4xl font-black text-yellow-200">
              {scheduledSales.length}
            </p>
          </div>

          <div className="rounded-[28px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">
              Total Records
            </p>
            <p className="mt-3 text-4xl font-black text-blue-300">
              {sales.length}
            </p>
          </div>
        </div>

        {message ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] px-5 py-4 text-sm text-emerald-200">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <section className="mb-8 overflow-hidden rounded-[32px] border border-blue-400/15 bg-white/[0.04]">
          <div className="border-b border-white/10 p-7 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                <Zap size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-300">
                  Limited Time Pricing
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  Create Flash Sale
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-7 md:grid-cols-2 md:p-8">
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-white/75">
                Product
              </span>

              <select
                value={form.productId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    productId:
                      event.target.value,
                    salePrice: "",
                  }))
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#0b1b30] px-4 text-sm text-white outline-none transition focus:border-blue-400/50"
              >
                <option value="">
                  Select a product
                </option>

                {products.map(
                  (product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name}
                      {product.size
                        ? ` • ${product.size}`
                        : ""}
                      {" • "}
                      {formatMoney(
                        Number(
                          product.price || 0
                        )
                      )}
                    </option>
                  )
                )}
              </select>
            </label>

            <div>
              <p className="mb-2 text-sm font-bold text-white/75">
                Regular Price
              </p>

              <div className="flex h-12 items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white/70">
                {selectedProduct
                  ? formatMoney(
                      Number(
                        selectedProduct.price ||
                          0
                      )
                    )
                  : "Choose a product"}
              </div>
            </div>

            <label>
              <span className="mb-2 block text-sm font-bold text-white/75">
                Flash Sale Price
              </span>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
                  $
                </span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.salePrice}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        salePrice:
                          event.target.value,
                      })
                    )
                  }
                  placeholder="0.00"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#0b1b30] pl-8 pr-4 text-sm text-white outline-none transition focus:border-blue-400/50"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-white/75">
                Starts
              </span>

              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startsAt:
                      event.target.value,
                  }))
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#0b1b30] px-4 text-sm text-white outline-none transition focus:border-blue-400/50"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-white/75">
                Ends
              </span>

              <input
                type="datetime-local"
                value={form.endsAt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    endsAt:
                      event.target.value,
                  }))
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#0b1b30] px-4 text-sm text-white outline-none transition focus:border-blue-400/50"
              />
            </label>

            <div className="md:col-span-2">
              <button
                onClick={createFlashSale}
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 text-sm font-black text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap size={17} />
                {saving
                  ? "Creating..."
                  : "Start Flash Sale"}
              </button>

              <p className="mt-3 text-xs leading-relaxed text-white/40">
                Flash sale pricing is
                temporary. The regular
                product price in Products
                remains unchanged.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-blue-400/15 bg-white/[0.04]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-7 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-blue-300">
                Promotion History
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Flash Sales
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/40">
              <Clock3 size={15} />
              Times shown in your local
              timezone
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-white/50">
              Loading flash sales...
            </div>
          ) : sales.length === 0 ? (
            <div className="p-8">
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                <Tag
                  size={28}
                  className="mx-auto mb-3 text-blue-300/60"
                />
                <p className="font-bold">
                  No flash sales yet
                </p>
                <p className="mt-2 text-sm text-white/45">
                  Create your first
                  limited-time product sale
                  above.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {sales.map((sale) => {
                const state =
                  getSaleState(sale);

                const regularPrice =
                  Number(
                    sale.regular_price || 0
                  );

                const savings =
                  regularPrice > 0
                    ? Math.round(
                        (1 -
                          Number(
                            sale.sale_price ||
                              0
                          ) /
                            regularPrice) *
                          100
                      )
                    : 0;

                const canEnd =
                  sale.active &&
                  state.label !== "Expired";

                return (
                  <div
                    key={sale.id}
                    className="p-7 md:p-8"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${state.className}`}
                          >
                            {state.label}
                          </span>

                          {savings > 0 ? (
                            <span className="rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3 py-1 text-xs font-bold text-blue-200">
                              {savings}% off
                            </span>
                          ) : null}
                        </div>

                        <h3 className="text-xl font-black">
                          {sale.product_name ||
                            sale.product_id}
                          {sale.product_size
                            ? ` • ${sale.product_size}`
                            : ""}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                          <span className="text-white/45">
                            Regular{" "}
                            <span className="line-through">
                              {formatMoney(
                                regularPrice
                              )}
                            </span>
                          </span>

                          <span className="font-black text-blue-300">
                            Sale{" "}
                            {formatMoney(
                              Number(
                                sale.sale_price ||
                                  0
                              )
                            )}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-white/45 sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <CalendarClock
                              size={15}
                              className="text-blue-300"
                            />
                            Starts{" "}
                            {formatDateTime(
                              sale.starts_at
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock3
                              size={15}
                              className="text-blue-300"
                            />
                            Ends{" "}
                            {formatDateTime(
                              sale.ends_at
                            )}
                          </div>
                        </div>
                      </div>

                      {canEnd ? (
                        <button
                          onClick={() =>
                            endFlashSale(
                              sale.id
                            )
                          }
                          disabled={
                            endingId ===
                            sale.id
                          }
                          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/[0.08] px-5 text-sm font-bold text-red-200 transition hover:bg-red-500/[0.14] disabled:opacity-50"
                        >
                          {endingId === sale.id
                            ? "Ending..."
                            : "End Sale"}
                        </button>
                      ) : (
                        <span className="text-xs uppercase tracking-[0.18em] text-white/30">
                          No action needed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[32px] border border-blue-400/10 bg-blue-500/[0.04] p-7 md:p-8">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
              <BadgePercent size={19} />
            </div>

            <div>
              <h2 className="font-black">
                Promo Pricing Rules
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/45">
                Flash sales do not change the
                regular product price. Your
                secure checkout verifies the
                active sale directly from
                Supabase. Current checkout
                logic does not stack a
                same-product quantity discount
                or Build-a-Bundle discount on
                top of a flash sale.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
