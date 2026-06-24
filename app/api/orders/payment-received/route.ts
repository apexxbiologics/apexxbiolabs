import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type CartItem = {
  id: string;
  quantity: number;
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderNumber } = await req.json();

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Missing order number" },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("order_number, status, cart")
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status === "Payment Received") {
      return NextResponse.json({
        success: true,
        message: "Inventory already updated for this order",
      });
    }

    const cart = order.cart as CartItem[];

    for (const item of cart) {
      const { data: product, error: productError } = await supabaseAdmin
        .from("products")
        .select("inventory")
        .eq("slug", item.id)
        .single();

      if (productError || !product) {
        console.error("Product not found:", item.id);
        continue;
      }

      const newInventory = Math.max(0, product.inventory - item.quantity);

      const { error: updateInventoryError } = await supabaseAdmin
        .from("products")
        .update({ inventory: newInventory })
        .eq("slug", item.id);

      if (updateInventoryError) {
        console.error("Inventory update failed:", item.id);
      }
    }

    const { error: statusError } = await supabaseAdmin
      .from("orders")
      .update({ status: "Payment Received" })
      .eq("order_number", orderNumber);

    if (statusError) {
      throw statusError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment received error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}