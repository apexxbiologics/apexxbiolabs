import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const subject = String(
      body.subject || ""
    ).trim();

    const message = String(
      body.message || ""
    ).trim();

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject is required.",
        },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required.",
        },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } =
      await supabaseAdmin.auth.admin.getUserById(
        id
      );

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found.",
        },
        { status: 404 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This customer does not have an email address.",
        },
        { status: 400 }
      );
    }

    const firstName =
      user.user_metadata?.first_name ||
      user.user_metadata?.name ||
      "there";

    const safeFirstName =
      escapeHtml(String(firstName));

    const safeMessage =
      escapeHtml(message).replace(
        /\n/g,
        "<br />"
      );

    const {
      data,
      error: emailError,
    } = await resend.emails.send({
      from:
        "Apexx Biolabs <orders@apexxbiolabs.com>",

      to: user.email,

      replyTo:
        process.env.CUSTOMER_REPLY_TO_EMAIL ||
        "orders@apexxbiolabs.com",

      subject,

      html: `
        <div style="
          margin:0;
          padding:0;
          background:#f8fbff;
          font-family:Arial, Helvetica, sans-serif;
        ">
          <div style="
            max-width:720px;
            margin:0 auto;
            padding:28px 16px;
          ">

            <div style="
              background:#ffffff;
              border:1px solid #dbeafe;
              border-radius:28px;
              overflow:hidden;
              box-shadow:0 18px 45px rgba(30,58,138,0.12);
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
                  font-size:13px;
                  letter-spacing:4px;
                  text-transform:uppercase;
                ">
                  Research. Quality. Confidence.
                </p>

                <h1 style="
                  margin:0;
                  color:#06111f;
                  font-size:34px;
                  letter-spacing:3px;
                ">
                  APEXX BIOLABS
                </h1>

                <p style="
                  margin:12px 0 0;
                  color:#475569;
                  font-size:13px;
                  letter-spacing:2px;
                  text-transform:uppercase;
                ">
                  Premium Research Materials
                </p>

              </div>

              <!-- BODY -->
              <div style="
                padding:32px 24px;
                color:#0f172a;
              ">

                <div style="
                  background:#ffffff;
                  border:1px solid #bfdbfe;
                  border-radius:22px;
                  padding:32px 24px;
                  margin-bottom:30px;
                  box-shadow:0 12px 30px rgba(59,130,246,0.10);
                ">

                  <p style="
                    margin:0 0 20px;
                    color:#06111f;
                    font-size:17px;
                    line-height:1.7;
                  ">
                    Hi ${safeFirstName},
                  </p>

                  <div style="
                    color:#475569;
                    font-size:15px;
                    line-height:1.8;
                  ">
                    ${safeMessage}
                  </div>

                </div>

                <!-- SUPPORT BOX -->
                <div style="
                  background:#f8fbff;
                  border:1px solid #bfdbfe;
                  border-radius:20px;
                  padding:22px;
                  margin-bottom:30px;
                ">

                  <h3 style="
                    margin:0 0 10px;
                    color:#06111f;
                    font-size:18px;
                  ">
                    Need Assistance?
                  </h3>

                  <p style="
                    margin:0;
                    color:#475569;
                    font-size:14px;
                    line-height:1.7;
                  ">
                    Simply reply to this email and our team will be happy to assist you.
                  </p>

                </div>

                <!-- FOOTER -->
                <div style="
                  border-top:1px solid #dbeafe;
                  padding-top:24px;
                ">

                  <p style="
                    font-size:12px;
                    color:#64748b;
                    line-height:1.6;
                    margin:0;
                  ">
                    Products sold by Apexx Biolabs are intended strictly
                    for lawful laboratory research use only. Not for human
                    consumption, medical use, veterinary use, diagnosis,
                    treatment, cure, or prevention of disease.
                  </p>

                  <p style="
                    margin:24px 0 0;
                    color:#334155;
                    line-height:1.6;
                    font-size:14px;
                  ">
                    Apexx Biolabs<br/>
                    orders@apexxbiolabs.com<br/>
                    apexxbiolabs.com
                  </p>

                </div>

              </div>

            </div>

          </div>
        </div>
      `,

      text: `Hi ${firstName},

${message}

Need assistance? Simply reply to this email and our team will be happy to assist you.

Apexx Biolabs
orders@apexxbiolabs.com
apexxbiolabs.com

Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only. Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.`,
    });

    if (emailError) {
      console.error(
        "Customer email error:",
        emailError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            emailError.message ||
            "Unable to send email.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email sent to ${user.email}.`,
      emailId: data?.id || null,
    });
  } catch (error) {
    console.error(
      "Send customer email route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while sending the email.",
      },
      { status: 500 }
    );
  }
}