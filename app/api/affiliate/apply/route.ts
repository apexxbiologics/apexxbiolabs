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

export async function POST(request: Request) {
  try {
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

    const researchUseAcknowledgement =
      formData.get(
        "research_use_acknowledgement"
      ) === "on";

    const marketingAcknowledgement =
      formData.get(
        "marketing_acknowledgement"
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
        { status: 400 }
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
        { status: 400 }
      );
    }

    /*
     * ==========================================
     * REQUIRE BOTH ACKNOWLEDGEMENTS
     * ==========================================
     */
    if (
      !researchUseAcknowledgement ||
      !marketingAcknowledgement
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must agree to the Research Referral Program requirements before applying.",
        },
        { status: 400 }
      );
    }

    /*
     * ==========================================
     * PREVENT DUPLICATE PENDING APPLICATIONS
     * ==========================================
     */
    const {
      data:
        existingApplication,
      error:
        existingApplicationError,
    } = await supabaseAdmin
      .from(
        "affiliate_applications"
      )
      .select(
        "id, status"
      )
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
      .maybeSingle();

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
        { status: 500 }
      );
    }

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
        { status: 409 }
      );
    }

    /*
     * ==========================================
     * SAVE APPLICATION
     * ==========================================
     */
    const {
      data: application,
      error:
        insertError,
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

        research_use_acknowledgement:
          true,

        marketing_acknowledgement:
          true,

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
        status
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
        { status: 500 }
      );
    }

    /*
     * ==========================================
     * EMAIL APPLICANT
     * ==========================================
     *
     * Application remains valid even if this
     * courtesy email fails.
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
          <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">
            <div style="max-width:680px;margin:0 auto;padding:28px 16px;">

              <div style="overflow:hidden;border:1px solid #dbeafe;border-radius:28px;background:#ffffff;">

                <div style="padding:34px 24px;text-align:center;background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);border-bottom:1px solid #dbeafe;">

                  <p style="margin:0 0 12px;color:#3b82f6;font-size:12px;letter-spacing:4px;text-transform:uppercase;">
                    Apexx Biolabs
                  </p>

                  <h1 style="margin:0;color:#06111f;font-size:30px;">
                    Application Received
                  </h1>

                </div>

                <div style="padding:30px 24px;color:#0f172a;">

                  <p style="margin:0;color:#334155;font-size:15px;line-height:1.7;">
                    Hi ${name},
                  </p>

                  <p style="margin:16px 0 0;color:#475569;font-size:15px;line-height:1.7;">
                    We received your application for the Apexx Biolabs
                    Research Referral Program.
                  </p>

                  <div style="margin:24px 0;padding:20px;border-radius:18px;border:1px solid #bfdbfe;background:#f8fbff;">

                    <p style="margin:0;color:#1e3a8a;font-weight:bold;">
                      Application Status
                    </p>

                    <p style="margin:8px 0 0;color:#2563eb;font-size:18px;font-weight:800;">
                      Pending Review
                    </p>

                  </div>

                  <p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;">
                    Submission does not guarantee acceptance.
                    If approved, you'll receive a separate invitation
                    with instructions for activating your Research Referral account.
                  </p>

                  <p style="margin:24px 0 0;color:#64748b;font-size:12px;line-height:1.7;">
                    Apexx Biolabs products are intended strictly for lawful
                    laboratory research use only and are not for human or veterinary use.
                  </p>

                  <p style="margin:28px 0 0;color:#334155;line-height:1.6;">
                    Apexx Biolabs<br/>
                    support@apexxbiolabs.com
                  </p>

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
          `New Research Referral Application • ${name}`,

        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.6;">

            <h2>
              New Research Referral Application
            </h2>

            <p>
              <strong>Name:</strong>
              ${name}
            </p>

            <p>
              <strong>Email:</strong>
              ${email}
            </p>

            <p>
              <strong>Organization / Platform:</strong>
              ${organization || "Not provided"}
            </p>

            <p>
              <strong>Website / Social:</strong>
              ${website || "Not provided"}
            </p>

            <p>
              <strong>Audience:</strong>
              ${audience}
            </p>

            <p>
              <strong>Description:</strong>
            </p>

            <p>
              ${description}
            </p>

            <p>
              Review this application from the Apexx admin dashboard.
            </p>

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
      { status: 500 }
    );
  }
}