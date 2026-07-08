import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function COAsPage() {
  const products = [
    {
      name: "APX-3",
      batch: "Blue Cap-1",
      status: "Verified",
      purity: "99.92%",
      content: "23.89 mg",
      coa: "/images/coas/apx3-20mg-blue-cap-coa.pdf",
    },
    {
      name: "BPC-157",
      batch: "Black Cap-1",
      status: "Verified",
      purity: "99.33%",
      content: "11.58 mg",
      coa: "/images/coas/bpc-157-10mg-black-cap-coa.pdf",
    },
    {
      name: "TB-500",
      batch: "Blue Cap-1",
      status: "Verified",
      purity: "99.47%",
      content: "11.83 mg",
      coa: "/images/coas/tb500-10mg-blue-cap-coa.pdf",
    },
    {
      name: "Bacteriostatic Water",
      batch: "PRX-2026-04-A",
      status: "Verified",
      purity: "Pass",
      content: "30 mL",
      coa: "/images/coas/bacwater-coa.pdf",
    },
{
  name: "KPV",
  batch: "Purple Cap-1",
  status: "Verified",
  purity: "99.60%",
  content: "10.41 mg",
  coa: "/images/coas/6-26-kpv-coa.pdf",
},
    { name: "GHK-Cu", batch: "Pending", status: "Awaiting Testing" },
    { name: "Pinealon", batch: "Pending", status: "Awaiting Testing" },
    {
      name: "Selank",
      batch: "SEL1005192026-08",
      status: "Verified",
      purity: "99.62%",
      content: "11.36 mg",
      coa: "/images/coas/selank-10mg-brown-green-coa.pdf",
    },
    {
      name: "Semax",
      batch: "SEMX1005182026-10",
      status: "Verified",
      purity: "99.33%",
      content: "11.71 mg",
      coa: "/images/coas/semax-10mg-coa.pdf",
    },
{
  name: "MOTS-c",
  batch: "Light Purple Cap-1",
  status: "Verified",
  purity: "99.48%",
  content: "13.94 mg",
  coa: "/images/coas/6-26-motsc-coa.pdf",
},
    {
      name: "ARA-290",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "PE-22-28",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "Adamax",
      batch: "Pending",
      status: "Awaiting Testing",
    },
    {
      name: "CJC/IPA without DAC",
      batch: "CJCIPA504292026-09",
      status: "Verified",
      purity: "99.42%",
      content: "5mg / 5mg",
      coa: "/images/coas/cjc-ipa-no-dac-coa.pdf",
    },
    {
  name: "Tesamorelin",
  batch: "Pending",
  status: "Awaiting Testing",
},
{
  name: "NAD+",
  batch: "Pending",
  status: "Awaiting Testing",
},
{
  name: "AOD-9604",
  batch: "Pending",
  status: "Awaiting Testing",
},
{
  name: "PT-141",
  batch: "Pending",
  status: "Awaiting Testing",
},
{
  name: "Acetic Acid",
  batch: "Pending",
  status: "Awaiting Testing",
},
{
  name: "5-Amino-1MQ",
  batch: "Pending",
  status: "Awaiting Testing",
},
{
  name: "Kisspeptin-10",
  batch: "Pending",
  status: "Awaiting Testing",
},
{
  name: "KLOW",
  batch: "Pending",
  status: "Awaiting Testing",
},
{
  name: "Wolverine",
  batch: "Pending",
  status: "Awaiting Testing",
},
  ];

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      <section className="relative text-center py-24 px-6 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
            Quality Assurance
          </p>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-6">
            Certificates of Analysis
          </h1>

          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/[0.04] text-sm text-white/70 mb-10">
            <span className="text-green-400">✓</span>
<span>Last Updated: July 8, 2026</span>
          </div>

          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
            Third-party analytical verification and batch documentation
            supporting research transparency, quality assurance, and product
            integrity.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-green-500/20 bg-green-500/5">
            <span className="text-green-400">✓</span>

            <span className="text-green-300 uppercase tracking-widest text-sm">
              Independently Verified Products
            </span>
          </div>
        </div>
      </section>

      <section className="relative px-6 md:px-10 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.08),transparent_60%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div
              key={product.name}
              className="min-h-[260px] flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h2 className="text-3xl font-black tracking-tight text-white">
                    {product.name}
                  </h2>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full border text-xs uppercase tracking-widest ${
                      product.status === "Verified"
                        ? "bg-green-500/10 text-green-300 border-green-500/20"
                        : "bg-white/[0.04] text-white/40 border-white/10"
                    }`}
                  >
                    {product.status === "Verified" ? "Verified" : "Pending"}
                  </span>
                </div>

                <div className="space-y-4 text-white/60 text-sm mb-8">
                  <div className="flex justify-between border-b border-white/10 pb-3 gap-6">
                    <span>Batch</span>
                    <span className="text-white/80 text-right">
                      {product.batch}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/10 pb-3 gap-6">
                    <span>Status</span>
                    <span
                      className={
                        product.status === "Verified"
                          ? "text-green-300"
                          : "text-white/40"
                      }
                    >
                      {product.status}
                    </span>
                  </div>

                  {product.purity && (
                    <div className="flex justify-between border-b border-white/10 pb-3 gap-6">
                      <span>Purity</span>
                      <span className="text-white/80">{product.purity}</span>
                    </div>
                  )}

                  {product.content && (
                    <div className="flex justify-between border-b border-white/10 pb-3 gap-6">
                      <span>Net Content</span>
                      <span className="text-white/80">{product.content}</span>
                    </div>
                  )}
                </div>
              </div>

              {product.coa ? (
                <>
                  {product.status === "Verified" && (
                    <div className="mb-4 text-center">
                      <span className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-300 border border-green-500/20 text-xs uppercase tracking-widest">
                        ✓ Third-Party Verified
                      </span>
                    </div>
                  )}

                  <a
                    href={product.coa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-white/10 bg-white/[0.04] py-4 uppercase tracking-widest text-sm rounded-full text-center block hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
                  >
                    View COA
                  </a>
                </>
              ) : (
                <button className="w-full border border-white/10 bg-white/[0.03] py-4 uppercase tracking-widest text-sm rounded-full text-white/40 cursor-not-allowed">
                  COA Coming Soon
                </button>
              )}
            </div>
          ))}
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