import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
        error: "Enter a promo code.",
      });
    }

    /*
     * WELCOME10
     *
     * - Requires a signed-in Apexx account.
     * - Can only be used once per account.
     * - Cancelled/canceled orders do not count as a use.
     */
    if (code === "WELCOME10") {
      const authorizationHeader =
        request.headers.get("authorization");

      const accessToken =
        authorizationHeader?.startsWith("Bearer ")
          ? authorizationHeader.slice(7)
          : null;

      if (!accessToken) {
        return NextResponse.json(
          {
            valid: false,
            discountRate: 0,
            error:
              "Sign in or create an account to use WELCOME10.",
          },
          { status: 401 }
        );
      }

      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.getUser(
        accessToken
      );

      if (userError || !user?.id || !user?.email) {
        console.error(
          "WELCOME10 authentication error:",
          userError
        );

        return NextResponse.json(
          {
            valid: false,
            discountRate: 0,
            error:
              "Your account session could not be verified. Please log in again.",
          },
          { status: 401 }
        );
      }

      const authenticatedEmail = user.email
        .trim()
        .toLowerCase();

      /*
       * Check previous orders belonging to the signed-in
       * customer's email for prior WELCOME10 usage.
       *
       * ilike makes the email/code comparison
       * case-insensitive.
       */
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

        return NextResponse.json(
          {
            valid: false,
            discountRate: 0,
            error:
              "WELCOME10 eligibility could not be verified. Please try again.",
          },
          { status: 500 }
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
        return NextResponse.json(
          {
            valid: false,
            discountRate: 0,
            error:
              "WELCOME10 has already been used on this account.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        valid: true,
        code: "WELCOME10",
        discountRate:
          REGULAR_PROMO_CODES.WELCOME10,
      });
    }

    /*
     * Other regular Apexx promo codes.
     *
     * WELCOME10 is handled above because it has
     * account-specific eligibility rules.
     */
    const regularRate =
      REGULAR_PROMO_CODES[code];

    if (regularRate) {
      return NextResponse.json({
        valid: true,
        code,
        discountRate: regularRate,
      });
    }

    /*
     * Affiliate promo codes.
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

      return NextResponse.json(
        {
          valid: false,
          discountRate: 0,
          error:
            "Promo code could not be validated. Please try again.",
        },
        { status: 500 }
      );
    }

    if (!affiliate) {
      return NextResponse.json({
        valid: false,
        discountRate: 0,
        error: "Invalid promo code",
      });
    }

    const affiliateDiscountRate = Number(
      affiliate.discount_rate || 0
    );

    if (
      !Number.isFinite(affiliateDiscountRate) ||
      affiliateDiscountRate <= 0
    ) {
      return NextResponse.json({
        valid: false,
        discountRate: 0,
        error: "Invalid promo code",
      });
    }

    return NextResponse.json({
      valid: true,
      code: String(
        affiliate.code || code
      ).toUpperCase(),
      discountRate: affiliateDiscountRate,
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
        error:
          "Promo code could not be validated. Please try again.",
      },
      { status: 500 }
    );
  }
}
