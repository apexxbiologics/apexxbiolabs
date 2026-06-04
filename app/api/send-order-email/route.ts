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
      subject: `Payment Instructions - Order ${orderNumber}`,
      html: `
        <h2>Thank you for your order.</h2>

        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total Due:</strong> $${Number(total).toFixed(2)}</p>
        <p><strong>Selected Payment Method:</strong> ${paymentMethod}</p>

        <h3>Payment Instructions</h3>
        <ul>
          <li>Payment instructions will be sent to the email address provided during checkout.</li>
          <li>Please submit the exact payment amount.</li>
          <li>Include ONLY your order number in the payment notes/comments section.</li>
          <li>Do not include product names, product descriptions, or additional details.</li>
          <li>Orders not paid within 24 hours may be automatically cancelled.</li>
        </ul>

        <h3>Order Summary</h3>
        <ul>${itemsHtml}</ul>

        <p><strong>Subtotal:</strong> $${Number(subtotal).toFixed(2)}</p>
        <p><strong>Shipping:</strong> $${Number(shipping).toFixed(2)}</p>
        <p><strong>Total:</strong> $${Number(total).toFixed(2)}</p>

        <p>
          Products are intended strictly for lawful laboratory research use only.
          Not for human consumption, medical use, veterinary use, diagnosis,
          treatment, cure, or prevention of disease.
        </p>
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