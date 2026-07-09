import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Certificates of Analysis", href: "/coas" },
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
    <footer className="bg-[#081526] border-t border-white/10 px-6 md:px-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
        <div>
          <img
            src="/images/logo.png"
            alt="Apexx Biolabs"
            className="h-12 w-auto mb-5"
          />

          <p className="text-white/60 text-sm leading-relaxed">
            Premium research-grade compounds built on science, quality, and
            transparency.
          </p>

          <div className="flex gap-3 mt-6">
            <a
              href="https://www.tiktok.com/@apexx.nyc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
            >
              <FaTiktok size={18} />
            </a>

            <a
              href="https://x.com/ApexxBiolabsLLC"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
            >
              <FaXTwitter size={18} />
            </a>

            <a
              href="mailto:support@apexxbiolabs.com"
              aria-label="Email"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-400/40 hover:bg-white/[0.07] transition-all"
            >
              <HiOutlineMail size={18} />
            </a>
          </div>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="text-white font-bold uppercase tracking-widest mb-5 text-sm">
              {section.title}
            </h4>

            <div className="space-y-3 text-white/50">
              {section.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block hover:text-blue-300 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
        <p>© 2026 Apexx Biolabs. All rights reserved.</p>

        <p>SSL Secured · 99%+ Purity · Research Use Only</p>

        <a
          href="https://www.jovavo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-300 transition-all"
        >
          Crafted by Jovavo →
        </a>
      </div>
    </footer>
  );
}