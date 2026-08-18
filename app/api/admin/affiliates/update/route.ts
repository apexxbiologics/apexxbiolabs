import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const affiliateId = String(
      body.affiliateId || ""
    ).trim();

    const action = String(
      body.action || ""
    ).trim();

    if (!affiliateId || !action) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing affiliate ID or action.",
        },
        { status: 400 }
      );
    }

    /*
     * Load the affiliate first.
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
        discount_rate,
        commission_rate,
        status,
        invite_token,
        invite_expires_at
      `)
      .eq("id", affiliateId)
      .maybeSingle();

    if (
      affiliateError ||
      !affiliate
    ) {
      console.error(
        "Affiliate update lookup error:",
        affiliateError
      );

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
     * EDIT DISCOUNT
     * ==========================================
     */
    if (action === "update_discount") {
      const discountPercent =
        Number(body.discountPercent);

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
              "Invalid discount percentage.",
          },
          { status: 400 }
        );
      }

      const {
        error: updateError,
      } = await supabaseAdmin
        .from("affiliates")
        .update({
          discount_rate:
            discountPercent / 100,
        })
        .eq(
          "id",
          affiliateId
        );

      if (updateError) {
        console.error(
          "Affiliate discount update error:",
          updateError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to update affiliate discount.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * ==========================================
     * EDIT COMMISSION
     * ==========================================
     */
    if (
      action ===
      "update_commission"
    ) {
      const commissionPercent =
        Number(
          body.commissionPercent
        );

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
              "Invalid commission percentage.",
          },
          { status: 400 }
        );
      }

      const {
        error: updateError,
      } = await supabaseAdmin
        .from("affiliates")
        .update({
          commission_rate:
            commissionPercent / 100,
        })
        .eq(
          "id",
          affiliateId
        );

      if (updateError) {
        console.error(
          "Affiliate commission update error:",
          updateError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to update affiliate commission.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * ==========================================
     * SUSPEND AFFILIATE
     * ==========================================
     */
    if (action === "suspend") {
      const {
        error: updateError,
      } = await supabaseAdmin
        .from("affiliates")
        .update({
          status: "suspended",
        })
        .eq(
          "id",
          affiliateId
        );

      if (updateError) {
        console.error(
          "Affiliate suspend error:",
          updateError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to suspend affiliate.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * ==========================================
     * REACTIVATE AFFILIATE
     * ==========================================
     */
    if (action === "reactivate") {
      const {
        error: updateError,
      } = await supabaseAdmin
        .from("affiliates")
        .update({
          status: "active",
        })
        .eq(
          "id",
          affiliateId
        );

      if (updateError) {
        console.error(
          "Affiliate reactivate error:",
          updateError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to reactivate affiliate.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * ==========================================
     * RESEND INVITE
     * ==========================================
     */
    if (action === "resend_invite") {
      if (
        affiliate.status !==
        "invited"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Only invited affiliates can receive another invitation.",
          },
          { status: 400 }
        );
      }

      /*
       * Existing Apexx account flow:
       * affiliate already has a custom
       * claim token.
       */
      if (affiliate.invite_token) {
        const expiresAt =
          affiliate.invite_expires_at
            ? new Date(
                affiliate.invite_expires_at
              )
            : null;

        /*
         * If the old link expired,
         * create a fresh token.
         */
        let inviteToken =
          affiliate.invite_token;

        let inviteExpiresAt =
          affiliate.invite_expires_at;

        if (
          !expiresAt ||
          expiresAt.getTime() <
            Date.now()
        ) {
          const crypto =
            await import("crypto");

          inviteToken =
            crypto.randomBytes(32)
              .toString("hex");

          inviteExpiresAt =
            new Date(
              Date.now() +
                24 *
                  60 *
                  60 *
                  1000
            ).toISOString();

          const {
            error:
              tokenUpdateError,
          } = await supabaseAdmin
            .from("affiliates")
            .update({
              invite_token:
                inviteToken,
              invite_expires_at:
                inviteExpiresAt,
            })
            .eq(
              "id",
              affiliateId
            );

          if (
            tokenUpdateError
          ) {
            console.error(
              "Affiliate invite token refresh error:",
              tokenUpdateError
            );

            return NextResponse.json(
              {
                success: false,
                error:
                  "Unable to refresh affiliate invitation.",
              },
              { status: 500 }
            );
          }
        }

        const claimUrl =
          `https://apexxbiolabs.com/affiliate/claim?token=${encodeURIComponent(
            inviteToken
          )}`;

        const {
          error:
            resendError,
        } =
          await resend.emails.send({
            from:
              "Apexx Biolabs <support@apexxbiolabs.com>",

            to:
              affiliate.email,

            subject:
              "Affiliate Invitation • Apexx Biolabs",

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

                      <div style="background:#ffffff;border:1px solid #bfdbfe;border-radius:22px;padding:32px 24px;text-align:center;margin-bottom:30px;">
                        <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                          Affiliate Invitation
                        </p>

                        <h2 style="margin:0;color:#06111f;font-size:34px;font-weight:800;">
                          Your Invitation Is Ready
                        </h2>

                        <p style="margin:18px auto 0;max-width:500px;color:#475569;font-size:15px;line-height:1.7;">
                          Hi ${affiliate.name}. Use the button below to activate
                          your Apexx Biolabs Affiliate Dashboard.
                        </p>
                      </div>

                      <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:22px;padding:28px;text-align:center;margin-bottom:30px;">

                        <p style="margin:0 0 8px;color:#1e3a8a;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                          Affiliate Code
                        </p>

                        <p style="margin:0 0 22px;color:#2563eb;font-size:30px;font-weight:900;">
                          ${affiliate.code}
                        </p>

                        <a
                          href="${claimUrl}"
                          style="display:inline-block;background:#06111f;color:#ffffff;padding:16px 30px;border-radius:999px;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:1px;text-transform:uppercase;"
                        >
                          Accept Affiliate Invitation
                        </a>
                      </div>

                      <p style="font-size:12px;color:#64748b;line-height:1.6;">
                        This invitation link expires in 24 hours.
                      </p>

                    </div>
                  </div>
                </div>
              </div>
            `,
          });

        if (resendError) {
          console.error(
            "Affiliate resend invite email error:",
            resendError
          );

          return NextResponse.json(
            {
              success: false,
              error:
                "Unable to resend affiliate invitation.",
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
        });
      }

      /*
       * Brand-new affiliate flow.
       *
       * Supabase Auth originally created
       * this invited user, so resend the
       * Supabase invite.
       */
      const {
        data:
          newInviteData,
        error:
          newInviteError,
      } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(
          affiliate.email,
          {
            redirectTo:
              "https://apexxbiolabs.com/affiliate/setup-password",

            data: {
              name:
                affiliate.name,
              role:
                "affiliate",
            },
          }
        );

      if (
        newInviteError ||
        !newInviteData.user
      ) {
        console.error(
          "Supabase affiliate resend invite error:",
          newInviteError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              newInviteError?.message ||
              "Unable to resend affiliate invitation.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unknown affiliate action.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "Affiliate admin update error:",
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