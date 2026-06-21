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
        (item: any) => `
          <tr>
            <td style="padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.10); color:#ffffff; font-weight:700;">
              ${item.name}
              <div style="color:#9fb4cf; font-size:13px; font-weight:400; margin-top:4px;">
                Quantity: ${item.quantity}
              </div>
            </td>

            <td style="padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.10); color:#ffffff; text-align:right; font-weight:800;">
              $${(item.price * item.quantity).toFixed(2)}
            </td>
          </tr>
        `
      )
      .join("");

    const plainItemsHtml = cart
      .map(
        (item: any) =>
          `<li>${item.name} x ${item.quantity} — $${(
            item.price * item.quantity
          ).toFixed(2)}</li>`
      )
      .join("");

    const paymentHtml =
      paymentMethod === "venmo"
        ? `
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.10); border-radius:28px; padding:28px; margin-bottom:26px;">
            <p style="margin:0 0 10px; color:#A5D8FF; font-size:12px; letter-spacing:3px; text-transform:uppercase; font-weight:800;">
              Venmo Payment
            </p>

            <h3 style="margin:0 0 14px; color:#ffffff; font-size:24px; font-weight:900;">
              Complete Payment With Venmo
            </h3>

            <p style="margin:0 0 22px; color:#b8c7da; line-height:1.7; font-size:15px;">
              Tap the button below to complete your payment. Your order will be prepared once payment is verified.
            </p>

            <a
              href="https://venmo.com/u/apexx-biolabs"
              style="display:block; text-align:center; background:#ffffff; color:#081526; padding:18px 24px; border-radius:999px; text-decoration:none; font-weight:900; font-size:14px; letter-spacing:2px; text-transform:uppercase;"
            >
              Pay With Venmo
            </a>

            <div style="margin-top:18px; background:linear-gradient(135deg,#dbeafe,#eff6ff); border-radius:20px; padding:18px; text-align:center;">
              <p style="margin:0 0 6px; color:#1e3a8a; font-size:12px; text-transform:uppercase; letter-spacing:2px; font-weight:900;">
                Venmo Username
              </p>

              <p style="margin:0; color:#020617; font-size:22px; font-weight:900;">
                @apexx-biolabs
              </p>
            </div>
          </div>
        `
        : paymentMethod === "zelle"
        ? `
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.10); border-radius:28px; padding:28px; margin-bottom:26px;">
            <p style="margin:0 0 10px; color:#A5D8FF; font-size:12px; letter-spacing:3px; text-transform:uppercase; font-weight:800;">
              Zelle Payment
            </p>

            <h3 style="margin:0 0 14px; color:#ffffff; font-size:24px; font-weight:900;">
              Complete Payment With Zelle
            </h3>

            <p style="margin:0 0 22px; color:#b8c7da; line-height:1.7; font-size:15px;">
              Scan the QR code or send payment manually using the Zelle email below.
            </p>

            <div style="background:linear-gradient(135deg,#dbeafe,#eff6ff); border-radius:28px; padding:24px; text-align:center; margin-bottom:18px;">
              <p style="margin:0 0 12px; color:#1e3a8a; font-size:12px; text-transform:uppercase; letter-spacing:2px; font-weight:900;">
                Option 1 · Scan QR Code
              </p>

              <img
                src="https://apexxbiolabs.com/images/zelle-qr.png"
                alt="Apexx Biolabs Zelle QR Code"
                style="width:230px; max-width:100%; border-radius:22px; background:#ffffff; padding:12px; display:block; margin:0 auto 14px;"
              />

              <p style="margin:0; color:#334155; font-size:13px; line-height:1.5;">
                Recipient should show as <strong style="color:#020617;">APEXX BIOLABS LLC</strong>.
              </p>
            </div>

            <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.10); border-radius:22px; padding:20px; text-align:center;">
              <p style="margin:0 0 8px; color:#A5D8FF; font-size:12px; text-transform:uppercase; letter-spacing:2px; font-weight:900;">
                Option 2 · Zelle Email
              </p>

              <p style="margin:0; color:#ffffff; font-size:22px; font-weight:900;">
                apexxbiolabs7@gmail.com
              </p>
            </div>
          </div>
        `
        : "";

    await resend.emails.send({
      from: "Apexx Biolabs <orders@apexxbiolabs.com>",
      to: customerEmail,
      subject: "Apexx Biolabs Order Confirmation - Payment Awaiting",
      html: `
        <div style="margin:0; padding:0; background:#081526; font-family:Arial, Helvetica, sans-serif;">
          <div style="max-width:760px; margin:0 auto; padding:34px 16px;">

            <div style="border:1px solid rgba(255,255,255,0.10); border-radius:36px; overflow:hidden; background:linear-gradient(180deg,#10213a 0%,#081526 45%,#06101f 100%); box-shadow:0 0 80px rgba(96,165,250,0.20);">

              <div style="padding:42px 26px 34px; text-align:center; background:radial-gradient(circle at top,rgba(165,216,255,0.20),transparent 55%); border-bottom:1px solid rgba(255,255,255,0.10);">
                <img
                  src="https://apexxbiolabs.com/images/logo.png"
                  alt="Apexx Biolabs"
                  style="height:58px; width:auto; margin:0 auto 26px; display:block;"
                />

                <p style="margin:0 0 16px; color:#A5D8FF; font-size:12px; letter-spacing:4px; text-transform:uppercase; font-weight:800;">
                  Order Confirmation
                </p>

                <h1 style="margin:0; color:#ffffff; font-size:42px; line-height:1.05; font-weight:900; letter-spacing:-1px;">
                  Payment Awaiting
                </h1>

                <p style="margin:16px auto 0; max-width:560px; color:#c7d7ea; font-size:16px; line-height:1.7;">
                  Thank you for choosing Apexx Biolabs. Your order has been received and is awaiting payment verification before processing.
                </p>
              </div>

              <div style="padding:30px 22px 34px;">

                <div style="background:linear-gradient(135deg,#dbeafe,#eff6ff); border-radius:30px; padding:30px 24px; text-align:center; margin-bottom:26px; box-shadow:0 20px 55px rgba(59,130,246,0.18);">
                  <p style="margin:0 0 10px; color:#1e3a8a; font-size:12px; letter-spacing:3px; text-transform:uppercase; font-weight:900;">
                    Total Due
                  </p>

                  <p style="margin:0; color:#081526; font-size:54px; line-height:1; font-weight:900;">
                    $${Number(total).toFixed(2)}
                  </p>

                  <p style="margin:14px 0 0; color:#475569; font-size:14px;">
                    Order Number: <strong style="color:#081526;">${orderNumber}</strong>
                  </p>
                </div>

                ${paymentHtml}

                <div style="background:rgba(165,216,255,0.10); border:1px solid rgba(165,216,255,0.28); border-radius:24px; padding:22px; margin-bottom:26px;">
                  <p style="margin:0 0 8px; color:#ffffff; font-size:18px; font-weight:900;">
                    Payment Note
                  </p>

                  <p style="margin:0; color:#dbeafe; line-height:1.7;">
                    Include ONLY your order number:
                    <strong style="color:#ffffff;">${orderNumber}</strong>
                  </p>

                  <p style="margin:10px 0 0; color:#9fb4cf; font-size:13px; line-height:1.6;">
                    Do not include product names, product descriptions, or extra details in the payment notes.
                  </p>
                </div>

                <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.10); border-radius:28px; padding:26px; margin-bottom:26px;">
                  <p style="margin:0 0 18px; color:#A5D8FF; font-size:12px; letter-spacing:3px; text-transform:uppercase; font-weight:800;">
                    Order Summary
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    ${itemsHtml}
                  </table>

                  <div style="margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.10);">
                    <div style="display:flex; justify-content:space-between; color:#b8c7da; font-size:15px; margin-bottom:10px;">
                      <span>Subtotal</span>
                      <strong>$${Number(subtotal).toFixed(2)}</strong>
                    </div>

                    <div style="display:flex; justify-content:space-between; color:#b8c7da; font-size:15px; margin-bottom:10px;">
                      <span>Shipping</span>
                      <strong>$${Number(shipping).toFixed(2)}</strong>
                    </div>

                    <div style="display:flex; justify-content:space-between; color:#ffffff; font-size:20px; font-weight:900; margin-top:14px;">
                      <span>Total</span>
                      <span>$${Number(total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.10); border-radius:28px; padding:26px; margin-bottom:26px;">
                  <p style="margin:0 0 10px; color:#A5D8FF; font-size:12px; letter-spacing:3px; text-transform:uppercase; font-weight:800;">
                    What Happens Next
                  </p>

                  <p style="margin:0; color:#c7d7ea; line-height:1.7; font-size:15px;">
                    Once payment is verified, your order will be prepared for shipment. Tracking information will be emailed once your order has been dispatched.
                  </p>
                </div>

                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:22px;">
                  <p style="margin:0; color:#9fb4cf; font-size:12px; line-height:1.7;">
                    Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only.
                    Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.
                  </p>

                  <p style="margin:22px 0 0; color:#ffffff; line-height:1.7; font-size:14px;">
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
        <div style="font-family:Arial, Helvetica, sans-serif; background:#081526; padding:28px;">
          <div style="max-width:720px; margin:0 auto; background:#0f1d33; border:1px solid rgba(255,255,255,0.12); border-radius:28px; padding:28px; color:#ffffff;">
            <h2 style="margin:0 0 18px;">New Order Received</h2>

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
            <ul>${plainItemsHtml}</ul>

            <p><strong>Subtotal:</strong> $${Number(subtotal).toFixed(2)}</p>
            <p><strong>Shipping:</strong> $${Number(shipping).toFixed(2)}</p>
            <p><strong>Total:</strong> $${Number(total).toFixed(2)}</p>
          </div>
        </div>
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