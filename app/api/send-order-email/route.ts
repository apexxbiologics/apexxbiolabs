import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
      freeBacWater,
      marketingConsent,
    } = body;

    const orderNumber = `APX-${Date.now()}`;

    // 1. SAVE ORDER TO SUPABASE FIRST
    const { data: order, error: orderInsertError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_email: customerEmail,
          first_name: firstName,
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
          marketing_consent: marketingConsent,
          status: "awaiting_payment",
        },
      ])
      .select()
      .single();

    if (orderInsertError) {
      console.error("Supabase order insert error:", orderInsertError);

      return NextResponse.json(
        {
          success: false,
          error: orderInsertError.message,
        },
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

    // 2. SEND CUSTOMER EMAIL
    await resend.emails.send({
      from: "Apexx Biolabs <orders@apexxbiolabs.com>",
      to: customerEmail,
      subject: `Apexx Biolabs Order Confirmation • Payment Awaiting`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#f8fbff;padding:30px;">
          <div style="max-width:720px;margin:auto;background:white;border:1px solid #dbeafe;border-radius:24px;padding:30px;">
            <h1 style="color:#06111f;">Order Confirmation</h1>
            <p>Thank you for choosing Apexx Biolabs. Your order has been received and is awaiting payment verification.</p>

            <h2>Order Number</h2>
            <p><strong>${orderNumber}</strong></p>

            <h2>Total Due</h2>
            <p style="font-size:32px;font-weight:900;">$${Number(total).toFixed(
              2
            )}</p>

            <h2>Payment Method</h2>
            <p><strong>${paymentMethod.toUpperCase()}</strong></p>

            <h2>Payment Note</h2>
            <p>Include ONLY your order number: <strong>${orderNumber}</strong></p>

            <h2>Order Summary</h2>
            <ul>${itemsHtml}</ul>

            <p><strong>Subtotal:</strong> $${Number(subtotal).toFixed(2)}</p>
            <p><strong>Shipping:</strong> $${Number(shipping).toFixed(2)}</p>
            <p><strong>Total:</strong> $${Number(total).toFixed(2)}</p>

            ${
              freeBacWater
                ? `<p style="color:green;font-weight:bold;">✓ Complimentary Bac Water Included</p>`
                : ""
            }

            <hr/>

            <p style="font-size:12px;color:#64748b;">
              Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only.
              Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.
            </p>
          </div>
        </div>
      `,
    });

    // 3. SEND ADMIN EMAIL
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
            ? `<p style="color:green;font-weight:bold;">✓ INCLUDE 1 FREE BAC WATER WITH THIS ORDER</p>`
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