import {
  FlaskConical,
  ClipboardCheck,
  ShieldCheck,
  Package,
  Truck,
  CheckCircle,
} from "lucide-react";

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-black text-white px-10 py-24">
      <a href="/" className="text-blue-400 uppercase tracking-widest text-sm">
        ← Back to Home
      </a>

      <section className="max-w-7xl mx-auto mt-24">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-6">
            Quality • Transparency • Reliability
          </p>

          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-700 bg-clip-text text-transparent">
            Our Process
          </h1>

          <p className="text-gray-400 text-xl max-w-4xl mx-auto mt-8 leading-relaxed">
            From sourcing to delivery, every step is designed to maintain
            consistency, traceability, and professional research standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[
            {
              number: "01",
              icon: <FlaskConical size={42} />,
              title: "Sourcing",
              text: "Research compounds are sourced from trusted manufacturing partners with strict quality standards and analytical verification.",
            },
            {
              number: "02",
              icon: <ClipboardCheck size={42} />,
              title: "Testing & Verification",
              text: "Products undergo identity, purity, and batch verification procedures to ensure consistency and transparency.",
            },
            {
              number: "03",
              icon: <ShieldCheck size={42} />,
              title: "Batch Tracking",
              text: "Every product batch is labeled and documented internally for traceability and inventory management.",
            },
            {
              number: "04",
              icon: <Package size={42} />,
              title: "Professional Packaging",
              text: "Products are carefully packaged in secure, professional packaging designed to preserve product integrity.",
            },
            {
              number: "05",
              icon: <Truck size={42} />,
              title: "Secure Shipping",
              text: "Orders are shipped discreetly with tracking information provided once fulfillment is complete.",
            },
            {
              number: "06",
              icon: <CheckCircle size={42} />,
              title: "Support & Transparency",
              text: "Our team remains committed to responsive communication, transparency, and customer support throughout the process.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="border border-blue-900 rounded-2xl p-10 bg-[#050505] hover:border-blue-500 transition-all hover:shadow-[0_0_35px_rgba(37,99,235,0.18)]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="text-blue-400">{step.icon}</div>

                <div className="w-14 h-14 rounded-full border border-blue-700 flex items-center justify-center text-blue-400 font-bold text-lg">
                  {step.number}
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6">{step.title}</h2>

              <p className="text-gray-400 leading-relaxed text-lg">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-xs text-gray-600 uppercase tracking-widest leading-relaxed">
          For laboratory research use only. Not for human consumption.
        </p>
      </section>
    </main>
  );
}