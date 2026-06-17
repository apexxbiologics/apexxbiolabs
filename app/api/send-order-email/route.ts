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
  subject: `Order Confirmation - ${orderNumber}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; color: #111;">
      <h2>Thank you for your order.</h2>

      <p>
        Your order has been received and is currently awaiting payment verification.
      </p>

      <p>
        <strong>Order Number:</strong> ${orderNumber}<br/>
        <strong>Total Due:</strong> $${Number(total).toFixed(2)}<br/>
        <strong>Selected Payment Method:</strong> ${paymentMethod}
      </p>

      <h3>Order Summary</h3>
      <ul>
        ${itemsHtml}
      </ul>

      <p>
        <strong>Subtotal:</strong> $${Number(subtotal).toFixed(2)}<br/>
        <strong>Shipping:</strong> $${Number(shipping).toFixed(2)}<br/>
        <strong>Total:</strong> $${Number(total).toFixed(2)}
      </p>

      <hr/>

      <h3>Complete Your Payment</h3>

      <p>
        Please submit the exact payment amount of
        <strong>$${Number(total).toFixed(2)}</strong>.
      </p>

      <ul>
        <li>Include ONLY your order number: <strong>${orderNumber}</strong></li>
        <li>Do not include product names, product descriptions, or additional details in the payment notes.</li>
        <li>Orders not paid within 24 hours may be automatically cancelled.</li>
      </ul>

      ${
        paymentMethod === "cashapp"
          ? `
            <h3>Cash App</h3>
            <p><strong>$YOURCASHTAG</strong></p>
          `
          : ""
      }

      ${
        paymentMethod === "venmo"
          ? `
            <h3>Venmo</h3>
            <p><strong>@apexx-biolabs</strong></p>
          `
          : ""
      }

${
  paymentMethod === "zelle"
    ? `
      <h3>Zelle</h3>
      <p>Please send payment via Zelle to:</p>
      <p><strong>apexxbiolabs7</strong></p>
    `
    : ""
}

      <p>
        After payment verification, shipment tracking information will be sent by email.
      </p>

      <hr/>

      <p style="font-size: 12px; color: #666;">
        Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only.
        Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.
      </p>

      <p>
        Apexx Biolabs<br/>
        orders@apexxbiolabs.com<br/>
        apexxbiolabs.com
      </p>
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