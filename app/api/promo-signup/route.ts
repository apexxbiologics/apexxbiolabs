import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase.from("promo_subscribers").insert([
      {
        email: cleanEmail,
      },
    ]);

    if (error?.code === "23505") {
      return NextResponse.json({
        success: false,
        message: "You're already subscribed.",
      });
    }

    if (error) {
      return NextResponse.json(
        { success: false, message: "Signup failed" },
        { status: 500 }
      );
    }

    await resend.emails.send({
      from: "Apexx Biolabs <orders@apexxbiolabs.com>",
      to: cleanEmail,
      subject: "Welcome to the Apexx List",
      html: `
  <div style="margin:0; padding:0; background:#f4f9ff; font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:680px; margin:0 auto; padding:28px 14px;">

      <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:28px; overflow:hidden; box-shadow:0 18px 45px rgba(30,58,138,0.10);">

        <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff); padding:34px 22px; text-align:center; border-bottom:1px solid #dbeafe;">
          <p style="margin:0 0 12px; color:#3b82f6; font-size:12px; letter-spacing:4px; text-transform:uppercase;">
            Welcome To
          </p>

          <h1 style="margin:0; color:#06111f; font-size:32px; letter-spacing:2px;">
            APEXX BIOLABS
          </h1>

          <p style="margin:12px 0 0; color:#475569; font-size:14px; line-height:1.6;">
            You’re officially on the Apexx List.
          </p>
        </div>

        <div style="padding:30px 22px; color:#0f172a;">

          <h2 style="margin:0 0 14px; color:#06111f; font-size:26px; line-height:1.2;">
            Thanks for joining us.
          </h2>

          <p style="margin:0 0 18px; color:#475569; font-size:15px; line-height:1.7;">
            We’re glad to have you here. You’ll receive early access to Apexx Biolabs promo codes, restock alerts, product launches, and important research-use updates.
          </p>

          <div style="background:#f8fbff; border:1px solid #bfdbfe; border-radius:22px; padding:22px; margin:26px 0; text-align:center;">
            <p style="margin:0 0 10px; color:#1e3a8a; font-size:12px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;">
              Your Welcome Code
            </p>

            <div style="display:inline-block; max-width:100%; box-sizing:border-box; background:#eef7ff; border:1px solid #bfdbfe; border-radius:18px; padding:14px 18px; margin:0 auto;">
              <p style="margin:0; color:#2563eb; font-size:26px; font-weight:900; letter-spacing:2px; line-height:1.1; word-break:break-word;">
                FREEDOM10
              </p>
            </div>

            <p style="margin:14px 0 0; color:#64748b; font-size:14px; line-height:1.5;">
              Save 10% sitewide on your next order.
            </p>
          </div>

          <div style="text-align:center; margin:28px 0;">
            <a 
              href="https://apexxbiolabs.com/products"
              style="display:inline-block; background:#06111f; color:#ffffff; padding:15px 28px; border-radius:999px; text-decoration:none; font-weight:900; font-size:14px; letter-spacing:1.5px; text-transform:uppercase;"
            >
              Shop Products
            </a>
          </div>

          <div style="background:#eef7ff; border:1px solid #dbeafe; border-radius:20px; padding:20px; margin-top:28px;">
            <h3 style="margin:0 0 10px; color:#06111f; font-size:17px;">
              What you can expect:
            </h3>

            <p style="margin:0; color:#475569; font-size:14px; line-height:1.8;">
              • Exclusive promo codes<br/>
              • Restock and product launch alerts<br/>
              • COA and batch documentation updates<br/>
              • Research-use-only product updates
            </p>
          </div>

          <p style="margin:24px 0 0; color:#64748b; font-size:13px; line-height:1.6;">
            Thank you for supporting Apexx Biolabs. We’re committed to quality, transparency, and a clean research-use customer experience.
          </p>

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
`,
    });

    return NextResponse.json({
      success: true,
      message: "✓ Welcome to the Apexx List.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}