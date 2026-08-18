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

    const body = await request.json();

    const token = String(
      body.token || ""
    ).trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid affiliate invitation.",
        },
        { status: 400 }
      );
    }

    /*
     * Verify the real authenticated
     * Supabase user.
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
      return NextResponse.json(
        {
          success: false,
          error:
            "Your Apexx account could not be verified.",
        },
        { status: 401 }
      );
    }

    const loggedInEmail =
      user.email
        .trim()
        .toLowerCase();

    /*
     * Find the affiliate invitation.
     */
    const {
      data: affiliate,
      error: affiliateError,
    } = await supabaseAdmin
      .from("affiliates")
      .select(`
        id,
        user_id,
        email,
        status,
        invite_token,
        invite_expires_at
      `)
      .eq(
        "invite_token",
        token
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
            "This affiliate invitation is invalid or has already been used.",
        },
        { status: 404 }
      );
    }

    /*
     * Invitation must still be pending.
     */
    if (
      affiliate.status !==
      "invited"
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

    /*
     * Make sure the invite has
     * not expired.
     */
    if (
      !affiliate.invite_expires_at ||
      new Date(
        affiliate.invite_expires_at
      ).getTime() <
        Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This affiliate invitation has expired.",
        },
        { status: 410 }
      );
    }

    /*
     * CRITICAL:
     *
     * The logged-in Apexx account email
     * must exactly match the email the
     * affiliate invitation was sent to.
     */
    const affiliateEmail =
      String(
        affiliate.email || ""
      )
        .trim()
        .toLowerCase();

    if (
      loggedInEmail !==
      affiliateEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This invitation belongs to a different Apexx account. Please sign in using the email address that received the invitation.",
        },
        { status: 403 }
      );
    }

    /*
     * Also make sure the expected
     * existing user ID matches.
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
     * Activate the affiliate account
     * and permanently invalidate the token.
     */
    const {
      error: updateError,
    } = await supabaseAdmin
      .from("affiliates")
      .update({
        user_id: user.id,
        status: "active",
        invite_token: null,
        invite_expires_at:
          null,
      })
      .eq(
        "id",
        affiliate.id
      );

    if (updateError) {
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

    return NextResponse.json({
      success: true,
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