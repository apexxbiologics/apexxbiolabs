"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  FileCheck2,
  FlaskConical,
  Handshake,
  Microscope,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

const faqs = [
  {
    question: "Who is the Research Referral Program for?",
    answer:
      "The program is intended for approved individuals, organizations, laboratories, research-focused communities, and other partners who can refer qualified research customers to Apexx Biolabs.",
  },
  {
    question: "How are referral commissions determined?",
    answer:
      "Commission and customer discount rates are assigned to approved partners by Apexx Biolabs. Your specific rates are provided when your referral account is approved and can be viewed from your partner dashboard.",
  },
  {
    question: "How are referrals tracked?",
    answer:
      "Approved partners receive a unique referral code. Eligible orders attributed to that code are recorded in the partner dashboard, where qualifying sales and commissions can be reviewed.",
  },
  {
    question: "When are commissions paid?",
    answer:
      "Eligible confirmed commissions are reviewed for payout on a bi-monthly schedule. Current payout history and previously paid amounts remain available in the partner dashboard.",
  },
  {
    question: "Can partners promote products for personal use?",
    answer:
      "No. Apexx Biolabs products are intended strictly for lawful laboratory research use and are not for human or veterinary use. Referral partners may not promote personal use, administration, dosing, therapeutic effects, or medical claims.",
  },
  {
    question: "Does applying guarantee approval?",
    answer:
      "No. Applications are reviewed by Apexx Biolabs. Submission of an application does not guarantee acceptance into the Research Referral Program.",
  },
];

