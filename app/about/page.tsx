export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <a
        href="/"
        className="text-blue-400 uppercase tracking-widest text-sm hover:text-blue-300 transition-all"
      >
        ← Back to Home
      </a>

      <section className="max-w-7xl mx-auto mt-16">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
            About Apexx
          </p>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent mb-8">
            Scientific Precision.
            <br />
            Trusted Quality.
          </h1>

          <div className="h-[1px] w-72 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-10"></div>

          <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed font-light">
            Apexx Biolabs supplies laboratory research compounds intended
            strictly for scientific, educational, and analytical research
            purposes only.
          </p>

          <div className="mt-10 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-blue-700 bg-blue-950/20 text-blue-300 text-sm uppercase tracking-widest">
            <span>✓</span>
            <span>Research Use Only • Batch Transparency • Quality Focused</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
            <div className="text-blue-400 text-4xl mb-5">✓</div>
            <h2 className="text-2xl font-bold mb-4">
              Quality Controlled
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Products are handled with internal quality-control standards,
              professional review, and batch-level documentation.
            </p>
          </div>

          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
            <div className="text-blue-400 text-4xl mb-5">⚗</div>
            <h2 className="text-2xl font-bold mb-4">
              Research Standards
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Materials are presented for lawful laboratory research,
              analytical reference, and educational research applications.
            </p>
          </div>

          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
            <div className="text-blue-400 text-4xl mb-5">🔬</div>
            <h2 className="text-2xl font-bold mb-4">
              Batch Transparency
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Supporting documentation and COAs are maintained to promote
              consistency, traceability, and transparency.
            </p>
          </div>
        </div>

        <div className="border border-blue-900 rounded-[2rem] p-8 md:p-14 bg-[#050505] shadow-[0_0_45px_rgba(37,99,235,0.15)] mb-12">
          <p className="uppercase tracking-[0.35em] text-blue-500 text-sm mb-6">
            Our Mission
          </p>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
            Built around consistency, transparency, and research integrity.
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed">
            Apexx Biolabs is committed to supplying professionally packaged
            laboratory research materials with an emphasis on consistency,
            traceability, transparent labeling, and dependable customer support.
            Our goal is to support scientific, analytical, and educational
            laboratory applications while maintaining a strict research-use-only
            business model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            {
              title: "Quality & Traceability",
              text:
                "Our products are manufactured, labeled, and packaged with an emphasis on consistency, batch traceability, and professional presentation.",
            },
            {
              title: "Research Compliance",
              text:
                "All products sold by Apexx Biolabs are intended exclusively for in-vitro laboratory research and are not intended for human or veterinary use.",
            },
            {
              title: "Customer Responsibility",
              text:
                "Customers are responsible for ensuring compliance with applicable federal, state, and local laws regarding laboratory research materials.",
            },
            {
              title: "No Human-Use Guidance",
              text:
                "Apexx Biolabs does not provide dosing instructions, treatment recommendations, medical advice, or guidance regarding human use of any product.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.22)] transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-blue-400 mb-5">
                {item.title}
              </h2>

              <p className="text-gray-400 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="border border-blue-900 rounded-3xl p-8 md:p-10 bg-[#050505] mb-12">
          <h2 className="text-3xl font-bold text-blue-400 mb-8">
            Our Standards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              "Quality Controlled",
              "Research Use Only",
              "Secure Packaging",
              "Batch Traceability",
            ].map((standard) => (
              <div
                key={standard}
                className="border border-blue-950 rounded-2xl p-6 bg-black/40"
              >
                <h3 className="text-blue-400 font-bold mb-3">
                  {standard}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Maintained to support professional research documentation,
                  quality review, and product integrity.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] text-center">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">
            Contact Apexx Biolabs
          </h2>

          <p className="text-gray-400 mb-6">
            For product inquiries, batch information, COAs, and research-use support.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 text-gray-400">
            <a
              href="mailto:support@apexxbiolabs.com"
              className="hover:text-blue-400 transition-all"
            >
              support@apexxbiolabs.com
            </a>

            <a
              href="https://www.tiktok.com/@apexx.nyc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-all"
            >
              @apexx.nyc
            </a>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-gray-600 uppercase tracking-widest leading-relaxed">
          FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION. NOT FOR
          MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
        </p>
      </section>
    </main>
  );
}