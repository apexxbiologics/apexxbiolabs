import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Program Overview",
    content: (
      <>
        <p>
          The Apexx Biolabs Research Referral Program
          (the &quot;Program&quot;) allows approved referral
          partners (&quot;Partners&quot;) to refer eligible
          research customers to Apexx Biolabs.
        </p>

        <p>
          Participation is subject to application, review,
          approval, and continued compliance with these
          Research Referral Program Terms
          (the &quot;Terms&quot;).
        </p>

        <p>
          Submission of an application does not guarantee
          acceptance into the Program. Apexx Biolabs may
          approve or decline applications in its discretion.
        </p>
      </>
    ),
  },

  {
    number: "02",
    title: "Eligibility & Approval",
    content: (
      <>
        <p>
          Applicants must provide accurate and complete
          information regarding their identity, organization,
          website, platform, community, and intended referral
          audience.
        </p>

        <p>
          Approved Partners may only promote Apexx Biolabs
          through websites, platforms, organizations,
          communities, or accounts that comply with these
          Terms.
        </p>

        <p>
          Apexx Biolabs may request additional information
          before or after approval and may suspend or revoke
          participation if information provided in an
          application is inaccurate, misleading, or
          incomplete.
        </p>
      </>
    ),
  },

  {
    number: "03",
    title: "Research-Use Restriction",
    content: (
      <>
        <p>
          Apexx Biolabs products are offered strictly for
          lawful laboratory research purposes and are not
          intended for human or veterinary use.
        </p>

        <p>
          Partners may not advertise, promote, describe,
          demonstrate, recommend, suggest, or imply that
          Apexx Biolabs products are intended or appropriate
          for personal consumption, human administration,
          veterinary administration, or other non-research
          use.
        </p>

        <p>
          Partners may not encourage purchasers to disregard
          product labeling, research-use restrictions, or
          other notices provided by Apexx Biolabs.
        </p>
      </>
    ),
  },

  {
    number: "04",
    title: "Prohibited Medical & Therapeutic Claims",
    content: (
      <>
        <p>
          Partners may not state or imply that an Apexx
          Biolabs product diagnoses, treats, cures, mitigates,
          or prevents any disease or medical condition.
        </p>

        <p>
          Partners may not make claims concerning weight
          loss, muscle growth, recovery, hormone
          optimization, anti-aging effects, injury treatment,
          disease treatment, cognitive enhancement, or other
          human health or physiological outcomes in
          connection with Apexx Biolabs products.
        </p>

        <p>
          Partners may not provide dosing protocols,
          administration instructions, injection guidance,
          cycle recommendations, reconstitution instructions
          intended for administration, or other instructions
          facilitating human or veterinary use.
        </p>
      </>
    ),
  },

  {
    number: "05",
    title: "Referral Marketing Standards",
    content: (
      <>
        <p>
          Referral activity must be truthful, accurate, and
          consistent with the information and documentation
          provided by Apexx Biolabs.
        </p>

        <p>
          Partners may not make false, misleading,
          exaggerated, unsubstantiated, or unauthorized
          claims regarding Apexx Biolabs, its products,
          testing, Certificates of Analysis, purity,
          laboratories, shipping, availability, or business
          practices.
        </p>

        <p>
          Partners may not create advertising that could
          reasonably suggest that Apexx Biolabs products are
          approved medicines, dietary supplements, consumer
          health products, or products intended for personal
          use.
        </p>
      </>
    ),
  },

  {
    number: "06",
    title: "Referral Relationship Disclosure",
    content: (
      <>
        <p>
          Partners must clearly disclose their financial
          relationship with Apexx Biolabs whenever they
          publish content containing a referral link,
          referral code, endorsement, recommendation, or
          other compensated promotion.
        </p>

        <p>
          The disclosure must be clear, conspicuous, easy to
          understand, and placed where the audience is likely
          to notice it in connection with the promotional
          content.
        </p>

        <p>
          Partners are responsible for complying with
          applicable advertising, endorsement, sponsorship,
          and disclosure requirements on every platform they
          use.
        </p>
      </>
    ),
  },

  {
    number: "07",
    title: "Referral Codes & Links",
    content: (
      <>
        <p>
          Approved Partners may receive a unique referral
          code, referral link, or other tracking identifier.
          These identifiers remain subject to Apexx Biolabs
          Program rules.
        </p>

        <p>
          Partners may not manipulate referral tracking,
          impersonate customers, generate artificial
          transactions, create fraudulent orders, improperly
          attribute transactions, or otherwise attempt to
          obtain referral value for transactions that do not
          constitute legitimate qualifying referrals.
        </p>

        <p>
          Self-referrals, duplicate accounts, coordinated
          transactions intended primarily to generate
          commission, or other abusive activity may be
          excluded from commission and may result in
          termination.
        </p>
      </>
    ),
  },

  {
    number: "08",
    title: "Qualifying Orders & Commission",
    content: (
      <>
        <p>
          Commission is earned only on qualifying orders
          properly attributed to an approved Partner under
          the Program rules in effect at the time of the
          transaction.
        </p>

        <p>
          Commission rates, customer discounts, attribution
          rules, and other Program economics may be specified
          in the Partner&apos;s dashboard, approval notice,
          or other Program documentation.
        </p>

        <p>
          Taxes, shipping charges, refunds, chargebacks,
          cancellations, fraudulent transactions, disputed
          payments, and other excluded amounts may be removed
          when calculating eligible commission.
        </p>
      </>
    ),
  },

  {
    number: "09",
    title: "Refunds, Returns & Chargebacks",
    content: (
      <>
        <p>
          Commission associated with an order that is
          refunded, cancelled, charged back, disputed,
          reversed, determined to be fraudulent, or otherwise
          deemed ineligible may be cancelled or deducted from
          future Partner balances.
        </p>

        <p>
          Apexx Biolabs may delay commission approval while
          an order remains subject to review, fulfillment,
          payment verification, refund, or dispute.
        </p>
      </>
    ),
  },

  {
    number: "10",
    title: "Payments",
    content: (
      <>
        <p>
          Eligible approved referral commissions are
          processed on a monthly basis according to the
          Program&apos;s then-current payment schedule.
        </p>

        <p>
          Partners are responsible for maintaining accurate
          payment information and for providing any
          documentation reasonably required to process
          payment.
        </p>

        <p>
          Apexx Biolabs may withhold disputed, fraudulent,
          reversed, non-qualifying, or compliance-related
          amounts while they are investigated.
        </p>
      </>
    ),
  },

  {
    number: "11",
    title: "Taxes",
    content: (
      <>
        <p>
          Partners are responsible for determining and
          satisfying their own tax obligations arising from
          payments received through the Program.
        </p>

        <p>
          Apexx Biolabs may request tax documentation or
          other information where required for reporting,
          verification, or payment processing purposes.
        </p>
      </>
    ),
  },

  {
    number: "12",
    title: "Brand & Intellectual Property",
    content: (
      <>
        <p>
          Approval in the Program does not transfer ownership
          of any Apexx Biolabs trademark, logo, product
          image, website content, design, copyright, or other
          intellectual property.
        </p>

        <p>
          Partners may use approved Apexx Biolabs branding
          solely for authorized Program activity and only in
          a manner that does not misrepresent the
          Partner&apos;s relationship with Apexx Biolabs.
        </p>

        <p>
          Partners may not claim to be employees, agents,
          representatives, subsidiaries, or official
          spokespersons of Apexx Biolabs.
        </p>
      </>
    ),
  },

  {
    number: "13",
    title: "Independent Relationship",
    content: (
      <>
        <p>
          Participation in the Program does not create an
          employment relationship, partnership, joint
          venture, franchise, agency relationship, or other
          similar relationship between Apexx Biolabs and the
          Partner.
        </p>

        <p>
          Partners operate independently and are responsible
          for their own activities, communications, business
          operations, expenses, taxes, and legal compliance.
        </p>
      </>
    ),
  },

  {
    number: "14",
    title: "Monitoring & Compliance",
    content: (
      <>
        <p>
          Apexx Biolabs may review publicly available Partner
          content and referral activity for compliance with
          these Terms and applicable Program standards.
        </p>

        <p>
          If Apexx Biolabs identifies content or conduct that
          may violate these Terms, the Partner may be
          required to modify or remove the content promptly.
        </p>

        <p>
          Serious or repeated violations may result in
          suspension, termination, cancellation of pending
          commissions associated with prohibited activity,
          or other appropriate action.
        </p>
      </>
    ),
  },

  {
    number: "15",
    title: "Prohibited Conduct",
    content: (
      <>
        <p>Partners may not engage in:</p>

        <ul className="space-y-3 pl-5">
          <li>• False or misleading advertising.</li>
          <li>• Medical or therapeutic claims.</li>
          <li>• Promotion of human or veterinary use.</li>
          <li>• Dosing or administration guidance.</li>
          <li>• Spam or unlawful unsolicited marketing.</li>
          <li>• Fraudulent or artificial referrals.</li>
          <li>• Misrepresentation of affiliation with Apexx Biolabs.</li>
          <li>• Unauthorized use of Apexx Biolabs intellectual property.</li>
          <li>• Conduct intended to circumvent Program rules.</li>
        </ul>
      </>
    ),
  },

  {
    number: "16",
    title: "Suspension & Termination",
    content: (
      <>
        <p>
          Apexx Biolabs may suspend or terminate a
          Partner&apos;s participation for violation of these
          Terms, suspected fraud, regulatory or legal risk,
          misuse of the Program, or other conduct that may
          harm Apexx Biolabs, its customers, or the Program.
        </p>

        <p>
          Following termination, the Partner must stop using
          referral links, referral codes, and Apexx Biolabs
          branding as directed by Apexx Biolabs.
        </p>
      </>
    ),
  },

  {
    number: "17",
    title: "Program Changes",
    content: (
      <>
        <p>
          Apexx Biolabs may modify the Program, including
          commission rates, customer discounts, eligibility
          standards, payment schedules, attribution rules,
          or these Terms.
        </p>

        <p>
          Material changes may be communicated through the
          Partner dashboard, email, website, or other
          reasonable means.
        </p>

        <p>
          Continued participation after updated Terms become
          effective constitutes acceptance of the updated
          Program requirements to the extent permitted by
          applicable law.
        </p>
      </>
    ),
  },

  {
    number: "18",
    title: "No Guarantee of Earnings",
    content: (
      <>
        <p>
          Participation in the Program does not guarantee
          referrals, sales, commission, income, or any
          particular financial result.
        </p>

        <p>
          Any examples, estimates, projections, or
          illustrations of referral value are examples only
          and are not guarantees of future performance.
        </p>
      </>
    ),
  },

  {
    number: "19",
    title: "Limitation of Program Access",
    content: (
      <>
        <p>
          Program participation is a revocable privilege and
          does not create a permanent right to participate,
          receive a particular commission rate, or use any
          Apexx Biolabs referral system.
        </p>

        <p>
          Apexx Biolabs may discontinue the Program or
          restrict participation where reasonably necessary
          for operational, legal, regulatory, security, or
          compliance reasons.
        </p>
      </>
    ),
  },

  {
    number: "20",
    title: "Electronic Acceptance",
    content: (
      <>
        <p>
          By checking the Program agreement checkbox and
          submitting an application, the applicant
          acknowledges that they have read and agree to these
          Terms.
        </p>

        <p>
          Electronic acceptance may be recorded together with
          information such as the applicant&apos;s account,
          date and time of acceptance, and version of the
          Terms accepted.
        </p>
      </>
    ),
  },
];

