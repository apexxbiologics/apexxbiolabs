export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <a
        href="/"
        className="text-blue-400 uppercase tracking-widest text-sm hover:text-blue-300 transition-all"
      >
        ← Back to Home
      </a>

      <section className="max-w-6xl mx-auto mt-20">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
            Contact
          </p>

          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600 bg-clip-text text-transparent">
            Contact Apexx Biolabs
          </h1>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Questions regarding products, COAs, order support, shipping, or
            general research inquiries? Reach out below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <a
            href="https://www.instagram.com/apexxbiolabs"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-blue-900 rounded-3xl p-10 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_40px_rgba(37,99,235,0.25)] transition-all"
          >
            <div className="flex items-center gap-5 mb-6">
              <span className="text-5xl text-blue-400">📷</span>

              <div>
                <p className="uppercase tracking-[0.3em] text-blue-500 text-xs mb-2">
                  Instagram
                </p>

                <h2 className="text-3xl font-bold">Follow Us</h2>
              </div>
            </div>

            <p className="text-blue-400 text-xl font-semibold">
              @apexxbiolabs
            </p>

            <p className="text-gray-500 mt-6 leading-relaxed">
              Follow for product updates, announcements, laboratory content,
              and new releases.
            </p>
          </a>

          <a
            href="mailto:support@apexxbiolabs.com"
            className="border border-blue-900 rounded-3xl p-10 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_40px_rgba(37,99,235,0.25)] transition-all"
          >
            <div className="flex items-center gap-5 mb-6">
              <span className="text-5xl text-blue-400">✉️</span>

              <div>
                <p className="uppercase tracking-[0.3em] text-blue-500 text-xs mb-2">
                  Email
                </p>

                <h2 className="text-3xl font-bold">Email Support</h2>
              </div>
            </div>

            <p className="text-blue-400 text-xl font-semibold break-all">
              support@apexxbiolabs.com
            </p>

            <p className="text-gray-500 mt-6 leading-relaxed">
              Contact us regarding orders, COAs, product availability, shipping
              updates, and support requests.
            </p>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="border border-blue-900 rounded-2xl p-8 bg-[#050505]">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Research Use Only
            </h3>

            <p className="text-gray-500 leading-relaxed">
              All products are intended strictly for laboratory research use.
            </p>
          </div>

          <div className="border border-blue-900 rounded-2xl p-8 bg-[#050505]">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Secure Packaging
            </h3>

            <p className="text-gray-500 leading-relaxed">
              Orders are packaged carefully and professionally.
            </p>
          </div>

          <div className="border border-blue-900 rounded-2xl p-8 bg-[#050505]">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Fast Support
            </h3>

            <p className="text-gray-500 leading-relaxed">
              Reach out anytime regarding products or existing orders.
            </p>
          </div>
        </div>

        <p className="mt-20 text-center text-xs text-gray-600 uppercase tracking-widest leading-relaxed">
          For laboratory research use only. Not for human consumption, medical
          use, veterinary use, diagnosis, treatment, cure, or prevention of
          disease.
        </p>
      </section>
    </main>
  );
}