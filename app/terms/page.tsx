import {
  FlaskConical,
  UserCheck,
  ClipboardCheck,
  Info,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldAlert,
  FileWarning,
  Copyright,
  RefreshCcw,
  Mail,
} from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: FlaskConical,
      title: "Research Use Only",
      text: "All products offered by Apexx Biolabs are sold strictly for laboratory research purposes only. Products are not intended for human consumption, veterinary use, medical use, diagnostic use, therapeutic use, or treatment or prevention of disease.",
    },
    {
      icon: UserCheck,
      title: "Age Requirement",
      text: "By accessing this website or placing an order, you confirm that you are at least 21 years of age.",
    },
    {
      icon: ClipboardCheck,
      title: "Customer Responsibility",
      text: "Customers are responsible for understanding the products purchased, complying with applicable laws, and ensuring proper handling, storage, and use in lawful laboratory research settings.",
    },
    {
      icon: Info,
      title: "Product Information",
      text: "Information on this website is provided for educational and research-reference purposes only and should not be interpreted as medical, pharmaceutical, or legal advice.",
    },
    {
      icon: ShoppingCart,
      title: "Orders",
      text: "Apexx Biolabs reserves the right to refuse service, cancel orders, limit quantities, or restrict purchases at its sole discretion.",
    },
    {
      icon: Truck,
      title: "Shipping",
      text: "Shipping times are estimates only. Apexx Biolabs is not responsible for carrier delays, weather delays, incorrect customer information, or other delays outside our control.",
    },
    {
      icon: RotateCcw,
      title: "Refunds and Returns",
      text: "Due to the nature of research products, all sales are final unless otherwise stated. Damaged or incorrect orders should be reported promptly after delivery.",
    },
    {
      icon: ShieldAlert,
      title: "Limitation of Liability",
      text: "To the maximum extent permitted by law, Apexx Biolabs shall not be liable for damages arising from the purchase, handling, storage, misuse, or use of any products.",
    },
    {
      icon: FileWarning,
      title: "Disclaimer of Warranties",
      text: "All products and services are provided as-is and as-available without warranties of any kind, express or implied.",
    },
    {
      icon: Copyright,
      title: "Intellectual Property",
      text: "All website content, including text, branding, graphics, logos, images, and designs, is the property of Apexx Biolabs and may not be copied or reproduced without permission.",
    },
    {
      icon: RefreshCcw,
      title: "Changes to Terms",
      text: "Apexx Biolabs reserves the right to update or modify these Terms & Conditions at any time. Continued use of this website constitutes acceptance of revised terms.",
    },
    {
      icon: Mail,
      title: "Contact",
      text: "Questions regarding these Terms & Conditions may be directed to support@apexxbiolabs.com.",
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
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.4em] text-blue-500 text-sm mb-6">
            Legal Documentation
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-700 bg-clip-text text-transparent mb-8">
            Terms & Conditions
          </h1>

          <p className="text-gray-500 uppercase tracking-widest text-sm">
            Last Updated: June 2026
          </p>
        </div>

        <div className="border border-blue-900 rounded-3xl p-8 md:p-12 bg-[#050505] shadow-[0_0_45px_rgba(37,99,235,0.15)] mb-12">
          <h2 className="text-3xl font-bold text-blue-400 mb-6">
            Important Notice
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed">
            Welcome to Apexx Biolabs. By accessing this website, purchasing
            products, or using our services, you agree to be bound by these Terms
            & Conditions. Products are intended strictly for lawful laboratory
            research purposes only.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-500 hover:shadow-[0_0_35px_rgba(37,99,235,0.2)] transition-all"
              >
                <div className="w-16 h-16 rounded-2xl border border-blue-700 bg-blue-950/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                  <Icon size={32} strokeWidth={2} />
                </div>

                <h2 className="text-2xl font-bold text-blue-400 mb-5 uppercase tracking-wide">
                  {section.title}
                </h2>

                <p className="text-gray-400 leading-relaxed">
                  {section.text}
                </p>
              </div>
            );
          })}
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