export default function ResearchReferralTermsPage() {
  return (
    <main className="min-h-screen bg-[#081526] text-white">

      {/* HERO */}
      <section className="border-b border-white/[0.07] px-6 pb-16 pt-24">
        <div className="mx-auto max-w-6xl">

<Link
  href="/research-referral#apply"
  className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/40 transition hover:text-blue-300"
>
  ← Back to application
</Link>

          <div className="max-w-4xl">

            <p className="mb-5 text-xs font-black uppercase tracking-[0.35em] text-blue-300">
              Apexx Research Referral Program
            </p>

            <h1 className="text-5xl font-black tracking-[-0.04em] md:text-7xl">
              Program Terms
              <span className="text-blue-300">.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/50 md:text-lg">
              Terms governing participation in the Apexx
              Biolabs Research Referral Program.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">

              <div className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/45">
                Version 1.0
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/45">
                Effective August 18, 2026
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* CONTENT */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[250px_1fr]">

          {/* SIDE NAV */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">

              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/25">
                Program Terms
              </p>

              <div className="space-y-1 text-sm text-white/40">
                <a
                  href="#terms"
                  className="block py-2 transition hover:text-blue-300"
                >
                  Terms & Conditions
                </a>

                <a
                  href="#compliance"
                  className="block py-2 transition hover:text-blue-300"
                >
                  Compliance
                </a>

                <a
                  href="#acceptance"
                  className="block py-2 transition hover:text-blue-300"
                >
                  Acceptance
                </a>
              </div>

              <div className="mt-8 rounded-2xl border border-blue-400/15 bg-blue-500/[0.05] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
                  Questions?
                </p>

                <p className="mt-3 text-xs leading-6 text-white/40">
                  Contact Apexx Biolabs regarding Research
                  Referral Program requirements.
                </p>

                <a
                  href="mailto:support@apexxbiolabs.com"
                  className="mt-4 block text-xs font-bold text-white/70 hover:text-blue-300"
                >
                  support@apexxbiolabs.com
                </a>
              </div>

            </div>
          </aside>


          {/* TERMS */}
          <div id="terms" className="min-w-0">

            <div className="mb-10 rounded-[28px] border border-blue-400/15 bg-blue-500/[0.05] p-6 md:p-8">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">
                Important
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">
                These Terms apply to all approved Research
                Referral Partners. Partners are responsible
                for ensuring that their referral activity,
                promotional content, and communications
                comply with these Terms and applicable law.
              </p>

            </div>


            <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">

              {sections.map((section) => (
                <section
                  key={section.number}
                  id={
                    section.number === "14"
                      ? "compliance"
                      : section.number === "20"
                      ? "acceptance"
                      : undefined
                  }
                  className="grid gap-5 py-10 md:grid-cols-[55px_1fr]"
                >

                  <div className="text-xs font-black tracking-widest text-blue-300/60">
                    {section.number}
                  </div>

                  <div>
                    <h2 className="text-xl font-black tracking-tight md:text-2xl">
                      {section.title}
                    </h2>

                    <div className="mt-5 space-y-4 text-sm leading-7 text-white/50">
                      {section.content}
                    </div>
                  </div>

                </section>
              ))}

            </div>


            {/* CONTACT */}
            <section className="mt-14 rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-7 md:p-10">

              <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                Contact
              </p>

              <h2 className="mt-4 text-2xl font-black">
                Questions about the Program?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
                Contact Apexx Biolabs before participating
                if you have questions regarding Program
                requirements or permitted referral activity.
              </p>

              <a
                href="mailto:support@apexxbiolabs.com"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-[#081526] transition hover:bg-blue-100"
              >
                Contact Support
              </a>

            </section>


            <p className="mt-8 text-xs leading-6 text-white/25">
              Last updated August 18, 2026. Version 1.0.
            </p>

          </div>
        </div>
      </section>

    </main>
  );
}