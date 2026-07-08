"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const products = [
    { name: "APX-3", href: "/products/apx3" },
    { name: "BPC-157", href: "/products/bpc157" },
    { name: "TB-500", href: "/products/tb500" },
    { name: "NAD+", href: "/products/nad" },
    { name: "AOD-9604", href: "/products/aod9604" },
    { name: "PT-141", href: "/products/pt141" },
    { name: "5-Amino-1MQ", href: "/products/5amino1mq" },
    { name: "Kisspeptin-10", href: "/products/kisspeptin10" },
    { name: "KLOW", href: "/products/klow" },
    { name: "Wolverine", href: "/products/wolverine" },
    { name: "Bacteriostatic Water", href: "/products/bacwater" },
    { name: "Acetic Acid", href: "/products/aceticacid" },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce(
      (sum: number, item: any) => sum + Number(item.quantity || 0),
      0
    );
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-50 border-b border-blue-900/70 bg-[#081526]/95 backdrop-blur-xl px-5 md:px-10 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white hover:text-blue-400 transition-all"
              aria-label="Open menu"
            >
              <Menu size={34} />
            </button>

            <a href="/">
              <img
                src="/images/logo.png"
                alt="Apexx Biolabs"
                className="h-10 md:h-12 w-auto"
              />
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-14 text-white text-sm font-bold uppercase tracking-[0.22em]">
            <a
              href="/"
              className="hover:text-blue-400 transition-all border-b-2 border-blue-500 pb-2"
            >
              Home
            </a>

            <a
              href="/products"
              className="hover:text-blue-400 transition-all pb-2"
            >
              Products
            </a>

            <a href="/coas" className="hover:text-blue-400 transition-all pb-2">
              COAs
            </a>

            <a
              href="/contact"
              className="hover:text-blue-400 transition-all pb-2"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-blue-400 transition-all"
              aria-label="Search products"
            >
              <Search size={34} />
            </button>

            <a
              href="/cart"
              className="relative text-white hover:text-blue-400 transition-all"
              aria-label="Cart"
            >
              <ShoppingCart size={36} />

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-4 bg-blue-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
          </div>
        </div>

        {searchOpen && (
          <div className="max-w-3xl mx-auto mt-5 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#020817] border border-blue-700 focus:border-blue-400 outline-none rounded-2xl px-6 py-4 text-white placeholder:text-gray-400 text-base"
            />

            {search && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-[#081526] border border-blue-800 rounded-2xl overflow-hidden z-[999]">
                {filteredProducts.map((product) => (
                  <a
                    key={product.name}
                    href={product.href}
                    className="block px-6 py-4 text-white hover:bg-[#102A4A] transition-all"
                  >
                    {product.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm">
          <div className="h-full w-[88%] max-w-md bg-[#081526] border-r border-blue-900 p-8 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-10">
              <img
                src="/images/logo.png"
                alt="Apexx Biolabs"
                className="h-12 w-auto"
              />

              <button
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-blue-400 transition-all"
                aria-label="Close menu"
              >
                <X size={30} />
              </button>
            </div>

            <div className="space-y-9">
              <MenuSection
                title="Navigation"
                links={[
                  ["Home", "/"],
                  ["All Products", "/products"],
                  ["Certificates of Analysis", "/coas"],
                  ["Contact", "/contact"],
                ]}
              />

              <MenuSection
                title="Research"
                links={[
                  ["Research Library", "/peptide-info"],
                  ["FAQ", "/faq"],
                ]}
              />

              <MenuSection
                title="Products"
                links={[
                  ["Metabolic Research", "/products"],
                  ["Tissue Repair Research", "/products"],
                  ["Neuro Research", "/products"],
                  ["Research Solutions", "/products"],
                ]}
              />

              <MenuSection
                title="Support"
                links={[
                  ["Shipping", "/shipping"],
                  ["Order Status", "/order-status"],
                  ["Returns & Refunds", "/refunds"],
                ]}
              />

              <MenuSection
                title="Legal"
                links={[
                  ["Privacy Policy", "/privacy"],
                  ["Terms of Service", "/terms"],
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuSection({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <p className="text-blue-300 text-xs uppercase tracking-[0.35em] mb-4">
        {title}
      </p>

      <div className="space-y-2">
        {links.map(([label, href]) => (
          <a
            key={label}
            href={href}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white/75 hover:text-white hover:bg-white/[0.07] hover:border-blue-400/50 transition-all"
          >
            <span className="uppercase tracking-widest text-sm font-semibold">
              {label}
            </span>

            <ChevronRight
              size={16}
              className="text-white/30 group-hover:text-blue-300 transition-all"
            />
          </a>
        ))}
      </div>
    </div>
  );
}