import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function GET(request: Request) {
  try {
    const authorizationHeader =
      request.headers.get("authorization");

    const accessToken =
      authorizationHeader?.startsWith("Bearer ")
        ? authorizationHeader.slice(7)
        : null;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    /*
     * Verify the logged-in Supabase user.
     */
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(
      accessToken
    );

    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your affiliate session could not be verified.",
        },
        { status: 401 }
      );
    }

    /*
     * Find the affiliate profile tied
     * to this authenticated user.
     */
    const {
      data: affiliate,
      error: affiliateError,
    } = await supabaseAdmin
      .from("affiliates")
      .select(`
        id,
        name,
        email,
        code,
        discount_rate,
        commission_rate,
        status,
        created_at
      `)
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();

    if (
      affiliateError ||
      !affiliate
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Affiliate account not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Only active affiliates can access
     * the affiliate dashboard.
     */
    if (
      affiliate.status !==
      "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            affiliate.status ===
            "suspended"
              ? "Your affiliate account is suspended."
              : "Your affiliate account is not active.",
        },
        { status: 403 }
      );
    }

    /*
     * Pull ONLY the order fields required
     * for affiliate reporting.
     *
     * No customer names.
     * No customer emails.
     * No addresses.
     * No product/cart information.
     */
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
      .eq(
        "affiliate_id",
        affiliate.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (ordersError) {
      console.error(
        "Affiliate dashboard order error:",
        ordersError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load affiliate activity.",
        },
        { status: 500 }
      );
    }

    /*
     * Load this affiliate's payout history.
     */
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
      .eq(
        "affiliate_id",
        affiliate.id
      )
      .order(
        "paid_at",
        {
          ascending: false,
        }
      );

    if (payoutsError) {
      console.error(
        "Affiliate dashboard payout error:",
        payoutsError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load affiliate payout history.",
        },
        { status: 500 }
      );
    }

    const safeOrders =
      orders || [];

    const safePayouts =
      payouts || [];

    /*
     * These statuses mean the customer
     * has paid and the commission has
     * been earned.
     */
    const confirmedStatuses = [
      "paid",
      "shipped",
      "payment received",
    ];

    /*
     * These statuses do not count toward
     * sales or affiliate commission.
     */
    const excludedStatuses = [
      "cancelled",
      "canceled",
      "refunded",
    ];

    let generatedSales = 0;

    /*
     * Customer has not yet paid.
     */
    let pendingCommission = 0;

    /*
     * Customer paid, but affiliate
     * has not yet received their Zelle payout.
     */
    let amountOwed = 0;

    /*
     * Historical total of commissions
     * that have already been paid out.
     */
    let paidOutFromOrders = 0;

    const sanitizedOrders =
      safeOrders.map(
        (order) => {
          const status =
            String(
              order.status || ""
            ).toLowerCase();

          const commission =
            Number(
              order.affiliate_commission ||
                0
            );

          const qualifyingSale =
            Math.max(
              0,
              Number(
                order.subtotal || 0
              ) -
                Number(
                  order.discount || 0
                )
            );

          const isExcluded =
            excludedStatuses.includes(
              status
            );

          const isConfirmed =
            confirmedStatuses.includes(
              status
            );

          const isPaidOut =
            Boolean(
              order.affiliate_paid_out
            );

          /*
           * Sales generated.
           */
          if (!isExcluded) {
            generatedSales +=
              qualifyingSale;
          }

          /*
           * Pending commission.
           */
          if (
            !isExcluded &&
            !isConfirmed
          ) {
            pendingCommission +=
              commission;
          }

          /*
           * Confirmed and still owed.
           */
          if (
            !isExcluded &&
            isConfirmed &&
            !isPaidOut
          ) {
            amountOwed +=
              commission;
          }

          /*
           * Already paid to affiliate.
           */
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
          };
        }
      );

    /*
     * Calculate lifetime paid out from
     * actual payout-history records.
     *
     * This is the authoritative payout total.
     */
    const paidOutLifetime =
      Number(
        safePayouts
          .reduce(
            (
              sum,
              payout
            ) =>
              sum +
              Number(
                payout.amount ||
                  0
              ),
            0
          )
          .toFixed(2)
      );

    /*
     * Sanitize payout records before
     * returning them to the affiliate.
     */
    const sanitizedPayouts =
      safePayouts.map(
        (payout) => ({
          id:
            payout.id,

          amount:
            Number(
              payout.amount ||
                0
            ),

          paymentMethod:
            payout.payment_method ||
            "zelle",

          paidAt:
            payout.paid_at,

          notes:
            payout.notes,
        })
      );

    return NextResponse.json({
      success: true,

      affiliate: {
        name:
          affiliate.name,

        email:
          affiliate.email,

        code:
          affiliate.code,

        discountRate:
          Number(
            affiliate.discount_rate ||
              0
          ),

        commissionRate:
          Number(
            affiliate.commission_rate ||
              0
          ),

        status:
          affiliate.status,

        createdAt:
          affiliate.created_at,
      },

      stats: {
        codeUses:
          sanitizedOrders.length,

        generatedSales:
          Number(
            generatedSales.toFixed(
              2
            )
          ),

        pendingCommission:
          Number(
            pendingCommission.toFixed(
              2
            )
          ),

        /*
         * Commission that has been earned
         * but has not yet been paid to
         * the affiliate.
         */
        amountOwed:
          Number(
            amountOwed.toFixed(
              2
            )
          ),

        /*
         * Kept for compatibility with your
         * current dashboard until we update
         * its UI in the next step.
         *
         * This now represents currently
         * confirmed/unpaid commission.
         */
        confirmedCommission:
          Number(
            amountOwed.toFixed(
              2
            )
          ),

        paidOutLifetime,

        /*
         * Internal comparison value.
         * Useful for debugging if payout
         * history and order flags ever differ.
         */
        paidOutFromOrders:
          Number(
            paidOutFromOrders.toFixed(
              2
            )
          ),
      },

      orders:
        sanitizedOrders,

      payouts:
        sanitizedPayouts,
    });
  } catch (error) {
    console.error(
      "Affiliate dashboard error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load affiliate dashboard.",
      },
      { status: 500 }
    );
  }
}