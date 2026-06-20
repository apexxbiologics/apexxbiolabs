"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What are your products?",
    answer:
      "We provide premium research compounds intended strictly for laboratory and analytical research purposes only.",
  },
  {
    question: "Are your products tested?",
    answer:
      "Yes. Products are batch tested and COA verified when available to support consistency, quality, and transparency.",
  },
  {
    question: "Are your products legal?",
    answer:
      "Products are intended strictly for laboratory research use only and are not intended for human or veterinary use. Customers are responsible for complying with all applicable laws and regulations.",
  },
  {
    question: "How is my order shipped?",
    answer:
      "Orders are shipped securely and discreetly in plain, unbranded packaging to protect privacy.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders typically ship within 1–2 business days. Delivery time depends on your location and carrier.",
  },
  {
    question: "Do you offer cold shipping?",
    answer:
      "When required, temperature-conscious packaging and ice packs may be used to help maintain product integrity.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes. Once your order ships, tracking information will be provided by email or direct message.",
  },
  {
    question: "Do you provide COAs?",
    answer:
      "Yes. Certificates of Analysis will be uploaded as batch testing becomes available.",
  },
  {
    question: "Are these products for human use?",
    answer:
      "No. All products are for laboratory research use only and are not intended for human consumption, medical use, veterinary use, diagnosis, treatment, or prevention of disease.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">
      <header className="border-b border-white/10 bg-[#081526]/95 backdrop-blur-xl px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/">
            <img
              src="/images/logo.png"
              alt="Apexx Biolabs"
              className="h-12 w-auto"
            />
          </a>

          <a
            href="/"
            className="border border-white/10 bg-white/[0.04] text-white rounded-full px-6 py-3 text-xs uppercase tracking-widest hover:border-blue-400/50 hover:bg-white/[0.07] transition-all"
          >
            Home
          </a>
        </div>
      </header>

      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
            Support Center
          </p>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
            Frequently Asked
            <br />
            Questions
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Information regarding product availability, shipping, COAs,
            laboratory standards, and research-use policies.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10 mb-16">
            {["Shipping", "COAs", "Products", "Orders"].map((item) => (
              <span
                key={item}
                className="px-5 py-3 rounded-full border border-white/10 bg-white/[0.04] text-blue-300 text-sm uppercase tracking-widest"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="space-y-5 text-left">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden hover:bg-white/[0.07] hover:border-blue-400/50 transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center text-left p-7 gap-6"
                >
                  <span className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {faq.question}
                  </span>

                  <span className="text-3xl text-blue-300 shrink-0">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-7 pb-7 text-white/60 leading-relaxed text-lg border-t border-white/10 pt-5">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 text-center">
            <h2 className="text-3xl font-black text-white mb-4">
              Still Need Assistance?
            </h2>

            <p className="text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
              Contact our support team regarding product availability, COAs,
              order updates, and research-use inquiries.
            </p>

            <a
              href="/contact"
              className="inline-block bg-white text-[#081526] px-8 py-4 rounded-full uppercase tracking-widest text-sm font-semibold hover:bg-blue-100 transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

                       <footer className="bg-[#081526] border-t border-blue-900/40 px-6 pt-24 pb-10">

  <div className="max-w-7xl mx-auto">

    {/* TOP */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">

      {/* BRAND */}
      <div>
        <img
          src="/images/logo.png"
          alt="Apexx Biolabs"
          className="h-12 w-auto mb-6"
        />

        <p className="text-white/70 leading-relaxed text-sm">
          High-purity research compounds supported by batch documentation,
          analytical testing, and research-use transparency.
        </p>
      </div>

      {/* COMPANY */}
      <div>
        <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Company
        </h4>

        <div className="space-y-4">
          <a href="/" className="block text-white/70 hover:text-white transition-all">
            Home
          </a>

          <a href="/products" className="block text-white/70 hover:text-white transition-all">
            Products
          </a>

          <a href="/coas" className="block text-white/70 hover:text-white transition-all">
            COAs
          </a>

          <a href="/contact" className="block text-white/70 hover:text-white transition-all">
            Contact
          </a>
        </div>
      </div>

      {/* RESOURCES */}
      <div>
        <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Resources
        </h4>

        <div className="space-y-4">
          <a href="/peptide-info" className="block text-white/70 hover:text-white transition-all">
            Peptide Info
          </a>

          <a href="/faq" className="block text-white/70 hover:text-white transition-all">
            FAQ
          </a>

          <a href="/shipping" className="block text-white/70 hover:text-white transition-all">
            Shipping
          </a>

          <a href="/refunds" className="block text-white/70 hover:text-white transition-all">
            Refunds
          </a>
        </div>
      </div>

      {/* CONTACT */}
      <div>
        <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
          Contact
        </h4>

        <div className="space-y-4">
          <a
            href="mailto:support@apexxbiolabs.com"
            className="block text-white/70 hover:text-white transition-all"
          >
            support@apexxbiolabs.com
          </a>

          <a
            href="https://www.tiktok.com/@apexx.nyc"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-white/70 hover:text-white transition-all"
          >
            TikTok
          </a>
        </div>
      </div>

    </div>

    {/* DISCLAIMER */}
    <div className="border-t border-white/10 pt-10">

      <p className="text-white/40 text-xs uppercase tracking-[0.18em] leading-relaxed max-w-5xl">
        FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION.
        NOT FOR MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
      </p>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10">

        <p className="text-white/40 text-sm">
          © 2026 Apexx Biolabs. All Rights Reserved.
        </p>

        <div className="flex gap-8 text-sm text-white/40">
          <a href="/privacy" className="hover:text-white transition-all">
            Privacy
          </a>

          <a href="/terms" className="hover:text-white transition-all">
            Terms
          </a>

          <a href="/shipping" className="hover:text-white transition-all">
            Shipping
          </a>
        </div>

      </div>

    </div>

  </div>

</footer>

    </main>
  );
}