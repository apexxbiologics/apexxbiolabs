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
    const formData = await request.formData();

    const name = String(
      formData.get("name") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const code = String(
      formData.get("code") || ""
    )
      .trim()
      .toUpperCase();

    const discountPercent = Number(
      formData.get("discount") || 0
    );

    const commissionPercent = Number(
      formData.get("commission") || 0
    );

    /*
     * Validate required fields.
     */
    if (!name || !email || !code) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, email, and affiliate code are required.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate email format.
     */
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid affiliate email address.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate affiliate code.
     *
     * Allows:
     * A-Z
     * 0-9
     * hyphens
     * underscores
     *
     * 3-30 characters total.
     */
    if (
      !/^[A-Z0-9_-]{3,30}$/.test(code)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Affiliate code must be 3–30 characters and contain only letters, numbers, hyphens, or underscores.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate customer discount.
     */
    if (
      !Number.isFinite(
        discountPercent
      ) ||
      discountPercent < 0 ||
      discountPercent > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid customer discount percentage.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate affiliate commission.
     */
    if (
      !Number.isFinite(
        commissionPercent
      ) ||
      commissionPercent < 0 ||
      commissionPercent > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid affiliate commission percentage.",
        },
        { status: 400 }
      );
    }

    /*
     * Convert percentages into
     * decimal values for Supabase.
     *
     * Example:
     * 15 -> 0.15
     */
    const discountRate =
      discountPercent / 100;

    const commissionRate =
      commissionPercent / 100;

    /*
     * Make sure neither the email
     * nor affiliate code already exists.
     */
    const {
      data: existingAffiliates,
      error: existingError,
    } = await supabaseAdmin
      .from("affiliates")
      .select(
        "id, email, code"
      )
      .or(
        `email.eq.${email},code.eq.${code}`
      )
      .limit(1);

    if (existingError) {
      console.error(
        "Affiliate duplicate check error:",
        existingError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify affiliate information.",
        },
        { status: 500 }
      );
    }

    if (
      existingAffiliates &&
      existingAffiliates.length > 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An affiliate with this email or code already exists.",
        },
        { status: 409 }
      );
    }

    /*
     * Send the affiliate a secure
     * Supabase invitation email.
     *
     * They will be sent to the
     * Apexx setup-password page.
     */
    const {
      data: inviteData,
      error: inviteError,
    } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo:
            "https://apexxbiolabs.com/affiliate/setup-password",

          data: {
            name,
            role: "affiliate",
          },
        }
      );

    if (
      inviteError ||
      !inviteData.user
    ) {
      console.error(
        "Affiliate invite error:",
        inviteError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            inviteError?.message ||
            "Unable to send affiliate invitation.",
        },
        { status: 500 }
      );
    }

    /*
     * Create the affiliate database row.
     *
     * The Supabase Auth user ID is stored
     * as user_id so this affiliate login
     * can only access its own affiliate data.
     */
    const {
      error: affiliateInsertError,
    } = await supabaseAdmin
      .from("affiliates")
      .insert({
        user_id:
          inviteData.user.id,

        name,

        email,

        code,

        discount_rate:
          discountRate,

        commission_rate:
          commissionRate,

        status: "invited",
      });

    /*
     * If the affiliate database row
     * fails, clean up the Auth user
     * that was just created.
     *
     * This prevents an orphaned
     * affiliate login.
     */
    if (
      affiliateInsertError
    ) {
      console.error(
        "Affiliate insert error:",
        affiliateInsertError
      );

      const {
        error: cleanupError,
      } =
        await supabaseAdmin.auth.admin.deleteUser(
          inviteData.user.id
        );

      if (cleanupError) {
        console.error(
          "Affiliate auth cleanup error:",
          cleanupError
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            affiliateInsertError.message ||
            "Unable to create affiliate.",
        },
        { status: 500 }
      );
    }

    /*
     * Send the admin back to the
     * Affiliates page after the invite
     * was successfully created.
     */
    return NextResponse.redirect(
      new URL(
        "/admin/affiliates?invite=success",
        request.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Affiliate invitation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create affiliate invitation.",
      },
      { status: 500 }
    );
  }
}