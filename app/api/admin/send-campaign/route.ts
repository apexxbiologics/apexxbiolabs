import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { subject, title, message, buttonText, buttonUrl } =
      await request.json();

    if (!subject || !title || !message) {
      return NextResponse.json(
        { success: false, error: "Subject, title, and message are required." },
        { status: 400 }
      );
    }

    const { data: subscribers, error } = await supabase
      .from("promo_subscribers")
      .select("email");

    if (error) {
      return NextResponse.json(
        { success: false, error: "Could not load subscribers." },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: "No subscribers found." },
        { status: 400 }
      );
    }

    const html = `
      <div style="margin:0; padding:0; background:#f4f9ff; font-family:Arial, Helvetica, sans-serif;">
        <div style="max-width:680px; margin:0 auto; padding:28px 14px;">
          <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:28px; overflow:hidden; box-shadow:0 18px 45px rgba(30,58,138,0.10);">
            
            <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff); padding:34px 22px; text-align:center; border-bottom:1px solid #dbeafe;">
              <p style="margin:0 0 12px; color:#3b82f6; font-size:12px; letter-spacing:4px; text-transform:uppercase;">
                Apexx Biolabs
              </p>

              <h1 style="margin:0; color:#06111f; font-size:30px; line-height:1.2;">
                ${title}
              </h1>
            </div>

            <div style="padding:30px 22px; color:#0f172a;">
              <p style="margin:0 0 24px; color:#475569; font-size:15px; line-height:1.8; white-space:pre-line;">
                ${message}
              </p>

              ${
                buttonText && buttonUrl
                  ? `
                    <div style="text-align:center; margin:30px 0;">
                      <a
                        href="${buttonUrl}"
                        style="display:inline-block; background:#06111f; color:#ffffff; padding:15px 28px; border-radius:999px; text-decoration:none; font-weight:900; font-size:14px; letter-spacing:1.5px; text-transform:uppercase;"
                      >
                        ${buttonText}
                      </a>
                    </div>
                  `
                  : ""
              }

              <div style="background:#eef7ff; border:1px solid #dbeafe; border-radius:20px; padding:20px; margin-top:28px;">
                <p style="margin:0; color:#475569; font-size:13px; line-height:1.7;">
                  You are receiving this email because you joined the Apexx Biolabs promo list.
                </p>
              </div>

              <div style="border-top:1px solid #dbeafe; padding-top:22px; margin-top:28px;">
                <p style="font-size:11px; color:#64748b; line-height:1.6; margin:0;">
                  Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only.
                  Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.
                </p>

                <p style="margin:20px 0 0; color:#334155; font-size:13px; line-height:1.6;">
                  Apexx Biolabs<br/>
                  orders@apexxbiolabs.com<br/>
                  apexxbiolabs.com
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    const results = await Promise.allSettled(
      subscribers.map((subscriber) =>
        resend.emails.send({
          from: "Apexx Biolabs <orders@apexxbiolabs.com>",
          to: subscriber.email,
          subject,
          html,
        })
      )
    );

    const sent = results.filter((result) => result.status === "fulfilled").length;
    const failed = results.length - sent;

    return NextResponse.json({
      success: true,
      sent,
      failed,
    });
  } catch (error) {
    console.error("Campaign send error:", error);

    return NextResponse.json(
      { success: false, error: "Campaign failed to send." },
      { status: 500 }
    );
  }
}