import {
  MapPin,
  PackageCheck,
  EyeOff,
  AlertCircle,
  PackageX,
  Clock,
  ShieldAlert,
  Truck,
} from "lucide-react";

export default function ShippingPolicyPage() {
  const policies = [
    {
      icon: MapPin,
      title: "Shipping Destinations",
      text: "Apexx Biolabs currently ships to eligible addresses within the United States. We reserve the right to refuse shipment to any location where products cannot legally be delivered.",
    },
    {
      icon: PackageCheck,
      title: "Order Tracking",
      text: "Once your order ships, tracking information will be provided. Tracking updates may take up to 24 hours after label creation.",
    },
    {
      icon: EyeOff,
      title: "Discreet Packaging",
      text: "All orders are shipped in plain, discreet packaging. Package contents are not visibly identified on exterior packaging.",
    },
    {
      icon: AlertCircle,
      title: "Incorrect Information",
      text: "Customers are responsible for providing accurate shipping information. Apexx Biolabs is not responsible for delays, returned shipments, or delivery issues caused by incorrect addresses.",
    },
    {
      icon: PackageX,
      title: "Lost or Stolen Packages",
      text: "Once a shipment is transferred to the carrier, ownership and responsibility transfer to the customer. Contact the carrier directly regarding lost or stolen package disputes.",
    },
    {
      icon: Clock,
      title: "Shipping Delays",
      text: "Delivery estimates are not guaranteed. Delays may occur due to weather, holidays, carrier disruptions, high shipping volume, or events beyond our control.",
    },
    {
      icon: ShieldAlert,
      title: "Damaged Shipments",
      text: "If your order arrives damaged, contact us within 48 hours of delivery with your order number and clear photographs of the shipping box, label, and product.",
    },
    {
      icon: Truck,
      title: "Shipping Restrictions",
      text: "All products are intended solely for lawful laboratory research purposes. Apexx Biolabs reserves the right to cancel or refuse orders inconsistent with our research-use-only policies or applicable laws.",
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
              Shipping Information
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
              Shipping
              <br />
              Policy
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Shipping information, delivery expectations, packaging standards,
              and carrier-related policies for Apexx Biolabs orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                label: "Processing",
                title: "1–2 Business Days",
                text:
                  "Orders are typically processed after payment has been received and approved. Weekend and holiday orders process the next business day.",
              },
              {
                label: "Packaging",
                title: "Secure & Discreet",
                text:
                  "Orders are packed professionally in plain exterior packaging to support privacy, protection, and careful handling.",
              },
              {
                label: "Tracking",
                title: "Carrier Updates",
                text:
                  "Tracking is provided once available. Carrier scans and movement updates may take up to 24 hours after label creation.",
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
            <div className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-300">
              <h2 className="text-3xl font-black text-white mb-4">
                Ground Shipping
              </h2>

              <p className="text-5xl font-black text-white mb-4">
                $5.99
              </p>

              <p className="text-blue-300 uppercase tracking-widest text-sm font-bold mb-6">
                Flat Rate
              </p>

              <ul className="space-y-3 text-white/60">
                <li>✓ Estimated delivery: 3–7 business days</li>
                <li>✓ Available throughout eligible U.S. locations</li>
                <li>✓ Includes shipment tracking</li>
                <li>✓ Discreet packaging</li>
              </ul>
            </div>

            <div className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-300">
              <h2 className="text-3xl font-black text-white mb-4">
                Express Shipping
              </h2>

              <p className="text-5xl font-black text-white mb-4">
                $25.99
              </p>

              <p className="text-blue-300 uppercase tracking-widest text-sm font-bold mb-6">
                Flat Rate
              </p>

              <ul className="space-y-3 text-white/60">
                <li>✓ Estimated delivery: 1–2 business days</li>
                <li>✓ Priority processing when possible</li>
                <li>✓ Includes shipment tracking</li>
                <li>✓ Discreet packaging</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-white/45 mb-12">
            Delivery estimates are not guaranteed and may vary based on carrier
            conditions.
          </p>

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
              Questions? We’re Here to Help.
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