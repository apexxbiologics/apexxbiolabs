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
  from: "Apexx Biolabs <order@apexxbiolabs.com>",
  to: customerEmail,
  subject: `Order Confirmation - ${orderNumber}`,
  html: `
    <h2>Thank you for your order.</h2>

    <p>
      Your order has been received and is currently awaiting payment verification.
    </p>

    <p><strong>Order Number:</strong> ${orderNumber}</p>
    <p><strong>Total Due:</strong> $${Number(total).toFixed(2)}</p>

    <h3>Order Summary</h3>

    <ul>
      ${itemsHtml}
    </ul>

    <hr />

    <h3>Payment Instructions</h3>

    <p>
      Submit the exact payment amount of
      <strong>$${Number(total).toFixed(2)}</strong>.
    </p>

    <p>
      Include ONLY your order number
      <strong>${orderNumber}</strong>
      in the payment notes/comments section.
    </p>

    <p>
      Do not include product names, product descriptions,
      or additional details.
    </p>

    ${
      paymentMethod === "cashapp"
        ? `<p><strong>Cash App:</strong> YOUR_CASHAPP_TAG</p>`
        : ""
    }

    ${
      paymentMethod === "venmo"
        ? `<p><strong>Venmo:</strong> YOUR_VENMO_USERNAME</p>`
        : ""
    }

    ${
      paymentMethod === "zelle"
        ? `<p><strong>Zelle:</strong> YOUR_ZELLE_EMAIL</p>`
        : ""
    }

    <p>
      Orders not paid within 24 hours may be automatically cancelled.
    </p>

    <p>
      After payment verification, shipment tracking information
      will be sent by email.
    </p>

    <hr />

    <p>
      Apexx Biolabs<br/>
      order@apexxbiolabs.com<br/>
      apexxbiolabs.com
    </p>
  `,
});
    await resend.emails.send({
      from: "Apexx Biolabs <order@apexxbiolabs.com>",
      to: "order@apexxbiolabs.com",
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