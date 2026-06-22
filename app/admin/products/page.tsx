"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const getStatus = (inventory: number) => {
    if (inventory <= 0) return "Out of Stock";
    if (inventory <= 5) return "Low Stock";
    return "In Stock";
  };

  const fetchProducts = async () => {
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/products");
      const data = await response.json();

      if (!data.success) {
        setStatus("Failed to load products.");
        return;
      }

      setProducts(data.products);
    } catch {
      setStatus("Something went wrong loading products.");
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

  const saveInventory = async (id: string, inventory: number) => {
    setSavingId(id);
    setStatus("");

    try {
      const response = await fetch("/api/admin/products/update-inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, inventory }),
      });

      const data = await response.json();

      if (!data.success) {
        setStatus(data.error || "Inventory update failed.");
        return;
      }

      setStatus("✓ Inventory updated successfully.");
    } catch {
      setStatus("Something went wrong saving inventory.");
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.slug} ${product.size || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
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

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <a
          href="/admin"
          className="inline-flex mb-8 text-blue-300 hover:text-white text-sm uppercase tracking-widest transition-all"
        >
          ← Back to Dashboard
        </a>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full border border-blue-400/20 bg-blue-500/10 flex items-center justify-center">
            <Package className="text-blue-300" />
          </div>

          <div>
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-2">
              Admin
            </p>
            <h1 className="text-5xl font-black">Products</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
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

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black">Product Inventory</h2>
              <p className="text-white/50 text-sm mt-1">
                Edit inventory here. If inventory is 0, the product will show
                out of stock on the website.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchProducts}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <div className="relative w-full md:w-80">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full bg-white/[0.04] border border-white/10 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-400/60"
                />
              </div>
            </div>
          </div>

          {status && (
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 mb-6">
              <p className="text-blue-100 text-sm font-semibold">{status}</p>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-white/50">
              Loading products...
            </div>
          ) : (
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
                  {filteredProducts.map((product) => {
                    const status = getStatus(product.inventory);

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

                        <td className="py-5 font-bold">
                          ${Number(product.price).toFixed(2)}
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
                              status === "In Stock"
                                ? "bg-green-500/10 text-green-200 border border-green-400/20"
                                : status === "Low Stock"
                                ? "bg-yellow-500/10 text-yellow-200 border border-yellow-400/20"
                                : "bg-red-500/10 text-red-200 border border-red-400/20"
                            }`}
                          >
                            {status === "In Stock" && (
                              <CheckCircle size={15} />
                            )}
                            {status !== "In Stock" && (
                              <AlertTriangle size={15} />
                            )}
                            {status}
                          </span>
                        </td>

                        <td className="py-5">
                          {product.coa_url ? (
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
                                  Number(product.inventory)
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

              {filteredProducts.length === 0 && (
                <div className="text-center py-14">
                  <p className="text-white/50">No products found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}