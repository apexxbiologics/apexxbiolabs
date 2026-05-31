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
  text: "We retain information only for as long as necessary to fulfill business, legal, accounting, compliance, and operational requirements. Information may be securely deleted or anonymized when no longer required.",
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
            Privacy Policy
          </h1>

          <p className="text-gray-500 uppercase tracking-widest text-sm">
            Last Updated: June 2026
          </p>
        </div>

        <div className="border border-blue-900 rounded-3xl p-8 md:p-12 bg-[#050505] shadow-[0_0_45px_rgba(37,99,235,0.15)] mb-12">
          <h2 className="text-3xl font-bold text-blue-400 mb-6">
            Privacy Commitment
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed">
            Apexx Biolabs is committed to protecting your privacy. This policy
            explains how information may be collected, used, shared, and
            safeguarded when you visit our website, place an order, or contact
            our support team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {policies.map((policy) => {
            const Icon = policy.icon;

            return (
              <div
                key={policy.title}
                className="border border-blue-900 rounded-3xl p-8 bg-[#050505] hover:border-blue-500 hover:shadow-[0_0_35px_rgba(37,99,235,0.2)] transition-all"
              >
                <div className="w-16 h-16 rounded-2xl border border-blue-700 bg-blue-950/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                  <Icon size={32} strokeWidth={2} />
                </div>

                <h2 className="text-2xl font-bold text-blue-400 mb-5 uppercase tracking-wide">
                  {policy.title}
                </h2>

                <p className="text-gray-400 leading-relaxed">
                  {policy.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 border border-blue-900 rounded-3xl p-8 bg-[#050505]">
          <h2 className="text-3xl font-bold text-blue-400 mb-6">
            Contact Information
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
                Privacy Questions
              </p>
              <p className="text-gray-400">
                Contact us for privacy-related requests.
              </p>
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