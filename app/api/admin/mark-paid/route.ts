import { Resend } from "resend";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { orderId } = await request.json();

  const { data: order, error } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId)
    .select()
    .single();

  if (error || !order) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

const orderCart = order.cart || order.items || [];

if (Array.isArray(orderCart)) {
  for (const item of orderCart) {
    const { data: product } = await supabase
      .from("products")
      .select("inventory")
      .eq("slug", item.id)
      .single();

    if (!product) continue;

    const newInventory = Math.max(
      0,
      Number(product.inventory || 0) - Number(item.quantity || 0)
    );

    await supabase
      .from("products")
      .update({ inventory: newInventory })
      .eq("slug", item.id);
  }

  const vialCount = orderCart.reduce((total: number, item: any) => {
    const isBacWater =
      item.id === "bacwater" ||
      item.id === "bac-water" ||
      item.name?.toLowerCase().includes("bac");

    return isBacWater ? total : total + Number(item.quantity || 0);
  }, 0);

  if (vialCount >= 4) {
    const { data: bacWater } = await supabase
      .from("products")
      .select("inventory")
      .eq("slug", "bacwater")
      .single();

    if (bacWater) {
      const newBacWaterInventory = Math.max(
        0,
        Number(bacWater.inventory || 0) - 1
      );

      await supabase
        .from("products")
        .update({ inventory: newBacWaterInventory })
        .eq("slug", "bacwater");
    }
  }
}

  await resend.emails.send({
    from: "Apexx Biolabs <orders@apexxbiolabs.com>",
    to: order.customer_email,
    subject: `Payment Received • ${order.order_number}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f8fbff;padding:30px;">
        <div style="max-width:680px;margin:auto;background:white;border:1px solid #dbeafe;border-radius:24px;padding:30px;">
          <h1 style="color:#06111f;">Payment Received</h1>
          <p>Your payment for order <strong>${order.order_number}</strong> has been verified.</p>
          <p>Your order is now being prepared for shipment.</p>
          <p><strong>Total:</strong> $${Number(order.total).toFixed(2)}</p>
          <hr/>
          <p style="font-size:12px;color:#64748b;">
            Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only.
          </p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ success: true, order });
}