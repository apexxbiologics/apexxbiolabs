import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

    const orderId =
      searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    const {
      data: order,
      error,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        customer_email,
        first_name,
        last_name,
        payment_method,
        cart,
        subtotal,
        shipping,
        discount,
        reward_discount,
        total,
        status,
        cancellation_reason,
        cancelled_at,
        refund_amount,
        refund_status,
        refund_reason
      `)
      .eq("id", orderId)
      .single();

    if (error || !order) {
      console.error(
        "Order details error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Order details route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load order details.",
      },
      { status: 500 }
    );
  }
}