import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("quantity_discount_tiers")
      .select(
        "id, name, quantity, discount_percent, sort_order"
      )
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("quantity", { ascending: true });

    if (error) {
      console.error(
        "Quantity discount fetch error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tiers: data || [],
    });
  } catch (error) {
    console.error(
      "Quantity discount fetch exception:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load quantity discounts.",
      },
      { status: 500 }
    );
  }
}