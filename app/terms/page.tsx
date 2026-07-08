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

import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
      text: "Customers are responsible for complying with applicable laws and ensuring proper handling, storage, and lawful laboratory research use.",
    },
    {
      icon: Info,
      title: "Product Information",
      text: "Information on this website is provided for educational and research-reference purposes only.",
    },
    {
      icon: ShoppingCart,
      title: "Orders",
      text: "Apexx Biolabs reserves the right to refuse service, cancel orders, limit quantities, or restrict purchases at its sole discretion.",
    },
    {
      icon: Truck,
      title: "Shipping",
      text: "Shipping times are estimates only. Apexx Biolabs is not responsible for carrier delays or incorrect customer information.",
    },
    {
      icon: RotateCcw,
      title: "Refunds and Returns",
      text: "Due to the nature of research products, all sales are final unless otherwise stated.",
    },
    {
      icon: ShieldAlert,
      title: "Limitation of Liability",
      text: "Apexx Biolabs shall not be liable for damages arising from purchase, handling, storage, misuse, or use of products.",
    },
    {
      icon: FileWarning,
      title: "Disclaimer of Warranties",
      text: "All products and services are provided as-is and as-available without warranties of any kind.",
    },
    {
      icon: Copyright,
      title: "Intellectual Property",
      text: "All website content, branding, logos, images, and designs are property of Apexx Biolabs.",
    },
    {
      icon: RefreshCcw,
      title: "Changes to Terms",
      text: "Apexx Biolabs reserves the right to update or modify these Terms & Conditions at any time.",
    },
    {
      icon: Mail,
      title: "Contact",
      text: "Questions regarding these Terms & Conditions may be directed to support@apexxbiolabs.com.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
              Legal Documentation
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
              Terms & Conditions
            </h1>

            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/[0.04] text-blue-300 text-sm mb-10">
              <span>✓</span>
              <span>Last Updated: June 2026</span>
            </div>

            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Terms, conditions, responsibilities, and legal requirements
              governing the use of Apexx Biolabs products and services.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-12 mb-16">
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
              Important Notice
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Research Use Only
            </h2>

            <p className="text-white/70 text-lg leading-relaxed max-w-5xl">
              Welcome to Apexx Biolabs. By accessing this website, purchasing
              products, or using our services, you agree to be bound by these
              Terms & Conditions. Products are intended strictly for lawful
              laboratory research purposes only.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.title}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.05] text-blue-300 flex items-center justify-center mb-6">
                    <Icon size={32} strokeWidth={2} />
                  </div>

                  <h2 className="text-xl font-black text-white mb-5">
                    {section.title}
                  </h2>

                  <p className="text-white/60 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10">
            <h2 className="text-3xl font-black text-white mb-8">
              Contact Information
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
                  Questions
                </p>
                <p className="text-white/60">
                  Contact us regarding terms and legal inquiries.
                </p>
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
  
    </main>
  );
}