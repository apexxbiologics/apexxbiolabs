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
 * Find an existing Apexx Supabase Auth
 * account by email.
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

    /*
     * This is present only when the affiliate
     * is being created from an approved
     * Research Referral application.
     */
    const applicationId =
      String(
        formData.get(
          "application_id"
        ) || ""
      ).trim();

    const name =
      String(
        formData.get("name") || ""
      ).trim();

    const email =
      String(
        formData.get("email") || ""
      )
        .trim()
        .toLowerCase();

    const code =
      String(
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
     * BASIC VALIDATION
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
            "Name, email, and referral code are required.",
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
            "Please enter a valid referral partner email address.",
        },
        { status: 400 }
      );
    }

    /*
     * Referral codes:
     * 3–30 characters
     * letters / numbers / - / _
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
            "Referral code must be 3–30 characters and contain only letters, numbers, hyphens, or underscores.",
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
            "Invalid referral commission percentage.",
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
     * VALIDATE REFERRAL APPLICATION
     * ==========================================
     *
     * If this invitation came from an approved
     * application, verify the application BEFORE
     * creating the affiliate.
     */
    let referralApplication:
      | {
          id: string;
          email: string;
          name: string;
          status: string;
          affiliate_id:
            | string
            | null;
        }
      | null = null;

    if (applicationId) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from(
          "affiliate_applications"
        )
        .select(`
          id,
          name,
          email,
          status,
          affiliate_id
        `)
        .eq(
          "id",
          applicationId
        )
        .maybeSingle();

      if (error) {
        console.error(
          "Referral application lookup error:",
          error
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to verify the approved referral application.",
          },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          {
            success: false,
            error:
              "The referral application could not be found.",
          },
          { status: 404 }
        );
      }

      if (
        data.status !==
        "approved"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This referral application has not been approved.",
          },
          { status: 409 }
        );
      }

      if (
        data.affiliate_id
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This referral application is already connected to an affiliate account.",
          },
          { status: 409 }
        );
      }

      const applicationEmail =
        String(
          data.email || ""
        )
          .trim()
          .toLowerCase();

      /*
       * Prevent the approved applicant's
       * email from being changed.
       */
      if (
        applicationEmail !==
        email
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "The affiliate email must match the email on the approved referral application.",
          },
          { status: 403 }
        );
      }

      referralApplication =
        data;
    }

    /*
     * ==========================================
     * CHECK FOR EXISTING AFFILIATE
     * ==========================================
     */
    const {
      data:
        existingAffiliates,
      error:
        existingAffiliateError,
    } = await supabaseAdmin
      .from("affiliates")
      .select(`
        id,
        email,
        code,
        status
      `)
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
            "Unable to verify referral partner information.",
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
            "An affiliate with this email or referral code already exists.",
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
     * GENERATE SECURE INVITATION
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
     * user_id is pre-linked.
     *
     * New Apexx customer:
     * user_id remains null until the person
     * creates their account and claims the invite.
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
            "Unable to create referral invitation.",
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
     * SEND REFERRAL INVITATION EMAIL
     * ==========================================
     */
    const {
      error:
        invitationEmailError,
    } =
      await resend.emails.send({
        from:
          "Apexx Biolabs <support@apexxbiolabs.com>",

        to:
          email,

        subject:
          "You're Invited • Apexx Biolabs Research Referral Program",

        html: `
          <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">

            <div style="max-width:720px;margin:0 auto;padding:28px 16px;">

              <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(30,58,138,0.12);">

                <!-- HEADER -->
                <div
                  style="
                    background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);
                    padding:38px 24px;
                    text-align:center;
                    border-bottom:1px solid #dbeafe;
                  "
                >

                  <p
                    style="
                      margin:0 0 14px;
                      color:#3b82f6;
                      font-size:13px;
                      letter-spacing:4px;
                      text-transform:uppercase;
                    "
                  >
                    Research. Quality. Confidence.
                  </p>

                  <h1
                    style="
                      margin:0;
                      color:#06111f;
                      font-size:34px;
                      letter-spacing:3px;
                    "
                  >
                    APEXX BIOLABS
                  </h1>

                  <p
                    style="
                      margin:12px 0 0;
                      color:#475569;
                      font-size:13px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                    "
                  >
                    Research Referral Program
                  </p>

                </div>

                <!-- BODY -->
                <div
                  style="
                    padding:32px 24px;
                    color:#0f172a;
                  "
                >

                  <!-- INVITATION -->
                  <div
                    style="
                      background:#ffffff;
                      border:1px solid #bfdbfe;
                      border-radius:22px;
                      padding:32px 24px;
                      text-align:center;
                      margin-bottom:30px;
                      box-shadow:0 12px 30px rgba(59,130,246,0.10);
                    "
                  >

                    <p
                      style="
                        margin:0 0 14px;
                        color:#3b82f6;
                        font-size:13px;
                        letter-spacing:4px;
                        text-transform:uppercase;
                      "
                    >
                      Research Referral Invitation
                    </p>

                    <h2
                      style="
                        margin:0;
                        color:#06111f;
                        font-size:34px;
                        font-weight:800;
                        line-height:1.1;
                      "
                    >
                      You're Approved
                    </h2>

                    <p
                      style="
                        margin:14px 0 0;
                        color:#2563eb;
                        font-size:18px;
                        font-weight:700;
                      "
                    >
                      Join the Apexx Biolabs Research Referral Program
                    </p>

                    <p
                      style="
                        margin:18px auto 0;
                        max-width:500px;
                        color:#475569;
                        font-size:15px;
                        line-height:1.7;
                      "
                    >
                      Hi ${name}. Your Research Referral access is ready
                      to activate.
                    </p>

                  </div>

                  <!-- CODE -->
                  <div
                    style="
                      background:linear-gradient(135deg,#eaf4ff,#f8fbff);
                      border:1px solid #bfdbfe;
                      border-radius:22px;
                      padding:28px;
                      text-align:center;
                      margin-bottom:24px;
                    "
                  >

                    <p
                      style="
                        margin:0 0 8px;
                        color:#1e3a8a;
                        font-size:13px;
                        text-transform:uppercase;
                        letter-spacing:2px;
                        font-weight:bold;
                      "
                    >
                      Your Referral Code
                    </p>

                    <p
                      style="
                        margin:0;
                        color:#2563eb;
                        font-size:32px;
                        font-weight:900;
                      "
                    >
                      ${code}
                    </p>

                  </div>

                  <!-- EXISTING ACCOUNT -->
                  <div
                    style="
                      background:#ffffff;
                      border:1px solid #dbeafe;
                      border-radius:20px;
                      padding:24px;
                      margin-bottom:18px;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        color:#06111f;
                        font-size:18px;
                        font-weight:800;
                      "
                    >
                      Already have an Apexx account?
                    </p>

                    <p
                      style="
                        margin:10px 0 0;
                        color:#64748b;
                        font-size:14px;
                        line-height:1.7;
                      "
                    >
                      Sign in using the same email address and password
                      you use for your Apexx Points account. Your referral
                      access will be connected to the same secure login.
                    </p>

                  </div>

                  <!-- NEW ACCOUNT -->
                  <div
                    style="
                      background:#ffffff;
                      border:1px solid #dbeafe;
                      border-radius:20px;
                      padding:24px;
                      margin-bottom:26px;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        color:#06111f;
                        font-size:18px;
                        font-weight:800;
                      "
                    >
                      New to Apexx?
                    </p>

                    <p
                      style="
                        margin:10px 0 0;
                        color:#64748b;
                        font-size:14px;
                        line-height:1.7;
                      "
                    >
                      Create an Apexx account using the same email address
                      that received this invitation. After confirming your
                      account, you'll be able to activate your referral
                      dashboard.
                    </p>

                  </div>

                  <!-- CTA -->
                  <div
                    style="
                      text-align:center;
                      margin-bottom:30px;
                    "
                  >

                    <a
                      href="${claimUrl}"
                      style="
                        display:inline-block;
                        background:#06111f;
                        color:#ffffff;
                        padding:16px 30px;
                        border-radius:999px;
                        text-decoration:none;
                        font-weight:900;
                        font-size:15px;
                        letter-spacing:1px;
                        text-transform:uppercase;
                      "
                    >
                      Accept Referral Invitation
                    </a>

                    <p
                      style="
                        margin:20px auto 0;
                        max-width:520px;
                        color:#64748b;
                        font-size:12px;
                        line-height:1.6;
                        word-break:break-all;
                      "
                    >
                      If the button above does not appear or work,
                      use this secure invitation link:
                    </p>

                    <p
                      style="
                        margin:10px auto 0;
                        max-width:520px;
                        font-size:12px;
                        line-height:1.6;
                        word-break:break-all;
                      "
                    >

                      <a
                        href="${claimUrl}"
                        style="
                          color:#2563eb;
                          text-decoration:underline;
                        "
                      >
                        ${claimUrl}
                      </a>

                    </p>

                  </div>

                  <!-- EXPIRATION -->
                  <div
                    style="
                      background:#fff7ed;
                      border-left:4px solid #f59e0b;
                      padding:18px;
                      border-radius:14px;
                      margin-bottom:24px;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        color:#92400e;
                        font-weight:bold;
                      "
                    >
                      Invitation Expires in ${INVITE_EXPIRATION_HOURS} Hours
                    </p>

                    <p
                      style="
                        margin:8px 0 0;
                        color:#92400e;
                        font-size:13px;
                        line-height:1.6;
                      "
                    >
                      For security, this invitation can only be used once.
                    </p>

                  </div>

                  <!-- RESEARCH POLICY -->
                  <div
                    style="
                      background:#f8fbff;
                      border:1px solid #dbeafe;
                      border-radius:18px;
                      padding:18px;
                      margin-bottom:28px;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        color:#1e3a8a;
                        font-weight:bold;
                      "
                    >
                      Research Referral Standards
                    </p>

                    <p
                      style="
                        margin:8px 0 0;
                        color:#64748b;
                        font-size:13px;
                        line-height:1.7;
                      "
                    >
                      Apexx Biolabs products are intended strictly for
                      lawful laboratory research use and are not for
                      human or veterinary use. Referral partners may not
                      promote personal use or make medical, therapeutic,
                      dosing, or administration claims.
                    </p>

                  </div>

                  <!-- FOOTER -->
                  <div
                    style="
                      border-top:1px solid #dbeafe;
                      padding-top:24px;
                    "
                  >

                    <p
                      style="
                        font-size:12px;
                        color:#64748b;
                        line-height:1.6;
                        margin:0;
                      "
                    >
                      If you were not expecting this invitation,
                      you may safely ignore this email.
                    </p>

                    <p
                      style="
                        margin:24px 0 0;
                        color:#334155;
                        line-height:1.6;
                      "
                    >
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
     * Your existing system already cleans up
     * the affiliate row if Resend fails.
     * We keep that behavior here.
     */
    if (
      invitationEmailError
    ) {
      console.error(
        "Referral invitation email error:",
        invitationEmailError
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

      if (
        cleanupError
      ) {
        console.error(
          "Referral affiliate cleanup error:",
          cleanupError
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Referral invitation could not be sent.",
        },
        { status: 500 }
      );
    }

    /*
     * ==========================================
     * CONNECT APPROVED APPLICATION
     * ==========================================
     *
     * Only do this AFTER the invitation email
     * succeeds.
     *
     * That way an application does not show
     * a connected affiliate when the invite
     * never actually went out.
     */
    if (
      referralApplication
    ) {
      const {
        error:
          applicationLinkError,
      } = await supabaseAdmin
        .from(
          "affiliate_applications"
        )
        .update({
          affiliate_id:
            createdAffiliate.id,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          referralApplication.id
        )
        .eq(
          "status",
          "approved"
        )
        .is(
          "affiliate_id",
          null
        );

      if (
        applicationLinkError
      ) {
        console.error(
          "Referral application linking error:",
          applicationLinkError
        );

        /*
         * The affiliate invitation itself has
         * already been sent successfully.
         *
         * Therefore we DO NOT delete the affiliate.
         * We return an error so the admin knows
         * the application connection needs review.
         */
        return NextResponse.json(
          {
            success: false,
            error:
              "The referral invitation was sent, but the application could not be linked to the affiliate record.",
          },
          { status: 500 }
        );
      }
    }

    /*
     * ==========================================
     * SUCCESS
     * ==========================================
     */

    /*
     * If created from an approved application,
     * return to that application so the admin
     * can immediately see the linked affiliate.
     */
    if (
      referralApplication
    ) {
      return NextResponse.redirect(
        new URL(
          `/admin/affiliate-applications/${referralApplication.id}?invite=sent`,
          request.url
        ),
        303
      );
    }

    /*
     * Keep the existing manual affiliate
     * invitation redirect behavior.
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
      "Referral invitation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create referral invitation.",
      },
      { status: 500 }
    );
  }
}