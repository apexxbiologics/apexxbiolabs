export default function ContactPage() {
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
          Contact Apexx
        </p>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent mb-8">
          Support & Research
          <br />
          Inquiries
        </h1>

        <div className="h-[1px] w-72 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-10"></div>

        <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed font-light mb-10">
          Contact Apexx Biolabs for product inquiries, COA requests, batch
          information, order support, shipping updates, and research-use
          questions.
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-blue-700 bg-blue-950/20 text-blue-300 text-sm uppercase tracking-widest mb-16">
          <span>✓</span>
          <span>Research Use Only • Professional Support</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <a
            href="https://www.tiktok.com/@apexx.nyc"
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-blue-900 rounded-3xl p-10 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_45px_rgba(37,99,235,0.28)] hover:-translate-y-2 transition-all duration-300 text-left"
          >
            <div className="w-16 h-16 rounded-2xl border border-blue-700 bg-blue-950/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.25)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.45)] transition-all">
              <div className="text-4xl font-black text-blue-400">
                ♪
              </div>
            </div>

            <p className="uppercase tracking-widest text-blue-500 text-sm mb-3">
              TikTok
            </p>

            <h2 className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors mb-4">
              @apexx.nyc
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Follow for product updates, announcements, laboratory content,
              COA updates, and new releases.
            </p>
          </a>

          <a
            href="mailto:support@apexxbiolabs.com"
            className="group border border-blue-900 rounded-3xl p-10 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_45px_rgba(37,99,235,0.28)] hover:-translate-y-2 transition-all duration-300 text-left"
          >
            <div className="w-16 h-16 rounded-2xl border border-blue-700 bg-blue-950/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.25)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.45)] transition-all">
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

            <p className="uppercase tracking-widest text-blue-500 text-sm mb-3">
              Email Support
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-blue-300 transition-colors mb-4 break-all">
              support@apexxbiolabs.com
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Contact us regarding orders, COAs, product availability, shipping
              updates, and support requests.
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
              className="border border-blue-900 rounded-2xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">
                {item.title}
              </h3>

              <p className="text-gray-500 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="border border-blue-900 rounded-3xl p-8 md:p-10 bg-[#050505] text-left shadow-[0_0_40px_rgba(37,99,235,0.12)]">
          <p className="uppercase tracking-[0.35em] text-blue-500 text-sm mb-5">
            Compliance Notice
          </p>

          <h3 className="text-3xl font-bold text-white mb-5">
            Research-use communication only.
          </h3>

          <p className="text-gray-400 leading-relaxed">
            Apexx Biolabs supplies products intended exclusively for scientific,
            analytical, and educational laboratory research applications. We do
            not provide medical advice, treatment recommendations, dosing
            instructions, or guidance regarding human use of any product.
          </p>
        </div>

        <p className="mt-12 text-center text-xs text-gray-600 uppercase tracking-widest leading-relaxed">
          FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION. NOT FOR
          MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
        </p>
      </section>
    </main>
  );
}