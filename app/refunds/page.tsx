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
            Refund Policy
          </h1>

          <div className="h-[1px] w-72 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8"></div>

          <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed font-light">
            Refund, replacement, cancellation, and order issue policies for
            Apexx Biolabs research-use-only products.
          </p>
        </div>

        <div className="border border-red-700 rounded-3xl p-8 md:p-12 bg-red-950/20 shadow-[0_0_45px_rgba(239,68,68,0.15)] mb-16">
          <p className="uppercase tracking-[0.35em] text-red-400 text-sm mb-5">
            Important Notice
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            All Sales Are Final
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed max-w-5xl">
            Due to the nature of laboratory research products, contamination
            risks, and quality-control requirements, all sales are final once an
            order has been processed and shipped. We do not accept returns of
            opened, used, or partially used products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
              Cancellation Window
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Before Shipment
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Orders may only be canceled before packaging, processing, or shipment.
            </p>
          </div>

          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
              Issue Reporting
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Within 48 Hours
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Damaged, incorrect, or missing item claims must be submitted within 48 hours of delivery.
            </p>
          </div>

          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
              Resolution Options
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Case-by-Case
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Verified issues may be reviewed for replacement, store credit, or partial refund eligibility.
            </p>
          </div>
        </div>

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
            Need Help?
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