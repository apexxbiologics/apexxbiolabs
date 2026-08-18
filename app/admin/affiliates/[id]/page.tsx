import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import PayoutButton from "./PayoutButton";
import AffiliateControls from "./AffiliateControls";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminAffiliateDashboardPage({
  params,
}: PageProps) {
  const { id } = await params;

  const {
    data: affiliate,
    error: affiliateError,
  } = await supabaseAdmin
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
    .eq("id", id)
    .maybeSingle();

  if (affiliateError) {
    console.error(
      "Admin affiliate lookup error:",
      affiliateError
    );
  }

  if (!affiliate) {
    notFound();
  }

  const {
    data: orders,
    error: ordersError,
  } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      order_number,
      created_at,
      subtotal,
      discount,
      total,
      status,
      affiliate_commission,
      affiliate_paid_out,
      affiliate_paid_at,
      affiliate_payout_id
    `)
    .eq("affiliate_id", affiliate.id)
    .order("created_at", {
      ascending: false,
    });

  if (ordersError) {
    console.error(
      "Admin affiliate orders error:",
      ordersError
    );
  }

  const {
    data: payouts,
    error: payoutsError,
  } = await supabaseAdmin
    .from("affiliate_payouts")
    .select(`
      id,
      amount,
      payment_method,
      paid_at,
      notes,
      created_at
    `)
    .eq("affiliate_id", affiliate.id)
    .order("paid_at", {
      ascending: false,
    });

  if (payoutsError) {
    console.error(
      "Admin affiliate payouts error:",
      payoutsError
    );
  }

  const safeOrders = orders || [];
  const safePayouts = payouts || [];

  const confirmedStatuses = [
    "paid",
    "shipped",
    "payment received",
  ];

  const excludedStatuses = [
    "cancelled",
    "canceled",
    "refunded",
  ];

  let generatedSales = 0;
  let pendingCommission = 0;
  let amountOwed = 0;
  let paidOutFromOrders = 0;

  const activity = safeOrders.map(
    (order) => {
      const normalizedStatus = String(
        order.status || ""
      ).toLowerCase();

      const qualifyingSale =
        Math.max(
          0,
          Number(order.subtotal || 0) -
            Number(order.discount || 0)
        );

      const commission =
        Number(
          order.affiliate_commission || 0
        );

      const isExcluded =
        excludedStatuses.includes(
          normalizedStatus
        );

      const isConfirmed =
        confirmedStatuses.includes(
          normalizedStatus
        );

      const isPaidOut =
        Boolean(order.affiliate_paid_out);

      if (!isExcluded) {
        generatedSales +=
          qualifyingSale;
      }

      if (
        !isExcluded &&
        !isConfirmed
      ) {
        pendingCommission +=
          commission;
      }

      if (
        !isExcluded &&
        isConfirmed &&
        !isPaidOut
      ) {
        amountOwed +=
          commission;
      }

      if (
        !isExcluded &&
        isConfirmed &&
        isPaidOut
      ) {
        paidOutFromOrders +=
          commission;
      }

      let commissionStatus =
        "Pending";

      if (isExcluded) {
        commissionStatus =
          "Excluded";
      } else if (
        isConfirmed &&
        isPaidOut
      ) {
        commissionStatus =
          "Paid Out";
      } else if (
        isConfirmed &&
        !isPaidOut
      ) {
        commissionStatus =
          "Owed";
      }

      return {
        id: order.id,
        orderNumber:
          order.order_number,
        createdAt:
          order.created_at,
        qualifyingSale,
        commission,
        status:
          order.status,
        commissionStatus,
        paidOut:
          isPaidOut,
        paidAt:
          order.affiliate_paid_at,
        payoutId:
          order.affiliate_payout_id,
      };
    }
  );

  const paidOutLifetime = Number(
    safePayouts
      .reduce(
        (sum, payout) =>
          sum +
          Number(
            payout.amount || 0
          ),
        0
      )
      .toFixed(2)
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

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
              Apexx Admin
            </p>

            <h1 className="text-5xl md:text-6xl font-black">
              {affiliate.name}
            </h1>

            <p className="text-white/60 mt-4">
              Admin view of this affiliate&apos;s
              activity, sales, commissions,
              and payout history.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/admin/affiliates"
              className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-center text-white/70 text-sm uppercase tracking-widest hover:bg-white/[0.08] transition-all"
            >
              Back to Affiliates
            </a>

            <a
              href="/admin"
              className="rounded-full border border-blue-400/20 bg-blue-500/10 px-6 py-3 text-center text-blue-200 text-sm uppercase tracking-widest hover:bg-blue-500/20 transition-all"
            >
              Admin Dashboard
            </a>
          </div>
        </div>

        <section className="rounded-[32px] border border-blue-400/20 bg-gradient-to-br from-blue-500/15 via-white/[0.05] to-white/[0.03] p-8 mb-8">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:items-center">

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-3">
                Affiliate Profile
              </p>

              <p className="text-3xl md:text-4xl font-black">
                {affiliate.code}
              </p>

              <p className="text-white/50 mt-3">
                {affiliate.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-[22px] border border-white/10 bg-[#081526]/50 px-5 py-4">
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Discount
                </p>

                <p className="text-2xl font-black text-blue-300 mt-2">
                  {Math.round(
                    Number(
                      affiliate.discount_rate ||
                        0
                    ) * 100
                  )}
                  %
                </p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-[#081526]/50 px-5 py-4">
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Commission
                </p>

                <p className="text-2xl font-black text-blue-300 mt-2">
                  {Math.round(
                    Number(
                      affiliate.commission_rate ||
                        0
                    ) * 100
                  )}
                  %
                </p>
              </div>

            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <span
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${
                affiliate.status === "active"
                  ? "border border-green-400/20 bg-green-500/10 text-green-300"
                  : affiliate.status === "invited"
                  ? "border border-yellow-400/20 bg-yellow-500/10 text-yellow-200"
                  : "border border-white/10 bg-white/[0.05] text-white/60"
              }`}
            >
              {affiliate.status}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-widest text-white/50">
              Joined{" "}
              {formatDate(
                affiliate.created_at
              )}
            </span>

          </div>
        </section>

        <div className="mb-8">
          <AffiliateControls
            affiliateId={affiliate.id}
            status={affiliate.status}
            discountRate={Number(
              affiliate.discount_rate || 0
            )}
            commissionRate={Number(
              affiliate.commission_rate || 0
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Code Uses
            </p>

            <p className="text-4xl font-black mt-3">
              {activity.length}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Sales Generated
            </p>

            <p className="text-4xl font-black text-blue-300 mt-3">
              {formatMoney(
                generatedSales
              )}
            </p>
          </div>

          <div className="rounded-[28px] border border-yellow-300/15 bg-yellow-400/[0.06] p-6">
            <p className="text-xs uppercase tracking-widest text-yellow-100/60">
              Pending
            </p>

            <p className="text-4xl font-black text-yellow-200 mt-3">
              {formatMoney(
                pendingCommission
              )}
            </p>
          </div>

          <div className="rounded-[28px] border border-green-300/15 bg-green-400/[0.06] p-6">
            <p className="text-xs uppercase tracking-widest text-green-100/60">
              Amount Owed
            </p>

            <p className="text-4xl font-black text-green-300 mt-3">
              {formatMoney(
                amountOwed
              )}
            </p>
          </div>

          <div className="rounded-[28px] border border-blue-300/15 bg-blue-400/[0.06] p-6">
            <p className="text-xs uppercase tracking-widest text-blue-100/60">
              Paid Out Lifetime
            </p>

            <p className="text-4xl font-black text-blue-200 mt-3">
              {formatMoney(
                paidOutLifetime
              )}
            </p>
          </div>

        </div>

        <section className="rounded-[32px] border border-blue-400/20 bg-blue-500/[0.07] p-7 mb-8">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:items-center">

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-3">
                Zelle Payout
              </p>

              <h2 className="text-3xl font-black">
                {formatMoney(
                  amountOwed
                )} currently owed
              </h2>

              <p className="text-white/55 mt-3 max-w-2xl">
                Send the affiliate their monthly payout through Zelle first.
                After you have sent the money, use the button to record the payout
                and move those commissions into Paid Out history.
              </p>

              <p className="text-white/35 text-sm mt-3">
                This button records the payout only. It does not send money through Zelle.
              </p>
            </div>

            <PayoutButton
              affiliateId={
                affiliate.id
              }
              amountOwed={
                Number(
                  amountOwed.toFixed(
                    2
                  )
                )
              }
            />

          </div>

        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] overflow-hidden mb-8">

          <div className="p-7 border-b border-white/10">
            <h2 className="text-2xl font-black">
              Payout History
            </h2>

            <p className="text-white/50 mt-2">
              Recorded Zelle payouts for this affiliate.
            </p>
          </div>

          {safePayouts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xl font-bold">
                No payouts recorded yet
              </p>

              <p className="text-white/50 mt-2">
                Monthly Zelle payments will appear here after you record them.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">

                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Paid Date
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Method
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Amount
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Notes
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {safePayouts.map(
                    (payout) => (
                      <tr
                        key={payout.id}
                        className="border-b border-white/[0.06] last:border-0"
                      >
                        <td className="p-5 text-white/60">
                          {formatDate(
                            payout.paid_at
                          )}
                        </td>

                        <td className="p-5">
                          <span className="capitalize rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-blue-200 text-xs font-bold uppercase tracking-widest">
                            {payout.payment_method ||
                              "zelle"}
                          </span>
                        </td>

                        <td className="p-5 font-black text-green-300">
                          {formatMoney(
                            Number(
                              payout.amount || 0
                            )
                          )}
                        </td>

                        <td className="p-5 text-white/50">
                          {payout.notes ||
                            "—"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}

        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] overflow-hidden">

          <div className="p-7 border-b border-white/10">
            <h2 className="text-2xl font-black">
              Affiliate Activity
            </h2>

            <p className="text-white/50 mt-2">
              Orders attributed to{" "}
              {affiliate.code}.
            </p>
          </div>

          {activity.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xl font-bold">
                No affiliate orders yet
              </p>

              <p className="text-white/50 mt-2">
                Orders will appear here when
                this affiliate&apos;s code is used.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead>
                  <tr className="border-b border-white/10 text-left">

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Order
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Date
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Qualifying Sale
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Commission
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Order Status
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Commission Status
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Paid Date
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {activity.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="border-b border-white/[0.06] last:border-0"
                      >

                        <td className="p-5 font-bold">
                          {order.orderNumber}
                        </td>

                        <td className="p-5 text-white/60">
                          {formatDate(
                            order.createdAt
                          )}
                        </td>

                        <td className="p-5">
                          {formatMoney(
                            order.qualifyingSale
                          )}
                        </td>

                        <td className="p-5 font-bold text-blue-300">
                          {formatMoney(
                            order.commission
                          )}
                        </td>

                        <td className="p-5">
                          <span className="capitalize">
                            {String(
                              order.status || ""
                            ).replaceAll(
                              "_",
                              " "
                            )}
                          </span>
                        </td>

                        <td className="p-5">
                          <span
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${
                              order.commissionStatus === "Paid Out"
                                ? "border border-blue-400/20 bg-blue-500/10 text-blue-200"
                                : order.commissionStatus === "Owed"
                                ? "border border-green-400/20 bg-green-500/10 text-green-300"
                                : order.commissionStatus === "Pending"
                                ? "border border-yellow-400/20 bg-yellow-500/10 text-yellow-200"
                                : "border border-white/10 bg-white/[0.05] text-white/50"
                            }`}
                          >
                            {order.commissionStatus}
                          </span>
                        </td>

                        <td className="p-5 text-white/60">
                          {order.paidOut
                            ? formatDate(
                                order.paidAt
                              )
                            : "—"}
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>

            </div>
          )}

        </section>

        <p className="text-white/35 text-sm mt-6">
          This is your private admin view.
          Affiliates cannot access other affiliate accounts
          or this admin page.
        </p>

      </div>
    </main>
  );
}