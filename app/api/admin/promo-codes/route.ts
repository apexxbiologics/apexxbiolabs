
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase environment variables are missing."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function errorResponse(
  message: string,
  status: number = 400
) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// GET: Load all promo codes
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Promo GET error:", error);
      return errorResponse(
        "Unable to load promo codes.",
        500
      );
    }

    return NextResponse.json({
      success: true,
      promoCodes: data ?? [],
    });
  } catch (error) {
    console.error("Promo GET error:", error);
    return errorResponse(
      "Unable to load promo codes.",
      500
    );
  }
}

// POST: Create a promo code
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const code = String(body.code ?? "")
      .trim()
      .toUpperCase();

    const discountType = body.discount_type;
    const discountValue = Number(
      body.discount_value
    );

    if (!/^[A-Z0-9_-]{3,40}$/.test(code)) {
      return errorResponse(
        "Code must contain 3–40 letters, numbers, underscores, or hyphens."
      );
    }

    // Preserve existing checkout codes
    if (
      code === "WELCOME10" ||
      code === "FREEDOM10"
    ) {
      return errorResponse(
        "This code is reserved.",
        409
      );
    }

    if (
      discountType !== "percentage" &&
      discountType !== "fixed"
    ) {
      return errorResponse(
        "Invalid discount type."
      );
    }

    if (
      !Number.isFinite(discountValue) ||
      discountValue <= 0 ||
      (discountType === "percentage" &&
        discountValue > 100) ||
      Math.round(discountValue * 100) !==
        discountValue * 100
    ) {
      return errorResponse(
        "Enter a valid discount amount with no more than two decimal places."
      );
    }

    const startsAt = body.starts_at || null;
    const endsAt = body.ends_at || null;

    const usageLimit =
      body.usage_limit === "" ||
      body.usage_limit == null
        ? null
        : Number(body.usage_limit);

    if (
      (startsAt &&
        !Number.isFinite(Date.parse(startsAt))) ||
      (endsAt &&
        !Number.isFinite(Date.parse(endsAt)))
    ) {
      return errorResponse(
        "Enter valid promotion dates."
      );
    }

    if (
      startsAt &&
      endsAt &&
      Date.parse(endsAt) <= Date.parse(startsAt)
    ) {
      return errorResponse(
        "End date must be after start date."
      );
    }

    if (
      usageLimit !== null &&
      (!Number.isSafeInteger(usageLimit) ||
        usageLimit <= 0)
    ) {
      return errorResponse(
        "Usage limit must be a positive whole number."
      );
    }

    if (
      body.active !== undefined &&
      typeof body.active !== "boolean"
    ) {
      return errorResponse(
        "Invalid active status."
      );
    }

    // Prevent collision with existing affiliate codes
    const { data: affiliates, error: affiliateError } =
      await supabase
        .from("affiliates")
        .select("id")
        .ilike("code", code)
        .limit(1);

    if (affiliateError) {
      console.error(
        "Affiliate code lookup error:",
        affiliateError
      );

      return errorResponse(
        "Unable to verify affiliate code availability.",
        500
      );
    }

    if (affiliates && affiliates.length > 0) {
      return errorResponse(
        "This code is already assigned to an affiliate.",
        409
      );
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .insert({
        code,
        discount_type: discountType,
        discount_value: discountValue,
        starts_at: startsAt,
        ends_at: endsAt,
        usage_limit: usageLimit,
        times_used: 0,
        active: body.active !== false,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Promo POST error:", error);

      if (error.code === "23505") {
        return errorResponse(
          "This promo code already exists.",
          409
        );
      }

      return errorResponse(
        "Unable to create promo code.",
        500
      );
    }

    return NextResponse.json(
      {
        success: true,
        promoCode: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Promo POST error:", error);

    return errorResponse(
      "Unable to create promo code.",
      500
    );
  }
}

// PATCH: Enable or disable a promo code
export async function PATCH(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    if (
      typeof body.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        body.id
      )
    ) {
      return errorResponse(
        "A valid promo code ID is required."
      );
    }

    if (typeof body.active !== "boolean") {
      return errorResponse(
        "Active status must be true or false."
      );
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .update({
        active: body.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Promo PATCH error:", error);

      return errorResponse(
        "Unable to update promo code.",
        500
      );
    }

    if (!data) {
      return errorResponse(
        "Promo code not found.",
        404
      );
    }

    return NextResponse.json({
      success: true,
      promoCode: data,
    });
  } catch (error) {
    console.error("Promo PATCH error:", error);

    return errorResponse(
      "Unable to update promo code.",
      500
    );
  }
}
