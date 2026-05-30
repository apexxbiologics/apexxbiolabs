import {
  Search,
  FlaskConical,
  ClipboardCheck,
  ShieldCheck,
  Package,
  Truck,
} from "lucide-react";

export default function ProcessPage() {
  const steps = [
    {
      number: "01",
      icon: <Search size={34} />,
      title: "Product Sourcing",
      text: "Research materials are sourced from trusted manufacturing partners with strict quality standards.",
    },
    {
      number: "02",
      icon: <FlaskConical size={34} />,
      title: "Analytical Testing",
      text: "Products are reviewed for identity, purity, and consistency through quality-focused testing procedures.",
    },
    {
      number: "03",
      icon: <ClipboardCheck size={34} />,
      title: "Batch Verification",
      text: "Each batch is documented for traceability, internal review, and COA organization.",
    },
    {
      number: "04",
      icon: <ShieldCheck size={34} />,
      title: "Quality Review",
      text: "Products are reviewed before release to ensure labeling, documentation, and presentation standards are met.",
    },
    {
      number: "05",
      icon: <Package size={34} />,
      title: "Secure Packaging",
      text: "Orders are prepared in professional packaging designed to maintain product integrity during fulfillment.",
    },
    {
      number: "06",
      icon: <Truck size={34} />,
      title: "Tracked Delivery",
      text: "Orders are shipped securely with tracking information provided after fulfillment.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-8 py-24">
      <a href="/" className="text-blue-400 uppercase tracking-widest text-sm">
        ← Back to Home
      </a>

      <section className="max-w-7xl mx-auto mt-20">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
            Our Process
          </p>

          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-700 bg-clip-text text-transparent">
            From Sourcing to Delivery
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-4xl mx-auto mt-8 leading-relaxed">
            Every step is designed around consistency, traceability, secure
            handling, and professional research-use standards.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-700 via-cyan-400 to-blue-900"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                }`}
              >
                <div
                  className={`md:w-[46%] border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.22)] transition-all ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <div
                    className={`flex items-center gap-5 mb-6 ${
                      index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                    }`}
                  >
                    <div className="text-blue-400">{step.icon}</div>

                    <div>
                      <p className="text-blue-500 text-xs uppercase tracking-[0.3em] mb-2">
                        Step {step.number}
                      </p>

                      <h2 className="text-3xl font-bold text-white">
                        {step.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed text-lg">
                    {step.text}
                  </p>
                </div>

                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border border-blue-600 bg-black items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.45)]">
                  <span className="text-blue-400 font-bold">
                    {step.number}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-20 text-center text-xs text-gray-600 uppercase tracking-widest leading-relaxed">
          For laboratory research use only. Not for human consumption.
        </p>
      </section>
    </main>
  );
}