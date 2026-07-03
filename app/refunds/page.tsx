import {
  ShieldCheck,
  PackageCheck,
  Camera,
  Mail,
  SearchCheck,
  CheckCircle,
  XCircle,
  FlaskConical,
  Truck,
  Clock,
  AlertTriangle,
  HeartHandshake,
} from "lucide-react";

export default function RefundPolicyPage() {
  const claimSteps = [
    {
      icon: Mail,
      number: "01",
      title: "Contact Us",
      text: "Email support@apexxbiolabs.com within 48 hours of delivery with your order number and a brief description of the issue.",
    },
    {
      icon: Camera,
      number: "02",
      title: "Send Photos",
      text: "Include clear photos of the product, packaging, shipping label, and any visible damage or fulfillment issue.",
    },
    {
      icon: SearchCheck,
      number: "03",
      title: "We Review It",
      text: "Our team reviews every claim individually and works to provide a fair resolution as quickly as possible.",
    },
  ];

  const coveredClaims = [
    "Product arrived damaged during shipping",
    "Incorrect item was received",
    "Item is missing from your shipment",
    "Verified packaging or fulfillment error",
    "Order issue reported within 48 hours of delivery",
  ];

  const notCovered = [
    "Opened, used, reconstituted, or partially used products",
    "Products stored improperly after delivery",
    "Claims submitted after 48 hours",
    "Buyer’s remorse or accidental purchases",
    "Incorrect address entered by the customer",
    "Carrier delays outside of our control",
  ];

  const resolutions = [
    {
      icon: PackageCheck,
      title: "Replacement Product",
      text: "Approved claims may qualify for a one-time replacement when damage, missing items, or fulfillment errors are verified.",
    },
    {
      icon: ShieldCheck,
      title: "Store Credit",
      text: "In some cases, store credit may be issued as a fair resolution for verified order concerns.",
    },
    {
      icon: HeartHandshake,
      title: "Case-by-Case Support",
      text: "Every issue is reviewed individually so we can provide a reasonable solution whenever possible.",
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_55%)]"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
              Refunds & Replacements
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
              We Stand Behind
              <br />
              Every Shipment.
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Every Apexx Biolabs order is carefully inspected, packaged, and
              verified before leaving our facility. If your order arrives
              damaged, incorrect, or incomplete, our support team will review
              the issue and work toward a fair resolution.
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-blue-400/20 bg-white/[0.04] backdrop-blur-sm p-8 md:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div>
                <div className="w-16 h-16 rounded-2xl border border-white/10 bg-blue-500/10 text-blue-300 flex items-center justify-center mb-8">
                  <ShieldCheck size={34} strokeWidth={2} />
                </div>

                <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
                  Our Commitment
                </p>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Order With Confidence.
                </h2>

                <p className="text-white/70 text-lg leading-relaxed">
                  We understand that ordering laboratory research materials
                  requires trust. While research-use products are generally
                  non-returnable, verified shipping damage, missing items, or
                  fulfillment mistakes may qualify for a replacement, store
                  credit, or another approved resolution.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#081526]/60 p-8">
                <p className="uppercase tracking-[0.3em] text-blue-300 text-xs mb-5">
                  Typical Review Time
                </p>

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-6xl font-black text-white">1–2</span>
                  <span className="text-white/60 pb-3">business days</span>
                </div>

                <p className="text-white/60 leading-relaxed">
                  Most properly submitted claims are reviewed within 1–2
                  business days after all required information has been
                  received.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="text-center mb-12">
              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
                Simple Claims Process
              </p>

              <h2 className="text-4xl md:text-5xl font-black text-white">
                How We Help
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {claimSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-300"
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

              <p className="uppercase tracking-[0.3em] text-green-300 text-sm mb-4">
                Covered Claims
              </p>

              <h2 className="text-3xl font-black text-white mb-8">
                When We Can Help
              </h2>

              <div className="space-y-5">
                {coveredClaims.map((item) => (
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

              <p className="uppercase tracking-[0.3em] text-red-300 text-sm mb-4">
                Not Covered
              </p>

              <h2 className="text-3xl font-black text-white mb-8">
                Outside Our Policy
              </h2>

              <div className="space-y-5">
                {notCovered.map((item) => (
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

          <div className="mb-16">
            <div className="text-center mb-12">
              <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
                Resolution Options
              </p>

              <h2 className="text-4xl md:text-5xl font-black text-white">
                Fair Solutions for Verified Issues
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resolutions.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/40 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center mb-6">
                      <Icon size={28} strokeWidth={2} />
                    </div>

                    <h3 className="text-2xl font-black text-white mb-4">
                      {item.title}
                    </h3>

                    <p className="text-white/60 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
              <div>
                <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center mb-8">
                  <FlaskConical size={34} strokeWidth={2} />
                </div>

                <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
                  Quality Standards
                </p>

                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  Built on Transparency.
                </h2>
              </div>

              <div className="space-y-6 text-white/70 text-lg leading-relaxed">
                <p>
                  Apexx Biolabs is committed to providing research-use products
                  backed by quality review, careful packaging, and batch
                  transparency.
                </p>

                <p>
                  When available, Certificates of Analysis apply to the specific
                  batch tested and are provided to support confidence in product
                  identity and purity.
                </p>

                <p>
                  Every shipment is prepared with care to help protect product
                  integrity during transit.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-12 mb-16">
            <div className="flex items-start gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center shrink-0">
                <Truck size={30} strokeWidth={2} />
              </div>

              <div>
                <p className="uppercase tracking-[0.3em] text-blue-300 text-sm mb-4">
                  Shipping Responsibility
                </p>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-5">
                  We Help Investigate Shipping Issues
                </h2>

                <p className="text-white/70 text-lg leading-relaxed">
                  Once an order has been accepted by the shipping carrier,
                  delivery timing and handling are controlled by the carrier.
                  However, if an issue occurs in transit, our team will review
                  the situation and assist where possible.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-blue-400/20 bg-blue-500/10 backdrop-blur-sm p-8 md:p-12 mb-16">
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center mb-8">
              <HeartHandshake size={34} strokeWidth={2} />
            </div>

            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
              Our Promise
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              If Something Isn’t Right, Contact Us First.
            </h2>

            <p className="text-white/70 text-lg leading-relaxed max-w-5xl">
              Apexx Biolabs was built on quality, transparency, and dependable
              support. If you believe there is an issue with your order, please
              reach out before assuming the worst. Our team is committed to
              providing fair, prompt, and reasonable solutions whenever possible.
            </p>
          </div>

          <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-500/10 backdrop-blur-sm p-8 md:p-12 mb-16">
            <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.05] text-yellow-300 flex items-center justify-center mb-6">
              <AlertTriangle size={30} strokeWidth={2} />
            </div>

            <p className="uppercase tracking-[0.35em] text-yellow-300 text-sm mb-5">
              Important Notice
            </p>

            <div className="space-y-5 text-white/70 leading-relaxed">
              <p>
                All Apexx Biolabs products are sold strictly for laboratory
                research purposes only. Products are not intended for human
                consumption, medical use, diagnostic use, therapeutic use, or
                veterinary use.
              </p>

              <p>
                Due to the nature of research-use products, contamination risk,
                and quality-control requirements, we cannot accept returns of
                opened, used, reconstituted, or partially used products.
              </p>

              <p>
                Refunds, replacements, and store credits are not guaranteed and
                are issued only after review and approval by Apexx Biolabs.
              </p>

              <p>
                By placing an order, you acknowledge that you have read and
                agree to this Returns & Replacements Policy.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center">
                <Clock size={26} strokeWidth={2} />
              </div>

              <h2 className="text-3xl font-black text-white">Need Help?</h2>
            </div>

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
                <a
                  href="/"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Home
                </a>

                <a
                  href="/products"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Products
                </a>

                <a
                  href="/coas"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  COAs
                </a>

                <a
                  href="/contact"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
                Resources
              </h4>

              <div className="space-y-4">
                <a
                  href="/peptide-info"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Peptide Info
                </a>

                <a
                  href="/faq"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  FAQ
                </a>

                <a
                  href="/shipping"
                  className="block text-white/70 hover:text-white transition-all"
                >
                  Shipping
                </a>

                <a
                  href="/refunds"
                  className="block text-white/70 hover:text-white transition-all"
                >
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
  href="https://x.com/ApexxBiolabsLLC"
  target="_blank"
  rel="noopener noreferrer"
  className="block text-white/70 hover:text-white transition-all"
>
  X
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