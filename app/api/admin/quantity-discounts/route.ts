import { NextRequest, NextResponse } from "next/server";
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

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("quantity_discount_tiers")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("quantity", { ascending: true });

    if (error) {
      console.error("Quantity discount GET error:", error);

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
    console.error("Quantity discount GET exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load quantity discounts.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = String(body.id || "").trim();
    const name = String(body.name || "").trim();
    const quantity = Number(body.quantity);
    const discountPercent = Number(body.discount_percent);
    const active = Boolean(body.active);
    const sortOrder = Number(body.sort_order ?? 0);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing discount tier ID.",
        },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Tier name is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity <= 1
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity must be a whole number greater than 1.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(discountPercent) ||
      discountPercent < 0 ||
      discountPercent > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Discount must be between 0% and 100%.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quantity_discount_tiers")
      .update({
        name,
        quantity,
        discount_percent: discountPercent,
        active,
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Quantity discount POST error:", error);

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
      tier: data,
    });
  } catch (error) {
    console.error("Quantity discount POST exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update quantity discount.",
      },
      { status: 500 }
    );
  }
}