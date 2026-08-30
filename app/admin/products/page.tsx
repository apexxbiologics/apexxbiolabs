"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  size: string | null;
  price: number;
  inventory: number;
  coa_url: string | null;
  active: boolean;
};

type ProductGroup = "peptides" | "shirts" | "vialCases";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const getStatus = (inventory: number) => {
    if (inventory <= 0) return "Out of Stock";
    if (inventory <= 5) return "Low Stock";
    return "In Stock";
  };

  const getProductGroup = (product: Product): ProductGroup => {
    const slug = (product.slug || "").toLowerCase();
    const name = (product.name || "").toLowerCase();

    if (
      slug.startsWith("apexx-shirt-") ||
      name.includes("signature tee") ||
      name.includes("shirt")
    ) {
      return "shirts";
    }

    if (
      slug === "vial-storage-case" ||
      name.includes("vial storage case")
    ) {
      return "vialCases";
    }

    return "peptides";
  };

  const fetchProducts = async () => {
    setLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!data.success) {
        setStatusMessage(data.error || "Failed to load products.");
        return;
      }

      setProducts(data.products || []);
    } catch {
      setStatusMessage("Something went wrong loading products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateLocalInventory = (id: string, inventory: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, inventory } : product
      )
    );
  };

  const updateLocalPrice = (id: string, price: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, price } : product
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
      const response = await fetch(
        "/api/admin/products/update-inventory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            inventory,
            price,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setStatusMessage(data.error || "Product update failed.");
        return;
      }

      setStatusMessage("✓ Product updated successfully.");
    } catch {
      setStatusMessage("Something went wrong saving product.");
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return products;

    return products.filter((product) =>
      `${product.name} ${product.slug} ${product.size || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [products, search]);

  const peptideProducts = filteredProducts.filter(
    (product) => getProductGroup(product) === "peptides"
  );

  const shirtProducts = filteredProducts.filter(
    (product) => getProductGroup(product) === "shirts"
  );

  const vialCaseProducts = filteredProducts.filter(
    (product) => getProductGroup(product) === "vialCases"
  );

  const totalInventory = products.reduce(
    (sum, product) => sum + Number(product.inventory || 0),
    0
  );

  const lowStockCount = products.filter(
    (product) => product.inventory > 0 && product.inventory <= 5
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.inventory <= 0
  ).length;

  const renderProductTable = (
    sectionProducts: Product[],
    group: ProductGroup
  ) => {
    if (sectionProducts.length === 0) {
      return (
        <div className="py-10 text-center text-white/40">
          No products found in this section.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
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

              <th className="pb-4 text-white/50 text-xs uppercase tracking-widest">
                COA
              </th>

              <th className="pb-4 text-white/50 text-xs uppercase tracking-widest text-right">
                Save
              </th>
            </tr>
          </thead>

          <tbody>
            {sectionProducts.map((product) => {
              const stockStatus = getStatus(product.inventory);
              const requiresCoa = group === "peptides";

              return (
                <tr
                  key={product.id}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                >
                  <td className="py-5">
                    <p className="font-bold text-white">
                      {product.name}
                    </p>
                    <p className="text-white/40 text-sm">
                      {product.slug}
                    </p>
                  </td>

                  <td className="py-5 text-white/80">
                    {product.size || "—"}
                  </td>

                  <td className="py-5">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={(e) =>
                        updateLocalPrice(
                          product.id,
                          Math.max(0, Number(e.target.value))
                        )
                      }
                      className="w-28 rounded-full bg-white/[0.06] border border-white/10 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-400"
                    />
                  </td>

                  <td className="py-5">
                    <input
                      type="number"
                      min="0"
                      value={product.inventory}
                      onChange={(e) =>
                        updateLocalInventory(
                          product.id,
                          Math.max(0, Number(e.target.value))
                        )
                      }
                      className="w-28 rounded-full bg-white/[0.06] border border-white/10 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-400"
                    />
                  </td>

                  <td className="py-5">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                        stockStatus === "In Stock"
                          ? "bg-green-500/10 text-green-200 border border-green-400/20"
                          : stockStatus === "Low Stock"
                          ? "bg-yellow-500/10 text-yellow-200 border border-yellow-400/20"
                          : "bg-red-500/10 text-red-200 border border-red-400/20"
                      }`}
                    >
                      {stockStatus === "In Stock" ? (
                        <CheckCircle size={15} />
                      ) : (
                        <AlertTriangle size={15} />
                      )}

                      {stockStatus}
                    </span>
                  </td>

                  <td className="py-5">
                    {!requiresCoa ? (
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/40">
                        N/A
                      </span>
                    ) : product.coa_url ? (
                      <a
                        href={product.coa_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-200 font-bold hover:text-white"
                      >
                        Available
                      </a>
                    ) : (
                      <span className="text-white/40">Missing</span>
                    )}
                  </td>

                  <td className="py-5">
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          saveInventory(
                            product.id,
                            Number(product.inventory),
                            Number(product.price)
                          )
                        }
                        disabled={savingId === product.id}
                        className="rounded-full bg-white text-[#081526] px-5 py-3 font-bold uppercase tracking-widest text-xs hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save size={15} />
                        {savingId === product.id ? "Saving" : "Save"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border border-blue-400/20 bg-blue-500/10 flex items-center justify-center">
              <Package className="text-blue-300" />
            </div>

            <div>
              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-2">
                Admin
              </p>
              <h1 className="text-5xl font-black">Products</h1>
              <p className="text-white/45 mt-2">
                Manage peptide, apparel, and accessory inventory.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchProducts}
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <div className="relative w-full sm:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search all products..."
                className="w-full rounded-full bg-white/[0.04] border border-white/10 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-400/60"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest mb-2">
              Total Inventory
            </p>
            <h2 className="text-4xl font-black">{totalInventory}</h2>
          </div>

          <div className="rounded-[28px] border border-yellow-400/20 bg-yellow-500/10 p-6">
            <p className="text-yellow-200/70 text-sm uppercase tracking-widest mb-2">
              Low Stock
            </p>
            <h2 className="text-4xl font-black text-yellow-100">
              {lowStockCount}
            </h2>
          </div>

          <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 p-6">
            <p className="text-red-200/70 text-sm uppercase tracking-widest mb-2">
              Out of Stock
            </p>
            <h2 className="text-4xl font-black text-red-100">
              {outOfStockCount}
            </h2>
          </div>
        </div>

        {statusMessage && (
          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 mb-8">
            <p className="text-blue-100 text-sm font-semibold">
              {statusMessage}
            </p>
          </div>
        )}

        {loading ? (
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] py-20 text-center text-white/50">
            Loading products...
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-[36px] border border-blue-400/15 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-white/10 bg-blue-500/[0.05]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl border border-blue-400/20 bg-blue-500/10 flex items-center justify-center">
                      <FlaskConical size={21} className="text-blue-300" />
                    </div>

                    <div>
                      <p className="text-blue-300 text-xs uppercase tracking-[0.3em] mb-1">
                        Research Products
                      </p>
                      <h2 className="text-2xl font-black">
                        Peptide Products
                      </h2>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70">
                    {peptideProducts.length} products
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {renderProductTable(peptideProducts, "peptides")}
              </div>
            </section>

            <section className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center">
                      <Shirt size={21} className="text-blue-200" />
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
                    {shirtProducts.length} variants
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {renderProductTable(shirtProducts, "shirts")}
              </div>
            </section>

            <section className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center">
                      <Archive size={21} className="text-blue-200" />
                    </div>

                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">
                        Accessory
                      </p>
                      <h2 className="text-2xl font-black">
                        Vial Storage Case
                      </h2>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70">
                    {vialCaseProducts.length} product
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {renderProductTable(vialCaseProducts, "vialCases")}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
