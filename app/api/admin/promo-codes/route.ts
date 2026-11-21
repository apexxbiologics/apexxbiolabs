import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminToken } from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

type AdminClient = ReturnType<typeof getSupabaseAdmin>;

type PromoWindow = {
  id?: string;
  code: string;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
};

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// Authenticate using the existing custom admin login cookie.
async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)apexx_admin_auth=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : undefined;
  if (!(await verifyAdminToken(token))) {
    return errorResponse("Admin sign-in is required or has expired.", 401);
  }
  return null;
}

function parseWindow(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) return undefined;
  return new Date(value).toISOString();
}

function isValidWindow(start: string | null, end: string | null) {
  return !start || !end || Date.parse(start) < Date.parse(end);
}

function windowsOverlap(a: PromoWindow, b: PromoWindow) {
  const aStart = a.starts_at ? Date.parse(a.starts_at) : -Infinity;
  const aEnd = a.ends_at ? Date.parse(a.ends_at) : Infinity;
  const bStart = b.starts_at ? Date.parse(b.starts_at) : -Infinity;
  const bEnd = b.ends_at ? Date.parse(b.ends_at) : Infinity;
  return aStart < bEnd && bStart < aEnd;
}

async function findOverlap(
  supabase: AdminClient,
  promo: PromoWindow,
  excludeId?: string
): Promise<{ conflict: boolean; failed: boolean }> {
  let query = supabase
    .from("promo_codes")
    .select("id, code, starts_at, ends_at, active")
    .eq("code", promo.code)
    .eq("active", true);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) {
    console.error("Promo overlap lookup error:", error);
    return { conflict: false, failed: true };
  }
  return {
    conflict: (data || []).some((existing) => windowsOverlap(promo, existing)),
    failed: false,
  };
}

function databaseError(error: { code?: string; message?: string }, action: string) {
  console.error(`Promo ${action} error:`, error);
  if (error.code === "23P01") {
    return errorResponse(
      "This code already has an enabled promotion during those dates. Change the dates or disable the conflicting promotion.",
      409
    );
  }
  if (error.code === "23505") {
    return errorResponse("A database uniqueness rule still prevents reusing this promo code.", 409);
  }
  if (error.code === "23514") return errorResponse("The promotion date range is invalid.", 400);
  return errorResponse(`Unable to ${action.toLowerCase()} promo code.`, 500);
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const denied = await requireAdmin(request);
    if (denied) return denied;

    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return databaseError(error, "load");
    return NextResponse.json({ success: true, promoCodes: data ?? [] });
  } catch (error) {
    console.error("Promo GET error:", error);
    return errorResponse("Unable to load promo codes.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const denied = await requireAdmin(request);
    if (denied) return denied;

    const body = await request.json();
    const code = String(body.code ?? "").trim().toUpperCase();
    const discountType = body.discount_type;
    const discountValue = Number(body.discount_value);

    if (!/^[A-Z0-9_-]{3,40}$/.test(code)) {
      return errorResponse("Code must contain 3–40 letters, numbers, underscores, or hyphens.");
    }
    if (code === "WELCOME10" || code === "FREEDOM10") {
      return errorResponse("This code is reserved.", 409);
    }
    if (discountType !== "percentage" && discountType !== "fixed") {
      return errorResponse("Invalid discount type.");
    }
    if (
      !Number.isFinite(discountValue) || discountValue <= 0 ||
      (discountType === "percentage" && discountValue > 100) ||
      Math.abs(discountValue * 100 - Math.round(discountValue * 100)) > 1e-7
    ) {
      return errorResponse("Enter a valid discount amount with no more than two decimal places.");
    }

    const startsAt = parseWindow(body.starts_at);
    const endsAt = parseWindow(body.ends_at);
    if (startsAt === undefined || endsAt === undefined) {
      return errorResponse("Enter valid promotion dates.");
    }
    if (!isValidWindow(startsAt, endsAt)) {
      return errorResponse("End date must be after start date.");
    }

    const usageLimit = body.usage_limit === "" || body.usage_limit == null
      ? null : Number(body.usage_limit);
    if (usageLimit !== null && (!Number.isSafeInteger(usageLimit) || usageLimit <= 0)) {
      return errorResponse("Usage limit must be a positive whole number.");
    }
    if (body.active !== undefined && typeof body.active !== "boolean") {
      return errorResponse("Invalid active status.");
    }

    const { data: affiliates, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id")
      .ilike("code", code)
      .limit(1);
    if (affiliateError) {
      console.error("Affiliate code lookup error:", affiliateError);
      return errorResponse("Unable to verify affiliate code availability.", 500);
    }
    if (affiliates && affiliates.length > 0) {
      return errorResponse("This code is already assigned to an affiliate.", 409);
    }

    const active = body.active !== false;
    if (active) {
      const overlap = await findOverlap(supabase, {
        code, starts_at: startsAt, ends_at: endsAt, active,
      });
      if (overlap.failed) return errorResponse("Unable to verify promo code availability.", 500);
      if (overlap.conflict) {
        return errorResponse(
          "This code already has an enabled promotion during the selected dates. Choose another date range or disable the existing promotion.",
          409
        );
      }
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
        active,
      })
      .select("*")
      .single();
    if (error) return databaseError(error, "create");
    return NextResponse.json({ success: true, promoCode: data }, { status: 201 });
  } catch (error) {
    console.error("Promo POST error:", error);
    return errorResponse("Unable to create promo code.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const denied = await requireAdmin(request);
    if (denied) return denied;

    const body = await request.json();
    if (
      typeof body.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id)
    ) {
      return errorResponse("A valid promo code ID is required.");
    }
    if (typeof body.active !== "boolean") {
      return errorResponse("Active status must be true or false.");
    }

    const { data: existing, error: lookupError } = await supabase
      .from("promo_codes")
      .select("id, code, starts_at, ends_at, active")
      .eq("id", body.id)
      .maybeSingle();
    if (lookupError) return databaseError(lookupError, "lookup");
    if (!existing) return errorResponse("Promo code not found.", 404);

    if (body.active) {
      if (existing.ends_at && Date.parse(existing.ends_at) <= Date.now()) {
        return errorResponse("This promotion has expired. Create a new promotion using the same code instead.", 409);
      }
      const overlap = await findOverlap(supabase, {
        id: existing.id,
        code: existing.code,
        starts_at: existing.starts_at,
        ends_at: existing.ends_at,
        active: true,
      }, existing.id);
      if (overlap.failed) return errorResponse("Unable to verify promo code availability.", 500);
      if (overlap.conflict) {
        return errorResponse(
          "Another enabled promotion with this code overlaps these dates. Disable that promotion or create a new date range.",
          409
        );
      }
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .update({ active: body.active, updated_at: new Date().toISOString() })
      .eq("id", body.id)
      .select("*")
      .maybeSingle();
    if (error) return databaseError(error, "update");
    if (!data) return errorResponse("Promo code not found.", 404);
    return NextResponse.json({ success: true, promoCode: data });
  } catch (error) {
    console.error("Promo PATCH error:", error);
    return errorResponse("Unable to update promo code.", 500);
  }
}
