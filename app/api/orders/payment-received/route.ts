import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

type CartItem = {
  id: string;
  quantity: number;
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(req: Request) {
  try {
    const { orderNumber } = await req.json();

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing order number",
        },
        { status: 400 }
      );
    }

    /*
     * Load the order.
     *
     * Affiliate information is included so we
     * know whether a commission confirmation
     * email needs to be sent.
     */
    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        cart,
        subtotal,
        discount,
        total,
        affiliate_id,
        affiliate_commission
      `)
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    /*
     * Prevent inventory from being deducted
     * twice and prevent duplicate affiliate
     * confirmation emails.
     */
    if (
      String(order.status).toLowerCase() ===
      "payment received"
    ) {
      return NextResponse.json({
        success: true,
        message:
          "Payment was already received for this order.",
      });
    }

    /*
     * Update inventory.
     */
    const cart =
      Array.isArray(order.cart)
        ? (order.cart as CartItem[])
        : [];

    for (const item of cart) {
      const {
        data: product,
        error: productError,
      } = await supabaseAdmin
        .from("products")
        .select("inventory")
        .eq("slug", item.id)
        .single();

      if (
        productError ||
        !product
      ) {
        console.error(
          "Product not found:",
          item.id
        );

        continue;
      }

      const currentInventory =
        Number(product.inventory || 0);

      const quantity =
        Number(item.quantity || 0);

      const newInventory =
        Math.max(
          0,
          currentInventory -
            quantity
        );

      const {
        error:
          updateInventoryError,
      } = await supabaseAdmin
        .from("products")
        .update({
          inventory:
            newInventory,
        })
        .eq("slug", item.id);

      if (
        updateInventoryError
      ) {
        console.error(
          "Inventory update failed:",
          item.id,
          updateInventoryError
        );
      }
    }

    /*
     * Mark payment received.
     *
     * Your affiliate dashboard already treats
     * this status as confirmed commission.
     */
    const {
      error: statusError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        status:
          "Payment Received",
      })
      .eq(
        "order_number",
        orderNumber
      );

    if (statusError) {
      throw statusError;
    }

    /*
     * If this order belongs to an affiliate,
     * send them a commission-confirmed email.
     */
    if (order.affiliate_id) {
      const {
        data: affiliate,
        error:
          affiliateError,
      } = await supabaseAdmin
        .from("affiliates")
        .select(
          `
            id,
            name,
            email,
            code,
            status
          `
        )
        .eq(
          "id",
          order.affiliate_id
        )
        .maybeSingle();

      if (
        affiliateError
      ) {
        console.error(
          "Affiliate lookup error:",
          affiliateError
        );
      }

      if (
        affiliate &&
        affiliate.email
      ) {
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

        const affiliateCommission =
          Number(
            order.affiliate_commission ||
              0
          );

        /*
         * Qualifying sale = merchandise subtotal
         * after the customer's promo discount.
         *
         * Shipping is not included.
         */
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

        const {
          error:
            affiliateEmailError,
        } =
          await resend.emails.send({
            from:
              "Apexx Biolabs <orders@apexxbiolabs.com>",

            to:
              affiliateEmail,

            subject:
              `Commission Confirmed • ${affiliateCode} • Apexx Biolabs`,

            html: `
              <div style="margin:0; padding:0; background:#f8fbff; font-family:Arial, Helvetica, sans-serif;">
                <div style="max-width:720px; margin:0 auto; padding:28px 16px;">

                  <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:28px; overflow:hidden; box-shadow:0 18px 45px rgba(30,58,138,0.12);">

                    <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff); padding:38px 24px; text-align:center; border-bottom:1px solid #dbeafe;">

                      <p style="margin:0 0 14px; color:#3b82f6; font-size:13px; letter-spacing:4px; text-transform:uppercase;">
                        Research. Quality. Confidence.
                      </p>

                      <h1 style="margin:0; color:#06111f; font-size:34px; letter-spacing:3px;">
                        APEXX BIOLABS
                      </h1>

                      <p style="margin:12px 0 0; color:#475569; font-size:13px; letter-spacing:2px; text-transform:uppercase;">
                        Affiliate Program
                      </p>

                    </div>

                    <div style="padding:32px 24px; color:#0f172a;">

                      <div style="background:#ffffff; border:1px solid #bfdbfe; border-radius:22px; padding:32px 24px; text-align:center; margin-bottom:30px; box-shadow:0 12px 30px rgba(59,130,246,0.10);">

                        <p style="margin:0 0 14px; color:#3b82f6; font-size:13px; letter-spacing:4px; text-transform:uppercase;">
                          Affiliate Activity
                        </p>

                        <h2 style="margin:0; color:#06111f; font-size:34px; font-weight:800; line-height:1.1;">
                          Commission Confirmed
                        </h2>

                        <p style="margin:14px 0 0; color:#16a34a; font-size:18px; font-weight:700;">
                          Payment Has Been Received
                        </p>

                        <p style="margin:18px auto 0; max-width:500px; color:#475569; font-size:15px; line-height:1.7;">
                          ${
                            affiliateName
                              ? `Good news, ${affiliateName}. `
                              : "Good news. "
                          }
                          Payment has been received for an order placed using your affiliate code.
                          Your commission is now confirmed.
                        </p>

                      </div>

                      <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff); border:1px solid #bfdbfe; border-radius:22px; padding:28px; text-align:center; margin-bottom:22px;">

                        <p style="margin:0 0 8px; color:#1e3a8a; font-size:13px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;">
                          Affiliate Code
                        </p>

                        <p style="margin:0; color:#2563eb; font-size:30px; font-weight:900;">
                          ${affiliateCode}
                        </p>

                      </div>

                      <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:20px; padding:22px; margin-bottom:22px;">

                        <p style="margin:0 0 8px; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:2px;">
                          Order
                        </p>

                        <p style="margin:0; color:#06111f; font-size:19px; font-weight:bold;">
                          ${order.order_number}
                        </p>

                      </div>

                      <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:20px; padding:22px; margin-bottom:22px;">

                        <p style="margin:0 0 8px; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:2px;">
                          Qualifying Sale
                        </p>

                        <p style="margin:0; color:#06111f; font-size:30px; font-weight:900;">
                          $${qualifyingSale.toFixed(
                            2
                          )}
                        </p>

                      </div>

                      <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5); border:1px solid #86efac; border-radius:22px; padding:28px; text-align:center; margin-bottom:30px;">

                        <p style="margin:0 0 8px; color:#15803d; font-size:13px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;">
                          Confirmed Commission
                        </p>

                        <p style="margin:0; color:#06111f; font-size:44px; font-weight:900;">
                          $${affiliateCommission.toFixed(
                            2
                          )}
                        </p>

                      </div>

                      <div style="background:#ffffff; border-left:4px solid #22c55e; padding:18px; border-radius:14px; margin-bottom:30px;">

                        <p style="margin:0; color:#06111f; font-weight:bold;">
                          Commission Confirmed
                        </p>

                        <p style="margin:8px 0 0; color:#64748b; font-size:14px; line-height:1.6;">
                          This commission has moved from pending to confirmed earnings in your Apexx Affiliate Dashboard.
                        </p>

                      </div>

                      <div style="text-align:center; margin-bottom:30px;">

                        <a
                          href="https://apexxbiolabs.com/affiliate/dashboard"
                          style="display:inline-block; background:#06111f; color:#ffffff; padding:16px 30px; border-radius:999px; text-decoration:none; font-weight:900; font-size:14px; letter-spacing:1px; text-transform:uppercase;"
                        >
                          View Affiliate Dashboard
                        </a>

                      </div>

                      <div style="border-top:1px solid #dbeafe; padding-top:24px;">

                        <p style="font-size:12px; color:#64748b; line-height:1.6; margin:0;">
                          This email contains affiliate performance information only.
                          Customer information is never shared with affiliates.
                        </p>

                        <p style="margin:24px 0 0; color:#334155; line-height:1.6;">
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

        if (
          affiliateEmailError
        ) {
          /*
           * IMPORTANT:
           * Payment remains received even if
           * the notification email fails.
           */
          console.error(
            "Affiliate commission confirmation email error:",
            affiliateEmailError
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Payment received error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update payment status",
      },
      { status: 500 }
    );
  }
}