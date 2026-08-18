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

const CONFIRMED_STATUSES = [
  "paid",
  "shipped",
  "payment received",
];

export async function POST(request: Request) {
  try {
    const { affiliateId } = await request.json();

    if (!affiliateId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing affiliate ID.",
        },
        { status: 400 }
      );
    }

    /*
     * Confirm the affiliate exists.
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
        status
      `)
      .eq("id", affiliateId)
      .maybeSingle();

    if (affiliateError || !affiliate) {
      console.error(
        "Affiliate payout lookup error:",
        affiliateError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Affiliate not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Pull all orders for this affiliate.
     *
     * Only confirmed + unpaid commissions
     * will be included in this payout.
     */
    const {
      data: orders,
      error: ordersError,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        affiliate_commission,
        affiliate_paid_out
      `)
      .eq("affiliate_id", affiliateId)
      .eq("affiliate_paid_out", false);

    if (ordersError) {
      console.error(
        "Affiliate payout orders error:",
        ordersError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load unpaid affiliate commissions.",
        },
        { status: 500 }
      );
    }

    const payableOrders =
      (orders || []).filter((order) => {
        const status = String(
          order.status || ""
        ).toLowerCase();

        return (
          CONFIRMED_STATUSES.includes(status) &&
          Number(order.affiliate_commission || 0) > 0
        );
      });

    if (payableOrders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "There are no confirmed unpaid commissions for this affiliate.",
        },
        { status: 400 }
      );
    }

    const payoutAmount = Number(
      payableOrders
        .reduce(
          (sum, order) =>
            sum +
            Number(
              order.affiliate_commission || 0
            ),
          0
        )
        .toFixed(2)
    );

    if (payoutAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The payout amount must be greater than $0.",
        },
        { status: 400 }
      );
    }

    /*
     * Create one payout history record
     * for this Zelle batch.
     */
    const {
      data: payout,
      error: payoutInsertError,
    } = await supabaseAdmin
      .from("affiliate_payouts")
      .insert({
        affiliate_id: affiliateId,
        amount: payoutAmount,
        payment_method: "zelle",
        paid_at: new Date().toISOString(),
        notes:
          `Bi-monthly Zelle payout covering ${payableOrders.length} affiliate order${
            payableOrders.length === 1
              ? ""
              : "s"
          }.`,
      })
      .select(`
        id,
        affiliate_id,
        amount,
        payment_method,
        paid_at,
        notes
      `)
      .single();

    if (
      payoutInsertError ||
      !payout
    ) {
      console.error(
        "Affiliate payout insert error:",
        payoutInsertError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create the affiliate payout record.",
        },
        { status: 500 }
      );
    }

    const paidAt =
      payout.paid_at ||
      new Date().toISOString();

    const payableOrderIds =
      payableOrders.map(
        (order) => order.id
      );

    /*
     * Attach all included orders to
     * this payout batch and mark them paid.
     */
    const {
      error: ordersUpdateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        affiliate_paid_out: true,
        affiliate_paid_at: paidAt,
        affiliate_payout_id:
          payout.id,
      })
      .in("id", payableOrderIds)
      .eq("affiliate_id", affiliateId)
      .eq("affiliate_paid_out", false);

    if (ordersUpdateError) {
      console.error(
        "Affiliate payout order update error:",
        ordersUpdateError
      );

      /*
       * Remove the payout record if the
       * orders could not be updated.
       *
       * This prevents payout history from
       * showing money as paid when the
       * included commissions were not marked paid.
       */
      const {
        error: cleanupError,
      } = await supabaseAdmin
        .from("affiliate_payouts")
        .delete()
        .eq("id", payout.id);

      if (cleanupError) {
        console.error(
          "Affiliate payout cleanup error:",
          cleanupError
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to mark affiliate commissions as paid.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      payout: {
        id: payout.id,
        affiliateId:
          affiliate.id,
        affiliateName:
          affiliate.name,
        affiliateCode:
          affiliate.code,
        amount:
          payoutAmount,
        paymentMethod:
          "zelle",
        paidAt,
        orderCount:
          payableOrders.length,
      },
    });
  } catch (error) {
    console.error(
      "Affiliate payout error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process affiliate payout.",
      },
      { status: 500 }
    );
  }
}