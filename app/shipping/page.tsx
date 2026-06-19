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
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <a
        href="/"
        className="text-blue-400 uppercase tracking-widest text-sm hover:text-blue-300 transition-all"
      >
        ← Back to Home
      </a>

      <section className="max-w-7xl mx-auto mt-16">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
            Legal Documentation
          </p>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent mb-8">
            Shipping Policy
          </h1>

          <div className="h-[1px] w-72 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8"></div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-700 bg-blue-950/20 text-blue-300 text-sm mb-10">
            <span>✓</span>
            <span>Last Updated: June 2026</span>
          </div>

          <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed font-light">
            Shipping information, delivery expectations, packaging standards,
            and carrier-related policies for Apexx Biolabs orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
              Processing
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              1–2 Business Days
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Orders are typically processed after payment has been received and
              approved. Weekend and holiday orders process the next business day.
            </p>
          </div>

          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
              Packaging
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Secure & Discreet
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Orders are packed professionally in plain exterior packaging to
              support privacy, protection, and careful handling.
            </p>
          </div>

          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
              Tracking
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Carrier Updates
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Tracking is provided once available. Carrier scans and movement
              updates may take up to 24 hours after label creation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="group border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_45px_rgba(37,99,235,0.28)] hover:-translate-y-2 transition-all duration-300">
            <h2 className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors mb-4">
              Ground Shipping
            </h2>

            <p className="text-5xl font-black text-blue-400 mb-4">
              $5.99
            </p>

            <p className="text-blue-400 uppercase tracking-widest text-sm font-bold mb-6">
              Flat Rate
            </p>

            <ul className="space-y-3 text-gray-400">
              <li>✓ Estimated delivery: 3–7 business days</li>
              <li>✓ Available throughout eligible U.S. locations</li>
              <li>✓ Includes shipment tracking</li>
              <li>✓ Discreet packaging</li>
            </ul>
          </div>

          <div className="group border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_45px_rgba(37,99,235,0.28)] hover:-translate-y-2 transition-all duration-300">
            <h2 className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors mb-4">
              Express Shipping
            </h2>

            <p className="text-5xl font-black text-blue-400 mb-4">
              $25.99
            </p>

            <p className="text-blue-400 uppercase tracking-widest text-sm font-bold mb-6">
              Flat Rate
            </p>

            <ul className="space-y-3 text-gray-400">
              <li>✓ Estimated delivery: 1–2 business days</li>
              <li>✓ Priority processing when possible</li>
              <li>✓ Includes shipment tracking</li>
              <li>✓ Discreet packaging</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-gray-500 mb-12">
          Delivery estimates are not guaranteed and may vary based on carrier
          conditions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {policies.map((policy) => {
            const Icon = policy.icon;

            return (
              <div
                key={policy.title}
                className="group border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.22)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl border border-blue-700 bg-blue-950/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.25)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.45)] transition-all">
                  <Icon size={32} strokeWidth={2} />
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-5">
                  {policy.title}
                </h2>

                <p className="text-gray-400 leading-relaxed">
                  {policy.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 border border-blue-900 rounded-3xl p-8 bg-[#050505] shadow-[0_0_40px_rgba(37,99,235,0.12)]">
          <h2 className="text-3xl font-bold text-blue-400 mb-8">
            Questions? We’re Here to Help.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="uppercase tracking-widest text-blue-500 text-sm mb-2">
                Email
              </p>
              <p className="text-gray-400">support@apexxbiolabs.com</p>
            </div>

            <div>
              <p className="uppercase tracking-widest text-blue-500 text-sm mb-2">
                Website
              </p>
              <p className="text-gray-400">apexxbiolabs.com</p>
            </div>

            <div>
              <p className="uppercase tracking-widest text-blue-500 text-sm mb-2">
                Response Time
              </p>
              <p className="text-gray-400">24–48 business hours</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border border-blue-900 rounded-3xl p-8 bg-[#050505] text-center">
          <p className="text-xs text-gray-600 uppercase tracking-widest leading-relaxed">
            FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION. NOT FOR
            MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
          </p>
        </div>
      </section>
    </main>
  );
}