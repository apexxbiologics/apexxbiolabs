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
    { name: "Bacteriostatic Water", batch: "Pending", status: "Awaiting Testing" },
    { name: "KPV", batch: "Pending", status: "Awaiting Testing" },
    { name: "GHK-Cu", batch: "Pending", status: "Awaiting Testing" },
    { name: "Pinealon", batch: "Pending", status: "Awaiting Testing" },
    { name: "Selank", batch: "Pending", status: "Awaiting Testing" },
    { name: "Semax", batch: "Pending", status: "Awaiting Testing" },
    {
  name: "MOTS-c",
  batch: "Pending",
  status: "Awaiting Testing",
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
  batch: "Pending",
  status: "Awaiting Testing",
},
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-10 py-6 border-b border-blue-900 bg-black">
        <a href="/" className="text-sm uppercase tracking-widest text-blue-400 hover:text-blue-300">
          ← Back to Home
        </a>

        <p className="uppercase tracking-[0.3em] text-gray-400 text-xs">
          APEXX BIOLABS
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {products.map((product) => (
            <div
              key={product.name}
              className="min-h-[260px] flex flex-col justify-between border border-blue-900 rounded-2xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] transition-all"
            >
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {product.name}
                </h2>

                <div className="space-y-4 text-gray-400 text-sm mb-8">
                  <div className="flex justify-between border-b border-blue-950 pb-3">
                    <span>Batch</span>
                    <span>{product.batch}</span>
                  </div>

                  <div className="flex justify-between border-b border-blue-950 pb-3">
                    <span>Status</span>
                    <span className={product.status === "Verified" ? "text-green-400" : ""}>
                      {product.status}
                    </span>
                  </div>

                  {product.purity && (
                    <div className="flex justify-between border-b border-blue-950 pb-3">
                      <span>Purity</span>
                      <span>{product.purity}</span>
                    </div>
                  )}

                  {product.content && (
                    <div className="flex justify-between border-b border-blue-950 pb-3">
                      <span>Net Content</span>
                      <span>{product.content}</span>
                    </div>
                  )}
                </div>
              </div>

              {product.coa ? (
                <a
                  href={product.coa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-blue-700 py-4 uppercase tracking-widest text-sm hover:bg-blue-700 transition-all rounded-lg text-center"
                >
                  View COA
                </a>
              ) : (
                <button className="w-full border border-blue-900 py-4 uppercase tracking-widest text-sm rounded-lg text-gray-500 cursor-not-allowed">
                  COA Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}