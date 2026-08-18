import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

const resend = new Resend(
  process.env.RESEND_API_KEY
);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const formData =
      await request.formData();

    const applicationId =
      String(
        formData.get("applicationId") || ""
      ).trim();

    const action =
      String(
        formData.get("action") || ""
      ).trim();

    const reviewNotes =
      String(
        formData.get("reviewNotes") || ""
      ).trim();

    /*
     * ==========================================
     * VALIDATION
     * ==========================================
     */
    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Application ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      action !== "approve" &&
      action !== "reject"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid review action.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * LOAD APPLICATION
     * ==========================================
     */
    const {
      data: application,
      error: applicationError,
    } = await supabaseAdmin
      .from("affiliate_applications")
      .select(`
        id,
        name,
        email,
        organization,
        website,
        audience,
        status,
        affiliate_id
      `)
      .eq("id", applicationId)
      .maybeSingle();

    if (
      applicationError ||
      !application
    ) {
      console.error(
        "Referral application lookup error:",
        applicationError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Referral application could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ==========================================
     * ONLY PENDING APPLICATIONS
     * CAN BE REVIEWED
     * ==========================================
     */
    if (
      application.status !== "pending"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This application has already been reviewed.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * ==========================================
     * REJECT APPLICATION
     * ==========================================
     */
    if (action === "reject") {
      const reviewedAt =
        new Date().toISOString();

      const {
        error: rejectError,
      } = await supabaseAdmin
        .from("affiliate_applications")
        .update({
          status: "rejected",
          reviewed_at: reviewedAt,
          review_notes:
            reviewNotes || null,
          updated_at: reviewedAt,
        })
        .eq("id", application.id)
        .eq("status", "pending");

      if (rejectError) {
        console.error(
          "Referral application rejection error:",
          rejectError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to reject this application.",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * ==========================================
       * SEND REJECTION EMAIL
       * ==========================================
       *
       * Internal admin review notes are
       * intentionally NOT included.
       */
      const safeName =
        escapeHtml(
          String(
            application.name || ""
          )
        );

      const {
        error: rejectionEmailError,
      } =
        await resend.emails.send({
          from:
            "Apexx Biolabs <support@apexxbiolabs.com>",

          to:
            application.email,

          subject:
            "Research Referral Application Update • Apexx Biolabs",

          html: `
            <div style="
              margin:0;
              padding:0;
              background:#f8fbff;
              font-family:Arial,Helvetica,sans-serif;
            ">

              <div style="
                max-width:680px;
                margin:0 auto;
                padding:28px 16px;
              ">

                <div style="
                  overflow:hidden;
                  background:#ffffff;
                  border:1px solid #dbeafe;
                  border-radius:28px;
                  box-shadow:0 18px 45px rgba(30,58,138,0.10);
                ">

                  <!-- HEADER -->
                  <div style="
                    background:linear-gradient(
                      135deg,
                      #eef7ff,
                      #dbeafe,
                      #ffffff
                    );
                    padding:38px 24px;
                    text-align:center;
                    border-bottom:1px solid #dbeafe;
                  ">

                    <p style="
                      margin:0 0 14px;
                      color:#3b82f6;
                      font-size:12px;
                      letter-spacing:4px;
                      text-transform:uppercase;
                    ">
                      Research. Quality. Confidence.
                    </p>

                    <h1 style="
                      margin:0;
                      color:#06111f;
                      font-size:30px;
                      letter-spacing:2px;
                    ">
                      APEXX BIOLABS
                    </h1>

                    <p style="
                      margin:12px 0 0;
                      color:#64748b;
                      font-size:12px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                    ">
                      Research Referral Program
                    </p>

                  </div>

                  <!-- BODY -->
                  <div style="
                    padding:34px 26px;
                    color:#0f172a;
                  ">

                    <p style="
                      margin:0;
                      color:#334155;
                      font-size:15px;
                      line-height:1.7;
                    ">
                      Hi ${safeName},
                    </p>

                    <h2 style="
                      margin:20px 0 0;
                      color:#06111f;
                      font-size:26px;
                      line-height:1.2;
                    ">
                      An update on your application
                    </h2>

                    <p style="
                      margin:16px 0 0;
                      color:#475569;
                      font-size:15px;
                      line-height:1.8;
                    ">
                      Thank you for your interest in the
                      Apexx Biolabs Research Referral Program
                      and for taking the time to submit an
                      application.
                    </p>

                    <div style="
                      margin:26px 0;
                      padding:22px;
                      background:#f8fafc;
                      border:1px solid #e2e8f0;
                      border-radius:18px;
                    ">

                      <p style="
                        margin:0;
                        color:#64748b;
                        font-size:11px;
                        font-weight:bold;
                        letter-spacing:2px;
                        text-transform:uppercase;
                      ">
                        Application Status
                      </p>

                      <p style="
                        margin:9px 0 0;
                        color:#334155;
                        font-size:20px;
                        font-weight:800;
                      ">
                        Not Approved at This Time
                      </p>

                    </div>

                    <p style="
                      margin:0;
                      color:#475569;
                      font-size:15px;
                      line-height:1.8;
                    ">
                      After reviewing your application,
                      we're unable to approve it for the
                      Research Referral Program at this time.
                    </p>

                    <p style="
                      margin:16px 0 0;
                      color:#475569;
                      font-size:15px;
                      line-height:1.8;
                    ">
                      This decision applies only to the
                      Research Referral Program and does not
                      affect any existing Apexx Biolabs
                      account you may have.
                    </p>

                    <div style="
                      margin:28px 0;
                      padding:18px;
                      background:#eff6ff;
                      border-left:4px solid #60a5fa;
                      border-radius:12px;
                    ">

                      <p style="
                        margin:0;
                        color:#1e3a8a;
                        font-size:13px;
                        line-height:1.7;
                      ">
                        Research Referral Program participation
                        is subject to individual review and
                        approval based on program eligibility
                        and research-focused marketing standards.
                      </p>

                    </div>

                    <p style="
                      margin:0;
                      color:#64748b;
                      font-size:13px;
                      line-height:1.7;
                    ">
                      If you have questions regarding the
                      Research Referral Program, you may
                      contact our team at
                      support@apexxbiolabs.com.
                    </p>

                    <!-- FOOTER -->
                    <div style="
                      margin-top:30px;
                      padding-top:24px;
                      border-top:1px solid #e2e8f0;
                    ">

                      <p style="
                        margin:0;
                        color:#334155;
                        font-size:13px;
                        line-height:1.7;
                      ">
                        Apexx Biolabs<br/>
                        support@apexxbiolabs.com<br/>
                        apexxbiolabs.com
                      </p>

                      <p style="
                        margin:18px 0 0;
                        color:#94a3b8;
                        font-size:11px;
                        line-height:1.6;
                      ">
                        Apexx Biolabs products are intended
                        strictly for lawful laboratory research
                        use and are not for human or veterinary use.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          `,
        });

      /*
       * The application remains rejected even
       * if the courtesy email fails.
       *
       * We log the failure rather than changing
       * the review decision.
       */
      if (
        rejectionEmailError
      ) {
        console.error(
          "Referral rejection email error:",
          rejectionEmailError
        );
      }

      return NextResponse.redirect(
        new URL(
          `/admin/affiliate-applications/${application.id}?review=rejected`,
          request.url
        ),
        303
      );
    }

    /*
     * ==========================================
     * APPROVE APPLICATION
     * ==========================================
     */
    const reviewedAt =
      new Date().toISOString();

    const {
      error: approveError,
    } = await supabaseAdmin
      .from("affiliate_applications")
      .update({
        status: "approved",
        reviewed_at: reviewedAt,
        review_notes:
          reviewNotes || null,
        updated_at: reviewedAt,
      })
      .eq("id", application.id)
      .eq("status", "pending");

    if (approveError) {
      console.error(
        "Referral application approval error:",
        approveError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to approve this application.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================
     * REDIRECT TO REFERRAL SETUP
     * ==========================================
     *
     * You still choose:
     *
     * - referral code
     * - customer discount
     * - commission percentage
     *
     * before the invitation is sent.
     */
    const redirectURL =
      new URL(
        "/admin/affiliates/new",
        request.url
      );

    redirectURL.searchParams.set(
      "application_id",
      application.id
    );

    redirectURL.searchParams.set(
      "name",
      application.name
    );

    redirectURL.searchParams.set(
      "email",
      application.email
    );

    if (
      application.organization
    ) {
      redirectURL.searchParams.set(
        "organization",
        application.organization
      );
    }

    return NextResponse.redirect(
      redirectURL,
      303
    );
  } catch (error) {
    console.error(
      "Referral application review error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to review this referral application.",
      },
      {
        status: 500,
      }
    );
  }
}