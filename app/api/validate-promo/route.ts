import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REGULAR_PROMO_CODES: Record<string, number> = {
  WELCOME10: 0.1,
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

    /*
     * WELCOME10
     * One use per signed-in account.
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
            error: "Sign in to use WELCOME10.",
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

      if (userError || !user?.email) {
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

      const customerEmail = user.email
        .trim()
        .toLowerCase();

      /*
       * Look for previous orders from this account
       * where WELCOME10 was used.
       */
      const {
        data: previousOrders,
        error: orderError,
      } = await supabaseAdmin
        .from("orders")
        .select("id, status, promo_code")
        .ilike("customer_email", customerEmail)
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
              "WELCOME10 eligibility could not be verified.",
          },
          { status: 500 }
        );
      }

      /*
       * Cancelled orders do not count as using
       * WELCOME10.
       */
      const hasUsedWelcome10 = (
        previousOrders || []
      ).some((order) => {
        const status = String(
          order.status || ""
        )
          .trim()
          .toLowerCase();

        return (
          status !== "cancelled" &&
          status !== "canceled"
        );
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
        discountRate: 0.1,
      });
    }

    /*
     * Other regular promo codes.
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
     * Affiliate codes.
     */
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