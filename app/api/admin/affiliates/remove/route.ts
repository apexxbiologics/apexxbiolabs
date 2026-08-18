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
      return NextResponse.json(
        {
          success: false,
          error:
            "Affiliate not found.",
        },
        { status: 404 }
      );
    }

    /*
     * ==========================================
     * ARCHIVE
     * ==========================================
     *
     * Keep the affiliate record and all
     * financial history, but disable affiliate
     * dashboard access.
     */
    if (action === "archive") {
      const {
        error: archiveError,
      } = await supabaseAdmin
        .from("affiliates")
        .update({
          status: "archived",
          invite_token: null,
          invite_expires_at: null,
        })
        .eq(
          "id",
          affiliateId
        );

      if (archiveError) {
        console.error(
          "Affiliate archive error:",
          archiveError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to archive affiliate.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: "archived",
      });
    }

    /*
     * ==========================================
     * DELETE
     * ==========================================
     *
     * Only allow permanent deletion when the
     * affiliate has NO linked affiliate orders
     * and NO payout history.
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
            "Unable to verify affiliate payout history.",
        },
        { status: 500 }
      );
    }

    if (
      Number(
        linkedOrdersCount || 0
      ) > 0 ||
      Number(
        payoutCount || 0
      ) > 0
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
     * Delete only the affiliate profile.
     *
     * IMPORTANT:
     * We do NOT delete their Supabase Auth user.
     * Their normal Apexx points/customer account
     * stays intact.
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
          "Unable to update affiliate.",
      },
      { status: 500 }
    );
  }
}