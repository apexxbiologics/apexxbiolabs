import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function POST(request: Request) {
  try {
    const { orderId, trackingNumber, carrier } =
      await request.json();

    if (!orderId || !trackingNumber || !carrier) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order ID, tracking number, and carrier are required.",
        },
        { status: 400 }
      );
    }

    const cleanedTrackingNumber =
      String(trackingNumber).trim();

    const cleanedCarrier = String(carrier).trim();

    if (!cleanedTrackingNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid tracking number.",
        },
        { status: 400 }
      );
    }

    const {
      data: existingOrder,
      error: existingOrderError,
    } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (existingOrderError || !existingOrder) {
      console.error(
        "Order lookup error:",
        existingOrderError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Order could not be found.",
        },
        { status: 404 }
      );
    }

    if (
      existingOrder.status !== "paid" &&
      existingOrder.status !== "shipped"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The order must be marked paid before it can be shipped.",
        },
        { status: 400 }
      );
    }

    const {
      data: order,
      error: updateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        status: "shipped",
        tracking_number: cleanedTrackingNumber,
        carrier: cleanedCarrier,
      })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError || !order) {
      console.error(
        "Tracking update error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to update tracking information.",
        },
        { status: 500 }
      );
    }

    const normalizedCustomerEmail = String(
      order.customer_email || ""
    )
      .trim()
      .toLowerCase();

    let customerUserId: string | null = null;
    let pointsAwarded = 0;
    let pointsMessage = "No points awarded.";

    const {
      data: usersData,
      error: usersError,
    } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) {
      console.error(
        "Customer account lookup error:",
        usersError
      );

      pointsMessage =
        "Order shipped, but the customer account could not be checked.";
    } else {
      const customerUser =
        usersData.users.find(
          (user) =>
            String(user.email || "")
              .trim()
              .toLowerCase() ===
            normalizedCustomerEmail
        );

      if (!customerUser) {
        pointsMessage =
          "Order shipped, but no customer account matched the order email.";
      } else {
        customerUserId = customerUser.id;

        const {
          data: existingEarnedTransaction,
          error: earnedLookupError,
        } = await supabaseAdmin
          .from("point_transactions")
          .select("id, points")
          .eq("order_id", order.id)
          .eq("type", "earned")
          .maybeSingle();

        if (earnedLookupError) {
          console.error(
            "Earned points lookup error:",
            earnedLookupError
          );

          pointsMessage =
            "The earned-points transaction could not be checked.";
        } else if (existingEarnedTransaction) {
          pointsAwarded = Number(
            existingEarnedTransaction.points || 0
          );

          pointsMessage =
            "Points were already awarded for this order.";
        } else {
          const earnedPoints = Math.max(
            0,
            Math.floor(
              Number(order.total || 0)
            )
          );

          if (earnedPoints > 0) {
            const {
              error: pointsInsertError,
            } = await supabaseAdmin
              .from("point_transactions")
              .insert({
                user_id: customerUser.id,
                order_id: order.id,
                points: earnedPoints,
                type: "earned",
                description: `Points earned from order ${order.order_number}`,
              });

            if (pointsInsertError) {
              if (
                pointsInsertError.code === "23505"
              ) {
                pointsMessage =
                  "Points were already awarded for this order.";
              } else {
                console.error(
                  "Points award error:",
                  pointsInsertError
                );

                pointsMessage =
                  "Order shipped, but points could not be awarded.";
              }
            } else {
              pointsAwarded = earnedPoints;

              pointsMessage =
                `${earnedPoints} points awarded.`;
            }
          } else {
            pointsMessage =
              "This order did not earn any points.";
          }
        }
      }
    }

    let updatedPointsBalance:
      | number
      | null = null;

    if (customerUserId) {
      const {
        data: updatedTransactions,
        error: updatedBalanceError,
      } = await supabaseAdmin
        .from("point_transactions")
        .select("points")
        .eq("user_id", customerUserId);

      if (updatedBalanceError) {
        console.error(
          "Updated point balance error:",
          updatedBalanceError
        );
      } else {
        updatedPointsBalance = Math.max(
          0,
          (updatedTransactions || []).reduce(
            (sum, transaction) =>
              sum +
              Number(
                transaction.points || 0
              ),
            0
          )
        );
      }
    }

    const trackingUrl =
      cleanedCarrier === "USPS"
        ? `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${encodeURIComponent(
            cleanedTrackingNumber
          )}`
        : cleanedCarrier === "UPS"
        ? `https://www.ups.com/track?tracknum=${encodeURIComponent(
            cleanedTrackingNumber
          )}`
        : cleanedCarrier === "FedEx"
        ? `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(
            cleanedTrackingNumber
          )}`
        : "";

    const rewardsEmailHtml =
      pointsAwarded > 0
        ? `
          <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #93c5fd;border-radius:22px;padding:26px;text-align:center;margin-bottom:30px;">
            <p style="margin:0 0 8px;color:#1e3a8a;font-size:12px;text-transform:uppercase;letter-spacing:3px;font-weight:bold;">
              Apexx Rewards
            </p>

            <p style="margin:0;color:#06111f;font-size:32px;font-weight:900;">
              +${pointsAwarded} Points Earned
            </p>

            ${
              updatedPointsBalance !== null
                ? `
                  <p style="margin:16px 0 0;color:#1e3a8a;font-size:16px;font-weight:800;">
                    New Balance: ${updatedPointsBalance} Points
                  </p>
                `
                : ""
            }

            <p style="margin:12px auto 0;max-width:480px;color:#475569;font-size:14px;line-height:1.7;">
              Every 100 points can be redeemed for $10 off a future purchase.
            </p>
          </div>
        `
        : "";

    const { error: emailError } =
      await resend.emails.send({
        from:
          "Apexx Biolabs <orders@apexxbiolabs.com>",
        to: order.customer_email,
        subject: `Your Apexx Biolabs Order Has Shipped • ${order.order_number}`,
        html: `
          <div style="margin:0; padding:0; background:#f8fbff; font-family:Arial, Helvetica, sans-serif;">
            <div style="max-width:700px; margin:0 auto; padding:28px 16px;">
              <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:28px; overflow:hidden; box-shadow:0 18px 45px rgba(30,58,138,0.12);">

                <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff); padding:36px 24px; text-align:center; border-bottom:1px solid #dbeafe;">
                  <p style="margin:0 0 14px; color:#3b82f6; font-size:13px; letter-spacing:4px; text-transform:uppercase;">
                    Research. Quality. Confidence.
                  </p>

                  <h1 style="margin:0; color:#06111f; font-size:34px; letter-spacing:3px;">
                    APEXX BIOLABS
                  </h1>

                  <p style="margin:12px 0 0; color:#475569; font-size:13px; letter-spacing:2px; text-transform:uppercase;">
                    Premium Research Materials
                  </p>
                </div>

                <div style="padding:32px 24px; color:#0f172a;">
                  <div style="background:#ffffff; border:1px solid #bfdbfe; border-radius:22px; padding:30px 24px; text-align:center; margin-bottom:28px;">
                    <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                      Shipment Confirmation
                    </p>

                    <h2 style="margin:0;color:#06111f;font-size:34px;font-weight:800;line-height:1.1;">
                      Your Order Has Shipped
                    </h2>

                    <p style="margin:14px 0 0;color:#16a34a;font-size:18px;font-weight:700;">
                      Package In Transit
                    </p>

                    <p style="margin:18px auto 0;max-width:500px;color:#475569;font-size:15px;line-height:1.7;">
                      Great news. Your Apexx Biolabs order has been packaged,
                      shipped, and is now in transit. Tracking information is
                      provided below.
                    </p>
                  </div>

                  <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:22px;padding:28px;text-align:center;margin-bottom:30px;">
                    <p style="margin:0 0 8px;color:#1e3a8a;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                      Tracking Number
                    </p>

                    <p style="margin:0;color:#06111f;font-size:28px;font-weight:900;word-break:break-all;">
                      ${cleanedTrackingNumber}
                    </p>

                    <p style="margin:12px 0 0;color:#64748b;">
                      Carrier:
                      <strong>${cleanedCarrier}</strong>
                    </p>

                    ${
                      trackingUrl
                        ? `
                          <a
                            href="${trackingUrl}"
                            style="
                              display:inline-block;
                              margin-top:22px;
                              background:#06111f;
                              color:#ffffff;
                              padding:16px 30px;
                              border-radius:999px;
                              text-decoration:none;
                              font-weight:900;
                              letter-spacing:1px;
                              text-transform:uppercase;
                            "
                          >
                            Track Package
                          </a>
                        `
                        : ""
                    }
                  </div>

                  ${rewardsEmailHtml}

                  <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:22px;margin-bottom:30px;">
                    <h3 style="margin:0 0 12px;color:#06111f;font-size:18px;">
                      What Happens Next?
                    </h3>

                    <p style="margin:0;color:#475569;line-height:1.8;">
                      Your package has been handed off to the carrier and is
                      currently making its way to you. Please allow up to 24
                      hours for tracking updates to appear after label creation.
                    </p>
                  </div>

                  <div style="border-top:1px solid #dbeafe; padding-top:22px;">
                    <p style="font-size:12px; color:#64748b; line-height:1.6; margin:0;">
                      Products sold by Apexx Biolabs are intended strictly for
                      lawful laboratory research use only. Not for human
                      consumption, medical use, veterinary use, diagnosis,
                      treatment, cure, or prevention of disease.
                    </p>

                    <p style="margin:22px 0 0; color:#334155; line-height:1.6;">
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

    if (emailError) {
      console.error(
        "Shipping email error:",
        emailError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Order was marked shipped and points were processed, but the shipping email could not be sent.",
          order,
          pointsAwarded,
          updatedPointsBalance,
          pointsMessage,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
      pointsAwarded,
      updatedPointsBalance,
      pointsMessage,
    });
  } catch (error) {
    console.error(
      "Send tracking error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process shipment.",
      },
      { status: 500 }
    );
  }
}