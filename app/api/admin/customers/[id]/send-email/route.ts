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
    } = await supabaseAdmin.auth.admin.getUserById(id);

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

    const escapedMessage = message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br />");

    const { data, error: emailError } =
      await resend.emails.send({
        from:
          "Apexx Biolabs <orders@apexxbiolabs.com>",
        to: user.email,
        replyTo:
          process.env.CUSTOMER_REPLY_TO_EMAIL ||
          "orders@apexxbiolabs.com",
        subject,
        html: `
          <div style="
            background:#071527;
            padding:40px 20px;
            font-family:Arial,Helvetica,sans-serif;
          ">
            <div style="
              max-width:620px;
              margin:0 auto;
              background:#ffffff;
              border-radius:18px;
              overflow:hidden;
            ">
              <div style="
                background:#0b1f36;
                padding:28px 32px;
              ">
                <div style="
                  color:#8ec5ff;
                  font-size:12px;
                  letter-spacing:4px;
                  text-transform:uppercase;
                ">
                  APEXX BIOLABS
                </div>
              </div>

              <div style="
                padding:36px 32px;
                color:#18212f;
                line-height:1.7;
              ">
                <p style="
                  margin-top:0;
                  font-size:16px;
                ">
                  Hi ${firstName},
                </p>

                <div style="
                  font-size:16px;
                ">
                  ${escapedMessage}
                </div>

                <p style="
                  margin-top:32px;
                  color:#667085;
                  font-size:14px;
                ">
                  Apexx Biolabs
                </p>
              </div>
            </div>
          </div>
        `,
        text: `Hi ${firstName},

${message}

Apexx Biolabs`,
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