import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, error: "Order number and email are required." },
        { status: 400 }
      );
    }

    const cleanOrderNumber = orderNumber.trim();
    const cleanEmail = email.trim().toLowerCase();

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(
        "order_number, customer_email, first_name, last_name, total, status, tracking_number, carrier, created_at"
      )
      .ilike("order_number", cleanOrderNumber)
      .ilike("customer_email", cleanEmail)
      .limit(1);

    if (error) {
      console.error("Order lookup error:", error);

      return NextResponse.json(
        { success: false, error: "Failed to look up order." },
        { status: 500 }
      );
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: orders[0],
    });
  } catch (error) {
    console.error("Order status error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to look up order." },
      { status: 500 }
    );
  }
}