export default function ResearchReferralPage() {
  const [openFAQ, setOpenFAQ] =
    useState<number | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#081526] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-20 sm:px-6 md:pb-28 md:pt-28">

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(96,165,250,0.17),transparent_38%)]" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_75%,rgba(37,99,235,0.10),transparent_40%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

          {/* LEFT */}
          <div>

            <p className="mb-6 text-xs font-black uppercase tracking-[0.35em] text-blue-300 sm:text-sm">
              Apexx Research Referral Program
            </p>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Help researchers
              <span className="block text-blue-300">
                find quality supply.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg md:text-xl">
              Refer qualified researchers, laboratories,
              organizations, and research teams to Apexx
              Biolabs and receive commission on eligible
              research purchases attributed to your referral
              code.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#081526] transition hover:bg-blue-100"
              >
                Apply as a Research Partner

                <ArrowRight
                  size={18}
                  strokeWidth={2.5}
                />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:border-blue-300/40 hover:bg-white/[0.08]"
              >
                Contact Us
              </Link>

            </div>

            <p className="mt-5 max-w-2xl text-xs leading-relaxed text-white/35">
              Applications are reviewed before approval.
              Participation is limited to research-focused
              referral activity that complies with Apexx
              Biolabs program policies.
            </p>

          </div>

          {/* RIGHT CARD */}
          <div className="relative">

            <div className="absolute -inset-8 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-blue-400/20 bg-gradient-to-br from-[#102a49] via-[#0d2038] to-[#071321] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-9">

              <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                Program Overview
              </p>

              <div className="mt-7 space-y-4">

                <ProgramStat
                  icon={
                    <Handshake size={21} />
                  }
                  title="Individual Referral Code"
                  text="Approved partners receive a unique code for eligible research referrals."
                />

                <ProgramStat
                  icon={
                    <BarChart3 size={21} />
                  }
                  title="Partner Dashboard"
                  text="Review attributed orders, qualifying sales, and commission activity."
                />

                <ProgramStat
                  icon={
                    <WalletCards size={21} />
                  }
                  title="Bi-Monthly Payouts"
                  text="Eligible confirmed commissions are reviewed for payout twice per month."
                />

                <ProgramStat
                  icon={
                    <ShieldCheck size={21} />
                  }
                  title="Research-Only Standards"
                  text="Referral activity must remain consistent with Apexx research-use requirements."
                />

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* BUILT FOR RESEARCH REFERRALS */}
      <section className="relative border-b border-white/10 px-5 py-20 sm:px-6 md:py-24">

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.08),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="mx-auto mb-14 max-w-3xl text-center">

            <p className="mb-5 text-xs font-black uppercase tracking-[0.35em] text-blue-300">
              Built for Research Referrals
            </p>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
              A referral program built around
              research transparency.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
              Introduce qualified research customers to a
              catalog supported by analytical documentation,
              batch information, and research-focused
              standards.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              icon={
                <FlaskConical size={25} />
              }
              title="Research-Grade Catalog"
              text="Apexx products are offered for lawful laboratory and analytical research purposes."
            />

            <FeatureCard
              icon={
                <FileCheck2 size={25} />
              }
              title="Batch Documentation"
              text="Available Certificates of Analysis and testing documentation support research transparency."
            />

            <FeatureCard
              icon={
                <BarChart3 size={25} />
              }
              title="Referral Tracking"
              text="View eligible orders and commission activity directly from your private referral dashboard."
            />

            <FeatureCard
              icon={
                <Users size={25} />
              }
              title="Qualified Referrals"
              text="Refer researchers, laboratories, research teams, and other appropriate research customers."
            />

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative px-5 py-20 sm:px-6 md:py-28">

        <div className="mx-auto max-w-7xl">

          <div className="mb-14">

            <p className="mb-5 text-xs font-black uppercase tracking-[0.35em] text-blue-300">
              How It Works
            </p>

            <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
              Four steps from application
              to referral partner.
            </h2>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            <StepCard
              number="01"
              title="Apply"
              text="Submit your Research Referral Program application for review by Apexx Biolabs."
            />

            <StepCard
              number="02"
              title="Get Approved"
              text="Approved applicants receive their referral account, unique code, and assigned program rates."
            />

            <StepCard
              number="03"
              title="Refer"
              text="Share Apexx with qualified research customers while following Research Referral Program standards."
            />

            <StepCard
              number="04"
              title="Track & Get Paid"
              text="Monitor eligible referrals and commissions from your dashboard. Confirmed commissions are paid on the established payout schedule."
            />

          </div>

        </div>
      </section>

      {/* WHY REFER */}
      <section className="relative border-y border-white/10 bg-[#071321] px-5 py-20 sm:px-6 md:py-24">

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr]">

          <div>

            <p className="mb-5 text-xs font-black uppercase tracking-[0.35em] text-blue-300">
              Research Standards
            </p>

            <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Refer researchers to a
              documented supply source.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              Referral partners should be able to direct
              qualified research customers toward clear
              product information, analytical documentation,
              and responsible research-use policies.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <StandardCard
              title="Analytical Documentation"
              text="Available batch testing and COA records support review of product documentation."
            />

            <StandardCard
              title="Research-Use Positioning"
              text="Products are presented specifically for lawful laboratory and analytical research."
            />

            <StandardCard
              title="Transparent Product Pages"
              text="Researchers can review product specifications, documentation, and research-use information before ordering."
            />

            <StandardCard
              title="Partner Accountability"
              text="Referral partners must follow program marketing standards and research-use restrictions."
            />

          </div>

        </div>
      </section>

      {/* PARTNER MARKETING STANDARDS */}
      <section className="relative px-5 py-20 sm:px-6 md:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="overflow-hidden rounded-[2.5rem] border border-blue-400/20 bg-white/[0.035]">

            <div className="border-b border-white/10 p-7 sm:p-9 md:p-10">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                  <ShieldCheck
                    size={27}
                  />
                </div>

                <div>

                  <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                    Partner Marketing Standards
                  </p>

                  <h2 className="text-3xl font-black text-white md:text-4xl">
                    Research-focused promotion only.
                  </h2>

                  <p className="mt-4 max-w-3xl leading-relaxed text-white/60">
                    Approval requires agreement to keep all
                    referral activity consistent with the
                    intended research-only nature of Apexx
                    Biolabs products.
                  </p>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-2">

              {[
                "Do not promote or imply personal or human use.",
                "Do not provide dosing, administration, reconstitution, injection, or cycle instructions.",
                "Do not make medical, therapeutic, disease, weight-loss, performance, or other human health claims.",
                "Do not use personal-use testimonials or before-and-after content.",
                "Do not contradict Apexx Biolabs research-use disclaimers.",
                "Clearly disclose your financial relationship with Apexx when required.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-[#0a1829] p-6"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-300">
                    <Check
                      size={15}
                      strokeWidth={3}
                    />
                  </div>

                  <p className="text-sm leading-relaxed text-white/65">
                    {item}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* COMMISSION STRUCTURE */}
      <section className="relative border-y border-white/10 px-5 py-20 sm:px-6 md:py-24">

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.09),transparent_52%)]" />

        <div className="relative z-10 mx-auto max-w-6xl">

          <div className="mx-auto mb-12 max-w-3xl text-center">

            <p className="mb-5 text-xs font-black uppercase tracking-[0.35em] text-blue-300">
              Simple Referral Structure
            </p>

            <h2 className="text-4xl font-black text-white sm:text-5xl">
              Clear tracking.
              Clear commissions.
            </h2>

            <p className="mt-5 leading-relaxed text-white/60">
              Program rates may vary by approved partner.
              Your specific customer discount and commission
              rate are provided when your account is approved.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <MiniProgramCard
              eyebrow="Referral Code"
              title="Unique to You"
              text="Eligible purchases made using your assigned referral code are attributed to your partner account."
            />

            <MiniProgramCard
              eyebrow="Commission"
              title="Assigned at Approval"
              text="Your commission percentage is configured by Apexx Biolabs and displayed within your referral account."
            />

            <MiniProgramCard
              eyebrow="Payouts"
              title="Bi-Monthly"
              text="Eligible confirmed commissions are reviewed for payout twice per month, with payout history retained in your dashboard."
            />

          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-5 py-20 sm:px-6 md:py-24">

        <div className="mx-auto max-w-5xl">

          <div className="mb-12 text-center">

            <p className="mb-5 text-xs font-black uppercase tracking-[0.35em] text-blue-300">
              Research Referral FAQ
            </p>

            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
              Common questions.
            </h2>

          </div>

          <div className="space-y-4">

            {faqs.map(
              (
                faq,
                index
              ) => (
                <div
                  key={
                    faq.question
                  }
                  className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] transition hover:border-blue-400/30"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFAQ(
                        openFAQ ===
                          index
                          ? null
                          : index
                      )
                    }
                    className="flex w-full items-center justify-between gap-6 p-6 text-left sm:p-7"
                  >

                    <span className="text-lg font-black text-white sm:text-xl">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-blue-300 transition-transform ${
                        openFAQ ===
                        index
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>

                  {openFAQ ===
                    index && (
                    <div className="border-t border-white/10 px-6 pb-7 pt-5 sm:px-7">
                      <p className="leading-relaxed text-white/60">
                        {
                          faq.answer
                        }
                      </p>
                    </div>
                  )}

                </div>
              )
            )}

          </div>

        </div>
      </section>

      {/* APPLICATION */}
      <section
        id="apply"
        className="relative border-t border-white/10 bg-[#071321] px-5 py-20 sm:px-6 md:py-28"
      >

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.13),transparent_48%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr]">

          <div>

            <p className="mb-5 text-xs font-black uppercase tracking-[0.35em] text-blue-300">
              Apply to Partner
            </p>

            <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Apply to the Apexx
              Research Referral Program.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              Tell us about yourself and the research-focused
              audience, organization, laboratory, or community
              you would be referring.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-blue-400/15 bg-blue-500/[0.06] p-6">

              <p className="font-black text-white">
                Before applying
              </p>

              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Research Referral Program participation is
                subject to review and approval. All approved
                partners must follow Apexx Biolabs referral
                terms, disclosure requirements, and
                research-use marketing standards.
              </p>

            </div>

          </div>

          <form
            action="/api/affiliate/apply"
            method="POST"
            className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8 md:p-10"
          >

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <FormField
                label="Full Name"
                name="name"
                placeholder="Your name"
                required
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="you@email.com"
                required
              />

            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

              <FormField
                label="Organization / Platform"
                name="organization"
                placeholder="Optional"
              />

              <FormField
                label="Website or Social Link"
                name="website"
                placeholder="https://"
              />

            </div>

            <div className="mt-5">

              <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-white/45">
                Research Audience
              </label>

              <select
                name="audience"
                required
                defaultValue=""
                className="w-full rounded-2xl border border-white/10 bg-[#0d1d30] px-5 py-4 text-sm text-white outline-none transition focus:border-blue-400/50"
              >
                <option
                  value=""
                  disabled
                >
                  Select one
                </option>

                <option value="laboratory">
                  Laboratory / Research Organization
                </option>

                <option value="research-community">
                  Research Community
                </option>

                <option value="professional-network">
                  Professional Network
                </option>

                <option value="educational">
                  Educational / Research Content
                </option>

                <option value="other">
                  Other
                </option>
              </select>

            </div>

            <div className="mt-5">

              <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-white/45">
                Tell Us About Your Referral Audience
              </label>

              <textarea
                name="description"
                required
                rows={5}
                placeholder="Briefly describe who you would refer to Apexx Biolabs and how you plan to introduce qualified research customers."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 text-sm leading-relaxed text-white outline-none placeholder:text-white/25 focus:border-blue-400/50"
              />

            </div>

            <div className="mt-6 space-y-4">

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                <input
                  type="checkbox"
                  name="research_use_acknowledgement"
                  required
                  className="mt-1 h-4 w-4 accent-blue-500"
                />

                <span className="text-sm leading-relaxed text-white/55">
                  I understand that Apexx Biolabs products
                  are intended strictly for lawful laboratory
                  research use and are not for human or
                  veterinary use.
                </span>

              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                <input
                  type="checkbox"
                  name="marketing_acknowledgement"
                  required
                  className="mt-1 h-4 w-4 accent-blue-500"
                />

                <span className="text-sm leading-relaxed text-white/55">
                  I agree not to promote personal use, make
                  medical or therapeutic claims, or provide
                  dosing or administration guidance in
                  connection with Apexx Biolabs products.
                </span>

              </label>

            </div>

            <button
              type="submit"
              className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#081526] transition hover:bg-blue-100"
            >
              Submit Application

              <ArrowRight
                size={18}
              />
            </button>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-white/30">
              Submission does not guarantee acceptance.
              Approved applicants will receive further
              program information by email.
            </p>

          </form>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-12 sm:px-6">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-[2rem] border border-blue-400/20 bg-gradient-to-r from-[#102a49] to-[#0b1d33] px-6 py-7 text-center md:flex-row md:px-9 md:text-left">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
              Have Questions?
            </p>

            <p className="mt-2 text-lg font-black text-white">
              Contact the Apexx team before applying.
            </p>

          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-7 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-white/[0.09]"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </main>
  );
}

function ProgramStat({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
        {icon}
      </div>

      <div>
        <p className="font-black text-white">
          {title}
        </p>

        <p className="mt-1 text-sm leading-relaxed text-white/45">
          {text}
        </p>
      </div>

    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 transition hover:border-blue-400/35 hover:bg-white/[0.055]">

      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
        {icon}
      </div>

      <h3 className="text-xl font-black text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-white/55">
        {text}
      </p>

    </div>
  );
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">

      <p className="text-4xl font-black text-blue-300/25">
        {number}
      </p>

      <h3 className="mt-6 text-2xl font-black text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-white/55">
        {text}
      </p>

    </div>
  );
}

function StandardCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6">

      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-300">
        <Microscope size={18} />
      </div>

      <h3 className="font-black text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-white/50">
        {text}
      </p>

    </div>
  );
}

function MiniProgramCard({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-blue-400/15 bg-white/[0.035] p-7">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">
        {eyebrow}
      </p>

      <h3 className="mt-4 text-2xl font-black text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-white/55">
        {text}
      </p>

    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-white/45">
        {label}
      </label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-blue-400/50"
      />

    </div>
  );
}