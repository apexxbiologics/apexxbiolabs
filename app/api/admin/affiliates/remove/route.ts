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

export async function POST(request: Request) {
  try {
    const body =
      await request.json();

    const affiliateId =
      String(
        body.affiliateId || ""
      ).trim();

    const action =
      String(
        body.action || ""
      ).trim();

    if (
      !affiliateId ||
      !["archive", "delete"].includes(
        action
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid affiliate action.",
        },
        { status: 400 }
      );
    }

    /*
     * Confirm the affiliate exists.
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
        status
      `)
      .eq(
        "id",
        affiliateId
      )
      .maybeSingle();

    if (
      affiliateError ||
      !affiliate
    ) {
      console.error(
        "Affiliate lookup error:",
        affiliateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            affiliateError?.message ||
            "Affiliate not found.",
        },
        { status: 404 }
      );
    }

    /*
     * ==========================================
     * ARCHIVE AFFILIATE
     * ==========================================
     *
     * Keep the affiliate record and all
     * historical information.
     *
     * Their dashboard API only permits
     * status === "active", so changing this
     * to "archived" blocks affiliate access.
     */
    if (action === "archive") {
      const {
        data: archivedAffiliate,
        error: archiveError,
      } = await supabaseAdmin
        .from("affiliates")
        .update({
          status: "archived",
        })
        .eq(
          "id",
          affiliateId
        )
        .select(`
          id,
          name,
          email,
          code,
          status
        `)
        .single();

      if (archiveError) {
        console.error(
          "Affiliate archive error:",
          archiveError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              archiveError.message ||
              "Unable to archive affiliate.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: "archived",
        affiliate:
          archivedAffiliate,
      });
    }

    /*
     * ==========================================
     * PERMANENT DELETE
     * ==========================================
     *
     * Before allowing permanent deletion,
     * make sure the affiliate has NO linked
     * orders and NO payout records.
     *
     * If they have financial history,
     * they should be archived instead.
     */

    const {
      count: linkedOrdersCount,
      error: linkedOrdersError,
    } = await supabaseAdmin
      .from("orders")
      .select(
        "id",
        {
          count: "exact",
          head: true,
        }
      )
      .eq(
        "affiliate_id",
        affiliateId
      );

    if (linkedOrdersError) {
      console.error(
        "Affiliate linked order check error:",
        linkedOrdersError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            linkedOrdersError.message ||
            "Unable to verify affiliate order history.",
        },
        { status: 500 }
      );
    }

    const {
      count: payoutCount,
      error: payoutCountError,
    } = await supabaseAdmin
      .from("affiliate_payouts")
      .select(
        "id",
        {
          count: "exact",
          head: true,
        }
      )
      .eq(
        "affiliate_id",
        affiliateId
      );

    if (payoutCountError) {
      console.error(
        "Affiliate payout history check error:",
        payoutCountError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            payoutCountError.message ||
            "Unable to verify affiliate payout history.",
        },
        { status: 500 }
      );
    }

    const hasLinkedOrders =
      Number(
        linkedOrdersCount || 0
      ) > 0;

    const hasPayoutHistory =
      Number(
        payoutCount || 0
      ) > 0;

    /*
     * Preserve financial history.
     */
    if (
      hasLinkedOrders ||
      hasPayoutHistory
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This affiliate has linked orders or payout history and cannot be permanently deleted. Archive the affiliate instead so the financial history is preserved.",
        },
        { status: 409 }
      );
    }

    /*
     * Delete ONLY the affiliate profile.
     *
     * Their Supabase Auth user is intentionally
     * left untouched so their normal Apexx
     * customer / rewards account continues
     * to work.
     */
    const {
      error: deleteError,
    } = await supabaseAdmin
      .from("affiliates")
      .delete()
      .eq(
        "id",
        affiliateId
      );

    if (deleteError) {
      console.error(
        "Affiliate delete error:",
        deleteError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            deleteError.message ||
            "Unable to permanently delete affiliate.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: "deleted",
    });
  } catch (error) {
    console.error(
      "Affiliate remove error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update affiliate.",
      },
      { status: 500 }
    );
  }
}