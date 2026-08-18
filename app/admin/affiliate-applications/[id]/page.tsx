import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AffiliateApplicationReviewPage({
  params,
}: PageProps) {
  const { id } = await params;

  const {
    data: application,
    error,
  } = await supabaseAdmin
    .from("affiliate_applications")
    .select(`
      id,
      created_at,
      updated_at,
      name,
      email,
      organization,
      website,
      audience,
      description,
      terms_acknowledgement,
      terms_version,
      terms_accepted_at,
      status,
      reviewed_at,
      review_notes,
      affiliate_id
    `)
    .eq("id", id)
    .maybeSingle();

  if (
    error ||
    !application
  ) {
    if (error) {
      console.error(
        "Referral application lookup error:",
        error
      );
    }

    notFound();
  }

  const isPending =
    application.status ===
    "pending";

  const isApproved =
    application.status ===
    "approved";

  const isRejected =
    application.status ===
    "rejected";

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-blue-300">
              Apexx Admin
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Review Application
            </h1>

            <p className="mt-4 max-w-2xl text-white/60">
              Review this Research Referral Program application
              before approving or rejecting the applicant.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              href="/admin/affiliate-applications"
              className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/70 transition hover:bg-white/[0.08]"
            >
              ← Applications
            </Link>

            <Link
              href="/admin/affiliates"
              className="rounded-full border border-blue-400/20 bg-blue-500/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-blue-200 transition hover:bg-blue-500/20"
            >
              Affiliates
            </Link>

          </div>

        </div>

        {/* STATUS BAR */}
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                Application Status
              </p>

              <div className="mt-3">

                <StatusBadge
                  status={
                    application.status
                  }
                />

              </div>

            </div>

            <div className="text-left sm:text-right">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                Submitted
              </p>

              <p className="mt-2 font-semibold text-white/70">
                {formatDateTime(
                  application.created_at
                )}
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">

          {/* =====================================
              LEFT — APPLICATION DETAILS
          ===================================== */}
          <div className="space-y-6">

            {/* APPLICANT */}
            <section className="rounded-[2rem] border border-blue-400/15 bg-white/[0.04] p-6 sm:p-8">

              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                Applicant
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoCard
                  label="Full Name"
                  value={
                    application.name
                  }
                />

                <InfoCard
                  label="Email"
                  value={
                    application.email
                  }
                />

                <InfoCard
                  label="Website / Platform"
                  value={
                    application.organization ||
                    "Not provided"
                  }
                />

                <InfoCard
                  label="Research Audience"
                  value={
                    formatAudience(
                      application.audience
                    )
                  }
                />

              </div>

              {application.website && (
                <div className="mt-4">

                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                    Handle or Link
                  </p>

                  {isLikelyUrl(
                    application.website
                  ) ? (
                    <a
                      href={
                        normalizeUrl(
                          application.website
                        )
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="block break-all rounded-2xl border border-blue-400/15 bg-blue-500/[0.06] px-5 py-4 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/10"
                    >
                      {
                        application.website
                      }
                    </a>
                  ) : (
                    <div className="break-all rounded-2xl border border-blue-400/15 bg-blue-500/[0.06] px-5 py-4 text-sm font-semibold text-blue-200">
                      {
                        application.website
                      }
                    </div>
                  )}

                </div>
              )}

            </section>

            {/* APPLICATION DESCRIPTION */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">

              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                Referral Audience
              </p>

              <h2 className="text-2xl font-black text-white">
                How they plan to refer research customers
              </h2>

              <div className="mt-6 rounded-[1.5rem] border border-white/[0.07] bg-black/10 p-6">

                <p className="whitespace-pre-wrap text-base leading-relaxed text-white/65">
                  {
                    application.description
                  }
                </p>

              </div>

            </section>

            {/* PROGRAM TERMS */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">

              <div className="flex items-start justify-between gap-5">

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                    Program Terms
                  </p>

                  <h2 className="mt-3 text-2xl font-black text-white">
                    Terms & Conditions
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/45">
                    Confirmation that the applicant accepted the
                    Apexx Biolabs Research Referral Program Terms
                    when submitting this application.
                  </p>

                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-lg font-black ${
                    application.terms_acknowledgement
                      ? "border-green-400/20 bg-green-500/10 text-green-300"
                      : "border-red-400/20 bg-red-500/10 text-red-300"
                  }`}
                >
                  {application.terms_acknowledgement
                    ? "✓"
                    : "×"}
                </div>

              </div>

              <div
                className={`mt-6 rounded-[1.5rem] border p-5 ${
                  application.terms_acknowledgement
                    ? "border-green-400/15 bg-green-500/[0.06]"
                    : "border-red-400/20 bg-red-500/[0.06]"
                }`}
              >

                <div className="flex items-start gap-4">

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      application.terms_acknowledgement
                        ? "bg-green-500/10 text-green-300"
                        : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    {application.terms_acknowledgement
                      ? "✓"
                      : "×"}
                  </div>

                  <div>

                    <p className="font-black text-white">
                      Research Referral Program Terms
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-white/50">
                      Applicant agreed to the Research Referral Program
                      Terms & Conditions, including research-use
                      restrictions, referral marketing standards,
                      disclosure requirements, commission rules,
                      and other Program policies.
                    </p>

                    <p
                      className={`mt-4 text-xs font-black uppercase tracking-[0.18em] ${
                        application.terms_acknowledgement
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {application.terms_acknowledgement
                        ? "Terms Accepted"
                        : "Terms Not Accepted"}
                    </p>

                  </div>

                </div>

              </div>

              {application.terms_acknowledgement && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <InfoCard
                    label="Terms Version"
                    value={
                      application.terms_version ||
                      "Current Version"
                    }
                  />

                  <InfoCard
                    label="Accepted"
                    value={
                      application.terms_accepted_at
                        ? formatDateTime(
                            application.terms_accepted_at
                          )
                        : "At application submission"
                    }
                  />

                </div>
              )}

              <Link
                href="/research-referral/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-blue-300 transition hover:text-blue-200"
              >
                View Program Terms
                <span>
                  ↗
                </span>
              </Link>

            </section>

          </div>

          {/* =====================================
              RIGHT — REVIEW / ACTIONS
          ===================================== */}
          <div className="space-y-6">

            {/* REVIEW CARD */}
            <section className="rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-[#102743] via-[#0e223d] to-[#091827] p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                Admin Review
              </p>

              {isPending && (
                <>

                  <h2 className="mt-4 text-3xl font-black text-white">
                    Make a Decision
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    Approving this application will allow you to
                    create and send a Research Referral invitation.
                    Rejecting the application will mark it as declined
                    and send the applicant an application update email.
                  </p>

                  {!application.terms_acknowledgement && (
                    <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">

                      <p className="text-sm font-bold text-red-200">
                        Terms acceptance is missing.
                      </p>

                      <p className="mt-2 text-xs leading-relaxed text-red-100/60">
                        This application does not contain a recorded
                        acceptance of the Research Referral Program Terms.
                      </p>

                    </div>
                  )}

                  <form
                    action="/api/admin/affiliate-applications/review"
                    method="POST"
                    className="mt-7"
                  >

                    <input
                      type="hidden"
                      name="applicationId"
                      value={
                        application.id
                      }
                    />

                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-white/40">
                        Review Notes
                      </label>

                      <textarea
                        name="reviewNotes"
                        rows={5}
                        placeholder="Optional internal notes about this application..."
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#081526]/70 px-5 py-4 text-sm leading-relaxed text-white outline-none placeholder:text-white/25 transition focus:border-blue-400/50"
                      />

                      <p className="mt-2 text-[11px] leading-relaxed text-white/25">
                        Review notes are internal and are not included
                        in applicant emails.
                      </p>

                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">

                      <button
                        type="submit"
                        name="action"
                        value="approve"
                        disabled={
                          !application.terms_acknowledgement
                        }
                        className="rounded-full border border-green-400/25 bg-green-500/10 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-green-200 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        Approve
                      </button>

                      <button
                        type="submit"
                        name="action"
                        value="reject"
                        className="rounded-full border border-red-400/25 bg-red-500/10 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-red-200 transition hover:bg-red-500/20"
                      >
                        Reject
                      </button>

                    </div>

                  </form>

                </>
              )}

              {isApproved && (
                <>

                  <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-full border border-green-400/20 bg-green-500/10 text-2xl text-green-300">
                    ✓
                  </div>

                  <h2 className="mt-5 text-3xl font-black text-white">
                    Application Approved
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    This applicant has been approved for the
                    Apexx Research Referral Program.
                  </p>

                  {application.affiliate_id ? (
                    <>

                      <div className="mt-6 rounded-2xl border border-green-400/15 bg-green-500/[0.06] p-4">

                        <p className="text-xs font-black uppercase tracking-[0.18em] text-green-300">
                          Affiliate Connected
                        </p>

                        <p className="mt-2 text-sm leading-relaxed text-white/50">
                          The approved application is linked to an
                          Affiliate account.
                        </p>

                      </div>

                      <Link
                        href={`/admin/affiliates/${application.affiliate_id}`}
                        className="mt-5 flex w-full items-center justify-center rounded-full border border-blue-400/25 bg-blue-500/10 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-blue-200 transition hover:bg-blue-500/20"
                      >
                        View Affiliate Dashboard
                      </Link>

                    </>
                  ) : (
                    <div className="mt-7 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4">

                      <p className="text-sm font-bold text-yellow-200">
                        Affiliate invitation not created yet.
                      </p>

                      <p className="mt-2 text-xs leading-relaxed text-yellow-100/60">
                        This application was approved, but it is not
                        currently linked to an Affiliate record.
                      </p>

                    </div>
                  )}

                </>
              )}

              {isRejected && (
                <>

                  <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-xl font-black text-red-300">
                    ×
                  </div>

                  <h2 className="mt-5 text-3xl font-black text-white">
                    Application Rejected
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    This Research Referral Program application
                    was declined.
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">
                      Applicant Notification
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-white/45">
                      The rejection workflow sends the applicant
                      an application status update by email.
                    </p>

                  </div>

                </>
              )}

            </section>

            {/* REVIEW INFORMATION */}
            {(application.reviewed_at ||
              application.review_notes) && (
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">

                <p className="text-xs font-black uppercase tracking-[0.25em] text-white/35">
                  Review History
                </p>

                {application.reviewed_at && (
                  <div className="mt-5">

                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                      Reviewed
                    </p>

                    <p className="mt-2 text-sm font-semibold text-white/65">
                      {formatDateTime(
                        application.reviewed_at
                      )}
                    </p>

                  </div>
                )}

                {application.review_notes && (
                  <div className="mt-5">

                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                      Internal Notes
                    </p>

                    <div className="mt-2 rounded-2xl border border-white/[0.07] bg-black/10 p-4">

                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/55">
                        {
                          application.review_notes
                        }
                      </p>

                    </div>

                  </div>
                )}

              </section>
            )}

            {/* APPLICATION RECORD */}
            <section className="rounded-[2rem] border border-white/[0.07] bg-white/[0.02] p-6">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/25">
                Application Record
              </p>

              <div className="mt-5 space-y-5">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
                    Application ID
                  </p>

                  <p className="mt-2 break-all font-mono text-xs text-white/35">
                    {
                      application.id
                    }
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
                    Last Updated
                  </p>

                  <p className="mt-2 text-xs text-white/35">
                    {application.updated_at
                      ? formatDateTime(
                          application.updated_at
                        )
                      : "—"}
                  </p>

                </div>

              </div>

            </section>

          </div>

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold text-white/75">
        {value || "—"}
      </p>

    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "approved"
      ? "border-green-400/20 bg-green-500/10 text-green-300"
      : status === "rejected"
        ? "border-red-400/20 bg-red-500/10 text-red-300"
        : "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";

  return (
    <span
      className={`inline-flex rounded-full border px-4 py-2 text-xs font-black uppercase tracking-widest ${styles}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDateTime(
  date: string | null
) {
  if (!date) {
    return "—";
  }

  return new Date(
    date
  ).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function formatAudience(
  audience: string | null
) {
  if (!audience) {
    return "—";
  }

  const labels: Record<
    string,
    string
  > = {
    laboratory:
      "Laboratory / Research Organization",

    "research-community":
      "Research Community",

    "professional-network":
      "Professional Network",

    educational:
      "Educational / Research Content",

    other:
      "Other",
  };

  return (
    labels[audience] ||
    audience
  );
}

function isLikelyUrl(
  value: string
) {
  const cleanValue =
    value.trim().toLowerCase();

  return (
    cleanValue.startsWith(
      "http://"
    ) ||
    cleanValue.startsWith(
      "https://"
    ) ||
    cleanValue.startsWith(
      "www."
    )
  );
}

function normalizeUrl(
  value: string
) {
  const cleanValue =
    value.trim();

  if (
    cleanValue.startsWith(
      "http://"
    ) ||
    cleanValue.startsWith(
      "https://"
    )
  ) {
    return cleanValue;
  }

  return `https://${cleanValue}`;
}