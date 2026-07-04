import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ProcessPage() {
  const steps = [
    {
      number: "01",
      icon: "flask",
      title: "Sourcing",
      text: "Research materials are sourced from verified supplier channels with an emphasis on consistency and documentation.",
    },
    {
      number: "02",
      icon: "clipboard",
      title: "Testing & Verification",
      text: "Batch documentation is reviewed for identity, purity, content, and supporting COA verification when available.",
    },
    {
      number: "03",
      icon: "shield",
      title: "Batch Tracking",
      text: "Products are organized with batch-level information to support traceability, transparency, and consistency.",
    },
    {
      number: "04",
      icon: "vial",
      title: "Professional Packaging",
      text: "Materials are prepared with secure, professional, and tamper-conscious packaging standards.",
    },
    {
      number: "05",
      icon: "box",
      title: "Secure Shipping",
      text: "Orders are packaged carefully and shipped discreetly with tracking information when available.",
    },
    {
      number: "06",
      icon: "check",
      title: "Delivery & Support",
      text: "Customers receive order support for fulfillment updates, batch documentation, and research-use inquiries.",
    },
  ];

  const renderIcon = (icon: string) => {
    if (icon === "flask") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-12 h-12 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 2v5l-5 8a4 4 0 003.4 6h7.2A4 4 0 0019 15l-5-8V2" />
        </svg>
      );
    }

    if (icon === "clipboard") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-12 h-12 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 2h3v16H5V5h3l1-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-5" />
        </svg>
      );
    }

    if (icon === "shield") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-12 h-12 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-6" />
        </svg>
      );
    }

    if (icon === "vial") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-12 h-12 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 2h6v4l3 5v9H6v-9l3-5V2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 15h8" />
        </svg>
      );
    }

    if (icon === "box") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-12 h-12 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v10" />
        </svg>
      );
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-12 h-12 text-blue-400">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-6" />
      </svg>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <a
        href="/"
        className="text-blue-400 uppercase tracking-widest text-sm hover:text-blue-300 transition-all"
      >
        ← Back to Home
      </a>

      <section className="max-w-7xl mx-auto mt-16 text-center">
        <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
          Apexx Biolabs
        </p>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent mb-8">
          Our Process
        </h1>

        <div className="h-[1px] w-72 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-10"></div>

        <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed font-light mb-10">
          From sourcing to delivery, each step is designed to support
          consistency, traceability, secure handling, and a professional
          research-use experience.
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-blue-700 bg-blue-950/20 text-blue-300 text-sm uppercase tracking-widest mb-20">
          <span>✓</span>
          <span>Quality Focused • Batch Tracked • Research Use Only</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 text-left">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_45px_rgba(37,99,235,0.28)] hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl border border-blue-700 bg-blue-950/30 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.25)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.45)] transition-all">
                  {renderIcon(step.icon)}
                </div>

                <span className="text-5xl font-black text-blue-950 group-hover:text-blue-800 transition-colors">
                  {step.number}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors mb-4">
                {step.title}
              </h2>

              <div className="h-[1px] w-full bg-gradient-to-r from-blue-700 via-blue-950 to-transparent mb-5" />

              <p className="text-gray-400 leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-16 border border-blue-900 rounded-3xl p-6 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">
          {[
            "COA Verified",
            "Research Use Only",
            "Secure & Discreet",
            "Batch Tracked",
            "Quality Focused",
          ].map((item) => (
            <div
              key={item}
              className="border border-blue-950 rounded-2xl px-4 py-4 text-blue-400 uppercase tracking-widest text-xs font-semibold bg-black/40"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-12 border border-blue-900 rounded-3xl p-8 bg-[#050505]">
          <p className="text-gray-300 uppercase tracking-[0.25em] text-sm leading-relaxed">
            For laboratory research use only.
            <span className="text-blue-400">
              {" "}
              Not intended for human or veterinary use.
            </span>
          </p>
        </div>
      </section>

            <footer className="bg-[#081526] border-t border-white/10 px-6 md:px-10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
          <div>
            <img
              src="/images/logo.png"
              alt="Apexx Biolabs"
              className="h-12 w-auto mb-5"
            />

            <p className="text-white/60 text-sm leading-relaxed">
              Premium research-grade peptides built on science, quality, and transparency.
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

          {[
            ["Shop", [["All Products", "/products"], ["Certificates of Analysis", "/coas"]]],
            ["Resources", [["Research Library", "/peptide-info"], ["FAQ", "/faq"]]],
            ["Support", [["Contact Us", "/contact"], ["Shipping Info", "/shipping"], ["Returns & Refunds", "/refunds"]]],
            ["Legal", [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]]],
          ].map(([title, links]: any) => (
            <div key={title}>
              <h4 className="text-white font-bold uppercase tracking-widest mb-5 text-sm">
                {title}
              </h4>

              <div className="space-y-3 text-white/50">
                {links.map(([label, href]: any) => (
                  <a key={label} href={href} className="block hover:text-blue-300">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-4 text-white/40 text-sm">
          <p>© 2026 Apexx Biolabs. All rights reserved.</p>
          <p>SSL Secured · 99%+ Purity · Research Use Only</p>
        </div>
      </footer>
      
    </main>
  );
}