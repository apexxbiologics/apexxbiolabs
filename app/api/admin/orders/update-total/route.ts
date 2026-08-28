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

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const orderId = String(
      body.orderId || ""
    ).trim();

    const newTotal = Number(
      body.total
    );

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(
        newTotal
      ) ||
      newTotal < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid order total is required.",
        },
        {
          status: 400,
        }
      );
    }

    const roundedTotal =
      Number(
        newTotal.toFixed(2)
      );

    const {
      data: order,
      error,
    } = await supabaseAdmin
      .from("orders")
      .update({
        total: roundedTotal,
      })
      .eq("id", orderId)
      .select(
        `
          id,
          order_number,
          total,
          status
        `
      )
      .single();

    if (
      error ||
      !order
    ) {
      console.error(
        "Update order total error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to update the order total.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Order total updated.",
      order,
    });
  } catch (error) {
    console.error(
      "Update order total route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while updating the order total.",
      },
      {
        status: 500,
      }
    );
  }
}
