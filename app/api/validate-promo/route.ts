import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REGULAR_PROMO_CODES: Record<string, number> = {
  FREEDOM10: 0.1,
  PEPTIDEALS: 0.15,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const code = String(body.code || "")
      .trim()
      .toUpperCase();

    if (!code) {
      return NextResponse.json({
        valid: false,
        discountRate: 0,
      });
    }

    const regularRate = REGULAR_PROMO_CODES[code];

    if (regularRate) {
      return NextResponse.json({
        valid: true,
        code,
        discountRate: regularRate,
      });
    }

    const { data: affiliate, error } =
      await supabaseAdmin
        .from("affiliates")
        .select("code, discount_rate")
        .eq("code", code)
        .eq("status", "active")
        .maybeSingle();

    if (error) {
      console.error(
        "Promo validation error:",
        error
      );

      return NextResponse.json(
        {
          valid: false,
          discountRate: 0,
        },
        { status: 500 }
      );
    }

    if (!affiliate) {
      return NextResponse.json({
        valid: false,
        discountRate: 0,
      });
    }

    return NextResponse.json({
      valid: true,
      code: affiliate.code,
      discountRate: Number(
        affiliate.discount_rate || 0
      ),
    });
  } catch (error) {
    console.error(
      "Promo validation error:",
      error
    );

    return NextResponse.json(
      {
        valid: false,
        discountRate: 0,
      },
      { status: 500 }
    );
  }
}