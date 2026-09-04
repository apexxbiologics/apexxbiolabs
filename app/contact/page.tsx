import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ContactPage() {
  const contactCards = [
    {
      label: "TikTok",
      title: "@apexx.nyc",
      description:
        "Product updates, laboratory content, COA announcements, and new releases.",
      href: "https://www.tiktok.com/@apexx.nyc",
      icon: <FaTiktok size={28} />,
    },
    {
      label: "X",
      title: "@ApexxBiolabsLLC",
      description:
        "Company announcements, research updates, releases, and laboratory news.",
      href: "https://x.com/ApexxBiolabsLLC",
      icon: <FaXTwitter size={28} />,
    },
    {
      label: "Email",
      title: "support@apexxbiolabs.com",
      description:
        "For orders, COAs, product availability, shipping, and general support.",
      href: "mailto:support@apexxbiolabs.com",
      icon: <HiOutlineMail size={30} />,
    },
  ];

  const infoCards = [
    {
      title: "Research Use Only",
      text: "All products are intended strictly for lawful laboratory research use only.",
    },
    {
      title: "Secure Packaging",
      text: "Orders are packaged carefully, securely, and professionally.",
    },
    {
      title: "Business Hours",
      text: "Monday – Friday, 9:00 AM – 5:00 PM EST. Replies are typically sent within 24–48 business hours.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#081526] text-white">
      <section className="relative px-5 py-16 md:px-8 md:py-24">
        {/* BACKGROUND GLOW */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.12),transparent_48%)]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* HERO */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.32em] text-[#A5D8FF] md:text-xs">
              Contact Apexx
            </p>

            <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white md:text-6xl">
              Support & Research Inquiries
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
              Reach out for order assistance, COA requests, batch information,
              product availability, shipping updates, and general research-use
              questions.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#93C5FD]/20 bg-[#93C5FD]/[0.06] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#A5D8FF]">
              <span className="text-sm">✓</span>
              Research Use Only
            </div>
          </div>

          {/* CONTACT METHODS */}
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {contactCards.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={
                  item.href.startsWith("mailto:")
                    ? undefined
                    : "_blank"
                }
                rel={
                  item.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="group rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#93C5FD]/30 hover:bg-white/[0.045]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#93C5FD]/15 bg-[#93C5FD]/[0.07] text-[#A5D8FF] transition group-hover:bg-[#93C5FD]/[0.12]">
                  {item.icon}
                </div>

                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#A5D8FF]/75">
                  {item.label}
                </p>

                <h2
                  className={`font-black text-white ${
                    item.label === "Email"
                      ? "break-all text-lg md:text-xl"
                      : "text-xl md:text-2xl"
                  }`}
                >
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/45">
                  {item.description}
                </p>

                <div className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/30 transition group-hover:text-[#A5D8FF]">
                  {item.label === "Email"
                    ? "Send Email →"
                    : "Visit Profile →"}
                </div>
              </a>
            ))}
          </div>

          {/* SUPPORT INFO */}
          <div className="mt-10 rounded-[24px] border border-white/[0.08] bg-[#0C1B2E]/70 p-5 md:p-6">
            <div className="grid grid-cols-1 divide-y divide-white/[0.07] md:grid-cols-3 md:divide-x md:divide-y-0">
              {infoCards.map((item, index) => (
                <div
                  key={item.title}
                  className={`py-5 md:px-6 md:py-2 ${
                    index === 0 ? "md:pl-0" : ""
                  } ${
                    index === infoCards.length - 1 ? "md:pr-0" : ""
                  }`}
                >
                  <h3 className="text-sm font-black text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-white/45">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* COMPLIANCE */}
          <div className="mt-6 rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-6 md:p-8">
            <div className="max-w-4xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#A5D8FF]">
                Compliance Notice
              </p>

              <h3 className="mt-3 text-2xl font-black tracking-[-0.02em] text-white md:text-3xl">
                Research-use communication only.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/45">
                Apexx Biolabs supplies products intended exclusively for
                scientific, analytical, and educational laboratory research
                applications. We do not provide medical advice, treatment
                recommendations, dosing instructions, or guidance regarding
                human use of any product.
              </p>
            </div>
          </div>

          {/* FOOTER NOTICE */}
          <p className="mx-auto mt-10 max-w-4xl text-center text-[9px] uppercase leading-6 tracking-[0.16em] text-white/25 md:text-[10px]">
            For laboratory research use only. Not for human consumption.
            Not for medical, diagnostic, therapeutic, or veterinary use.
          </p>
        </div>
      </section>
    </main>
  );
}