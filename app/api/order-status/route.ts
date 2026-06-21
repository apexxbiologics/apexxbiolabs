import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, error: "Order number and email are required." },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        "order_number, customer_email, first_name, last_name, total, status, tracking_number, carrier, created_at"
      )
      .eq("order_number", orderNumber.trim())
      .eq("customer_email", email.trim().toLowerCase())
      .single();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order status error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to look up order." },
      { status: 500 }
    );
  }
}