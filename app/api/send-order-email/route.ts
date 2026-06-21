import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    } = body;

    const orderNumber = `APX-${Date.now()}`;

    const itemsHtml = cart
      .map(
        (item: any) =>
          `<li>${item.name} x ${item.quantity} — $${(
            item.price * item.quantity
          ).toFixed(2)}</li>`
      )
      .join("");

await resend.emails.send({
  from: "Apexx Biolabs <orders@apexxbiolabs.com>",
  to: customerEmail,
  subject: `Payment Required - Order ${orderNumber}`,
  html: `
    <div style="margin:0; padding:0; background:#020617; font-family:Arial, Helvetica, sans-serif;">
      <div style="max-width:720px; margin:0 auto; padding:28px 16px;">

        <div style="background:#050505; border:1px solid #1e3a8a; border-radius:24px; overflow:hidden; box-shadow:0 0 40px rgba(37,99,235,0.20);">

          <div style="background:linear-gradient(135deg,#020617,#0f172a,#1e3a8a); padding:34px 24px; text-align:center;">
            <h1 style="margin:0; color:#ffffff; font-size:30px; letter-spacing:3px;">
              APEXX BIOLABS
            </h1>
            <p style="margin:12px 0 0; color:#bfdbfe; font-size:13px; letter-spacing:2px; text-transform:uppercase;">
              Premium Research Materials
            </p>
          </div>

          <div style="padding:30px 24px; color:#e5e7eb;">

            <div style="background:#0f172a; border:1px solid #2563eb; border-radius:18px; padding:22px; text-align:center; margin-bottom:26px;">
              <p style="margin:0 0 8px; color:#93c5fd; font-size:13px; letter-spacing:2px; text-transform:uppercase;">
                Order Received
              </p>
              <h2 style="margin:0; color:#ffffff; font-size:26px;">
                Payment Required
              </h2>
              <p style="margin:12px 0 0; color:#cbd5e1; font-size:15px; line-height:1.6;">
                Your order has been received, but it will not be processed until payment is verified.
              </p>
            </div>

            <div style="background:#eff6ff; border-radius:18px; padding:24px; text-align:center; margin-bottom:28px;">
              <p style="margin:0 0 8px; color:#1e3a8a; font-size:13px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;">
                Total Due
              </p>
              <p style="margin:0; color:#020617; font-size:38px; font-weight:900;">
                $${Number(total).toFixed(2)}
              </p>
            </div>

            <div style="background:#020617; border:1px solid #1e40af; border-radius:18px; padding:22px; margin-bottom:28px;">
              <h3 style="margin:0 0 16px; color:#ffffff; font-size:20px;">
                Complete Your Payment
              </h3>

              ${
                paymentMethod === "venmo"
                  ? `
                    <div style="text-align:center;">
                      <p style="color:#cbd5e1; line-height:1.6;">
                        Tap below to pay with Venmo.
                      </p>

                      <a 
                        href="https://venmo.com/u/apexx-biolabs"
                        style="display:inline-block; background:#2563eb; color:#ffffff; padding:16px 28px; border-radius:14px; text-decoration:none; font-weight:bold; font-size:16px; margin:12px 0;"
                      >
                        Pay with Venmo
                      </a>

                      <p style="margin:14px 0 0; color:#93c5fd; font-size:15px;">
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
        <p style="color:#cbd5e1; line-height:1.6; margin:0 0 18px;">
          You can complete your Zelle payment by scanning the QR code or by sending payment manually using the email below.
        </p>

        <div style="background:#0f172a; border:1px solid #1e40af; border-radius:16px; padding:20px; margin:16px 0;">
          <p style="margin:0 0 10px; color:#93c5fd; font-size:13px; text-transform:uppercase; letter-spacing:1.5px;">
            Option 1
          </p>

          <h4 style="margin:0 0 14px; color:#ffffff; font-size:18px;">
            Scan Zelle QR Code
          </h4>

          <img 
            src="https://apexxbiolabs.com/images/zelle-qr.png"
            alt="Apexx Biolabs Zelle QR Code"
            style="width:230px; max-width:100%; border-radius:16px; background:#ffffff; padding:12px; margin:8px auto 12px; display:block;"
          />

          <p style="margin:0; color:#94a3b8; font-size:13px; line-height:1.5;">
            Recipient should show as <strong style="color:#ffffff;">APEXX BIOLABS LLC</strong>.
          </p>
        </div>

        <div style="background:#eff6ff; border-radius:16px; padding:20px; margin:18px 0;">
          <p style="margin:0 0 10px; color:#1e3a8a; font-size:13px; text-transform:uppercase; letter-spacing:1.5px; font-weight:bold;">
            Option 2
          </p>

          <h4 style="margin:0 0 12px; color:#020617; font-size:18px;">
            Send Using Zelle Email
          </h4>

          <p style="margin:0 0 6px; color:#334155; font-size:14px;">
            Zelle Recipient
          </p>

          <p style="margin:0; color:#020617; font-size:22px; font-weight:900;">
            apexxbiolabs7@gmail.com
          </p>
        </div>
      </div>
    `
    : ""
}

              <div style="background:#111827; border-left:4px solid #60a5fa; padding:16px; border-radius:12px; margin-top:22px;">
                <p style="margin:0; color:#ffffff; font-weight:bold;">
                  Payment Note:
                </p>
                <p style="margin:8px 0 0; color:#dbeafe;">
                  Include ONLY your order number:
                  <strong>${orderNumber}</strong>
                </p>
                <p style="margin:10px 0 0; color:#94a3b8; font-size:13px; line-height:1.5;">
                  Do not include product names, product descriptions, or extra details in the payment notes.
                </p>
              </div>
            </div>

            <div style="margin-bottom:28px;">
              <p style="margin:0 0 8px; color:#94a3b8; font-size:13px; text-transform:uppercase; letter-spacing:1.5px;">
                Order Number
              </p>
              <p style="margin:0; color:#ffffff; font-size:20px; font-weight:bold;">
                ${orderNumber}
              </p>
            </div>

            <div style="background:#020617; border:1px solid #1e293b; border-radius:16px; padding:18px; margin-bottom:28px;">
              <h3 style="margin:0 0 14px; color:#ffffff; font-size:20px;">
                Order Summary
              </h3>

              <ul style="margin:0 0 18px; padding-left:20px; color:#e5e7eb; line-height:1.8;">
                ${itemsHtml}
              </ul>

              <div style="border-top:1px solid #1e293b; padding-top:16px; color:#cbd5e1; line-height:1.8;">
                <p style="margin:0;"><strong>Subtotal:</strong> $${Number(subtotal).toFixed(2)}</p>
                <p style="margin:0;"><strong>Shipping:</strong> $${Number(shipping).toFixed(2)}</p>
                <p style="margin:10px 0 0; color:#ffffff; font-size:18px;">
                  <strong>Total:</strong> $${Number(total).toFixed(2)}
                </p>
              </div>
            </div>

            <div style="background:#0f172a; border-radius:16px; padding:20px; margin-bottom:28px;">
              <h3 style="margin:0 0 12px; color:#ffffff; font-size:18px;">
                What Happens Next?
              </h3>
              <p style="margin:0; color:#cbd5e1; line-height:1.7;">
                Once payment is verified, your order will be prepared for shipment. Tracking information will be emailed once your order has been dispatched.
              </p>
            </div>

            <p style="margin:0 0 22px; color:#fca5a5; font-size:14px; line-height:1.6;">
              Orders not paid within 24 hours may be automatically cancelled.
            </p>

            <div style="border-top:1px solid #1e293b; padding-top:22px;">
              <p style="font-size:12px; color:#94a3b8; line-height:1.6; margin:0;">
                Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only.
                Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.
              </p>

              <p style="margin:22px 0 0; color:#e5e7eb; line-height:1.6;">
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
      `,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
    });
  } catch (error) {
    console.error("Order email error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to send order email" },
      { status: 500 }
    );
  }
}