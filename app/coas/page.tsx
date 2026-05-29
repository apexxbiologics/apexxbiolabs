export default function COAsPage() {
  const products = [
    "Retatrutide",
    "BPC-157",
    "TB-500",
    "Bacteriostatic Water",
    "KPV",
    "GHK-Cu",
    "Pinealon",
    "Selank",
    "Semax",
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-10 py-6 border-b border-blue-900 bg-black">
        <a
          href="/"
          className="text-sm uppercase tracking-widest text-blue-400 hover:text-blue-300"
        >
          ← Back to Home
        </a>

        <p className="uppercase tracking-[0.3em] text-gray-400 text-xs">
          Apexx Biologics
        </p>
      </header>

      <section className="text-center py-28 px-6 border-b border-blue-950">
        <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-6">
          Quality Assurance
        </p>

        <h1 className="text-6xl font-bold mb-8">
          Certificates of Analysis
        </h1>

        <p className="text-gray-400 text-lg max-w-4xl mx-auto leading-relaxed">
          Analytical verification and batch documentation intended to support
          research transparency and quality assurance.
        </p>
      </section>

      <section className="px-10 py-24">
<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">          {products.map((product) => (
            <div
              key={product}
className="min-h-[230px] flex flex-col justify-between border border-blue-900 rounded-2xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] transition-all"            >
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {product}
                </h2>

                <div className="space-y-4 text-gray-400 text-sm mb-8">
                  <div className="flex justify-between border-b border-blue-950 pb-3">
                    <span>Batch</span>
                    <span>Pending</span>
                  </div>

                  <div className="flex justify-between border-b border-blue-950 pb-3">
                    <span>Status</span>
                    <span>Awaiting Testing</span>
                  </div>
                </div>
              </div>

              <button className="w-full border border-blue-700 py-4 uppercase tracking-widest text-sm hover:bg-blue-700 transition-all rounded-lg">
                COA Coming Soon
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}