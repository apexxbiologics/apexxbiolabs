import {
  XCircle,
  PackageX,
  Truck,
  RotateCcw,
  FlaskConical,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function RefundPolicyPage() {
  const policies = [
    {
      icon: XCircle,
      title: "Order Cancellations",
      text: "Orders may only be canceled before shipment. Once an order has been packaged, processed, or shipped, it cannot be canceled.",
    },
    {
      icon: PackageX,
      title: "Damaged or Incorrect Orders",
      text: "If you receive a damaged, incorrect, or missing item, contact us within 48 hours of delivery with your order number, clear photos, and a description of the issue.",
    },
    {
      icon: Truck,
      title: "Lost or Stolen Packages",
      text: "Once a shipment has been transferred to the carrier, responsibility transfers to the customer. Apexx Biolabs is not responsible for lost, stolen, or delayed packages.",
    },
    {
      icon: RotateCcw,
      title: "Returned Shipments",
      text: "Orders returned due to incorrect address information, refusal of delivery, or carrier return-to-sender may be subject to reshipping or administrative fees.",
    },
    {
      icon: FlaskConical,
      title: "Product Quality",
      text: "All products are sold for laboratory research purposes only. Certificates of Analysis, when available, apply only to the specific batch tested.",
    },
    {
      icon: CreditCard,
      title: "Chargeback Policy",
      text: "Customers agree to contact Apexx Biolabs before initiating a dispute or chargeback. Fraudulent disputes may result in account restrictions or legal action where permitted.",
    },
    {
      icon: ShieldCheck,
      title: "Refund Exceptions",
      text: "At our sole discretion, store credit, replacement products, or partial refunds may be issued for verified order issues on a case-by-case basis.",
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
              Refund Information
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
              Refund Policy
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Refund, replacement, cancellation, and order issue policies for
              Apexx Biolabs research-use-only products.
            </p>
          </div>

          <div className="rounded-[2rem] border border-red-400/20 bg-red-500/10 backdrop-blur-sm p-8 md:p-12 mb-16">
            <p className="uppercase tracking-[0.35em] text-red-300 text-sm mb-5">
              Important Notice
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              All Sales Are Final
            </h2>

            <p className="text-white/70 text-lg leading-relaxed max-w-5xl">
              Due to the nature of laboratory research products, contamination
              risks, and quality-control requirements, all sales are final once
              an order has been processed and shipped. We do not accept returns
              of opened, used, or partially used products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                label: "Cancellation Window",
                title: "Before Shipment",
                text:
                  "Orders may only be canceled before packaging, processing, or shipment.",
              },
              {
                label: "Issue Reporting",
                title: "Within 48 Hours",
                text:
                  "Damaged, incorrect, or missing item claims must be submitted within 48 hours of delivery.",
              },
              {
                label: "Resolution Options",
                title: "Case-by-Case",
                text:
                  "Verified issues may be reviewed for replacement, store credit, or partial refund eligibility.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/40 transition-all duration-300"
              >
                <p className="uppercase tracking-[0.3em] text-blue-300 text-sm mb-4">
                  {item.label}
                </p>

                <h2 className="text-3xl font-black text-white mb-4">
                  {item.title}
                </h2>

                <p className="text-white/60 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {policies.map((policy) => {
              const Icon = policy.icon;

              return (
                <div
                  key={policy.title}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center mb-6">
                    <Icon size={32} strokeWidth={2} />
                  </div>

                  <h2 className="text-xl font-black text-white mb-5">
                    {policy.title}
                  </h2>

                  <p className="text-white/60 leading-relaxed">
                    {policy.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10">
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