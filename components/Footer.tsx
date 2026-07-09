import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Heart, LayoutDashboard, ShieldCheck, ShoppingBag } from "lucide-react";

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Certificates of Analysis", href: "/coas" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Dashboard", href: "/account" },
      { label: "Favorites", href: "/account/favorites" },
      { label: "Security Settings", href: "/account/settings" },
      { label: "Order Status", href: "/order-status" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Research Library", href: "/peptide-info" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Refunds", href: "/refunds" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#081526] px-6 pb-8 pt-16 md:px-10">
      <div className="mx-auto mb-14 grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1.3fr_repeat(5,1fr)]">
        <div>
          <img
            src="/images/logo.png"
            alt="Apexx Biolabs"
            className="mb-5 h-12 w-auto"
          />

          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            Premium research-grade compounds built on science, quality, and
            transparency.
          </p>

          <div className="mt-6 grid gap-3">
            <a
              href="/account"
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/70 transition hover:border-blue-400/40 hover:bg-white/[0.07] hover:text-white"
            >
              <LayoutDashboard
                size={18}
                className="text-blue-300 transition group-hover:scale-110"
              />
              Customer Dashboard
            </a>

            <a
              href="/account/favorites"
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/70 transition hover:border-blue-400/40 hover:bg-white/[0.07] hover:text-white"
            >
              <Heart
                size={18}
                className="text-blue-300 transition group-hover:scale-110"
              />
              Saved Favorites
            </a>

            <a
              href="/products"
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/70 transition hover:border-blue-400/40 hover:bg-white/[0.07] hover:text-white"
            >
              <ShoppingBag
                size={18}
                className="text-blue-300 transition group-hover:scale-110"
              />
              Shop Products
            </a>
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="https://www.tiktok.com/@apexx.nyc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-blue-400/40 hover:bg-white/[0.07] hover:text-white"
            >
              <FaTiktok size={18} />
            </a>

            <a
              href="https://x.com/ApexxBiolabsLLC"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-blue-400/40 hover:bg-white/[0.07] hover:text-white"
            >
              <FaXTwitter size={18} />
            </a>

            <a
              href="mailto:support@apexxbiolabs.com"
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-blue-400/40 hover:bg-white/[0.07] hover:text-white"
            >
              <HiOutlineMail size={18} />
            </a>
          </div>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              {section.title}
            </h4>

            <div className="space-y-3 text-white/50">
              {section.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block transition-all hover:text-blue-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/40 md:flex-row">
        <p>© 2026 Apexx Biolabs. All rights reserved.</p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={15} className="text-blue-300" />
            SSL Secured
          </span>

          <span>99%+ Purity</span>

          <span>Research Use Only</span>
        </div>

        <a
          href="https://www.jovavo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all hover:text-blue-300"
        >
          Crafted by Jovavo →
        </a>
      </div>
    </footer>
  );
}