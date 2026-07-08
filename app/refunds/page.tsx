import {
  ShieldCheck,
  Camera,
  Mail,
  PackageCheck,
  CheckCircle,
  XCircle,
  Clock,
  Box,
} from "lucide-react";

import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function RefundPolicyPage() {
  const steps = [
    {
      number: "1",
      title: "Document the Issue",
      text: "Take clear photos of the product, packaging, and shipping label as soon as the order arrives. Photo evidence is required for all claims.",
    },
    {
      number: "2",
      title: "Contact Us",
      text: "Email support@apexxbiolabs.com with your order number, photos, and a brief explanation of the issue.",
    },
    {
      number: "3",
      title: "Resolution Review",
      text: "Once we review and verify the issue, eligible claims may qualify for a replacement, store credit, or another approved resolution.",
    },
  ];

  const eligible = [
    "Products damaged during shipping with photo evidence",
    "Incorrect items received",
    "Missing items from your order",
    "Verified packaging or fulfillment errors",
  ];

  const notEligible = [
    "Opened, used, or reconstituted products",
    "Claims without photo evidence",
    "Products improperly stored after delivery",
    "Products without proof of purchase",
    "Buyer’s remorse or accidental purchases",
  ];

  const reportCards = [
    {
      icon: Camera,
      title: "Take Photos",
      text: "Photograph the product, packaging, and shipping label clearly.",
    },
    {
      icon: Mail,
      title: "Email Support",
      text: "Send your order number and photos to support@apexxbiolabs.com.",
    },
    {
      icon: Box,
      title: "Claim Review",
      text: "Our team will review the claim and follow up with next steps.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      <section className="relative px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="rounded-[2rem] border border-green-400/20 bg-green-500/10 backdrop-blur-sm px-8 py-16 md:px-20 text-center mb-16">
            <div className="w-20 h-20 rounded-full bg-white/90 text-green-500 flex items-center justify-center mx-auto mb-8">
              <ShieldCheck size={36} strokeWidth={2.2} />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-8">
              Damage Protection Policy
            </h1>

            <p className="text-white/70 text-lg leading-relaxed max-w-3xl mx-auto">
              Every order is reviewed and packed with care before shipment. If
              your product arrives damaged, incorrect, or incomplete, we will
              review the issue and may provide a one-time replacement, store
              credit, or another approved resolution.
            </p>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              How Returns Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 text-center">
            {steps.map((step) => (
              <div key={step.title}>
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-6 text-2xl font-black">
                  {step.number}
                </div>

                <h3 className="text-xl font-black text-white mb-4">
                  {step.title}
                </h3>

                <p className="text-white/60 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="rounded-[2rem] bg-white/[0.04] border border-white/10 p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>

                <h2 className="text-2xl font-black text-white">
                  Eligible for Review
                </h2>
              </div>

              <div className="space-y-5">
                {eligible.map((item) => (
                  <div key={item} className="flex gap-4">
                    <CheckCircle
                      size={20}
                      className="text-green-300 shrink-0 mt-1"
                    />
                    <p className="text-white/65 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/[0.04] border border-white/10 p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center">
                  <XCircle size={24} />
                </div>

                <h2 className="text-2xl font-black text-white">
                  Not Eligible for Return
                </h2>
              </div>

              <div className="space-y-5">
                {notEligible.map((item) => (
                  <div key={item} className="flex gap-4">
                    <XCircle
                      size={20}
                      className="text-red-300 shrink-0 mt-1"
                    />
                    <p className="text-white/65 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-14 text-center mb-24">
            <h2 className="text-4xl font-black text-white mb-6">
              Received a Damaged or Defective Product?
            </h2>

            <p className="text-white/65 leading-relaxed max-w-3xl mx-auto mb-12">
              We take order issues seriously. If your order arrives damaged,
              incorrect, or incomplete, contact us within 48 hours of delivery.
              Photo evidence is required, and all claims are subject to review.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {reportCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-[1.5rem] bg-[#081526]/70 border border-white/10 p-8"
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center mx-auto mb-5">
                      <Icon size={26} />
                    </div>

                    <h3 className="text-xl font-black text-white mb-3">
                      {card.title}
                    </h3>

                    <p className="text-white/55 leading-relaxed text-sm">
                      {card.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <a
              href="mailto:support@apexxbiolabs.com"
              className="inline-flex items-center justify-center rounded-full bg-white text-[#081526] px-8 py-4 font-black hover:bg-blue-100 transition-all"
            >
              Report an Issue
            </a>
          </div>

          <div className="mb-24">
            <h2 className="text-4xl font-black text-white text-center mb-10">
              Replacement Timeline
            </h2>

            <div className="rounded-[2rem] bg-white/[0.04] border border-white/10 p-8 md:p-10">
              <div className="space-y-0">
                <div className="flex justify-between gap-6 border-b border-white/10 py-6">
                  <p className="text-white/65">
                    Claim submitted with photos
                  </p>
                  <p className="text-white font-semibold shrink-0">Day 1</p>
                </div>

                <div className="flex justify-between gap-6 border-b border-white/10 py-6">
                  <p className="text-white/65">
                    Claim reviewed and verified
                  </p>
                  <p className="text-white font-semibold shrink-0">
                    1–2 business days
                  </p>
                </div>

                <div className="flex justify-between gap-6 py-6">
                  <p className="text-white/65">
                    Replacement, credit, or resolution issued
                  </p>
                  <p className="text-white font-semibold shrink-0">
                    After approval
                  </p>
                </div>
              </div>

              <p className="text-white/45 text-sm leading-relaxed mt-6">
                Note: One replacement may be issued per customer per order. All
                claims are subject to review and may be denied if evidence is
                insufficient, incomplete, inconsistent, or suspicious. Apexx
                Biolabs reserves the right to approve or deny replacement,
                refund, or store credit requests at its sole discretion.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-500/10 p-8 md:p-10 mb-16">
            <h2 className="text-3xl font-black text-white mb-6">
              Important Notice
            </h2>

            <div className="space-y-5 text-white/65 leading-relaxed">
              <p>
                All Apexx Biolabs products are sold strictly for laboratory
                research purposes only.
              </p>

              <p>
                Products are not intended for human consumption, medical use,
                diagnostic use, therapeutic use, or veterinary use.
              </p>

              <p>
                Due to the nature of research-use products, opened, used,
                reconstituted, or partially used products cannot be returned.
              </p>

              <p>
                By placing an order, you acknowledge that you have read and
                agree to this Returns & Replacements Policy.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
            <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed">
              FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION. NOT
              FOR MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}