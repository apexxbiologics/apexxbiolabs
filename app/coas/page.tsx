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

{ name: "KPV", batch: "Pending", status: "Awaiting Testing" },
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
  batch: "CJCIPA504292026-09",
  status: "Verified",
  purity: "Verified",
  content: "5mg / 5mg",
  coa: "/images/coas/cjc-ipa-no-dac-coa.pdf",
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

<h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent">
  Certificates of Analysis
</h1>

<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-800 bg-blue-950/20 text-sm text-blue-300 mb-8">
  <span>✓</span>
  <span>Last Updated: June 19, 2026</span>
</div>
<div className="mt-6 h-[1px] w-64 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent">

</div>


<p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed font-light">          
Third-party analytical verification and batch documentation supporting research transparency, quality assurance, and product integrity.        
</p>
</section>

<div className="flex justify-center mb-16 mt-16">
  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-green-500/30 bg-green-500/5">
    <span className="text-green-400">✓</span>
    <span className="text-green-300 uppercase tracking-widest text-sm">
      All Verified Products Independently Tested
    </span>
  </div>
</div>

<section className="px-10 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {products.map((product) => (
            <div
              key={product.name}
              className="min-h-[260px] flex flex-col justify-between border border-blue-900 rounded-2xl p-8 bg-[#050505]hover:shadow-[0_0_50px_rgba(37,99,235,0.35)]
hover:-translate-y-2
duration-300 transition-all"
            >
              <div>
<h2 className="text-3xl font-bold mb-6 tracking-tight text-white group-hover:text-blue-300 transition-colors">                  {product.name}
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
  <>
    {product.status === "Verified" && (
      <div className="mb-4 text-center">
        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 text-xs uppercase tracking-widest">
          ✓ Third-Party Verified
        </span>
      </div>
    )}

    <a
      href={product.coa}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full border border-blue-700 py-4 uppercase tracking-widest text-sm hover:bg-blue-700 transition-all rounded-lg text-center block"
    >
      View COA
    </a>
  </>
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