import { createClient } from "@supabase/supabase-js";
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

export default async function AffiliateApplicationsAdminPage() {
  const { data: applications, error } =
    await supabaseAdmin
      .from("affiliate_applications")
      .select(`
        id,
        created_at,
        name,
        email,
        organization,
        website,
        audience,
        description,
        status,
        reviewed_at,
        review_notes,
        affiliate_id
      `)
      .order("created_at", {
        ascending: false,
      });

  const safeApplications =
    applications || [];

  const pendingApplications =
    safeApplications.filter(
      (application) =>
        application.status === "pending"
    );

  const approvedApplications =
    safeApplications.filter(
      (application) =>
        application.status === "approved"
    );

  const rejectedApplications =
    safeApplications.filter(
      (application) =>
        application.status === "rejected"
    );

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-blue-300">
              Apexx Admin
            </p>

            <h1 className="text-4xl font-black sm:text-5xl md:text-6xl">
              Referral Applications
            </h1>

            <p className="mt-4 max-w-2xl text-white/60">
              Review applications submitted through the
              Apexx Research Referral Program.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              href="/admin/affiliates"
              className="rounded-full border border-blue-400/20 bg-blue-500/10 px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-blue-200 transition hover:bg-blue-500/20"
            >
              Affiliates
            </Link>

            <Link
              href="/admin"
              className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-white/70 transition hover:bg-white/[0.08]"
            >
              Back to Admin
            </Link>

          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-red-200">
            Unable to load referral applications:{" "}
            {error.message}
          </div>
        )}

        {/* STATS */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            label="Total"
            value={safeApplications.length}
          />

          <StatCard
            label="Pending"
            value={pendingApplications.length}
            highlight
          />

          <StatCard
            label="Approved"
            value={approvedApplications.length}
          />

          <StatCard
            label="Rejected"
            value={rejectedApplications.length}
          />

        </div>

        {/* PENDING */}
        <section className="mb-12">

          <div className="mb-5 flex items-center justify-between gap-4">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
                Needs Review
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Pending Applications
              </h2>
            </div>

            {pendingApplications.length > 0 && (
              <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-yellow-200">
                {pendingApplications.length} Pending
              </span>
            )}

          </div>

          {pendingApplications.length === 0 ? (
            <EmptyState
              title="You're all caught up"
              text="There are no Research Referral applications waiting for review."
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {pendingApplications.map(
                (application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                  />
                )
              )}

            </div>
          )}

        </section>

        {/* APPLICATION HISTORY */}
        <section>

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/35">
              Application History
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Reviewed Applications
            </h2>

          </div>

          {approvedApplications.length === 0 &&
          rejectedApplications.length === 0 ? (
            <EmptyState
              title="No reviewed applications yet"
              text="Approved and rejected applications will appear here."
            />
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>
                    <tr className="border-b border-white/10">

                      <th className="p-5 text-left text-xs uppercase tracking-widest text-white/40">
                        Applicant
                      </th>

                      <th className="p-5 text-left text-xs uppercase tracking-widest text-white/40">
                        Audience
                      </th>

                      <th className="p-5 text-left text-xs uppercase tracking-widest text-white/40">
                        Applied
                      </th>

                      <th className="p-5 text-left text-xs uppercase tracking-widest text-white/40">
                        Status
                      </th>

                      <th className="p-5 text-right text-xs uppercase tracking-widest text-white/40">
                        Application
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {[
                      ...approvedApplications,
                      ...rejectedApplications,
                    ].map((application) => (

                      <tr
                        key={application.id}
                        className="border-b border-white/[0.06] last:border-0 transition hover:bg-white/[0.025]"
                      >

                        <td className="p-5">

                          <p className="font-bold text-white">
                            {application.name}
                          </p>

                          <p className="mt-1 text-sm text-white/40">
                            {application.email}
                          </p>

                        </td>

                        <td className="p-5 text-sm text-white/60">
                          {formatAudience(
                            application.audience
                          )}
                        </td>

                        <td className="p-5 text-sm text-white/50">
                          {formatDate(
                            application.created_at
                          )}
                        </td>

                        <td className="p-5">

                          <StatusBadge
                            status={
                              application.status
                            }
                          />

                        </td>

                        <td className="p-5 text-right">

                          <Link
                            href={`/admin/affiliate-applications/${application.id}`}
                            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/70 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-200"
                          >
                            View
                          </Link>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </section>

      </div>

    </main>
  );
}

/* =========================================================
   APPLICATION CARD
========================================================= */

function ApplicationCard({
  application,
}: {
  application: any;
}) {
  return (
    <div className="group rounded-[2rem] border border-blue-400/15 bg-white/[0.04] p-6 transition hover:border-blue-400/30 hover:bg-white/[0.055]">

      <div className="flex items-start justify-between gap-5">

        <div className="min-w-0">

          <p className="text-xl font-black text-white">
            {application.name}
          </p>

          <p className="mt-1 break-all text-sm text-blue-200/70">
            {application.email}
          </p>

        </div>

        <StatusBadge
          status={application.status}
        />

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <InfoBlock
          label="Audience"
          value={formatAudience(
            application.audience
          )}
        />

        <InfoBlock
          label="Applied"
          value={formatDate(
            application.created_at
          )}
        />

      </div>

      {(application.organization ||
        application.website) && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

          {application.organization && (
            <InfoBlock
              label="Organization"
              value={
                application.organization
              }
            />
          )}

          {application.website && (
            <InfoBlock
              label="Website / Social"
              value={
                application.website
              }
            />
          )}

        </div>
      )}

      <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/10 p-4">

        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
          Application
        </p>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/55">
          {application.description}
        </p>

      </div>

      <Link
        href={`/admin/affiliate-applications/${application.id}`}
        className="mt-6 flex w-full items-center justify-between rounded-full border border-blue-400/20 bg-blue-500/10 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-blue-200 transition hover:border-blue-300/40 hover:bg-blue-500/20"
      >

        Review Application

        <span className="text-lg">
          →
        </span>

      </Link>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.75rem] border p-5 sm:p-6 ${
        highlight
          ? "border-blue-400/25 bg-blue-500/[0.08]"
          : "border-white/10 bg-white/[0.035]"
      }`}
    >

      <p className="text-xs font-bold uppercase tracking-widest text-white/40">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-black sm:text-4xl ${
          highlight
            ? "text-blue-300"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   INFO BLOCK
========================================================= */

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-white/70">
        {value || "—"}
      </p>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
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
      className={`inline-flex shrink-0 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${styles}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 text-xl text-blue-300">
        ✓
      </div>

      <p className="mt-5 text-xl font-black text-white">
        {title}
      </p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/45">
        {text}
      </p>

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(
  date: string | null
) {
  if (!date) {
    return "—";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
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