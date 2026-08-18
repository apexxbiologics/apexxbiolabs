type NewAffiliatePageProps = {
  searchParams: Promise<{
    application_id?: string;
    name?: string;
    email?: string;
    organization?: string;
  }>;
};

export default async function NewAffiliatePage({
  searchParams,
}: NewAffiliatePageProps) {
  const params = await searchParams;

  const applicationId =
    params.application_id || "";

  const prefilledName =
    params.name || "";

  const prefilledEmail =
    params.email || "";

  const organization =
    params.organization || "";

  const cameFromApplication =
    Boolean(applicationId);

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">

      <div className="mx-auto max-w-3xl">

        <div className="mb-10">

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-blue-300">
            Apexx Admin
          </p>

          <h1 className="text-5xl font-black md:text-6xl">
            {cameFromApplication
              ? "Approve Referral Partner"
              : "Add Affiliate"}
          </h1>

          <p className="mt-4 text-white/60">
            {cameFromApplication
              ? "Set the referral code, customer discount, and commission rate before sending the approved applicant their invitation."
              : "Create an invite-only affiliate account."}
          </p>

        </div>

        {cameFromApplication && (
          <div className="mb-6 rounded-[28px] border border-green-400/20 bg-green-500/[0.07] p-6">

            <p className="text-xs font-black uppercase tracking-[0.3em] text-green-300">
              Approved Referral Application
            </p>

            <p className="mt-3 text-xl font-black text-white">
              {prefilledName}
            </p>

            <p className="mt-1 text-sm text-white/55">
              {prefilledEmail}
            </p>

            {organization && (
              <p className="mt-3 text-sm text-white/45">
                {organization}
              </p>
            )}

            <p className="mt-4 text-xs leading-relaxed text-white/40">
              This applicant has already been approved.
              Complete the referral setup below to send their
              activation invitation.
            </p>

          </div>
        )}

        <form
          action="/api/admin/affiliates/invite"
          method="POST"
          className="space-y-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-8"
        >

          {applicationId && (
            <input
              type="hidden"
              name="application_id"
              value={applicationId}
            />
          )}

          <div>
            <label className="mb-2 block text-sm uppercase tracking-widest text-white/50">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              required
              defaultValue={prefilledName}
              readOnly={cameFromApplication}
              className={`w-full rounded-2xl border px-5 py-4 text-white outline-none ${
                cameFromApplication
                  ? "cursor-not-allowed border-white/[0.07] bg-white/[0.025] text-white/60"
                  : "border-white/10 bg-white/[0.05] focus:border-blue-400/50"
              }`}
              placeholder="Ashley Smith"
            />

            {cameFromApplication && (
              <p className="mt-2 text-xs text-white/30">
                Pulled from the approved referral application.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm uppercase tracking-widest text-white/50">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              defaultValue={prefilledEmail}
              readOnly={cameFromApplication}
              className={`w-full rounded-2xl border px-5 py-4 text-white outline-none ${
                cameFromApplication
                  ? "cursor-not-allowed border-white/[0.07] bg-white/[0.025] text-white/60"
                  : "border-white/10 bg-white/[0.05] focus:border-blue-400/50"
              }`}
              placeholder="ashley@email.com"
            />

            {cameFromApplication && (
              <p className="mt-2 text-xs text-white/30">
                The invitation will be sent to this approved email address.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm uppercase tracking-widest text-white/50">
              Referral Code
            </label>

            <input
              type="text"
              name="code"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 uppercase text-white outline-none focus:border-blue-400/50"
              placeholder="ASHLEY15"
            />

            <p className="mt-2 text-xs text-white/30">
              This will be their unique referral code.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm uppercase tracking-widest text-white/50">
                Customer Discount %
              </label>

              <input
                type="number"
                name="discount"
                min="0"
                max="100"
                step="0.01"
                defaultValue="15"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-widest text-white/50">
                Commission %
              </label>

              <input
                type="number"
                name="commission"
                min="0"
                max="100"
                step="0.01"
                defaultValue="15"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none focus:border-blue-400/50"
              />
            </div>

          </div>

          <div className="rounded-2xl border border-blue-400/15 bg-blue-500/[0.06] p-5">

            <p className="text-sm font-black text-blue-200">
              Before sending
            </p>

            <p className="mt-2 text-xs leading-relaxed text-white/45">
              Confirm the referral code, customer discount,
              and commission rate are correct. The applicant
              will receive the same secure 24-hour invitation
              used by the Apexx Research Referral Program.
            </p>

          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">

            <button
              type="submit"
              className="rounded-full bg-blue-500 px-7 py-4 text-sm font-bold uppercase tracking-widest transition hover:bg-blue-400"
            >
              {cameFromApplication
                ? "Send Referral Invitation"
                : "Send Affiliate Invite"}
            </button>

            <a
              href={
                cameFromApplication
                  ? `/admin/affiliate-applications/${applicationId}`
                  : "/admin/affiliates"
              }
              className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-center text-sm uppercase tracking-widest text-white/70 transition hover:bg-white/[0.08]"
            >
              Cancel
            </a>

          </div>

        </form>

      </div>

    </main>
  );
}