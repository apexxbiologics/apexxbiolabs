"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  ChevronRight,
  UserCircle,
  Heart,
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
      <style jsx global>{`
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <header className="sticky top-0 left-0 z-50 w-full border-b border-blue-900/50 bg-[#071323]/95 px-5 py-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-white transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300"
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>

            <a href="/">
              <img
                src="/images/logo.png"
                alt="Apexx Biolabs"
                className="h-16 w-auto md:h-20"
              />
            </a>
          </div>

          <nav className="hidden items-center gap-10 text-sm font-bold uppercase tracking-[0.22em] text-white md:flex">
            <a href="/" className="pb-2 transition hover:text-blue-300">
              Home
            </a>

            <a href="/products" className="pb-2 transition hover:text-blue-300">
              Products
            </a>

            <a href="/coas" className="pb-2 transition hover:text-blue-300">
              COAs
            </a>

            <a href="/contact" className="pb-2 transition hover:text-blue-300">
              Contact
            </a>

          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-white transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300"
              aria-label="Search products"
            >
              <Search size={25} />
            </button>

            <a
              href="/account/favorites"
              className="hidden rounded-full border border-white/10 bg-white/[0.04] p-3 text-white transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300 sm:inline-flex"
              aria-label="Favorites"
            >
              <Heart size={25} />
            </a>

            <a
              href="/account"
              className="hidden rounded-full border border-white/10 bg-white/[0.04] p-3 text-white transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300 sm:inline-flex"
              aria-label="Account Dashboard"
            >
              <UserCircle size={26} />
            </a>

            <a
              href="/cart"
              className="relative rounded-full border border-white/10 bg-white/[0.04] p-3 text-white transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300"
              aria-label="Cart"
            >
              <ShoppingCart size={26} />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </a>
          </div>
        </div>

        {searchOpen && (
          <div className="relative mx-auto mt-5 max-w-3xl">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-blue-800 bg-[#020817] px-6 py-4 text-base text-white outline-none placeholder:text-gray-400 focus:border-blue-400"
            />

            {search && filteredProducts.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-[999] mt-3 overflow-hidden rounded-2xl border border-blue-800 bg-[#081526]">
                {filteredProducts.map((product) => (
                  <a
                    key={product.name}
                    href={product.href}
                    className="block px-6 py-4 text-white transition hover:bg-[#102A4A]"
                  >
                    {product.name}
                  </a>
                ))}
              </div>
            )}

            {search && filteredProducts.length === 0 && (
              <div className="absolute left-0 right-0 top-full z-[999] mt-3 rounded-2xl border border-blue-800 bg-[#081526] px-6 py-4 text-white/60">
                No products found.
              </div>
            )}
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Close menu overlay"
          />

          <aside className="no-scrollbar relative h-full w-[90%] max-w-[520px] overflow-y-auto border-r border-blue-900/50 bg-[#071323] px-7 py-8 shadow-2xl md:px-10">
            <div className="mb-12 flex items-center justify-between">
              <img
                src="/images/logo.png"
                alt="Apexx Biolabs"
                className="h-16 w-auto md:h-20"
              />

              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-white transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300"
                aria-label="Close menu"
              >
                <X size={25} />
              </button>
            </div>

            <div className="space-y-10 pb-10">
              <MenuSection
                title="Account"
                links={[
                  ["Dashboard", "/account"],
                  ["Favorites", "/account/favorites"],
                  ["Security Settings", "/account/settings"],
                  ["Order Status", "/order-status"],
                ]}
              />

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
                  ["Returns & Refunds", "/refunds"],
                  ["Contact Support", "/contact"],
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
          </aside>
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
      <p className="mb-4 text-xs uppercase tracking-[0.38em] text-blue-300">
        {title}
      </p>

      <div className="space-y-3">
        {links.map(([label, href]) => (
          <a
            key={label}
            href={href}
            className="group flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.045] px-6 py-5 text-white/75 transition hover:border-blue-400/60 hover:bg-blue-500/10 hover:text-white"
          >
            <span className="text-sm font-bold uppercase tracking-[0.18em]">
              {label}
            </span>

            <ChevronRight
              size={18}
              className="text-white/25 transition group-hover:translate-x-1 group-hover:text-blue-300"
            />
          </a>
        ))}
      </div>
    </div>
  );
}