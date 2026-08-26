import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = String(searchParams.get("orderId") || "").trim();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Order could not be found." },
        { status: 404 }
      );
    }

    const { data: messages, error } = await supabaseAdmin
      .from("order_customer_messages")
      .select("id, direction, subject, body_text, from_email, to_email, created_at")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Conversation load error:", error);
      return NextResponse.json(
        { success: false, error: "Conversation could not be loaded." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messages: messages || [] });
  } catch (error) {
    console.error("Conversation route error:", error);
    return NextResponse.json(
      { success: false, error: "Conversation could not be loaded." },
      { status: 500 }
    );
  }
}