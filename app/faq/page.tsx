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
    <main className="min-h-screen bg-black text-white px-6 md:px-10 py-24">
      <a
        href="/"
        className="text-blue-400 uppercase tracking-widest text-sm hover:text-blue-300 transition-all"
      >
        ← Back to Home
      </a>

      <section className="max-w-6xl mx-auto mt-20 text-center">
        <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
          Support Center
        </p>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent mb-6">
          Frequently Asked Questions
        </h1>

        <div className="h-[1px] w-64 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-10"></div>

        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
          Information regarding product availability, shipping, COAs,
          laboratory standards, and research-use policies.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10 mb-16">
          {["Shipping", "COAs", "Products", "Orders"].map((item) => (
            <span
              key={item}
              className="px-5 py-2 rounded-full border border-blue-700 bg-blue-950/20 text-blue-300 text-sm uppercase tracking-widest"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="space-y-5 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-blue-900 rounded-3xl bg-[#050505] overflow-hidden hover:border-blue-400 hover:shadow-[0_0_40px_rgba(37,99,235,0.25)] transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left p-7 gap-6"
              >
                <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {faq.question}
                </span>

                <span className="text-3xl text-blue-400 shrink-0">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-7 pb-7 text-gray-400 leading-relaxed text-lg border-t border-blue-950 pt-5">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 border border-blue-900 rounded-3xl p-10 bg-[#050505] text-center shadow-[0_0_40px_rgba(37,99,235,0.12)]">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">
            Still Need Assistance?
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Contact our support team regarding product availability, COAs, order
            updates, and research-use inquiries.
          </p>

          <a
            href="/contact"
            className="inline-block px-8 py-4 rounded-xl border border-blue-700 hover:bg-blue-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] transition-all uppercase tracking-widest text-sm"
          >
            Contact Support
          </a>
        </div>
      </section>
    </main>
  );
}