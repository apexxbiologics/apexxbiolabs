import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AffiliatesAdminPage() {
  const { data: affiliates, error } = await supabaseAdmin
    .from("affiliates")
    .select(`
      id,
      created_at,
      user_id,
      name,
      email,
      code,
      discount_rate,
      commission_rate,
      status
    `)
    .order("created_at", { ascending: false });

  const safeAffiliates = affiliates || [];

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
              Apexx Admin
            </p>

            <h1 className="text-5xl md:text-6xl font-black">
              Affiliates
            </h1>

            <p className="text-white/60 mt-4 max-w-2xl">
              Manage affiliate accounts, codes, discounts, commissions,
              and account status.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/admin"
              className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-white/70 text-sm uppercase tracking-widest hover:bg-white/[0.08] transition-all"
            >
              Back
            </a>

            <a
              href="/admin/affiliates/new"
              className="rounded-full bg-blue-500 px-6 py-3 text-white text-sm font-bold uppercase tracking-widest hover:bg-blue-400 transition-all"
            >
              + Add Affiliate
            </a>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5 mb-8 text-red-200">
            Unable to load affiliates: {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Total Affiliates
            </p>

            <p className="text-4xl font-black mt-3">
              {safeAffiliates.length}
            </p>
          </div>

          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Active
            </p>

            <p className="text-4xl font-black text-blue-300 mt-3">
              {
                safeAffiliates.filter(
                  (affiliate) => affiliate.status === "active"
                ).length
              }
            </p>
          </div>

          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Invited
            </p>

            <p className="text-4xl font-black text-blue-300 mt-3">
              {
                safeAffiliates.filter(
                  (affiliate) => affiliate.status === "invited"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] overflow-hidden">
          {safeAffiliates.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-2xl font-black mb-3">
                No affiliates yet
              </p>

              <p className="text-white/50 mb-6">
                Add your first Apexx affiliate to get started.
              </p>

              <a
                href="/admin/affiliates/new"
                className="inline-block rounded-full bg-blue-500 px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all"
              >
                Add Affiliate
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest">
                      Affiliate
                    </th>

                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest">
                      Code
                    </th>

                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest">
                      Discount
                    </th>

                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest">
                      Commission
                    </th>

                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest">
                      Status
                    </th>

                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {safeAffiliates.map((affiliate) => (
                    <tr
                      key={affiliate.id}
                      className="border-b border-white/[0.06] last:border-0"
                    >
                      <td className="p-5">
                        <p className="font-bold">
                          {affiliate.name}
                        </p>

                        <p className="text-white/40 text-sm mt-1">
                          {affiliate.email}
                        </p>
                      </td>

                      <td className="p-5">
                        <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-blue-200 font-bold">
                          {affiliate.code}
                        </span>
                      </td>

                      <td className="p-5">
                        {Number(affiliate.discount_rate) * 100}%
                      </td>

                      <td className="p-5">
                        {Number(affiliate.commission_rate) * 100}%
                      </td>

                      <td className="p-5">
                        <span className="capitalize">
                          {affiliate.status}
                        </span>
                      </td>

                      <td className="p-5 text-white/60">
                        {new Date(
                          affiliate.created_at
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}