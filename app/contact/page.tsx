export default function ContactPage() {
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

      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
            Contact Apexx
          </p>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
            Support & Research
            <br />
            Inquiries
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-10">
            Contact Apexx Biolabs for product inquiries, COA requests, batch
            information, order support, shipping updates, and research-use
            questions.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.04] text-blue-300 text-sm uppercase tracking-widest mb-16">
            <span>✓</span>
            <span>Research Use Only • Professional Support</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14 text-left">
            <a
              href="https://www.tiktok.com/@apexx.nyc"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 hover:bg-white/[0.07] hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[#102A4A] flex items-center justify-center text-blue-300 mb-6">
                <div className="text-4xl font-black">♪</div>
              </div>

              <p className="uppercase tracking-widest text-blue-300 text-sm mb-3">
                TikTok
              </p>

              <h2 className="text-3xl font-black text-white mb-4">
                @apexx.nyc
              </h2>

              <p className="text-white/60 leading-relaxed">
                Follow for product updates, announcements, laboratory content,
                COA updates, and new releases.
              </p>
            </a>

            <a
              href="mailto:support@apexxbiolabs.com"
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 hover:bg-white/[0.07] hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[#102A4A] flex items-center justify-center text-blue-300 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 7.5v9A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0L12 13.5 2.25 7.5m19.5 0A2.25 2.25 0 0 0 19.5 5.25h-15A2.25 2.25 0 0 0 2.25 7.5"
                  />
                </svg>
              </div>

              <p className="uppercase tracking-widest text-blue-300 text-sm mb-3">
                Email Support
              </p>

              <h2 className="text-2xl md:text-3xl font-black text-white mb-4 break-all">
                support@apexxbiolabs.com
              </h2>

              <p className="text-white/60 leading-relaxed">
                Contact us regarding orders, COAs, product availability,
                shipping updates, and support requests.
              </p>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            {[
              {
                title: "Research Use Only",
                text:
                  "All products are intended strictly for lawful laboratory research use only.",
              },
              {
                title: "Secure Packaging",
                text:
                  "Orders are packaged carefully, securely, and professionally.",
              },
              {
                title: "Business Hours",
                text:
                  "Monday – Friday, 9:00 AM – 5:00 PM EST. Replies are typically sent within 24–48 business hours.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all duration-300"
              >
                <h3 className="text-xl font-black text-white mb-4">
                  {item.title}
                </h3>

                <p className="text-white/60 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10 text-left">
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
              Compliance Notice
            </p>

            <h3 className="text-3xl font-black text-white mb-5">
              Research-use communication only.
            </h3>

            <p className="text-white/60 leading-relaxed">
              Apexx Biolabs supplies products intended exclusively for
              scientific, analytical, and educational laboratory research
              applications. We do not provide medical advice, treatment
              recommendations, dosing instructions, or guidance regarding human
              use of any product.
            </p>
          </div>

          <p className="mt-12 text-center text-xs text-white/35 uppercase tracking-widest leading-relaxed">
            FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION. NOT FOR
            MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
          </p>
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