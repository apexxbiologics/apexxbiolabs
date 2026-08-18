import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

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

    if (
      affiliateError ||
      !affiliate
    ) {
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
     * Pull confirmed but unpaid affiliate orders.
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
      (orders || []).filter(
        (order) => {
          const status = String(
            order.status || ""
          ).toLowerCase();

          return (
            CONFIRMED_STATUSES.includes(
              status
            ) &&
            Number(
              order.affiliate_commission ||
                0
            ) > 0
          );
        }
      );

    if (
      payableOrders.length === 0
    ) {
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
              order.affiliate_commission ||
                0
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
     * Create one payout record
     * for this Zelle batch.
     */
    const {
      data: payout,
      error: payoutInsertError,
    } = await supabaseAdmin
      .from("affiliate_payouts")
      .insert({
        affiliate_id:
          affiliateId,

        amount:
          payoutAmount,

        payment_method:
          "zelle",

        paid_at:
          new Date().toISOString(),

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
     * Mark included commissions paid out.
     */
    const {
      error: ordersUpdateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        affiliate_paid_out:
          true,

        affiliate_paid_at:
          paidAt,

        affiliate_payout_id:
          payout.id,
      })
      .in(
        "id",
        payableOrderIds
      )
      .eq(
        "affiliate_id",
        affiliateId
      )
      .eq(
        "affiliate_paid_out",
        false
      );

    if (ordersUpdateError) {
      console.error(
        "Affiliate payout order update error:",
        ordersUpdateError
      );

      /*
       * Roll back the payout history record
       * if the orders could not be updated.
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

    /*
     * Send payout confirmation email
     * AFTER payout was successfully recorded.
     */
    if (affiliate.email) {
      const affiliateName =
        String(
          affiliate.name || ""
        ).trim();

      const affiliateEmail =
        String(
          affiliate.email || ""
        )
          .trim()
          .toLowerCase();

      const affiliateCode =
        String(
          affiliate.code || ""
        )
          .trim()
          .toUpperCase();

      const paidDate =
        new Date(
          paidAt
        ).toLocaleDateString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        );

      const {
        error:
          payoutEmailError,
      } =
        await resend.emails.send({
          from:
            "Apexx Biolabs <orders@apexxbiolabs.com>",

          to:
            affiliateEmail,

          subject:
            `Affiliate Payout Sent • ${affiliateCode} • Apexx Biolabs`,

          html: `
            <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">
              <div style="max-width:720px;margin:0 auto;padding:28px 16px;">

                <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(30,58,138,0.12);">

                  <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);padding:38px 24px;text-align:center;border-bottom:1px solid #dbeafe;">

                    <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                      Research. Quality. Confidence.
                    </p>

                    <h1 style="margin:0;color:#06111f;font-size:34px;letter-spacing:3px;">
                      APEXX BIOLABS
                    </h1>

                    <p style="margin:12px 0 0;color:#475569;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                      Affiliate Program
                    </p>

                  </div>

                  <div style="padding:32px 24px;color:#0f172a;">

                    <div style="background:#ffffff;border:1px solid #bfdbfe;border-radius:22px;padding:32px 24px;text-align:center;margin-bottom:30px;box-shadow:0 12px 30px rgba(59,130,246,0.10);">

                      <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                        Affiliate Payout
                      </p>

                      <h2 style="margin:0;color:#06111f;font-size:34px;font-weight:800;line-height:1.1;">
                        Payout Sent
                      </h2>

                      <p style="margin:14px 0 0;color:#16a34a;font-size:18px;font-weight:700;">
                        Your Zelle Payment Has Been Recorded
                      </p>

                      <p style="margin:18px auto 0;max-width:500px;color:#475569;font-size:15px;line-height:1.7;">
                        ${
                          affiliateName
                            ? `Hi ${affiliateName}. `
                            : ""
                        }
                        Your Apexx Biolabs affiliate payout has been sent via Zelle
                        and recorded in your affiliate payout history.
                      </p>

                    </div>

                    <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:22px;padding:28px;text-align:center;margin-bottom:22px;">

                      <p style="margin:0 0 8px;color:#1e3a8a;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                        Affiliate Code
                      </p>

                      <p style="margin:0;color:#2563eb;font-size:30px;font-weight:900;">
                        ${affiliateCode}
                      </p>

                    </div>

                    <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1px solid #86efac;border-radius:22px;padding:30px;text-align:center;margin-bottom:22px;">

                      <p style="margin:0 0 8px;color:#15803d;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                        Payout Amount
                      </p>

                      <p style="margin:0;color:#06111f;font-size:48px;font-weight:900;">
                        $${payoutAmount.toFixed(
                          2
                        )}
                      </p>

                    </div>

                    <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:22px;margin-bottom:18px;">

                      <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:2px;">
                        Payment Method
                      </p>

                      <p style="margin:0;color:#06111f;font-size:20px;font-weight:800;">
                        Zelle
                      </p>

                    </div>

                    <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:22px;margin-bottom:18px;">

                      <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:2px;">
                        Payment Date
                      </p>

                      <p style="margin:0;color:#06111f;font-size:20px;font-weight:800;">
                        ${paidDate}
                      </p>

                    </div>

                    <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:22px;margin-bottom:28px;">

                      <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:2px;">
                        Orders Included
                      </p>

                      <p style="margin:0;color:#06111f;font-size:20px;font-weight:800;">
                        ${payableOrders.length}
                      </p>

                    </div>

                    <div style="background:#ffffff;border-left:4px solid #22c55e;padding:18px;border-radius:14px;margin-bottom:30px;">

                      <p style="margin:0;color:#06111f;font-weight:bold;">
                        Payout Recorded
                      </p>

                      <p style="margin:8px 0 0;color:#64748b;font-size:14px;line-height:1.6;">
                        These commissions have been moved from Amount Owed
                        to Paid Out in your Apexx Affiliate account.
                      </p>

                    </div>

                    <div style="text-align:center;margin-bottom:30px;">

                      <a
                        href="https://apexxbiolabs.com/affiliate/dashboard"
                        style="display:inline-block;background:#06111f;color:#ffffff;padding:16px 30px;border-radius:999px;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:1px;text-transform:uppercase;"
                      >
                        View Affiliate Dashboard
                      </a>

                    </div>

                    <div style="border-top:1px solid #dbeafe;padding-top:24px;">

                      <p style="font-size:12px;color:#64748b;line-height:1.6;margin:0;">
                        This email confirms that an affiliate payout was recorded
                        for your Apexx Biolabs affiliate account.
                      </p>

                      <p style="margin:24px 0 0;color:#334155;line-height:1.6;">
                        Apexx Biolabs<br/>
                        support@apexxbiolabs.com<br/>
                        apexxbiolabs.com
                      </p>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          `,
        });

      if (payoutEmailError) {
        /*
         * IMPORTANT:
         *
         * The payout remains recorded even if
         * the notification email fails.
         */
        console.error(
          "Affiliate payout email error:",
          payoutEmailError
        );
      }
    }

    return NextResponse.json({
      success: true,

      payout: {
        id:
          payout.id,

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