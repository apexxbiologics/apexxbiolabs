import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const failedAttempts = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const currentAttempts = failedAttempts.get(ip) || 0;

    if (currentAttempts >= 5) {
      return NextResponse.json(
        { success: false, locked: true, error: "Too many failed attempts." },
        { status: 423 }
      );
    }

    const isValid =
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD;

    if (!isValid) {
      const nextAttempts = currentAttempts + 1;
      failedAttempts.set(ip, nextAttempts);

      if (nextAttempts >= 5) {
        await resend.emails.send({
          from: "Apexx Biolabs <orders@apexxbiolabs.com>",
          to: "orders@apexxbiolabs.com",
          subject: "Apexx Admin Login Alert",
          html: `
            <h2>Admin Login Lockout</h2>
            <p>Someone failed to log into the Apexx admin dashboard 5 times.</p>
            <p><strong>IP:</strong> ${ip}</p>
            <p><strong>Attempted username:</strong> ${username}</p>
          `,
        });

        return NextResponse.json(
          { success: false, locked: true, error: "Too many failed attempts." },
          { status: 423 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          locked: false,
          attemptsLeft: 5 - nextAttempts,
          error: "Invalid username or password.",
        },
        { status: 401 }
      );
    }

    failedAttempts.delete(ip);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { success: false, error: "Login failed." },
      { status: 500 }
    );
  }
}