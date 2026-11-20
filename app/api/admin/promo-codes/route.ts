
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      promoCodes: data || [],
    });
  } catch (error) {
    console.error("Promo code GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load promo codes.",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Promo code creation is not enabled yet.",
    },
    { status: 501 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      success: false,
      error: "Promo code updates are not enabled yet.",
    },
    { status: 501 }
  );
}
