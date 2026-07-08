import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
            Contact Apexx
          </p>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8">
            Support & Research Inquiries
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-10">
            Contact Apexx Biolabs for product inquiries, COA requests, batch
            information, order support, shipping updates, and research-use
            questions.
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.04] text-blue-300 text-sm uppercase tracking-widest mb-16">
            <span>✓</span>
            <span>Research Use Only • Professional Support</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14 text-left">
            <a
              href="https://www.tiktok.com/@apexx.nyc"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 hover:bg-white/[0.07] hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[#102A4A] flex items-center justify-center text-blue-300 mb-6">
                <FaTiktok size={34} />
              </div>

              <p className="uppercase tracking-widest text-blue-300 text-sm mb-3">
                TikTok
              </p>

              <h2 className="text-3xl font-black text-white mb-4">
                @apexx.nyc
              </h2>

              <p className="text-white/60 leading-relaxed">
                Follow for product updates, announcements, laboratory content,
                COA updates, and new releases.
              </p>
            </a>

            <a
              href="https://x.com/ApexxBiolabsLLC"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 hover:bg-white/[0.07] hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[#102A4A] flex items-center justify-center text-blue-300 mb-6">
                <FaXTwitter size={34} />
              </div>

              <p className="uppercase tracking-widest text-blue-300 text-sm mb-3">
                X
              </p>

              <h2 className="text-3xl font-black text-white mb-4">
                @ApexxBiolabsLLC
              </h2>

              <p className="text-white/60 leading-relaxed">
                Follow us on X for company announcements, research updates, new
                product releases, and important laboratory news.
              </p>
            </a>

            <a
              href="mailto:support@apexxbiolabs.com"
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 hover:bg-white/[0.07] hover:border-blue-400/50 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[#102A4A] flex items-center justify-center text-blue-300 mb-6">
                <HiOutlineMail size={38} />
              </div>

              <p className="uppercase tracking-widest text-blue-300 text-sm mb-3">
                Email Support
              </p>

              <h2 className="text-2xl md:text-3xl font-black text-white mb-4 break-all">
                support@apexxbiolabs.com
              </h2>

              <p className="text-white/60 leading-relaxed">
                Contact us regarding orders, COAs, product availability,
                shipping updates, and support requests.
              </p>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            {[
              {
                title: "Research Use Only",
                text:
                  "All products are intended strictly for lawful laboratory research use only.",
              },
              {
                title: "Secure Packaging",
                text:
                  "Orders are packaged carefully, securely, and professionally.",
              },
              {
                title: "Business Hours",
                text:
                  "Monday – Friday, 9:00 AM – 5:00 PM EST. Replies are typically sent within 24–48 business hours.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 hover:bg-white/[0.07] hover:border-blue-400/50 transition-all duration-300"
              >
                <h3 className="text-xl font-black text-white mb-4">
                  {item.title}
                </h3>

                <p className="text-white/60 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10 text-left">
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-5">
              Compliance Notice
            </p>

            <h3 className="text-3xl font-black text-white mb-5">
              Research-use communication only.
            </h3>

            <p className="text-white/60 leading-relaxed">
              Apexx Biolabs supplies products intended exclusively for
              scientific, analytical, and educational laboratory research
              applications. We do not provide medical advice, treatment
              recommendations, dosing instructions, or guidance regarding human
              use of any product.
            </p>
          </div>

          <p className="mt-12 text-center text-xs text-white/35 uppercase tracking-widest leading-relaxed">
            FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN CONSUMPTION. NOT FOR
            MEDICAL, DIAGNOSTIC, THERAPEUTIC, OR VETERINARY USE.
          </p>
        </div>
      </section>

    </main>
  );
}