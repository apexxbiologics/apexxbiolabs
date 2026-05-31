export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <a
        href="/"
        className="text-blue-400 uppercase tracking-widest text-sm hover:text-blue-300 transition-all"
      >
        ← Back to Home
      </a>

      <section className="max-w-6xl mx-auto mt-16 text-center">
        <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
          Contact
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 bg-clip-text text-transparent mb-8">
          Contact Apexx Biolabs
        </h1>

        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed mb-14">
          For product inquiries, COA requests, batch information, order support,
          shipping updates, and general research-use questions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <a
            href="https://www.instagram.com/apexxbiolabs"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-blue-900 rounded-3xl p-10 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all text-left"
          >
            <div className="w-16 h-16 rounded-2xl border border-blue-700 bg-blue-950/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.25)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-9 h-9"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </div>

            <p className="uppercase tracking-widest text-blue-500 text-sm mb-3">
              Instagram
            </p>

            <h2 className="text-3xl font-bold text-blue-400 mb-4">
              @apexxbiolabs
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Follow for product updates, announcements, laboratory content,
              COA updates, and new releases.
            </p>
          </a>

          <a
            href="mailto:support@apexxbiolabs.com"
            className="border border-blue-900 rounded-3xl p-10 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all text-left"
          >
            <div className="w-16 h-16 rounded-2xl border border-blue-700 bg-blue-950/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.25)]">
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

            <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-4 break-all">
              support@apexxbiolabs.com
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Contact us regarding orders, COAs, product availability, shipping
              updates, and support requests.
            </p>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="border border-blue-900 rounded-2xl p-8 bg-[#050505]">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Research Use Only
            </h3>
            <p className="text-gray-500 leading-relaxed">
              All products are intended strictly for lawful laboratory research
              use only.
            </p>
          </div>

          <div className="border border-blue-900 rounded-2xl p-8 bg-[#050505]">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Secure Packaging
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Orders are packaged carefully, securely, and professionally.
            </p>
          </div>

          <div className="border border-blue-900 rounded-2xl p-8 bg-[#050505]">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Business Hours
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Monday – Friday
              <br />
              9:00 AM – 5:00 PM EST
              <br />
              Replies are typically sent within 24–48 business hours.
            </p>
          </div>
        </div>

        <div className="mt-12 border border-blue-900 rounded-3xl p-8 bg-[#050505] text-left">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">
            Compliance Notice
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