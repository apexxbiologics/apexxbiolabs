import {
  Camera,
  Mail,
  PackageCheck,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function RefundPolicyPage() {
  const steps = [
    {
      number: "1",
      icon: Camera,
      title: "Document the Issue",
      text: "Take clear photos of the damaged product, packaging, shipping label, and any visible issue as soon as the order arrives.",
    },
    {
      number: "2",
      icon: Mail,
      title: "Contact Us",
      text: "Email support@apexxbiolabs.com with your order number, photos, and a short description of the issue.",
    },
    {
      number: "3",
      icon: PackageCheck,
      title: "Review & Resolution",
      text: "Once your claim is reviewed and verified, we may issue a one-time replacement, store credit, or other resolution at our discretion.",
    },
  ];

  const eligible = [
    "Products damaged during shipping with clear photo evidence",
    "Incorrect items received",
    "Missing items from an order",
    "Defective products that do not meet stated quality standards",
  ];

  const notEligible = [
    "Opened, used, reconstituted, or partially used products",
    "Claims submitted without photo evidence",
    "Products improperly stored after delivery",
    "Products without proof of purchase",
    "Change-of-mind returns or buyer’s remorse",
    "Orders delayed, lost, or stolen after carrier delivery confirmation",
  ];

  const timeline = [
    {
      title: "Claim Submitted",
      text: "Customer emails photos, order number, and issue details.",
      time: "Day 1",
    },
    {
      title: "Claim Reviewed",
      text: "Our team reviews the claim and verifies the submitted evidence.",
      time: "1–2 business days",
    },
    {
      title: "Resolution Issued",
      text: "Approved claims may receive a replacement, store credit, or other approved resolution.",
      time: "After approval",
    },
  ];

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

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
              Damage Protection
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
              Returns & Refunds
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Every order is reviewed with care. If your product arrives
              damaged, incorrect, or with a verified issue, contact us so our
              team can review the claim.
            </p>
          </div>

          <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 backdrop-blur-sm p-8 md:p-12 mb-16">
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center mb-6">
              <ShieldCheck size={34} strokeWidth={2} />
            </div>

            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
              Damage Protection Policy
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Damaged Orders May Qualify for a One-Time Replacement
            </h2>

            <p className="text-white/70 text-lg leading-relaxed max-w-5xl">
              If your order arrives damaged in transit, Apexx Biolabs may issue
              a one-time replacement after the claim is reviewed and verified.
              All damage claims must include clear photo evidence and are
              subject to approval. One replacement may be issued per customer
              per order.
            </p>
          </div>

          <div className="mb-16">
            <div className="text-center mb-12">
              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
                How Returns Work
              </p>

              <h2 className="text-4xl md:text-5xl font-black text-white">
                Simple Claim Process
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/40 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center">
                        <Icon size={28} strokeWidth={2} />
                      </div>

                      <span className="text-5xl font-black text-white/10">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-4">
                      {step.title}
                    </h3>

                    <p className="text-white/60 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="rounded-[2rem] border border-green-400/20 bg-green-500/10 backdrop-blur-sm p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.05] text-green-300 flex items-center justify-center mb-6">
                <CheckCircle size={30} strokeWidth={2} />
              </div>

              <h2 className="text-3xl font-black text-white mb-8">
                Eligible for Review
              </h2>

              <div className="space-y-5">
                {eligible.map((item) => (
                  <div key={item} className="flex gap-4">
                    <CheckCircle
                      size={20}
                      className="text-green-300 shrink-0 mt-1"
                    />
                    <p className="text-white/70 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-red-400/20 bg-red-500/10 backdrop-blur-sm p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.05] text-red-300 flex items-center justify-center mb-6">
                <XCircle size={30} strokeWidth={2} />
              </div>

              <h2 className="text-3xl font-black text-white mb-8">
                Not Eligible for Return
              </h2>

              <div className="space-y-5">
                {notEligible.map((item) => (
                  <div key={item} className="flex gap-4">
                    <XCircle
                      size={20}
                      className="text-red-300 shrink-0 mt-1"
                    />
                    <p className="text-white/70 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-12 mb-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center">
                <Clock size={30} strokeWidth={2} />
              </div>

              <div>
                <p className="uppercase tracking-[0.3em] text-blue-300 text-sm mb-2">
                  Replacement Timeline
                </p>

                <h2 className="text-3xl md:text-4xl font-black text-white">
                  What Happens After You Report an Issue
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {timeline.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
                >
                  <p className="text-blue-300 text-sm uppercase tracking-widest mb-4">
                    {item.time}
                  </p>

                  <h3 className="text-xl font-black text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="text-white/60 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-sm leading-relaxed mt-8">
              Note: All claims are subject to review and may be denied if
              evidence is insufficient, inconsistent, incomplete, or suspicious.
              Apexx Biolabs reserves the right to deny replacement, refund, or
              credit requests at its sole discretion.
            </p>
          </div>

          <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-500/10 backdrop-blur-sm p-8 md:p-12 mb-16">
            <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.05] text-yellow-300 flex items-center justify-center mb-6">
              <AlertTriangle size={30} strokeWidth={2} />
            </div>

            <p className="uppercase tracking-[0.35em] text-yellow-300 text-sm mb-5">
              Important Disclaimer
            </p>

            <div className="space-y-5 text-white/70 leading-relaxed">
              <p>
                All Apexx Biolabs products are sold strictly for laboratory
                research purposes only. Products are not intended for human
                consumption, medical use, diagnostic use, therapeutic use, or
                veterinary use.
              </p>

              <p>
                Due to the nature of research-use products, contamination risks,
                and quality-control requirements, we do not accept returns of
                opened, used, reconstituted, or partially used products.
              </p>

              <p>
                Refunds are not offered for change of mind, dissatisfaction,
                improper storage, misuse, or any reason other than a verified
                order issue approved by Apexx Biolabs.
              </p>

              <p>
                By placing an order, you acknowledge and agree to this Returns
                & Refunds Policy.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10">
            <h2 className="text-3xl font-black text-white mb-8">
              Need Help?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="uppercase tracking-widest text-blue-300 text-sm mb-2">
                  Email
                </p>
                <p className="text-white/60">support@apexxbiolabs.com</p>
              </div>

              <div>
                <p className="uppercase tracking-widest text-blue-300 text-sm mb-2">
                  Website
                </p>
                <p className="text-white/60">apexxbiolabs.com</p>
              </div>

              <div>
                <p className="uppercase tracking-widest text-blue-300 text-sm mb-2">
                  Response Time
                </p>
                <p className="text-white/60">24–48 business hours</p>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 text-center">
            <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed">
              FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION. NOT
              FOR MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#081526] border-t border-blue-900/40 px-6 pt-24 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
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

          <div className="border-t border-white/10 pt-10">
            <p className="text-white/40 text-xs uppercase tracking-[0.18em] leading-relaxed max-w-5xl">
              FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION. NOT
              FOR MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
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