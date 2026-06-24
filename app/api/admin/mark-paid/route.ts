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
    const { orderId } = await request.json();

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId)
      .select()
      .single();

    if (error || !order) {
      console.error("Mark paid order error:", error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    const orderCart = order.cart || order.items || [];

    if (!Array.isArray(orderCart) || orderCart.length === 0) {
      console.error("No cart found on order:", order);
    } else {
      for (const item of orderCart) {
        const itemId = String(item.id || "").toLowerCase();
        const itemName = String(item.name || "").toLowerCase();

        const { data: products, error: productError } = await supabaseAdmin
          .from("products")
          .select("id, slug, name, inventory")
          .or(`slug.eq.${itemId},name.ilike.%${itemName}%`)
          .limit(1);

        if (productError || !products || products.length === 0) {
          console.error("Product not found for inventory update:", {
            itemId,
            itemName,
            productError,
          });
          continue;
        }

        const product = products[0];

        const newInventory = Math.max(
          0,
          Number(product.inventory || 0) - Number(item.quantity || 0)
        );

        const { error: updateError } = await supabaseAdmin
          .from("products")
          .update({ inventory: newInventory })
          .eq("id", product.id);

        if (updateError) {
          console.error("Inventory update failed:", {
            product,
            updateError,
          });
        }
      }

      const vialCount = orderCart.reduce((total: number, item: any) => {
        const isBacWater =
          String(item.id || "").toLowerCase().includes("bac") ||
          String(item.name || "").toLowerCase().includes("bac");

        return isBacWater ? total : total + Number(item.quantity || 0);
      }, 0);

      if (vialCount >= 4) {
        const { data: bacProducts, error: bacError } = await supabaseAdmin
          .from("products")
          .select("id, slug, name, inventory")
          .or(
            "slug.eq.bacwater,slug.eq.bac-water,slug.eq.bacteriostatic-water,name.ilike.%bac%"
          )
          .limit(1);

        if (bacError || !bacProducts || bacProducts.length === 0) {
          console.error("Bac Water not found for free inventory update:", bacError);
        } else {
          const bacWater = bacProducts[0];

          const newBacWaterInventory = Math.max(
            0,
            Number(bacWater.inventory || 0) - 1
          );

          const { error: bacUpdateError } = await supabaseAdmin
            .from("products")
            .update({ inventory: newBacWaterInventory })
            .eq("id", bacWater.id);

          if (bacUpdateError) {
            console.error("Bac Water inventory update failed:", bacUpdateError);
          }
        }
      }
    }

    await resend.emails.send({
      from: "Apexx Biolabs <orders@apexxbiolabs.com>",
      to: order.customer_email,
      subject: `Payment Received • ${order.order_number}`,
      html: `
        <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
            <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(30,58,138,0.12);">
              <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);padding:38px 24px;text-align:center;border-bottom:1px solid #dbeafe;">
                <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                  Research. Quality. Confidence.
                </p>
                <h1 style="margin:0;color:#06111f;font-size:34px;letter-spacing:3px;">
                  APEXX BIOLABS
                </h1>
                <p style="margin:12px 0 0;color:#475569;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                  Premium Research Materials
                </p>
              </div>

              <div style="padding:32px 24px;">
                <div style="background:#ffffff;border:1px solid #bfdbfe;border-radius:22px;padding:32px 24px;text-align:center;margin-bottom:30px;box-shadow:0 12px 30px rgba(59,130,246,0.10);">
                  <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                    Payment Verified
                  </p>
                  <h2 style="margin:0;color:#06111f;font-size:34px;font-weight:800;line-height:1.1;">
                    Payment Received
                  </h2>
                  <p style="margin:14px 0 0;color:#16a34a;font-size:18px;font-weight:700;">
                    Your Order Is Now Processing
                  </p>
                  <p style="margin:18px auto 0;max-width:500px;color:#475569;font-size:15px;line-height:1.7;">
                    Thank you. We have successfully received and verified your payment.
                    Your order is now being prepared for shipment.
                  </p>
                </div>

                <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:22px;padding:28px;text-align:center;margin-bottom:30px;">
                  <p style="margin:0 0 8px;color:#1e3a8a;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                    Order Number
                  </p>
                  <p style="margin:0;color:#06111f;font-size:28px;font-weight:900;">
                    ${order.order_number}
                  </p>
                </div>

                <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:22px;margin-bottom:30px;">
                  <h3 style="margin:0 0 16px;color:#06111f;font-size:22px;">
                    Payment Details
                  </h3>
                  <p style="margin:0 0 10px;color:#334155;">
                    <strong>Total Paid:</strong> $${Number(order.total).toFixed(2)}
                  </p>
                  <p style="margin:0;color:#334155;">
                    <strong>Status:</strong>
                    <span style="color:#16a34a;font-weight:bold;">Payment Confirmed</span>
                  </p>
                </div>

                <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:22px;margin-bottom:30px;">
                  <h3 style="margin:0 0 12px;color:#06111f;font-size:18px;">
                    What Happens Next?
                  </h3>
                  <p style="margin:0;color:#475569;line-height:1.8;">
                    Your order is now in our fulfillment queue. Once your package
                    ships, you will automatically receive a shipment confirmation email
                    with tracking information.
                  </p>
                </div>

                <p style="margin:0 0 24px;color:#2563eb;font-size:14px;line-height:1.6;">
                  Thank you for choosing Apexx Biolabs.
                </p>

                <div style="border-top:1px solid #dbeafe;padding-top:24px;">
                  <p style="font-size:12px;color:#64748b;line-height:1.6;margin:0;">
                    Products sold by Apexx Biolabs are intended strictly for lawful
                    laboratory research use only. Not for human consumption, medical
                    use, veterinary use, diagnosis, treatment, cure, or prevention of
                    disease.
                  </p>
                  <p style="margin:24px 0 0;color:#334155;line-height:1.6;">
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

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Mark paid route error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to mark paid" },
      { status: 500 }
    );
  }
}