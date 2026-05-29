export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-10 py-24">
      <a
        href="/"
        className="text-blue-400 uppercase tracking-widest text-sm"
      >
        ← Back to Home
      </a>

      <section className="max-w-5xl mx-auto mt-20 text-center">
        <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-6">
          Contact
        </p>

        <h1 className="text-6xl font-bold mb-8">
          Contact Apexx Biologics
        </h1>

        <p className="text-gray-400 text-lg mb-14">
          For product inquiries, batch information, and order support.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a
            href="https://www.instagram.com/apexxbiologics"
            target="_blank"
            className="border border-blue-900 rounded-2xl p-10 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] transition-all"
          >
            <h2 className="text-3xl font-bold mb-4">Instagram</h2>
            <p className="text-blue-400 text-xl">@apexxbiologics</p>
          </a>

          <a
            href="mailto:apexxbiologicsllc@gmail.com"
            className="border border-blue-900 rounded-2xl p-10 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] transition-all"
          >
            <h2 className="text-3xl font-bold mb-4">Email</h2>
            <p className="text-blue-400 text-xl">
              apexxbiologicsllc@gmail.com
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}