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
          </p>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-blue-300 bg-clip-text text-transparent mb-8">
            Privacy Policy
          </h1>

          <div className="h-[1px] w-72 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8"></div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-700 bg-blue-950/20 text-blue-300 text-sm mb-10">
            <span>✓</span>
            <span>Last Updated: June 2026</span>
          </div>

          <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed font-light">
            Information regarding data collection, privacy practices, website
            usage, security measures, and customer rights.
          </p>
        </div>

        <div className="border border-blue-900 rounded-3xl p-8 md:p-12 bg-[#050505] shadow-[0_0_45px_rgba(37,99,235,0.15)] mb-16">
          <p className="uppercase tracking-[0.35em] text-blue-500 text-sm mb-5">
            Privacy Commitment
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Your information stays protected.
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed max-w-5xl">
            Apexx Biolabs is committed to protecting your privacy. This policy
            explains how information may be collected, used, shared, and
            safeguarded when you visit our website, place an order, or contact
            our support team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505]">
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
              Security
            </p>

            <h2 className="text-3xl font-bold text-white mb-4">
              Protected Data
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Reasonable safeguards are used to help protect customer
              information.
            </p>
          </div>

          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505]">
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
              Transparency
            </p>

            <h2 className="text-3xl font-bold text-white mb-4">
              No Data Sales
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Apexx Biolabs does not sell personal information to third parties.
            </p>
          </div>

          <div className="border border-blue-900 rounded-3xl p-8 bg-[#050505]">
            <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
              Control
            </p>

            <h2 className="text-3xl font-bold text-white mb-4">
              Your Rights
            </h2>

            <p className="text-gray-400 leading-relaxed">
              You may have rights to access, correct, or request deletion of
              your data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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