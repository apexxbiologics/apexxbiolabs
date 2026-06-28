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
  ];

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">
      <header className="border-b border-white/10 bg-[#081526]/95 backdrop-blur-xl px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/">
            <img
              src="/images/logo.png"
              alt="Apexx Biolabs"
              className="h-12 w-auto"
            />
          </a>

          <a
            href="/"
            className="border border-white/10 bg-white/[0.04] text-white rounded-full px-6 py-3 text-xs uppercase tracking-widest hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
          >
            Home
          </a>
        </div>
      </header>

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
            <span>Last Updated: June 23, 2026</span>
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

      <footer className="bg-[#081526] border-t border-blue-900/40 px-6 pt-24 pb-10">

  <div className="max-w-7xl mx-auto">

    {/* TOP */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">

      {/* BRAND */}
      <div>
        <img
          src="/images/logo.png"
          alt="Apexx Biolabs"
          className="h-12 w-auto mb-6"
        />

        <p className="text-white/70 leading-relaxed text-sm">
          High-purity research compounds supported by batch documentation,
          analytical testing, and research-use transparency.
        </p>
      </div>

      {/* COMPANY */}
      <div>
        <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Company
        </h4>

        <div className="space-y-4">
          <a href="/" className="block text-white/70 hover:text-white transition-all">
            Home
          </a>

          <a href="/products" className="block text-white/70 hover:text-white transition-all">
            Products
          </a>

          <a href="/coas" className="block text-white/70 hover:text-white transition-all">
            COAs
          </a>

          <a href="/contact" className="block text-white/70 hover:text-white transition-all">
            Contact
          </a>
        </div>
      </div>

      {/* RESOURCES */}
      <div>
        <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Resources
        </h4>

        <div className="space-y-4">
          <a href="/peptide-info" className="block text-white/70 hover:text-white transition-all">
            Peptide Info
          </a>

          <a href="/faq" className="block text-white/70 hover:text-white transition-all">
            FAQ
          </a>

          <a href="/shipping" className="block text-white/70 hover:text-white transition-all">
            Shipping
          </a>

          <a href="/refunds" className="block text-white/70 hover:text-white transition-all">
            Refunds
          </a>
        </div>
      </div>

      {/* CONTACT */}
      <div>
        <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Contact
        </h4>

        <div className="space-y-4">
          <a
            href="mailto:support@apexxbiolabs.com"
            className="block text-white/70 hover:text-white transition-all"
          >
            support@apexxbiolabs.com
          </a>

          <a
            href="https://www.tiktok.com/@apexx.nyc"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-white/70 hover:text-white transition-all"
          >
            TikTok
          </a>
        </div>
      </div>

    </div>

    {/* DISCLAIMER */}
    <div className="border-t border-white/10 pt-10">

      <p className="text-white/40 text-xs uppercase tracking-[0.18em] leading-relaxed max-w-5xl">
        FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION.
        NOT FOR MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
      </p>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">

        <p className="text-white/40 text-sm">
          © 2026 Apexx Biolabs. All Rights Reserved.
        </p>

        <div className="flex gap-8 text-sm text-white/40">
          <a href="/privacy" className="hover:text-white transition-all">
            Privacy
          </a>

          <a href="/terms" className="hover:text-white transition-all">
            Terms
          </a>

          <a href="/shipping" className="hover:text-white transition-all">
            Shipping
          </a>
        </div>

      </div>

    </div>

  </div>

</footer>

    </main>
  );
}