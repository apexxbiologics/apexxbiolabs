import {
  FlaskConical,
  ShieldCheck,
  Ban,
  FileCheck,
  Headset,
  Lock,
  BadgeCheck,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-24">
      <a href="/" className="text-blue-400 uppercase tracking-widest text-sm">
        ← Back to Home
      </a>

      <section className="max-w-6xl mx-auto mt-16">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
            About
          </p>

          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-700 bg-clip-text text-transparent">
            Apexx Biologics
          </h1>
        </div>

        <div className="space-y-10">
          {[
  {
    icon: <FlaskConical size={46} />,
    text: "APEXX Biologics supplies laboratory research compounds intended strictly for scientific, educational, and analytical research purposes only.",
  },

  {
    icon: <ShieldCheck size={46} />,
    text: "Our products are manufactured and packaged with an emphasis on consistency, traceability, and professional presentation. Each batch is labeled and handled according to internal quality-control standards.",
  },

  {
    icon: <Ban size={46} />,
    text: "All products sold by APEXX Biologics are intended exclusively for in-vitro laboratory research and are NOT intended for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of any disease or condition.",
  },

  {
    icon: <FileCheck size={46} />,
    text: "By purchasing from APEXX Biologics, customers acknowledge that all materials are being obtained solely for lawful research purposes and will be handled only by qualified individuals familiar with research materials and laboratory procedures.",
  },

  {
    icon: <Headset size={46} />,
    text: "APEXX Biologics is committed to maintaining a professional research-focused brand with secure packaging, transparent labeling, and dependable customer support.",
  },
].map((item, index) => (
  <div
    key={index}
    className="flex gap-8 items-start border-b border-blue-950 pb-10"
  >
    <div className="text-blue-400 shrink-0 mt-1">
      {item.icon}
    </div>

    <p className="text-gray-300 text-xl leading-relaxed">
      {item.text}
    </p>
  </div>
))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20 text-center">
          {[
            "Purity & Quality Guaranteed",
            "Research Use Only",
            "Secure & Discreet Shipping",
            "Batch Tested",
          ].map((item) => (
            <div
              key={item}
              className="border border-blue-900 rounded-2xl p-6 bg-[#050505]"
            >
              <p className="text-blue-400 text-sm uppercase tracking-widest">
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border border-blue-900 rounded-2xl p-8 bg-[#050505] flex flex-col md:flex-row justify-center gap-8 text-center">
          <a
            href="mailto:apexxbiologicsllc@gmail.com"
            className="text-blue-400 text-lg"
          >
            APEXXBIOLOGICSLLC@gmail.com
          </a>

          <a
            href="https://www.instagram.com/apexxbiologics"
            target="_blank"
            className="text-blue-400 text-lg"
          >
            @apexxbiologics
          </a>
        </div>
      </section>
    </main>
  );
}