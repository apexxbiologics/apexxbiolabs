import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const result = await resend.emails.send({
      from: "Apexx Biolabs <orders@apexxbiolabs.com>",
      to: "marcirokicki12x@aol.com",
      subject: "Apexx Test Email",
      html: "<h1>Test email worked</h1><p>Resend is working.</p>",
    });

    console.log("TEST EMAIL RESULT:", result);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("TEST EMAIL ERROR:", error);

    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}