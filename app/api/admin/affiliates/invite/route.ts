import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

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
 * Find an existing Supabase Auth user
 * by email.
 *
 * This stays server-side because admin
 * Auth methods require elevated access.
 */
async function findExistingAuthUser(
  email: string
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  let page = 1;
  const perPage = 1000;

  while (true) {
    const {
      data,
      error,
    } =
      await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

    if (error) {
      throw error;
    }

    const users =
      data?.users || [];

    const matchingUser =
      users.find(
        (user) =>
          String(
            user.email || ""
          )
            .trim()
            .toLowerCase() ===
          normalizedEmail
      );

    if (matchingUser) {
      return matchingUser;
    }

    if (
      users.length <
      perPage
    ) {
      break;
    }

    page += 1;
  }

  return null;
}

export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

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

    const discountPercent =
      Number(
        formData.get(
          "discount"
        ) || 0
      );

    const commissionPercent =
      Number(
        formData.get(
          "commission"
        ) || 0
      );

    /*
     * Required fields.
     */
    if (
      !name ||
      !email ||
      !code
    ) {
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
     * Email validation.
     */
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email
      )
    ) {
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
     * Affiliate code validation.
     */
    if (
      !/^[A-Z0-9_-]{3,30}$/.test(
        code
      )
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
     * Customer discount.
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
     * Affiliate commission.
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

    const discountRate =
      discountPercent / 100;

    const commissionRate =
      commissionPercent / 100;

    /*
     * Make sure this person/code is not
     * already an affiliate.
     */
    const {
      data:
        existingAffiliates,
      error:
        existingAffiliateError,
    } = await supabaseAdmin
      .from("affiliates")
      .select(
        "id, email, code"
      )
      .or(
        `email.eq.${email},code.eq.${code}`
      )
      .limit(1);

    if (
      existingAffiliateError
    ) {
      console.error(
        "Affiliate duplicate check error:",
        existingAffiliateError
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
      existingAffiliates.length >
        0
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
     * Check whether this email already
     * belongs to an Apexx Auth account.
     */
    let existingAuthUser;

    try {
      existingAuthUser =
        await findExistingAuthUser(
          email
        );
    } catch (authLookupError) {
      console.error(
        "Existing Auth user lookup error:",
        authLookupError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to check the existing Apexx account.",
        },
        { status: 500 }
      );
    }

    /*
     * ===================================================
     * CASE 1:
     * EXISTING APEXX POINTS/CUSTOMER ACCOUNT
     * ===================================================
     */
    if (existingAuthUser) {
      /*
       * Create a strong one-time affiliate
       * activation token.
       */
      const inviteToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      /*
       * Invitation expires after 24 hours.
       */
      const inviteExpiresAt =
        new Date(
          Date.now() +
            24 *
              60 *
              60 *
              1000
        ).toISOString();

      /*
       * Create the affiliate profile.
       *
       * It is linked to the existing Apexx
       * Auth account, but remains INVITED.
       *
       * That means they still cannot use the
       * affiliate dashboard until they accept
       * the affiliate invitation.
       */
      const {
        error:
          affiliateInsertError,
      } = await supabaseAdmin
        .from("affiliates")
        .insert({
          user_id:
            existingAuthUser.id,

          name,

          email,

          code,

          discount_rate:
            discountRate,

          commission_rate:
            commissionRate,

          status: "invited",

          invite_token:
            inviteToken,

          invite_expires_at:
            inviteExpiresAt,
        });

      if (
        affiliateInsertError
      ) {
        console.error(
          "Existing user affiliate insert error:",
          affiliateInsertError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              affiliateInsertError.message ||
              "Unable to create affiliate invitation.",
          },
          { status: 500 }
        );
      }

      const claimUrl =
        `https://apexxbiolabs.com/affiliate/claim?token=${encodeURIComponent(
          inviteToken
        )}`;

      /*
       * Send separate Affiliate Invitation
       * through Resend.
       *
       * This is NOT a password reset.
       * Their existing Apexx password remains
       * completely unchanged.
       */
      const {
        error:
          affiliateInviteEmailError,
      } =
        await resend.emails.send({
          from:
            "Apexx Biolabs <support@apexxbiolabs.com>",

          to: email,

          subject:
            "You're Invited • Apexx Biolabs Affiliate Program",

          html: `
            <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">
              <div style="max-width:720px;margin:0 auto;padding:28px 16px;">

                <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(30,58,138,0.12);">

                  <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);padding:38px 24px;text-align:center;border-bottom:1px solid #dbeafe;">

                    <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                      Research. Quality. Confidence.
                    </p>

                    <h1 style="margin:0;color:#06111f;font-size:34px;letter-spacing:3px;">
                      APEXX BIOLABS
                    </h1>

                    <p style="margin:12px 0 0;color:#475569;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                      Affiliate Program
                    </p>

                  </div>

                  <div style="padding:32px 24px;color:#0f172a;">

                    <div style="background:#ffffff;border:1px solid #bfdbfe;border-radius:22px;padding:32px 24px;text-align:center;margin-bottom:30px;box-shadow:0 12px 30px rgba(59,130,246,0.10);">

                      <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                        Affiliate Invitation
                      </p>

                      <h2 style="margin:0;color:#06111f;font-size:34px;font-weight:800;line-height:1.1;">
                        You're Invited
                      </h2>

                      <p style="margin:14px 0 0;color:#2563eb;font-size:18px;font-weight:700;">
                        Join the Apexx Biolabs Affiliate Program
                      </p>

                      <p style="margin:18px auto 0;max-width:500px;color:#475569;font-size:15px;line-height:1.7;">
                        Hi ${name}. You've been selected to join the
                        Apexx Biolabs Affiliate Program.
                      </p>

                    </div>

                    <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:22px;padding:28px;text-align:center;margin-bottom:30px;">

                      <p style="margin:0 0 8px;color:#1e3a8a;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                        Your Affiliate Code
                      </p>

                      <p style="margin:0 0 20px;color:#2563eb;font-size:30px;font-weight:900;">
                        ${code}
                      </p>

                      <p style="margin:0 auto 22px;max-width:500px;color:#475569;font-size:15px;line-height:1.7;">
                        We recognized that this email already belongs to an
                        Apexx account. Your rewards account will stay intact.
                        Accept this invitation to activate the Affiliate
                        Dashboard for your account.
                      </p>

                      <a
                        href="${claimUrl}"
                        style="display:inline-block;background:#06111f;color:#ffffff;padding:16px 30px;border-radius:999px;text-decoration:none;font-weight:900;font-size:15px;letter-spacing:1px;text-transform:uppercase;"
                      >
                        Accept Affiliate Invitation
                      </a>

                    </div>

                    <div style="background:#ffffff;border-left:4px solid #60a5fa;padding:18px;border-radius:14px;margin-bottom:30px;">

                      <p style="margin:0;color:#06111f;font-weight:bold;">
                        Already Have Apexx Rewards?
                      </p>

                      <p style="margin:8px 0 0;color:#64748b;font-size:14px;line-height:1.6;">
                        That's okay. Your Apexx Rewards and Affiliate
                        Program information remain separate.
                        You simply use the same secure Apexx login to access both.
                      </p>

                    </div>

                    <div style="border-top:1px solid #dbeafe;padding-top:24px;">

                      <p style="font-size:12px;color:#64748b;line-height:1.6;margin:0;">
                        This affiliate invitation expires in 24 hours.
                        If you were not expecting this invitation,
                        you may safely ignore this email.
                      </p>

                      <p style="margin:24px 0 0;color:#334155;line-height:1.6;">
                        Apexx Biolabs<br/>
                        support@apexxbiolabs.com<br/>
                        apexxbiolabs.com
                      </p>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          `,
        });

      if (
        affiliateInviteEmailError
      ) {
        console.error(
          "Existing user affiliate invite email error:",
          affiliateInviteEmailError
        );

        /*
         * Remove the affiliate row if the
         * invitation email itself could not
         * be sent.
         */
        await supabaseAdmin
          .from("affiliates")
          .delete()
          .eq(
            "email",
            email
          );

        return NextResponse.json(
          {
            success: false,
            error:
              "Affiliate profile was created, but the invitation email could not be sent.",
          },
          { status: 500 }
        );
      }

      return NextResponse.redirect(
        new URL(
          "/admin/affiliates?invite=existing-user",
          request.url
        ),
        303
      );
    }

    /*
     * ===================================================
     * CASE 2:
     * BRAND-NEW APEXX USER
     * ===================================================
     *
     * Keep the normal Supabase invite flow.
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
            role:
              "affiliate",
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
     * Create affiliate row for new user.
     */
    const {
      error:
        affiliateInsertError,
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

        invite_token: null,

        invite_expires_at:
          null,
      });

    if (
      affiliateInsertError
    ) {
      console.error(
        "Affiliate insert error:",
        affiliateInsertError
      );

      /*
       * Only delete Auth users that WE
       * just created through this invite.
       *
       * Existing customer accounts are never
       * deleted by this route.
       */
      const {
        error:
          cleanupError,
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