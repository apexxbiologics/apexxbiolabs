import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

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

const resend = new Resend(
  process.env.RESEND_API_KEY
);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ================================
     * LOAD ORDER
     * ================================
     */

    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        customer_email,
        first_name,
        last_name,
        payment_method,
        total,
        status,
        refund_amount,
        refund_status,
        refund_reason,
        refunded_at
      `)
      .eq("id", id)
      .single();

    if (
      orderError ||
      !order
    ) {
      console.error(
        "Refund order lookup error:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Order could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    const refundAmount =
      Number(
        order.refund_amount ||
          0
      );

    /*
     * ================================
     * VALIDATION
     * ================================
     */

    if (
      refundAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This order does not have a refund due.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      order.refund_status ===
      "completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This refund has already been marked completed.",
        },
        {
          status: 400,
        }
      );
    }

    const refundedAt =
      new Date().toISOString();

    /*
     * ================================
     * MARK REFUND COMPLETED
     * ================================
     */

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        refund_status:
          "completed",

        refunded_at:
          refundedAt,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error(
        "Refund update error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to mark the refund as completed.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ================================
     * CUSTOMER EMAIL
     * ================================
     */

    const firstName =
      order.first_name ||
      "there";

    const paymentMethod =
      order.payment_method
        ? String(
            order.payment_method
          )
        : "original payment method";

    try {
      await resend.emails.send({
        from:
          "Apexx Biolabs <orders@apexxbiolabs.com>",

        to:
          order.customer_email,

        replyTo:
          process.env
            .CUSTOMER_REPLY_TO_EMAIL ||
          "orders@apexxbiolabs.com",

        subject:
          `Refund Completed — Order ${order.order_number}`,

        html: `
          <div style="
            margin:0;
            padding:0;
            background:#f8fbff;
            font-family:Arial,Helvetica,sans-serif;
          ">

            <div style="
              max-width:720px;
              margin:0 auto;
              padding:28px 16px;
            ">

              <div style="
                background:#ffffff;
                border:1px solid #dbeafe;
                border-radius:28px;
                overflow:hidden;
                box-shadow:0 18px 45px rgba(30,58,138,0.12);
              ">

                <div style="
                  background:linear-gradient(
                    135deg,
                    #eef7ff,
                    #dbeafe,
                    #ffffff
                  );
                  padding:38px 24px;
                  text-align:center;
                  border-bottom:1px solid #dbeafe;
                ">

                  <p style="
                    margin:0 0 14px;
                    color:#3b82f6;
                    font-size:13px;
                    letter-spacing:4px;
                    text-transform:uppercase;
                  ">
                    RESEARCH. QUALITY. CONFIDENCE.
                  </p>

                  <h1 style="
                    margin:0;
                    color:#06111f;
                    font-size:34px;
                    letter-spacing:3px;
                  ">
                    APEXX BIOLABS
                  </h1>

                  <p style="
                    margin:10px 0 0;
                    color:#64748b;
                    font-size:12px;
                    letter-spacing:2px;
                  ">
                    PREMIUM RESEARCH MATERIALS
                  </p>

                </div>

                <div style="
                  padding:32px 24px;
                  color:#0f172a;
                ">

                  <p style="
                    margin:0 0 18px;
                    color:#06111f;
                    font-size:16px;
                  ">
                    Hi ${escapeHtml(
                      firstName
                    )},
                  </p>

                  <h2 style="
                    margin:0 0 16px;
                    color:#06111f;
                    font-size:27px;
                  ">
                    Your refund has been completed.
                  </h2>

                  <p style="
                    margin:0 0 24px;
                    color:#475569;
                    font-size:15px;
                    line-height:1.7;
                  ">
                    Your refund for order
                    <strong>
                      ${escapeHtml(
                        order.order_number
                      )}
                    </strong>
                    has now been processed.
                  </p>

                  <div style="
                    background:linear-gradient(
                      135deg,
                      #ecfdf5,
                      #f0fdf4
                    );
                    border:1px solid #bbf7d0;
                    border-radius:20px;
                    padding:24px;
                    margin-bottom:24px;
                  ">

                    <p style="
                      margin:0 0 8px;
                      color:#15803d;
                      font-size:12px;
                      font-weight:800;
                      letter-spacing:2px;
                      text-transform:uppercase;
                    ">
                      Refund Completed
                    </p>

                    <p style="
                      margin:0;
                      color:#052e16;
                      font-size:36px;
                      font-weight:900;
                    ">
                      $${refundAmount.toFixed(
                        2
                      )}
                    </p>

                  </div>

                  <div style="
                    background:#f8fbff;
                    border:1px solid #bfdbfe;
                    border-radius:20px;
                    padding:22px;
                    margin-bottom:26px;
                  ">

                    <p style="
                      margin:0 0 8px;
                      color:#64748b;
                      font-size:12px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                    ">
                      Payment Method
                    </p>

                    <p style="
                      margin:0;
                      color:#06111f;
                      font-size:15px;
                      font-weight:700;
                      text-transform:capitalize;
                    ">
                      ${escapeHtml(
                        paymentMethod
                      )}
                    </p>

                  </div>

                  <div style="
                    background:#eff6ff;
                    border:1px solid #bfdbfe;
                    border-radius:20px;
                    padding:22px;
                    margin-bottom:28px;
                  ">

                    <p style="
                      margin:0 0 7px;
                      color:#1e3a8a;
                      font-weight:800;
                    ">
                      Need assistance?
                    </p>

                    <p style="
                      margin:0;
                      color:#475569;
                      font-size:14px;
                      line-height:1.7;
                    ">
                      If you have any questions regarding
                      your refund, simply reply to this
                      email and our team will assist you.
                    </p>

                  </div>

                  <div style="
                    border-top:1px solid #dbeafe;
                    padding-top:24px;
                  ">

                    <p style="
                      font-size:12px;
                      color:#64748b;
                      line-height:1.6;
                      margin:0;
                    ">
                      Products sold by Apexx Biolabs are
                      intended strictly for lawful
                      laboratory research use only.
                      Not for human consumption, medical
                      use, veterinary use, diagnosis,
                      treatment, cure, or prevention of
                      disease.
                    </p>

                    <p style="
                      margin:24px 0 0;
                      color:#334155;
                      line-height:1.6;
                    ">
                      Apexx Biolabs<br/>
                      orders@apexxbiolabs.com<br/>
                      apexxbiolabs.com
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>
        `,
      });
    } catch (
      emailError
    ) {
      /*
       * IMPORTANT:
       * Refund completion is already
       * saved even if Resend fails.
       */
      console.error(
        "Refund confirmation email error:",
        emailError
      );

      return NextResponse.json({
        success: true,

        warning:
          "Refund was marked completed, but the confirmation email could not be sent.",

        refundAmount,

        refundedAt,
      });
    }

    return NextResponse.json({
      success: true,

      message:
        `Refund of $${refundAmount.toFixed(
          2
        )} marked completed.`,

      refundAmount,

      refundedAt,
    });
  } catch (error) {
    console.error(
      "Mark refund completed error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while completing the refund.",
      },
      {
        status: 500,
      }
    );
  }
}