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

/*
 * Keep this synchronized with the version
 * displayed on:
 *
 * /research-referral/terms
 */
const TERMS_VERSION = "1.0";

/*
 * Prevent applicant-controlled text from being
 * interpreted as HTML inside notification emails.
 */
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
    /*
     * ==========================================
     * READ APPLICATION
     * ==========================================
     */
    const formData =
      await request.formData();

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

    const organization =
      String(
        formData.get("organization") || ""
      ).trim();

    const website =
      String(
        formData.get("website") || ""
      ).trim();

    const audience =
      String(
        formData.get("audience") || ""
      ).trim();

    const description =
      String(
        formData.get("description") || ""
      ).trim();

    /*
     * ONE agreement checkbox.
     *
     * This replaces:
     *
     * research_use_acknowledgement
     * marketing_acknowledgement
     */
    const termsAcknowledgement =
      formData.get(
        "terms_acknowledgement"
      ) === "on";

    /*
     * ==========================================
     * VALIDATE REQUIRED FIELDS
     * ==========================================
     */
    if (
      !name ||
      !email ||
      !audience ||
      !description
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please complete all required application fields.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * VALIDATE EMAIL
     * ==========================================
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
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * REQUIRE TERMS ACCEPTANCE
     * ==========================================
     */
    if (
      !termsAcknowledgement
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must read and agree to the Research Referral Program Terms before applying.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * VALIDATE AUDIENCE VALUE
     * ==========================================
     */
    const allowedAudiences = [
      "laboratory",
      "research-community",
      "professional-network",
      "educational",
      "other",
    ];

    if (
      !allowedAudiences.includes(
        audience
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select a valid research audience.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * LIMIT EXCESSIVELY LARGE INPUTS
     * ==========================================
     */
    if (
      name.length > 150 ||
      organization.length > 250 ||
      website.length > 500 ||
      description.length > 5000
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "One or more application fields are too long.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * PREVENT DUPLICATE PENDING /
     * APPROVED APPLICATIONS
     * ==========================================
     */
    const {
      data:
        existingApplications,
      error:
        existingApplicationError,
    } = await supabaseAdmin
      .from(
        "affiliate_applications"
      )
      .select(`
        id,
        status
      `)
      .eq(
        "email",
        email
      )
      .in(
        "status",
        [
          "pending",
          "approved",
        ]
      )
      .limit(1);

    if (
      existingApplicationError
    ) {
      console.error(
        "Affiliate application duplicate check error:",
        existingApplicationError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify your application status.",
        },
        {
          status: 500,
        }
      );
    }

    const existingApplication =
      existingApplications?.[0];

    if (
      existingApplication
    ) {
      const message =
        existingApplication.status ===
        "approved"
          ? "This email already has an approved Research Referral application."
          : "An application from this email is already pending review.";

      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        {
          status: 409,
        }
      );
    }

    /*
     * ==========================================
     * RECORD TERMS ACCEPTANCE TIME
     * ==========================================
     */
    const termsAcceptedAt =
      new Date().toISOString();

    /*
     * ==========================================
     * SAVE APPLICATION
     * ==========================================
     */
    const {
      data: application,
      error: insertError,
    } = await supabaseAdmin
      .from(
        "affiliate_applications"
      )
      .insert({
        name,
        email,

        organization:
          organization || null,

        website:
          website || null,

        audience,

        description,

        /*
         * New single agreement record.
         */
        terms_acknowledgement:
          true,

        terms_version:
          TERMS_VERSION,

        terms_accepted_at:
          termsAcceptedAt,

        status:
          "pending",
      })
      .select(`
        id,
        created_at,
        name,
        email,
        organization,
        website,
        audience,
        description,
        status,
        terms_acknowledgement,
        terms_version,
        terms_accepted_at
      `)
      .single();

    if (
      insertError ||
      !application
    ) {
      console.error(
        "Affiliate application insert error:",
        insertError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to submit your application.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================
     * SAFE EMAIL CONTENT
     * ==========================================
     */
    const safeName =
      escapeHtml(name);

    const safeEmail =
      escapeHtml(email);

    const safeOrganization =
      escapeHtml(
        organization ||
          "Not provided"
      );

    const safeWebsite =
      escapeHtml(
        website ||
          "Not provided"
      );

    const safeAudience =
      escapeHtml(audience);

    const safeDescription =
      escapeHtml(description)
        .replace(
          /\n/g,
          "<br/>"
        );

    /*
     * ==========================================
     * EMAIL APPLICANT
     * ==========================================
     *
     * The application remains saved even if
     * this courtesy email fails.
     * ==========================================
     */
    const {
      error:
        applicantEmailError,
    } =
      await resend.emails.send({
        from:
          "Apexx Biolabs <support@apexxbiolabs.com>",

        to:
          email,

        subject:
          "Research Referral Application Received • Apexx Biolabs",

        html: `
          <div
            style="
              margin:0;
              padding:0;
              background:#f8fbff;
              font-family:Arial,Helvetica,sans-serif;
            "
          >

            <div
              style="
                max-width:680px;
                margin:0 auto;
                padding:28px 16px;
              "
            >

              <div
                style="
                  overflow:hidden;
                  border:1px solid #dbeafe;
                  border-radius:28px;
                  background:#ffffff;
                  box-shadow:0 18px 45px rgba(30,58,138,0.10);
                "
              >

                <!-- HEADER -->
                <div
                  style="
                    padding:36px 24px;
                    text-align:center;
                    background:linear-gradient(
                      135deg,
                      #eef7ff,
                      #dbeafe,
                      #ffffff
                    );
                    border-bottom:1px solid #dbeafe;
                  "
                >

                  <p
                    style="
                      margin:0 0 12px;
                      color:#3b82f6;
                      font-size:12px;
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
                      font-size:30px;
                      letter-spacing:2px;
                    "
                  >
                    APEXX BIOLABS
                  </h1>

                  <p
                    style="
                      margin:12px 0 0;
                      color:#64748b;
                      font-size:12px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                    "
                  >
                    Research Referral Program
                  </p>

                </div>

                <!-- CONTENT -->
                <div
                  style="
                    padding:32px 26px;
                    color:#0f172a;
                  "
                >

                  <p
                    style="
                      margin:0;
                      color:#334155;
                      font-size:15px;
                      line-height:1.7;
                    "
                  >
                    Hi ${safeName},
                  </p>

                  <h2
                    style="
                      margin:18px 0 0;
                      color:#06111f;
                      font-size:27px;
                      line-height:1.2;
                    "
                  >
                    Application Received
                  </h2>

                  <p
                    style="
                      margin:16px 0 0;
                      color:#475569;
                      font-size:15px;
                      line-height:1.8;
                    "
                  >
                    We received your application for the
                    Apexx Biolabs Research Referral Program.
                  </p>

                  <!-- STATUS -->
                  <div
                    style="
                      margin:26px 0;
                      padding:22px;
                      border-radius:18px;
                      border:1px solid #bfdbfe;
                      background:#f8fbff;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        color:#1e3a8a;
                        font-size:11px;
                        font-weight:bold;
                        letter-spacing:2px;
                        text-transform:uppercase;
                      "
                    >
                      Application Status
                    </p>

                    <p
                      style="
                        margin:8px 0 0;
                        color:#2563eb;
                        font-size:19px;
                        font-weight:800;
                      "
                    >
                      Pending Review
                    </p>

                  </div>

                  <p
                    style="
                      margin:0;
                      color:#64748b;
                      font-size:14px;
                      line-height:1.8;
                    "
                  >
                    Submission does not guarantee acceptance.
                    If your application is approved, you will
                    receive a separate invitation with
                    instructions for activating your Research
                    Referral account.
                  </p>

                  <!-- TERMS -->
                  <div
                    style="
                      margin:26px 0;
                      padding:18px;
                      background:#eff6ff;
                      border-left:4px solid #60a5fa;
                      border-radius:12px;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        color:#1e3a8a;
                        font-size:13px;
                        font-weight:bold;
                      "
                    >
                      Program Terms Accepted
                    </p>

                    <p
                      style="
                        margin:7px 0 0;
                        color:#64748b;
                        font-size:12px;
                        line-height:1.7;
                      "
                    >
                      Research Referral Program Terms
                      Version ${TERMS_VERSION} were accepted
                      with your application.
                    </p>

                  </div>

                  <p
                    style="
                      margin:24px 0 0;
                      color:#64748b;
                      font-size:12px;
                      line-height:1.7;
                    "
                  >
                    Apexx Biolabs products are intended strictly
                    for lawful laboratory research use only and
                    are not for human or veterinary use.
                  </p>

                  <div
                    style="
                      margin-top:30px;
                      padding-top:24px;
                      border-top:1px solid #e2e8f0;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        color:#334155;
                        font-size:13px;
                        line-height:1.7;
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

    if (
      applicantEmailError
    ) {
      console.error(
        "Affiliate application confirmation email error:",
        applicantEmailError
      );
    }

    /*
     * ==========================================
     * EMAIL ADMIN
     * ==========================================
     */
    const {
      error:
        adminEmailError,
    } =
      await resend.emails.send({
        from:
          "Apexx Biolabs <support@apexxbiolabs.com>",

        to:
          "support@apexxbiolabs.com",

        subject:
          `New Research Referral Application • ${safeName}`,

        html: `
          <div
            style="
              margin:0;
              padding:30px;
              background:#f8fbff;
              font-family:Arial,Helvetica,sans-serif;
              color:#0f172a;
            "
          >

            <div
              style="
                max-width:680px;
                margin:0 auto;
                background:#ffffff;
                border:1px solid #dbeafe;
                border-radius:24px;
                padding:30px;
              "
            >

              <p
                style="
                  margin:0;
                  color:#3b82f6;
                  font-size:11px;
                  font-weight:bold;
                  letter-spacing:3px;
                  text-transform:uppercase;
                "
              >
                Apexx Admin
              </p>

              <h2
                style="
                  margin:12px 0 24px;
                  color:#06111f;
                "
              >
                New Research Referral Application
              </h2>

              <p>
                <strong>Name:</strong><br/>
                ${safeName}
              </p>

              <p>
                <strong>Email:</strong><br/>
                ${safeEmail}
              </p>

              <p>
                <strong>Website / Platform:</strong><br/>
                ${safeOrganization}
              </p>

              <p>
                <strong>Handle or Link:</strong><br/>
                ${safeWebsite}
              </p>

              <p>
                <strong>Research Audience:</strong><br/>
                ${safeAudience}
              </p>

              <p>
                <strong>Referral Description:</strong>
              </p>

              <div
                style="
                  padding:16px;
                  background:#f8fafc;
                  border-radius:12px;
                  line-height:1.7;
                "
              >
                ${safeDescription}
              </div>

              <div
                style="
                  margin-top:24px;
                  padding:16px;
                  border:1px solid #bfdbfe;
                  background:#eff6ff;
                  border-radius:12px;
                "
              >

                <strong>
                  Terms Accepted
                </strong>

                <br/>

                Version:
                ${TERMS_VERSION}

                <br/>

                Accepted:
                ${escapeHtml(
                  termsAcceptedAt
                )}

              </div>

              <p
                style="
                  margin-top:24px;
                  color:#64748b;
                "
              >
                Review this application from the
                Apexx Admin Dashboard.
              </p>

            </div>

          </div>
        `,
      });

    if (
      adminEmailError
    ) {
      console.error(
        "Affiliate application admin email error:",
        adminEmailError
      );
    }

    /*
     * ==========================================
     * SUCCESS
     * ==========================================
     */
    return NextResponse.redirect(
      new URL(
        "/research-referral?application=success",
        request.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Affiliate application error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to submit your Research Referral application.",
      },
      {
        status: 500,
      }
    );
  }
}