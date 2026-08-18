import { createClient } from "@supabase/supabase-js";
import AffiliateRowActions from "./AffiliateRowActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CONFIRMED_STATUSES = [
  "paid",
  "shipped",
  "payment received",
];

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

  const {
    data: affiliateOrders,
    error: affiliateOrdersError,
  } = await supabaseAdmin
    .from("orders")
    .select(`
      affiliate_id,
      status,
      affiliate_commission,
      affiliate_paid_out
    `)
    .not("affiliate_id", "is", null);

  if (affiliateOrdersError) {
    console.error(
      "Affiliate amount owed loading error:",
      affiliateOrdersError
    );
  }

  const amountOwedByAffiliate =
    new Map<string, number>();

  for (const order of affiliateOrders || []) {
    const affiliateId = String(
      order.affiliate_id || ""
    );

    if (!affiliateId) {
      continue;
    }

    const normalizedStatus = String(
      order.status || ""
    ).toLowerCase();

    const isConfirmed =
      CONFIRMED_STATUSES.includes(
        normalizedStatus
      );

    const isPaidOut =
      Boolean(
        order.affiliate_paid_out
      );

    const commission =
      Number(
        order.affiliate_commission || 0
      );

    if (
      isConfirmed &&
      !isPaidOut &&
      commission > 0
    ) {
      const current =
        amountOwedByAffiliate.get(
          affiliateId
        ) || 0;

      amountOwedByAffiliate.set(
        affiliateId,
        current + commission
      );
    }
  }

  const totalAffiliates =
    safeAffiliates.length;

  const activeAffiliates =
    safeAffiliates.filter(
      (affiliate) =>
        affiliate.status === "active"
    ).length;

  const invitedAffiliates =
    safeAffiliates.filter(
      (affiliate) =>
        affiliate.status === "invited"
    ).length;

  const totalAmountOwed =
    Array.from(
      amountOwedByAffiliate.values()
    ).reduce(
      (sum, amount) =>
        sum + amount,
      0
    );

  function formatMoney(
    amount: number
  ) {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(amount);
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
              Apexx Admin
            </p>

            <h1 className="text-5xl md:text-6xl font-black">
              Affiliates
            </h1>

            <p className="text-white/60 mt-4 max-w-2xl">
              Manage affiliate accounts, promo codes,
              discounts, commissions, account status,
              payouts, and affiliate performance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/admin"
              className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-center text-white/70 text-sm uppercase tracking-widest hover:bg-white/[0.08] transition-all"
            >
              Back
            </a>

            <a
              href="/admin/affiliates/new"
              className="rounded-full bg-blue-500 px-6 py-3 text-center text-white text-sm font-bold uppercase tracking-widest hover:bg-blue-400 transition-all"
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

        {affiliateOrdersError && (
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-5 mb-8 text-yellow-100">
            Affiliate accounts loaded, but current amount owed could not be calculated.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Total Affiliates
            </p>

            <p className="text-4xl font-black mt-3">
              {totalAffiliates}
            </p>
          </div>

          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Active
            </p>

            <p className="text-4xl font-black text-blue-300 mt-3">
              {activeAffiliates}
            </p>
          </div>

          <div className="rounded-[30px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-white/50 text-sm uppercase tracking-widest">
              Invited
            </p>

            <p className="text-4xl font-black text-blue-300 mt-3">
              {invitedAffiliates}
            </p>
          </div>

          <div className="rounded-[30px] border border-green-400/15 bg-green-500/[0.06] p-6">
            <p className="text-green-100/60 text-sm uppercase tracking-widest">
              Total Amount Owed
            </p>

            <p className="text-4xl font-black text-green-300 mt-3">
              {formatMoney(
                totalAmountOwed
              )}
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
              <table className="w-full min-w-[1450px]">
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
                      Amount Owed
                    </th>

                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest">
                      Status
                    </th>

                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest">
                      Joined
                    </th>

                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest text-right">
                      Dashboard
                    </th>

                    <th className="p-5 text-white/50 text-xs uppercase tracking-widest text-right">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {safeAffiliates.map(
                    (affiliate) => {
                      const discountPercent =
                        Number(
                          affiliate.discount_rate ||
                            0
                        ) * 100;

                      const commissionPercent =
                        Number(
                          affiliate.commission_rate ||
                            0
                        ) * 100;

                      const amountOwed =
                        amountOwedByAffiliate.get(
                          affiliate.id
                        ) || 0;

                      return (
                        <tr
                          key={affiliate.id}
                          className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.025] transition-colors"
                        >

                          <td className="p-5">
                            <p className="font-bold text-white">
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
                            {discountPercent}%
                          </td>

                          <td className="p-5">
                            {commissionPercent}%
                          </td>

                          <td className="p-5">
                            <span
                              className={
                                amountOwed > 0
                                  ? "font-black text-green-300"
                                  : "text-white/45"
                              }
                            >
                              {formatMoney(
                                amountOwed
                              )}
                            </span>
                          </td>

                          <td className="p-5">
                            <span
                              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${
                                affiliate.status === "active"
                                  ? "border border-green-400/20 bg-green-500/10 text-green-300"
                                  : affiliate.status === "invited"
                                  ? "border border-yellow-400/20 bg-yellow-500/10 text-yellow-200"
                                  : affiliate.status === "archived"
                                  ? "border border-white/10 bg-white/[0.05] text-white/40"
                                  : affiliate.status === "suspended"
                                  ? "border border-red-400/20 bg-red-500/10 text-red-200"
                                  : "border border-white/10 bg-white/[0.05] text-white/60"
                              }`}
                            >
                              {affiliate.status}
                            </span>
                          </td>

                          <td className="p-5 text-white/60">
                            {affiliate.created_at
                              ? new Date(
                                  affiliate.created_at
                                ).toLocaleDateString()
                              : "—"}
                          </td>

                          <td className="p-5 text-right">
                            <a
                              href={`/admin/affiliates/${affiliate.id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-blue-200 transition hover:border-blue-300/40 hover:bg-blue-500/20"
                            >
                              View Dashboard
                              <span>→</span>
                            </a>
                          </td>

                          <td className="p-5 text-right">
                            <AffiliateRowActions
                              affiliateId={
                                affiliate.id
                              }
                              affiliateName={
                                affiliate.name
                              }
                              status={
                                affiliate.status
                              }
                            />
                          </td>

                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-white/35">
          Archive affiliates to disable access while preserving their order and payout history.
          Permanent delete is only allowed when the affiliate has no linked orders or payout records.
        </p>

      </div>
    </main>
  );
}