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
    const body = await request.json();

    const {
      customerEmail,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      paymentMethod,
      cart,
      subtotal,
      shipping,
      total,
      freeBacWater,
    } = body;

    const orderNumber = `APX-${Date.now()}`;

const { data: order, error: orderInsertError } = await supabaseAdmin
  .from("orders")
      .insert([
        {
          order_number: orderNumber,
customer_email: customerEmail.trim().toLowerCase(),          first_name: firstName,
          last_name: lastName,
          address,
          city,
          state,
          zip_code: zipCode,
          payment_method: paymentMethod,
          cart,
          subtotal,
          shipping,
          total,
          status: "awaiting_payment",
        },
      ])
      .select()
      .single();

    if (orderInsertError) {
      console.error("Supabase order insert error:", orderInsertError);

      return NextResponse.json(
        { success: false, error: orderInsertError.message },
        { status: 500 }
      );
    }

    const itemsHtml = cart
      .map(
        (item: any) =>
          `<li style="margin-bottom:8px;">${item.name} x ${
            item.quantity
          } — $${(item.price * item.quantity).toFixed(2)}</li>`
      )
      .join("");

    await resend.emails.send({
      from: "Apexx Biolabs <orders@apexxbiolabs.com>",
      to: customerEmail,
      subject: `Apexx Biolabs Order Confirmation • Payment Awaiting`,
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
                  Premium Research Materials
                </p>
              </div>

              <div style="padding:32px 24px; color:#0f172a;">
                <div style="background:#ffffff; border:1px solid #bfdbfe; border-radius:22px; padding:32px 24px; text-align:center; margin-bottom:30px; box-shadow:0 12px 30px rgba(59,130,246,0.10);">
                  <p style="margin:0 0 14px; color:#3b82f6; font-size:13px; letter-spacing:4px; text-transform:uppercase;">
                    Order Received
                  </p>

                  <h2 style="margin:0; color:#06111f; font-size:34px; font-weight:800; line-height:1.1;">
                    Order Confirmation
                  </h2>

                  <p style="margin:14px 0 0; color:#2563eb; font-size:18px; font-weight:700;">
                    Payment Awaiting Verification
                  </p>

                  <p style="margin:18px auto 0; max-width:500px; color:#475569; font-size:15px; line-height:1.7;">
                    Thank you for choosing Apexx Biolabs. Your order has been successfully received and is awaiting payment verification before processing and fulfillment.
                  </p>
                </div>

                <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff); border:1px solid #bfdbfe; border-radius:22px; padding:28px; text-align:center; margin-bottom:30px;">
                  <p style="margin:0 0 8px; color:#1e3a8a; font-size:13px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;">
                    Total Due
                  </p>

                  <p style="margin:0; color:#0f172a !important; font-size:50px; font-weight:900;">
                    $${Number(total).toFixed(2)}
                  </p>
                </div>

                <div style="background:#f8fbff; border:1px solid #bfdbfe; border-radius:22px; padding:24px; margin-bottom:30px;">
                  <h3 style="margin:0 0 18px; color:#06111f; font-size:22px;">
                    Complete Payment Verification
                  </h3>

                  ${
                    paymentMethod === "venmo"
                      ? `
                        <div style="text-align:center;">
                          <p style="color:#475569; line-height:1.6; margin:0 0 16px;">
                            Tap below to complete your Venmo payment.
                          </p>

                          <a 
                            href="https://venmo.com/u/apexx-biolabs"
                            style="display:inline-block; background:#06111f; color:#ffffff; padding:16px 30px; border-radius:999px; text-decoration:none; font-weight:900; font-size:15px; letter-spacing:1px; text-transform:uppercase; margin:12px 0;"
                          >
                            Pay With Venmo
                          </a>

                          <p style="margin:16px 0 0; color:#2563eb; font-size:15px;">
                            Venmo: <strong>@apexx-biolabs</strong>
                          </p>
                        </div>
                      `
                      : ""
                  }

                  ${
                    paymentMethod === "zelle"
                      ? `
                        <div style="text-align:center;">
                          <p style="color:#475569; line-height:1.6; margin:0 0 18px;">
                            You can complete your Zelle payment by scanning the QR code or by sending payment manually using the email below.
                          </p>

                          <div style="background:#ffffff; border:1px solid #bfdbfe; border-radius:18px; padding:22px; margin:18px 0;">
                            <p style="margin:0 0 10px; color:#3b82f6; font-size:13px; text-transform:uppercase; letter-spacing:1.5px;">
                              Option 1
                            </p>

                            <h4 style="margin:0 0 14px; color:#06111f; font-size:18px;">
                              Scan Zelle QR Code
                            </h4>

                            <img 
                              src="https://apexxbiolabs.com/images/zelle-qr.png"
                              alt="Apexx Biolabs Zelle QR Code"
                              width="200"
                              style="width:200px; max-width:85%; height:auto; border-radius:14px; background:#ffffff; padding:10px; margin:8px auto 14px; display:block; border:1px solid #e5e7eb;"
                            />

                            <p style="margin:0; color:#64748b; font-size:13px; line-height:1.5;">
                              Recipient should show as <strong style="color:#06111f;">APEXX BIOLABS LLC</strong>.
                            </p>
                          </div>

                          <div style="background:linear-gradient(135deg,#eaf4ff,#ffffff); border:1px solid #bfdbfe; border-radius:18px; padding:22px; margin:18px 0;">
                            <p style="margin:0 0 10px; color:#2563eb; font-size:13px; text-transform:uppercase; letter-spacing:1.5px; font-weight:bold;">
                              Option 2
                            </p>

                            <h4 style="margin:0 0 12px; color:#06111f; font-size:18px;">
                              Send Using Zelle Email
                            </h4>

                            <p style="margin:0 0 6px; color:#475569; font-size:14px;">
                              Zelle Recipient
                            </p>

                            <p style="margin:0; color:#0f172a !important; font-size:22px; font-weight:900;">
                              apexxbiolabs7@gmail.com
                            </p>
                          </div>
                        </div>
                      `
                      : ""
                  }

                  <div style="background:#ffffff; border-left:4px solid #60a5fa; padding:18px; border-radius:14px; margin-top:24px;">
                    <p style="margin:0; color:#06111f; font-weight:bold;">
                      Payment Note
                    </p>

                    <p style="margin:8px 0 0; color:#1e3a8a;">
                      Include ONLY your order number:
                      <strong>${orderNumber}</strong>
                    </p>

                    <p style="margin:10px 0 0; color:#64748b; font-size:13px; line-height:1.5;">
                      Do not include product names, product descriptions, or extra details in the payment notes.
                    </p>
                  </div>
                </div>

                <div style="margin-bottom:30px; background:#ffffff; border:1px solid #dbeafe; border-radius:18px; padding:20px;">
                  <p style="margin:0 0 8px; color:#3b82f6; font-size:13px; text-transform:uppercase; letter-spacing:2px;">
                    Order Number
                  </p>

                  <p style="margin:0; color:#06111f; font-size:21px; font-weight:bold;">
                    ${orderNumber}
                  </p>
                </div>

                <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:20px; padding:22px; margin-bottom:30px;">
                  <h3 style="margin:0 0 16px; color:#06111f; font-size:22px;">
                    Order Summary
                  </h3>

                  <ul style="margin:0 0 18px; padding-left:20px; color:#334155; line-height:1.8;">
                    ${itemsHtml}
                  </ul>

                  <div style="border-top:1px solid #dbeafe; padding-top:16px; color:#334155; line-height:1.8;">
                    <p style="margin:0;"><strong>Subtotal:</strong> $${Number(subtotal).toFixed(2)}</p>
                    <p style="margin:0;"><strong>Shipping:</strong> $${Number(shipping).toFixed(2)}</p>

                    ${
                      freeBacWater
                        ? `
                          <p style="margin:8px 0 0; color:#16a34a; font-weight:bold;">
                            ✓ Complimentary Bac Water Included
                          </p>
                        `
                        : ""
                    }

                    <p style="margin:12px 0 0; color:#06111f; font-size:19px;">
                      <strong>Total:</strong> $${Number(total).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:20px; padding:22px; margin-bottom:30px;">
                  <h3 style="margin:0 0 12px; color:#06111f; font-size:18px;">
                    What Happens Next?
                  </h3>

                  <p style="margin:0; color:#475569; line-height:1.7;">
                    Once payment is verified, your order will be prepared for shipment. Tracking information will be emailed once your order has been dispatched.
                  </p>
                </div>

                <p style="margin:0 0 24px; color:#2563eb; font-size:14px; line-height:1.6;">
                  Orders not paid within 24 hours may be automatically cancelled.
                </p>

                <div style="border-top:1px solid #dbeafe; padding-top:24px;">
                  <p style="font-size:12px; color:#64748b; line-height:1.6; margin:0;">
                    Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only.
                    Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.
                  </p>

                  <p style="margin:24px 0 0; color:#334155; line-height:1.6;">
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

    await resend.emails.send({
      from: "Apexx Biolabs <orders@apexxbiolabs.com>",
      to: "orders@apexxbiolabs.com",
      subject: `New Apexx Order ${orderNumber}`,
      html: `
        <h2>New Order Received</h2>

        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>

        <h3>Shipping Address</h3>
        <p>
          ${address}<br/>
          ${city}, ${state} ${zipCode}
        </p>

        <p><strong>Payment Method:</strong> ${paymentMethod}</p>

        <h3>Order Items</h3>
        <ul>${itemsHtml}</ul>

        <p><strong>Subtotal:</strong> $${Number(subtotal).toFixed(2)}</p>
        <p><strong>Shipping:</strong> $${Number(shipping).toFixed(2)}</p>
        <p><strong>Total:</strong> $${Number(total).toFixed(2)}</p>

        ${
          freeBacWater
            ? `<p style="color:green; font-weight:bold;">✓ INCLUDE 1 FREE BAC WATER WITH THIS ORDER</p>`
            : ""
        }
      `,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      order,
    });
  } catch (error) {
    console.error("Order email error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to submit order" },
      { status: 500 }
    );
  }
}