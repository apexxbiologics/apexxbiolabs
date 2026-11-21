
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REGULAR_PROMO_CODES: Record<string, number> = {
  WELCOME10: 0.1,
};

const CANCELLED_STATUSES = new Set([
  "cancelled",
  "canceled",
]);

function normalizeEmail(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function invalidPromo(
  error: string,
  status: number = 400
) {
  return NextResponse.json(
    {
      valid: false,
      discountRate: 0,
      error,
    },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const code = String(body.code || "")
      .trim()
      .toUpperCase();

    if (!code) {
      return invalidPromo("Enter a promo code.");
    }

    /*
     * WELCOME10
     *
     * Existing behavior preserved:
     * - Signed-in account required
     * - One use per account/email
     * - Cancelled orders do not count
     */
    if (code === "WELCOME10") {
      const authorizationHeader =
        request.headers.get("authorization");

      const accessToken =
        authorizationHeader?.startsWith("Bearer ")
          ? authorizationHeader.slice(7)
          : null;

      if (!accessToken) {
        return invalidPromo(
          "Sign in or create an account to use WELCOME10.",
          401
        );
      }

      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.getUser(
        accessToken
      );

      if (
        userError ||
        !user?.id ||
        !user?.email
      ) {
        console.error(
          "WELCOME10 authentication error:",
          userError
        );

        return invalidPromo(
          "Your account session could not be verified. Please log in again.",
          401
        );
      }

      const authenticatedEmail =
        normalizeEmail(user.email);

      const {
        data: previousOrders,
        error: orderError,
      } = await supabaseAdmin
        .from("orders")
        .select("id, status, promo_code")
        .ilike(
          "customer_email",
          authenticatedEmail
        )
        .ilike("promo_code", "WELCOME10");

      if (orderError) {
        console.error(
          "WELCOME10 order lookup error:",
          orderError
        );

        return invalidPromo(
          "WELCOME10 eligibility could not be verified. Please try again.",
          500
        );
      }

      const hasUsedWelcome10 = (
        previousOrders || []
      ).some((order) => {
        const status = String(
          order.status || ""
        )
          .trim()
          .toLowerCase();

        return !CANCELLED_STATUSES.has(status);
      });

      if (hasUsedWelcome10) {
        return invalidPromo(
          "WELCOME10 has already been used on this account."
        );
      }

      return NextResponse.json({
        valid: true,
        code: "WELCOME10",
        discountRate: 0.1,
        discountType: "percentage",
        discountValue: 10,
      });
    }

    /*
     * Existing affiliate codes.
     *
     * Keep affiliate handling ahead of
     * admin-created promo codes.
     */
    const {
      data: affiliate,
      error: affiliateError,
    } = await supabaseAdmin
      .from("affiliates")
      .select("code, discount_rate")
      .eq("code", code)
      .eq("status", "active")
      .maybeSingle();

    if (affiliateError) {
      console.error(
        "Affiliate promo validation error:",
        affiliateError
      );

      return invalidPromo(
        "Promo code could not be validated. Please try again.",
        500
      );
    }

    if (affiliate) {
      const affiliateDiscountRate = Number(
        affiliate.discount_rate || 0
      );

      if (
        !Number.isFinite(affiliateDiscountRate) ||
        affiliateDiscountRate <= 0
      ) {
        return invalidPromo(
          "Invalid promo code."
        );
      }

      return NextResponse.json({
        valid: true,
        code: String(
          affiliate.code || code
        ).toUpperCase(),
        discountRate: affiliateDiscountRate,
        discountType: "percentage",
        discountValue:
          affiliateDiscountRate * 100,
      });
    }

    /*
     * Admin-created promo codes.
     */
    const {
      data: promo,
      error: promoError,
    } = await supabaseAdmin
      .from("promo_codes")
      .select(
        "id, code, discount_type, discount_value, starts_at, ends_at, usage_limit, active"
      )
.eq("code", code)
.eq("active", true)
.or(`starts_at.is.null,starts_at.lte.${new Date().toISOString()}`)
.or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
.order("created_at", { ascending: false })
.limit(1)
.maybeSingle();

    if (promoError) {
      console.error(
        "Admin promo lookup error:",
        promoError
      );

      return invalidPromo(
        "Promo code could not be validated. Please try again.",
        500
      );
    }

    if (!promo) {
      return invalidPromo(
        "Invalid promo code."
      );
    }

    if (!promo.active) {
      return invalidPromo(
        "This promo code is currently disabled."
      );
    }

    const now = Date.now();

    if (
      promo.starts_at &&
      now < new Date(promo.starts_at).getTime()
    ) {
      return invalidPromo(
        "This promo code is not active yet."
      );
    }

    if (
      promo.ends_at &&
      now >= new Date(promo.ends_at).getTime()
    ) {
      return invalidPromo(
        "This promo code has expired."
      );
    }

    const discountType =
      promo.discount_type;

    const discountValue = Number(
      promo.discount_value
    );

    if (
      !["percentage", "fixed"].includes(
        discountType
      ) ||
      !Number.isFinite(discountValue) ||
      discountValue <= 0 ||
      (discountType === "percentage" &&
        discountValue > 100)
    ) {
      return invalidPromo(
        "This promo code has invalid discount settings."
      );
    }

    /*
     * Per-customer redemption limit.
     *
     * The customer email is supplied by
     * checkout for guest and signed-in users.
     *
     * This is a preliminary eligibility check.
     * The order server must independently
     * verify and enforce the limit.
     */
    const usesPerCustomer =
      promo.usage_limit === null
        ? null
        : Number(promo.usage_limit);

    if (
      usesPerCustomer !== null &&
      (!Number.isSafeInteger(
        usesPerCustomer
      ) ||
        usesPerCustomer <= 0)
    ) {
      return invalidPromo(
        "This promo code has invalid usage settings."
      );
    }

    if (usesPerCustomer !== null) {
      const customerEmail = normalizeEmail(
        body.email
      );

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          customerEmail
        )
      ) {
        return invalidPromo(
          "Enter your checkout email before applying this promo code."
        );
      }

      const {
        data: redemptions,
        error: redemptionError,
      } = await supabaseAdmin
        .from("promo_code_redemptions")
        .select("order_id")
        .eq("promo_code_id", promo.id)
        .eq(
          "customer_email",
          customerEmail
        );

      if (redemptionError) {
        console.error(
          "Promo redemption lookup error:",
          redemptionError
        );

        return invalidPromo(
          "Promo code eligibility could not be verified. Please try again.",
          500
        );
      }

      const redemptionCount =
        redemptions?.length || 0;

      if (
        redemptionCount >= usesPerCustomer
      ) {
        return invalidPromo(
          "You have already reached the usage limit for this promo code."
        );
      }
    }

    /*
     * Return compatible discount data.
     *
     * discountRate remains available for
     * existing percentage-based checkout logic.
     *
     * Fixed discounts must use discountValue,
     * not discountRate.
     */
    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountRate:
        discountType === "percentage"
          ? discountValue / 100
          : 0,
      discountType,
      discountValue,
      usesPerCustomer,
    });
  } catch (error) {
    console.error(
      "Promo validation error:",
      error
    );

    return invalidPromo(
      "Promo code could not be validated. Please try again.",
      500
    );
  }
}
