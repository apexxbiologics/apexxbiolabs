export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <a href="/" className="text-blue-400 uppercase tracking-widest text-sm">
        ← Back to Home
      </a>

      <section className="max-w-7xl mx-auto mt-16 text-center">
        <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
          Contact
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 bg-clip-text text-transparent mb-8">
          Contact Apexx Biolabs
        </h1>

        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed mb-14">
          Questions regarding products, COAs, order support, shipping, or
          general research inquiries? Reach out below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <a
            href="https://www.instagram.com/apexxbiolabs"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-blue-900 rounded-3xl p-10 bg-[#050505] text-left"
          >
            <div className="text-blue-400 text-4xl mb-6">◎</div>
            <h2 className="text-3xl font-bold text-blue-400 mb-4">
              @apexxbiolabs
            </h2>
            <p className="text-gray-400">
              Follow for product updates, announcements, and new releases.
            </p>
          </a>

          <a
            href="mailto:support@apexxbiolabs.com"
            className="border border-blue-900 rounded-3xl p-10 bg-[#050505] text-left"
          >
            <div className="text-blue-400 text-4xl mb-6">✉</div>
            <h2 className="text-3xl font-bold text-blue-400 mb-4">
              support@apexxbiolabs.com
            </h2>
            <p className="text-gray-400">
              Contact us regarding orders, COAs, product availability, shipping,
              and support requests.
            </p>
          </a>
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
      </section>
    </main>
  );
}