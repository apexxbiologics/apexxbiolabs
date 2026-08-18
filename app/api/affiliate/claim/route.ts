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

/*
 * Affiliate invitations expire after 24 hours.
 *
 * IMPORTANT:
 * The invite creation route should set
 * invite_expires_at when the invitation is created.
 */
const INVITE_EXPIRATION_HOURS = 24;

export async function POST(request: Request) {
  try {
    /*
     * ==========================================
     * GET AUTHORIZATION TOKEN
     * ==========================================
     */
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
          error:
            "You must sign in to your Apexx account first.",
        },
        { status: 401 }
      );
    }

    /*
     * ==========================================
     * GET AFFILIATE INVITE TOKEN
     * ==========================================
     */
    const body =
      await request.json();

    const token =
      String(
        body.token || ""
      ).trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This affiliate invitation is invalid.",
        },
        { status: 400 }
      );
    }

    /*
     * ==========================================
     * VERIFY LOGGED-IN SUPABASE USER
     * ==========================================
     *
     * We verify the access token server-side.
     */
    const {
      data: { user },
      error: userError,
    } =
      await supabaseAdmin.auth.getUser(
        accessToken
      );

    if (
      userError ||
      !user ||
      !user.email
    ) {
      console.error(
        "Affiliate claim user verification error:",
        userError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Your Apexx account could not be verified. Please sign in again.",
        },
        { status: 401 }
      );
    }

    const loggedInEmail =
      user.email
        .trim()
        .toLowerCase();

    /*
     * ==========================================
     * FIND AFFILIATE INVITATION
     * ==========================================
     */
    const {
      data: affiliate,
      error: affiliateError,
    } = await supabaseAdmin
      .from("affiliates")
      .select(`
        id,
        user_id,
        name,
        email,
        code,
        status,
        invite_token,
        invite_expires_at,
        created_at
      `)
      .eq(
        "invite_token",
        token
      )
      .maybeSingle();

    if (
      affiliateError
    ) {
      console.error(
        "Affiliate invitation lookup error:",
        affiliateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify this affiliate invitation.",
        },
        { status: 500 }
      );
    }

    if (!affiliate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This affiliate invitation is invalid, expired, or has already been used.",
        },
        { status: 404 }
      );
    }

    /*
     * ==========================================
     * CHECK INVITATION STATUS
     * ==========================================
     */
    if (
      affiliate.status !==
      "invited"
    ) {
      if (
        affiliate.status ===
        "active"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This affiliate invitation has already been activated.",
          },
          { status: 409 }
        );
      }

      if (
        affiliate.status ===
        "suspended"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This affiliate account is currently suspended.",
          },
          { status: 403 }
        );
      }

      if (
        affiliate.status ===
        "archived"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This affiliate invitation is no longer active.",
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "This affiliate invitation cannot be activated.",
        },
        { status: 409 }
      );
    }

    /*
     * ==========================================
     * CHECK INVITATION EXPIRATION
     * ==========================================
     *
     * invite_expires_at is the authoritative
     * expiration timestamp.
     *
     * Invitations should expire 24 hours
     * after they are generated.
     */
    if (
      !affiliate.invite_expires_at
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `This invitation does not have a valid expiration time. Please request a new affiliate invitation. Invitations expire after ${INVITE_EXPIRATION_HOURS} hours.`,
        },
        { status: 410 }
      );
    }

    const expiresAt =
      new Date(
        affiliate.invite_expires_at
      );

    /*
     * Protect against an invalid date
     * being stored in the database.
     */
    if (
      Number.isNaN(
        expiresAt.getTime()
      )
    ) {
      console.error(
        "Invalid affiliate invite expiration:",
        affiliate.invite_expires_at
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "This invitation has an invalid expiration time. Please request a new invitation.",
        },
        { status: 410 }
      );
    }

    if (
      expiresAt.getTime() <=
      Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `This affiliate invitation has expired. Invitations are valid for ${INVITE_EXPIRATION_HOURS} hours. Please request a new invitation.`,
        },
        { status: 410 }
      );
    }

    /*
     * ==========================================
     * VERIFY EMAIL MATCH
     * ==========================================
     *
     * This is CRITICAL.
     *
     * The Apexx account that accepts the
     * invitation must use the EXACT email
     * address the invitation was sent to.
     */
    const affiliateEmail =
      String(
        affiliate.email || ""
      )
        .trim()
        .toLowerCase();

    if (
      !affiliateEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This affiliate invitation does not have a valid email address.",
        },
        { status: 400 }
      );
    }

    if (
      loggedInEmail !==
      affiliateEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `This invitation was sent to ${affiliateEmail}. Please sign in or create your Apexx account using that same email address.`,
        },
        { status: 403 }
      );
    }

    /*
     * ==========================================
     * VERIFY EXISTING USER LINK
     * ==========================================
     *
     * If this invite was already associated
     * with a specific Supabase user ID,
     * make sure the same user is claiming it.
     */
    if (
      affiliate.user_id &&
      affiliate.user_id !==
        user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This invitation is connected to a different Apexx account.",
        },
        { status: 403 }
      );
    }

    /*
     * ==========================================
     * ACTIVATE AFFILIATE
     * ==========================================
     *
     * Link the authenticated Apexx account
     * to this affiliate profile.
     *
     * Then permanently invalidate the invite
     * token so it cannot be reused.
     */
    const {
      data: activatedAffiliate,
      error: updateError,
    } = await supabaseAdmin
      .from("affiliates")
      .update({
        user_id:
          user.id,

        status:
          "active",

        /*
         * Destroy the invitation after use.
         */
        invite_token:
          null,

        invite_expires_at:
          null,
      })
      .eq(
        "id",
        affiliate.id
      )
      .eq(
        "status",
        "invited"
      )
      .eq(
        "invite_token",
        token
      )
      .select(`
        id,
        name,
        email,
        code,
        status
      `)
      .maybeSingle();

    if (
      updateError
    ) {
      console.error(
        "Affiliate claim update error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to activate your affiliate account.",
        },
        { status: 500 }
      );
    }

    /*
     * If another request somehow claimed
     * the same token first, the guarded
     * update above returns no row.
     */
    if (
      !activatedAffiliate
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This affiliate invitation has already been used or is no longer valid.",
        },
        { status: 409 }
      );
    }

    /*
     * ==========================================
     * SUCCESS
     * ==========================================
     */
    return NextResponse.json({
      success: true,

      affiliate: {
        id:
          activatedAffiliate.id,

        name:
          activatedAffiliate.name,

        email:
          activatedAffiliate.email,

        code:
          activatedAffiliate.code,

        status:
          activatedAffiliate.status,
      },
    });
  } catch (error) {
    console.error(
      "Affiliate claim error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to activate affiliate account.",
      },
      { status: 500 }
    );
  }
}