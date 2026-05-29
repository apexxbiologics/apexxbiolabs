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
    <main className="min-h-screen bg-black text-white px-10 py-24">
      <a href="/" className="text-blue-400 uppercase tracking-widest text-sm">
        ← Back to Home
      </a>

      <section className="max-w-5xl mx-auto mt-20">
        <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-6 text-center">
          Support
        </p>

        <h1 className="text-6xl font-bold mb-14 text-center">
          Frequently Asked Questions
        </h1>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-blue-900 rounded-2xl bg-[#050505] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left p-6"
              >
                <span className="text-xl font-semibold text-blue-400">
                  {faq.question}
                </span>

                <span className="text-3xl text-blue-400">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}