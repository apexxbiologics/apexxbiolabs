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

export async function GET(request: Request) {
  try {
    const authorizationHeader =
      request.headers.get("authorization");

    const accessToken =
      authorizationHeader?.startsWith("Bearer ")
        ? authorizationHeader.slice(7)
        : null;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    /*
     * Verify the user with Supabase Auth.
     */
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(
      accessToken
    );

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your affiliate session could not be verified.",
        },
        { status: 401 }
      );
    }

    /*
     * Find the affiliate tied to this login.
     */
    const {
      data: affiliate,
      error: affiliateError,
    } = await supabaseAdmin
      .from("affiliates")
      .select(`
        id,
        name,
        email,
        code,
        discount_rate,
        commission_rate,
        status,
        created_at
      `)
      .eq("user_id", user.id)
      .maybeSingle();

    if (
      affiliateError ||
      !affiliate
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Affiliate account not found.",
        },
        { status: 404 }
      );
    }

    if (
      affiliate.status !== "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            affiliate.status ===
            "suspended"
              ? "Your affiliate account is suspended."
              : "Your affiliate account is not active.",
        },
        { status: 403 }
      );
    }

    /*
     * Pull ONLY the order fields needed
     * for affiliate reporting.
     *
     * No names.
     * No customer emails.
     * No addresses.
     * No cart/product information.
     */
    const {
      data: orders,
      error: ordersError,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        created_at,
        subtotal,
        discount,
        total,
        status,
        affiliate_commission
      `)
      .eq(
        "affiliate_id",
        affiliate.id
      )
      .order(
        "created_at",
        { ascending: false }
      );

    if (ordersError) {
      console.error(
        "Affiliate dashboard order error:",
        ordersError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load affiliate activity.",
        },
        { status: 500 }
      );
    }

    const safeOrders =
      orders || [];

    /*
     * These statuses count as
     * confirmed/earned commission.
     */
    const confirmedStatuses = [
      "paid",
      "shipped",
      "payment received",
    ];

    /*
     * These should not count toward
     * pending or confirmed commission.
     */
    const excludedStatuses = [
      "cancelled",
      "canceled",
      "refunded",
    ];

    let generatedSales = 0;
    let pendingCommission = 0;
    let confirmedCommission = 0;

    const sanitizedOrders =
      safeOrders.map((order) => {
        const status = String(
          order.status || ""
        ).toLowerCase();

        const commission =
          Number(
            order.affiliate_commission ||
              0
          );

        const qualifyingSale =
          Math.max(
            0,
            Number(
              order.subtotal || 0
            ) -
              Number(
                order.discount || 0
              )
          );

        if (
          !excludedStatuses.includes(
            status
          )
        ) {
          generatedSales +=
            qualifyingSale;
        }

        if (
          confirmedStatuses.includes(
            status
          )
        ) {
          confirmedCommission +=
            commission;
        } else if (
          !excludedStatuses.includes(
            status
          )
        ) {
          pendingCommission +=
            commission;
        }

        return {
          orderNumber:
            order.order_number,

          createdAt:
            order.created_at,

          qualifyingSale,

          commission,

          status:
            order.status,
        };
      });

    return NextResponse.json({
      success: true,

      affiliate: {
        name:
          affiliate.name,

        email:
          affiliate.email,

        code:
          affiliate.code,

        discountRate:
          Number(
            affiliate.discount_rate ||
              0
          ),

        commissionRate:
          Number(
            affiliate.commission_rate ||
              0
          ),

        status:
          affiliate.status,

        createdAt:
          affiliate.created_at,
      },

      stats: {
        codeUses:
          sanitizedOrders.length,

        generatedSales:
          Number(
            generatedSales.toFixed(2)
          ),

        pendingCommission:
          Number(
            pendingCommission.toFixed(
              2
            )
          ),

        confirmedCommission:
          Number(
            confirmedCommission.toFixed(
              2
            )
          ),
      },

      orders:
        sanitizedOrders,
    });
  } catch (error) {
    console.error(
      "Affiliate dashboard error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load affiliate dashboard.",
      },
      { status: 500 }
    );
  }
}