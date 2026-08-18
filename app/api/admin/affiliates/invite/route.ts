import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { randomBytes } from "crypto";

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

const INVITE_EXPIRATION_HOURS = 24;

/*
 * Find an existing Supabase Auth user
 * by email.
 *
 * If they already have an Apexx points/customer
 * account, we can pre-link the pending affiliate
 * profile to their existing Auth user.
 *
 * If no Auth user exists, user_id remains null
 * until they create an Apexx account and claim
 * the invitation.
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
    /*
     * ==========================================
     * READ FORM
     * ==========================================
     */
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
     * ==========================================
     * VALIDATION
     * ==========================================
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
     * ==========================================
     * CHECK FOR EXISTING AFFILIATE
     * ==========================================
     *
     * Email and affiliate code must both
     * remain unique.
     */
    const {
      data:
        existingAffiliates,
      error:
        existingAffiliateError,
    } = await supabaseAdmin
      .from("affiliates")
      .select(
        "id, email, code, status"
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
     * ==========================================
     * CHECK FOR EXISTING APEXX ACCOUNT
     * ==========================================
     */
    let existingAuthUser =
      null;

    try {
      existingAuthUser =
        await findExistingAuthUser(
          email
        );
    } catch (error) {
      console.error(
        "Existing Apexx Auth lookup error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to check whether this email already has an Apexx account.",
        },
        { status: 500 }
      );
    }

    /*
     * ==========================================
     * GENERATE ONE-TIME INVITATION
     * ==========================================
     */
    const inviteToken =
      randomBytes(32)
        .toString("hex");

    const inviteExpiresAt =
      new Date(
        Date.now() +
          INVITE_EXPIRATION_HOURS *
            60 *
            60 *
            1000
      ).toISOString();

    /*
     * ==========================================
     * CREATE PENDING AFFILIATE
     * ==========================================
     *
     * Existing Apexx account:
     * user_id = their existing Auth ID
     *
     * Brand-new person:
     * user_id = null
     *
     * When a brand-new person creates an
     * Apexx account and claims the invitation,
     * /api/affiliate/claim sets user_id.
     */
    const {
      data:
        createdAffiliate,
      error:
        affiliateInsertError,
    } = await supabaseAdmin
      .from("affiliates")
      .insert({
        user_id:
          existingAuthUser?.id ||
          null,

        name,

        email,

        code,

        discount_rate:
          discountRate,

        commission_rate:
          commissionRate,

        status:
          "invited",

        invite_token:
          inviteToken,

        invite_expires_at:
          inviteExpiresAt,
      })
      .select(`
        id,
        name,
        email,
        code,
        status,
        invite_expires_at
      `)
      .single();

    if (
      affiliateInsertError ||
      !createdAffiliate
    ) {
      console.error(
        "Affiliate insert error:",
        affiliateInsertError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            affiliateInsertError?.message ||
            "Unable to create affiliate invitation.",
        },
        { status: 500 }
      );
    }

    /*
     * ==========================================
     * BUILD CLAIM URL
     * ==========================================
     */
    const claimUrl =
      `https://apexxbiolabs.com/affiliate/claim?token=${encodeURIComponent(
        inviteToken
      )}`;

    /*
     * ==========================================
     * SEND AFFILIATE INVITATION
     * ==========================================
     *
     * EVERY affiliate now receives the same
     * invitation regardless of whether they
     * already have an Apexx account.
     *
     * The claim page handles both situations.
     */
    const {
      error:
        affiliateInviteEmailError,
    } =
      await resend.emails.send({
        from:
          "Apexx Biolabs <support@apexxbiolabs.com>",

        to:
          email,

        subject:
          "You're Invited • Apexx Biolabs Affiliate Program",

        html: `
          <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">

            <div style="max-width:720px;margin:0 auto;padding:28px 16px;">

              <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(30,58,138,0.12);">

                <!-- HEADER -->

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

                <!-- BODY -->

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

                  <!-- CODE -->

                  <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:22px;padding:28px;text-align:center;margin-bottom:24px;">

                    <p style="margin:0 0 8px;color:#1e3a8a;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                      Your Affiliate Code
                    </p>

                    <p style="margin:0;color:#2563eb;font-size:32px;font-weight:900;">
                      ${code}
                    </p>

                  </div>

                  <!-- ACCOUNT OPTIONS -->

                  <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:24px;margin-bottom:18px;">

                    <p style="margin:0;color:#06111f;font-size:18px;font-weight:800;">
                      Already have an Apexx account?
                    </p>

                    <p style="margin:10px 0 0;color:#64748b;font-size:14px;line-height:1.7;">
                      Sign in using the same email address and password
                      you use for your Apexx Points account.
                      Your rewards account and Affiliate Dashboard will
                      remain separate while using the same secure login.
                    </p>

                  </div>

                  <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:24px;margin-bottom:26px;">

                    <p style="margin:0;color:#06111f;font-size:18px;font-weight:800;">
                      New to Apexx?
                    </p>

                    <p style="margin:10px 0 0;color:#64748b;font-size:14px;line-height:1.7;">
                      Create an Apexx account using the same email address
                      where you received this invitation.
                      After confirming your account, you'll be able to
                      activate your Affiliate Dashboard.
                    </p>

                  </div>

                  <!-- CTA -->

                  <div style="text-align:center;margin-bottom:30px;">

                    <a
                      href="${claimUrl}"
                      style="display:inline-block;background:#06111f;color:#ffffff;padding:16px 30px;border-radius:999px;text-decoration:none;font-weight:900;font-size:15px;letter-spacing:1px;text-transform:uppercase;"
                    >
                      Accept Affiliate Invitation
                    </a>

                    <!-- FALLBACK LINK -->

                    <p style="margin:20px auto 0;max-width:520px;color:#64748b;font-size:12px;line-height:1.6;word-break:break-all;">
                      If the button above does not appear or work,
                      use this secure invitation link:
                    </p>

                    <p style="margin:10px auto 0;max-width:520px;font-size:12px;line-height:1.6;word-break:break-all;">
                      <a
                        href="${claimUrl}"
                        style="color:#2563eb;text-decoration:underline;"
                      >
                        ${claimUrl}
                      </a>
                    </p>

                  </div>

                  <!-- EXPIRATION -->

                  <div style="background:#fff7ed;border-left:4px solid #f59e0b;padding:18px;border-radius:14px;margin-bottom:30px;">

                    <p style="margin:0;color:#92400e;font-weight:bold;">
                      Invitation Expires in 24 Hours
                    </p>

                    <p style="margin:8px 0 0;color:#92400e;font-size:13px;line-height:1.6;">
                      For security, this invitation can only be used once
                      and expires ${INVITE_EXPIRATION_HOURS} hours after it was sent.
                    </p>

                  </div>

                  <!-- FOOTER -->

                  <div style="border-top:1px solid #dbeafe;padding-top:24px;">

                    <p style="font-size:12px;color:#64748b;line-height:1.6;margin:0;">
                      This invitation was sent because you were selected
                      to join the Apexx Biolabs Affiliate Program.
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

    /*
     * ==========================================
     * EMAIL FAILURE CLEANUP
     * ==========================================
     *
     * If the email cannot be delivered through
     * Resend, remove the pending affiliate profile
     * so you can try again cleanly.
     *
     * We do NOT delete any Apexx Auth user.
     */
    if (
      affiliateInviteEmailError
    ) {
      console.error(
        "Affiliate invitation email error:",
        affiliateInviteEmailError
      );

      const {
        error:
          cleanupError,
      } = await supabaseAdmin
        .from("affiliates")
        .delete()
        .eq(
          "id",
          createdAffiliate.id
        );

      if (cleanupError) {
        console.error(
          "Affiliate invite cleanup error:",
          cleanupError
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Affiliate invitation could not be sent.",
        },
        { status: 500 }
      );
    }

    /*
     * ==========================================
     * SUCCESS
     * ==========================================
     */
    return NextResponse.redirect(
      new URL(
        existingAuthUser
          ? "/admin/affiliates?invite=existing-user"
          : "/admin/affiliates?invite=new-user",
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