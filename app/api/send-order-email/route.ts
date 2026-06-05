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
  subject: `Thank you for your order - ${orderNumber}`,
  html: `
    <h2>Thank you for your order.</h2>

    <p>Your order has been received and is currently pending payment verification.</p>

    <p><strong>Order Number:</strong> ${orderNumber}</p>
    <p><strong>Order Total:</strong> $${Number(total).toFixed(2)}</p>

    <h3>Order Summary</h3>
    <ul>${itemsHtml}</ul>

    <p>
      A separate email with payment instructions has been sent to this email address.
      Please review the payment instructions carefully before submitting payment.
    </p>

    <p>
      Products are intended strictly for lawful laboratory research use only.
      Not for human consumption, medical use, veterinary use, diagnosis,
      treatment, cure, or prevention of disease.
    </p>
  `,
});

await resend.emails.send({
  from: "Apexx Biolabs <orders@apexxbiolabs.com>",
  to: customerEmail,
  subject: `Payment Instructions - Order ${orderNumber}`,
  html: `
    <h2>Payment Instructions</h2>

    <p><strong>Order Number:</strong> ${orderNumber}</p>
    <p><strong>Total Amount Due:</strong> $${Number(total).toFixed(2)}</p>
    <p><strong>Selected Payment Method:</strong> ${paymentMethod}</p>

    <h3>How to Pay</h3>

    <ul>
      <li>Submit the exact payment amount of <strong>$${Number(total).toFixed(2)}</strong>.</li>
      <li>Include ONLY your order number <strong>${orderNumber}</strong> in the payment notes/comments section.</li>
      <li>Do not include product names, product descriptions, or additional details.</li>
      <li>Orders not paid within 24 hours may be automatically cancelled.</li>
    </ul>

    <h3>Payment Method</h3>

    ${
      paymentMethod === "cashapp"
        ? `<p><strong>Cash App:</strong> ENTER YOUR CASH APP TAG HERE</p>`
        : ""
    }

    ${
      paymentMethod === "venmo"
        ? `<p><strong>Venmo:</strong> ENTER YOUR VENMO USERNAME HERE</p>`
        : ""
    }

    ${
      paymentMethod === "zelle"
        ? `<p><strong>Zelle:</strong> ENTER YOUR ZELLE EMAIL OR PHONE HERE</p>`
        : ""
    }

    <p>
      After payment is received and verified, an order confirmation and shipment
      tracking information will be sent by email.
    </p>

    <p>
      Please check your Inbox and Spam/Junk folders for updates regarding this order.
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