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
      research_use_acknowledgement,
      marketing_acknowledgement,
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
                  label="Organization / Platform"
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
                    Website / Social
                  </p>

                  <a
                    href={
                      application.website
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all rounded-2xl border border-blue-400/15 bg-blue-500/[0.06] px-5 py-4 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/10"
                  >
                    {
                      application.website
                    }
                  </a>

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

            {/* ACKNOWLEDGEMENTS */}
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">

              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                Required Acknowledgements
              </p>

              <div className="space-y-4">

                <AcknowledgementCard
                  accepted={
                    Boolean(
                      application.research_use_acknowledgement
                    )
                  }
                  title="Research Use Acknowledgement"
                  text="Applicant acknowledged that Apexx Biolabs products are intended strictly for lawful laboratory research use and are not for human or veterinary use."
                />

                <AcknowledgementCard
                  accepted={
                    Boolean(
                      application.marketing_acknowledgement
                    )
                  }
                  title="Marketing Standards Acknowledgement"
                  text="Applicant agreed not to promote personal use, make medical or therapeutic claims, or provide dosing or administration guidance in connection with Apexx Biolabs products."
                />

              </div>

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
                    Rejecting the application will mark it as declined.
                  </p>

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

                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">

                      <button
                        type="submit"
                        name="action"
                        value="approve"
                        className="rounded-full border border-green-400/25 bg-green-500/10 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-green-200 transition hover:bg-green-500/20"
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
                    <Link
                      href={`/admin/affiliates/${application.affiliate_id}`}
                      className="mt-7 flex w-full items-center justify-center rounded-full border border-blue-400/25 bg-blue-500/10 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-blue-200 transition hover:bg-blue-500/20"
                    >
                      View Affiliate Dashboard
                    </Link>
                  ) : (
                    <div className="mt-7 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4">

                      <p className="text-sm font-bold text-yellow-200">
                        Affiliate invitation not created yet.
                      </p>

                      <p className="mt-2 text-xs leading-relaxed text-yellow-100/60">
                        We will connect approval directly to your
                        affiliate invitation system in the next step.
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

            {/* APPLICATION ID */}
            <section className="rounded-[2rem] border border-white/[0.07] bg-white/[0.02] p-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
                Application ID
              </p>

              <p className="mt-2 break-all font-mono text-xs text-white/35">
                {
                  application.id
                }
              </p>

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
   ACKNOWLEDGEMENT
========================================================= */

function AcknowledgementCard({
  accepted,
  title,
  text,
}: {
  accepted: boolean;
  title: string;
  text: string;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border p-5 ${
        accepted
          ? "border-green-400/15 bg-green-500/[0.06]"
          : "border-red-400/20 bg-red-500/[0.06]"
      }`}
    >

      <div className="flex items-start gap-4">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            accepted
              ? "bg-green-500/10 text-green-300"
              : "bg-red-500/10 text-red-300"
          }`}
        >
          {accepted
            ? "✓"
            : "×"}
        </div>

        <div>

          <p className="font-black text-white">
            {title}
          </p>

          <p className="mt-2 text-sm leading-relaxed text-white/50">
            {text}
          </p>

          <p
            className={`mt-3 text-xs font-black uppercase tracking-widest ${
              accepted
                ? "text-green-300"
                : "text-red-300"
            }`}
          >
            {accepted
              ? "Acknowledged"
              : "Not Acknowledged"}
          </p>

        </div>

      </div>

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