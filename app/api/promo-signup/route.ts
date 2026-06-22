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
        <div style="background:#f8fbff; padding:32px; font-family:Arial, sans-serif;">
          <div style="max-width:640px; margin:0 auto; background:white; border:1px solid #dbeafe; border-radius:28px; padding:36px; text-align:center;">
            <p style="color:#3b82f6; letter-spacing:4px; text-transform:uppercase; font-size:12px;">
              Exclusive Access
            </p>

            <h1 style="color:#081526; font-size:34px; margin:12px 0;">
              Welcome to the Apexx List
            </h1>

            <p style="color:#475569; line-height:1.7; font-size:16px;">
              You’ll now receive promo codes, restock alerts, product launches, and Apexx updates.
            </p>

            <div style="background:#eef7ff; border:1px solid #bfdbfe; border-radius:20px; padding:24px; margin:28px 0;">
              <p style="color:#081526; font-size:18px; font-weight:bold; margin:0 0 8px;">
                Use Code
              </p>

              <p style="color:#2563eb; font-size:32px; font-weight:900; letter-spacing:3px; margin:0;">
                FREEDOM10
              </p>

              <p style="color:#64748b; margin:10px 0 0;">
                Save 10% sitewide.
              </p>
            </div>

            <a 
              href="https://apexxbiolabs.com/products"
              style="display:inline-block; background:#081526; color:white; padding:16px 30px; border-radius:999px; text-decoration:none; font-weight:bold; letter-spacing:2px; text-transform:uppercase;"
            >
              Shop Products
            </a>

            <p style="color:#94a3b8; font-size:12px; margin-top:28px; line-height:1.6;">
              Products are intended strictly for lawful laboratory research use only.
            </p>
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