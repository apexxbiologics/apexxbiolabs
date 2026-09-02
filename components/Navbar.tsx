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
    { name: "APX-2", href: "/products/apx2" },
    { name: "MITO-X", href: "/products/mitox" },
    { name: "NEURO-X", href: "/products/neurox" },
    { name: "Glutathione", href: "/products/glutathione" },
    { name: "SS-31", href: "/products/ss31" },
    { name: "BPC-157", href: "/products/bpc157" },
    { name: "TB-500", href: "/products/tb500" },
    { name: "GHK-Cu", href: "/products/ghkcu" },
    { name: "MOTS-c", href: "/products/motsc" },
    { name: "KPV", href: "/products/kpv" },
    { name: "Tesamorelin", href: "/products/tesamorelin" },
    { name: "CJC/IPA", href: "/products/cjcipa" },
    { name: "Adamax", href: "/products/adamax" },
    { name: "Semax", href: "/products/semax" },
    { name: "Selank", href: "/products/selank" },
    { name: "Pinealon", href: "/products/pinealon" },
    { name: "PE-22-28", href: "/products/pe2228" },
    { name: "ARA-290", href: "/products/ara290" },
    { name: "NAD+", href: "/products/nad" },
    { name: "AOD-9604", href: "/products/aod9604" },
    { name: "PT-141", href: "/products/pt141" },
    { name: "5-Amino-1MQ", href: "/products/5amino1mq" },
    {
      name: "Kisspeptin-10",
      href: "/products/kisspeptin10",
    },
    { name: "KLOW", href: "/products/klow" },
    { name: "Wolverine", href: "/products/wolverine" },
    {
      name: "Bacteriostatic Water",
      href: "/products/bacwater",
    },
    {
      name: "Acetic Acid",
      href: "/products/aceticacid",
    },
  ];

  const normalizedSearch =
    search
      .trim()
      .toLowerCase()
      .replace(/[-_\s/]/g, "");

  const filteredProducts = products.filter((product) => {
    const normalizedProduct =
      product.name
        .toLowerCase()
        .replace(/[-_\s/]/g, "");

    return normalizedProduct.includes(normalizedSearch);
  });

  const updateCartCount = () => {
    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const count = cart.reduce(
      (sum: number, item: any) =>
        sum + Number(item.quantity || 0),
      0
    );

    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    window.addEventListener(
      "storage",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .apexx-scrollbar {
          scrollbar-width: thin;
          scrollbar-color:
            rgba(96, 165, 250, 0.7)
            rgba(255, 255, 255, 0.03);
        }

        .apexx-scrollbar::-webkit-scrollbar {
          width: 7px;
        }

        .apexx-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.025);
          border-radius: 999px;
          margin-top: 18px;
          margin-bottom: 18px;
        }

        .apexx-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(147, 197, 253, 0.95),
            rgba(59, 130, 246, 0.72)
          );
          border-radius: 999px;
          border: 2px solid #071323;
        }

        .apexx-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(191, 219, 254, 1),
            rgba(96, 165, 250, 0.95)
          );
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
            <a
              href="/"
              className="pb-2 transition hover:text-blue-300"
            >
              Home
            </a>

            <a
              href="/products"
              className="pb-2 transition hover:text-blue-300"
            >
              Products
            </a>

            <a
              href="/build-a-bundle"
              className="pb-2 transition hover:text-blue-300"
            >
              Build a Bundle
            </a>

            <a
              href="/coas"
              className="pb-2 transition hover:text-blue-300"
            >
              COAs
            </a>

            <a
              href="/contact"
              className="pb-2 transition hover:text-blue-300"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setSearchOpen(!searchOpen)
              }
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
          <div className="mx-auto mt-5 max-w-4xl">

            <div className="relative rounded-[24px] border border-blue-400/25 bg-gradient-to-r from-[#06101f] via-[#09182b] to-[#06101f] p-[1px] shadow-[0_16px_50px_rgba(37,99,235,0.12)]">

              <div className="relative flex items-center rounded-[23px] bg-[#050d1a]/95 px-5">

                <Search
                  size={21}
                  className="mr-3 shrink-0 text-blue-300/70"
                />

                <input
                  type="text"
                  placeholder="Search Apexx research products..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  autoFocus
                  className="w-full bg-transparent py-5 text-[15px] text-white outline-none placeholder:text-white/35"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/[0.08] hover:text-white"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}

              </div>

              {search &&
                filteredProducts.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[999] overflow-hidden rounded-[24px] border border-blue-400/20 bg-[#081526]/98 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">

                    <div className="border-b border-white/[0.06] px-5 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-300/60">
                        Search Results
                      </p>
                    </div>

                    {filteredProducts.map(
                      (product) => (
                        <a
                          key={product.name}
                          href={product.href}
                          className="group flex items-center justify-between border-b border-white/[0.05] px-5 py-4 text-white/80 transition last:border-0 hover:bg-blue-500/10 hover:text-white"
                        >
                          <span className="font-semibold">
                            {product.name}
                          </span>

                          <ChevronRight
                            size={17}
                            className="text-white/25 transition group-hover:translate-x-1 group-hover:text-blue-300"
                          />
                        </a>
                      )
                    )}
                  </div>
                )}

              {search &&
                filteredProducts.length === 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[999] rounded-[24px] border border-blue-400/20 bg-[#081526]/98 px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">

                    <p className="font-semibold text-white/70">
                      No products found
                    </p>

                    <p className="mt-1 text-sm text-white/35">
                      Try another product name.
                    </p>

                  </div>
                )}

            </div>

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

          <aside className="apexx-scrollbar relative h-full w-[90%] max-w-[520px] overflow-y-auto border-r border-blue-900/50 bg-[#071323] px-7 py-8 shadow-2xl md:px-10">

            <div className="mb-12 flex items-center justify-between">

              <img
                src="/images/logo.png"
                alt="Apexx Biolabs"
                className="h-16 w-auto md:h-20"
              />

              <button
                onClick={() =>
                  setMenuOpen(false)
                }
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
                  ["Build a Bundle", "/build-a-bundle"],
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
                title="Research Referral"
                links={[
                  [
                    "Program Overview",
                    "/research-referral",
                  ],
                  [
                    "Apply to Partner",
                    "/research-referral#apply",
                  ],
                  [
                    "Program Terms",
                    "/research-referral/terms",
                  ],
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
                  [
                    "Research Referral Terms",
                    "/research-referral/terms",
                  ],
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