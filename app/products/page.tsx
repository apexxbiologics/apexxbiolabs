export default function ProductsPage() {
  const products = [
    { name: "APX-3", desc: "10–20mg Research Peptide", image: "/images/retatrutide.PNG", href: "/products/apx3" },
    { name: "BPC-157", desc: "10mg Research Peptide", image: "/images/bpc157.PNG", href: "/products/bpc157" },
    { name: "TB-500", desc: "10mg Research Peptide", image: "/images/tb500.PNG", href: "/products/tb500" },
    { name: "Bacteriostatic Water", desc: "Research Reconstitution Solution", image: "/images/bacwater.PNG", href: "/products/bacwater" },
    { name: "KPV", desc: "10mg Research Peptide", image: "/images/kpv.PNG", href: "/products/kpv" },
    { name: "GHK-Cu", desc: "100mg Research Peptide", image: "/images/ghkcu.PNG", href: "/products/ghkcu" },
    { name: "Pinealon", desc: "10mg Research Peptide", image: "/images/pinealon.PNG", href: "/products/pinealon" },
    { name: "Selank", desc: "10mg Research Peptide", image: "/images/selank.PNG", href: "/products/selank" },
    { name: "Semax", desc: "10mg Research Peptide", image: "/images/semax.PNG", href: "/products/semax" },
    { name: "MOTS-C", desc: "10mg Research Peptide", image: "/images/motsc.PNG", href: "/products/motsc" },
    { name: "ARA-290", desc: "10mg Research Peptide", image: "/images/ara290.PNG", href: "/products/ara290" },
    { name: "PE-22-28", desc: "10mg Research Peptide", image: "/images/pe2228.PNG", href: "/products/pe2228" },
    { name: "ADAMAX", desc: "10mg Research Peptide", image: "/images/adamax.PNG", href: "/products/adamax" },
    { name: "CJC/IPA Without DAC", desc: "10mg Research Peptide", image: "/images/cjcipa.PNG", href: "/products/cjcipa" },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <a href="/" className="text-blue-400 uppercase tracking-widest text-sm">
          ← Back Home
        </a>

        <h1 className="text-5xl md:text-7xl font-black mt-10 mb-6">
          All Products
        </h1>

        <p className="text-gray-400 mb-14">
          Browse the full Apexx Biolabs research catalog.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-[#050505] border border-blue-900/60 rounded-3xl overflow-hidden hover:border-blue-400 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="bg-black h-[360px] flex items-center justify-center border-b border-blue-950">
                <img
                  src={product.image}
                  alt=""
                  className="h-72 object-contain hover:scale-105 transition-all duration-300"
                />
              </div>

              <div className="p-7">
                <h2 className="text-2xl font-black mb-3">{product.name}</h2>
                <p className="text-gray-400 mb-8">{product.desc}</p>

                <div className="flex gap-3">
                  <a
                    href="/coas"
                    className="flex-1 border border-blue-700/70 text-blue-300 rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-all"
                  >
                    COA
                  </a>

                  <a
                    href={product.href}
                    className="flex-1 bg-blue-600 text-white rounded-full py-3 text-center text-sm font-semibold uppercase tracking-widest hover:bg-blue-500 transition-all"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}