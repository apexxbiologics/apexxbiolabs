"use client";

import { useState } from "react";
import { Package, Search, AlertTriangle, CheckCircle, Edit, Eye } from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  size: string;
  price: number;
  inventory: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  coa: boolean;
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const products: Product[] = [
    {
      id: 1,
      name: "APX-3",
      category: "Research Peptide",
      size: "10mg",
      price: 179,
      inventory: 14,
      status: "In Stock",
      coa: true,
    },
    {
      id: 2,
      name: "APX-3",
      category: "Research Peptide",
      size: "20mg",
      price: 299,
      inventory: 5,
      status: "Low Stock",
      coa: true,
    },
    {
      id: 3,
      name: "BPC-157",
      category: "Research Peptide",
      size: "10mg",
      price: 89,
      inventory: 22,
      status: "In Stock",
      coa: true,
    },
    {
      id: 4,
      name: "TB-500",
      category: "Research Peptide",
      size: "10mg",
      price: 99,
      inventory: 8,
      status: "Low Stock",
      coa: true,
    },
    {
      id: 5,
      name: "Semax",
      category: "Research Peptide",
      size: "10mg",
      price: 79,
      inventory: 0,
      status: "Out of Stock",
      coa: false,
    },
    {
      id: 6,
      name: "Selank",
      category: "Research Peptide",
      size: "10mg",
      price: 79,
      inventory: 16,
      status: "In Stock",
      coa: true,
    },
    {
      id: 7,
      name: "CJC-1295",
      category: "Research Peptide",
      size: "5mg",
      price: 85,
      inventory: 11,
      status: "In Stock",
      coa: true,
    },
    {
      id: 8,
      name: "Bacteriostatic Water",
      category: "Supply",
      size: "30ml",
      price: 15,
      inventory: 40,
      status: "In Stock",
      coa: false,
    },
  ];

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category} ${product.size}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalInventory = products.reduce((sum, product) => sum + product.inventory, 0);
  const lowStockCount = products.filter((product) => product.status === "Low Stock").length;
  const outOfStockCount = products.filter((product) => product.status === "Out of Stock").length;

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
            <h2 className="text-4xl font-black text-yellow-100">{lowStockCount}</h2>
          </div>

          <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 p-6">
            <p className="text-red-200/70 text-sm uppercase tracking-widest mb-2">
              Out of Stock
            </p>
            <h2 className="text-4xl font-black text-red-100">{outOfStockCount}</h2>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black">Product Inventory</h2>
              <p className="text-white/50 text-sm mt-1">
                View product stock, pricing, COA status, and inventory levels.
              </p>
            </div>

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

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
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
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                  >
                    <td className="py-5">
                      <p className="font-bold text-white">{product.name}</p>
                      <p className="text-white/40 text-sm">{product.category}</p>
                    </td>

                    <td className="py-5 text-white/80">{product.size}</td>

                    <td className="py-5 font-bold">${product.price}</td>

                    <td className="py-5">
                      <span className="rounded-full bg-white/[0.06] border border-white/10 px-4 py-2 text-sm font-bold">
                        {product.inventory} units
                      </span>
                    </td>

                    <td className="py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                          product.status === "In Stock"
                            ? "bg-green-500/10 text-green-200 border border-green-400/20"
                            : product.status === "Low Stock"
                            ? "bg-yellow-500/10 text-yellow-200 border border-yellow-400/20"
                            : "bg-red-500/10 text-red-200 border border-red-400/20"
                        }`}
                      >
                        {product.status === "In Stock" && <CheckCircle size={15} />}
                        {product.status === "Low Stock" && <AlertTriangle size={15} />}
                        {product.status === "Out of Stock" && <AlertTriangle size={15} />}
                        {product.status}
                      </span>
                    </td>

                    <td className="py-5">
                      {product.coa ? (
                        <span className="text-blue-200 font-bold">Available</span>
                      ) : (
                        <span className="text-white/40">Missing</span>
                      )}
                    </td>

                    <td className="py-5">
                      <div className="flex justify-end gap-3">
                        <button className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] hover:bg-blue-500/20 transition-all flex items-center justify-center">
                          <Eye size={16} />
                        </button>

                        <button className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] hover:bg-blue-500/20 transition-all flex items-center justify-center">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-14">
                <p className="text-white/50">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}