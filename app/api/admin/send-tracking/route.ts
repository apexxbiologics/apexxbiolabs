import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { orderId, trackingNumber, carrier } = await request.json();

    const trackingUrl =
      carrier === "USPS"
        ? `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`
        : carrier === "UPS"
        ? `https://www.ups.com/track?tracknum=${trackingNumber}`
        : carrier === "FedEx"
        ? `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
        : "";

const { data: order, error } = await supabaseAdmin
  .from("orders")
      .update({
        status: "shipped",
        tracking_number: trackingNumber,
        carrier,
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Tracking update error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update tracking" },
        { status: 500 }
      );
    }

    await resend.emails.send({
      from: "Apexx Biolabs <orders@apexxbiolabs.com>",
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
  Great news. Your Apexx Biolabs order has been packaged, shipped, and is now in transit.
  Tracking information is provided below.
</p>
                </div>

<div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:22px;padding:28px;text-align:center;margin-bottom:30px;">

  <p style="margin:0 0 8px;color:#1e3a8a;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
    Tracking Number
  </p>

  <p style="margin:0;color:#06111f;font-size:28px;font-weight:900;word-break:break-all;">
    ${trackingNumber}
  </p>

  <p style="margin:12px 0 0;color:#64748b;">
    Carrier: <strong>${carrier}</strong>
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

<div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:22px;margin-bottom:30px;">

  <h3 style="margin:0 0 12px;color:#06111f;font-size:18px;">
    What Happens Next?
  </h3>

  <p style="margin:0;color:#475569;line-height:1.8;">
    Your package has been handed off to the carrier and is currently making its way to you.
    Please allow up to 24 hours for tracking updates to appear after label creation.
  </p>

</div>

                <div style="border-top:1px solid #dbeafe; padding-top:22px;">
                  <p style="font-size:12px; color:#64748b; line-height:1.6; margin:0;">
                    Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only.
                    Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.
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

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Send tracking error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to send tracking email" },
      { status: 500 }
    );
  }
}