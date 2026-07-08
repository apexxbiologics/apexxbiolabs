import {
  Database,
  Eye,
  FileText,
  Share2,
  Cookie,
  Lock,
  Archive,
  Shield,
  Globe,
} from "lucide-react";

import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function PrivacyPage() {
  const policies = [
    {
      icon: Database,
      title: "Information We Collect",
      text: "We may collect information you provide directly, including name, email, shipping information, billing information, account details, and communications with us.",
    },
    {
      icon: Eye,
      title: "Automatic Information",
      text: "We may collect technical information such as IP address, browser type, device information, pages visited, cookies, and similar tracking technologies.",
    },
    {
      icon: FileText,
      title: "How We Use Information",
      text: "Information may be used to process orders, provide support, improve our website, prevent fraud, maintain security, and comply with legal obligations.",
    },
    {
      icon: Share2,
      title: "Information Sharing",
      text: "We do not sell personal information. We may share information with payment processors, shipping carriers, service providers, or legal authorities when required.",
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      text: "Cookies may be used to improve site functionality, analyze traffic, remember preferences, and enhance the customer experience.",
    },
    {
      icon: Lock,
      title: "Data Security",
      text: "We use reasonable safeguards to help protect personal information, but no electronic transmission or storage system is completely secure.",
    },
    {
      icon: Archive,
      title: "Data Retention",
      text: "We retain information only for as long as necessary to fulfill business, legal, accounting, compliance, and operational requirements.",
    },
    {
      icon: Shield,
      title: "Your Rights",
      text: "Depending on your location, you may have rights to access, correct, delete, restrict, or request information about your personal data.",
    },
    {
      icon: Globe,
      title: "Children’s Privacy",
      text: "This website is not intended for individuals under 21 years of age. We do not knowingly collect information from individuals under 21.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
              Privacy Information
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
              Privacy Policy
            </h1>

            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/[0.04] text-blue-300 text-sm mb-10">
              <span>✓</span>
              <span>Last Updated: June 2026</span>
            </div>

            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Information regarding data collection, privacy practices, website
              usage, security measures, and customer rights.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-12 mb-16">
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
              Privacy Commitment
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Your information stays protected.
            </h2>

            <p className="text-white/70 text-lg leading-relaxed max-w-5xl">
              Apexx Biolabs is committed to protecting your privacy. This policy
              explains how information may be collected, used, shared, and
              safeguarded when you visit our website, place an order, or contact
              our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                label: "Security",
                title: "Protected Data",
                text:
                  "Reasonable safeguards are used to help protect customer information.",
              },
              {
                label: "Transparency",
                title: "No Data Sales",
                text:
                  "Apexx Biolabs does not sell personal information to third parties.",
              },
              {
                label: "Control",
                title: "Your Rights",
                text:
                  "You may have rights to access, correct, or request deletion of your data.",
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
                  Privacy Questions
                </p>
                <p className="text-white/60">
                  Contact us for privacy-related requests.
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