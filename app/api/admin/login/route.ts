import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000;

type LoginAttemptRecord = {
  attempts: number;
  lockedUntil: number | null;
};

const loginAttempts = new Map<string, LoginAttemptRecord>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string" ? body.username.trim() : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          locked: false,
          error: "Username and password are required.",
        },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const now = Date.now();

    const record = loginAttempts.get(ip) || {
      attempts: 0,
      lockedUntil: null,
    };

    /*
     * If the lockout has expired, clear the attempts
     * and allow the user to try again.
     */
    if (record.lockedUntil && now >= record.lockedUntil) {
      loginAttempts.delete(ip);
      record.attempts = 0;
      record.lockedUntil = null;
    }

    /*
     * The IP is still temporarily locked.
     */
    if (record.lockedUntil && now < record.lockedUntil) {
      const secondsRemaining = Math.ceil(
        (record.lockedUntil - now) / 1000
      );

      const minutesRemaining = Math.ceil(secondsRemaining / 60);

      return NextResponse.json(
        {
          success: false,
          locked: true,
          retryAfter: secondsRemaining,
          error: `Too many failed attempts. Try again in approximately ${minutesRemaining} minute${
            minutesRemaining === 1 ? "" : "s"
          }.`,
        },
        {
          status: 423,
          headers: {
            "Retry-After": secondsRemaining.toString(),
          },
        }
      );
    }

    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedUsername || !expectedPassword) {
      console.error(
        "ADMIN_USERNAME or ADMIN_PASSWORD is missing from the environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          locked: false,
          error: "Admin login is not configured correctly.",
        },
        { status: 500 }
      );
    }

    const isValid =
      username === expectedUsername &&
      password === expectedPassword;

    /*
     * Successful login:
     * clear all failed attempts for this IP.
     */
    if (isValid) {
      loginAttempts.delete(ip);

      return NextResponse.json({
        success: true,
        locked: false,
      });
    }

    const nextAttempts = record.attempts + 1;

    /*
     * Fifth failed attempt:
     * temporarily lock the IP.
     */
    if (nextAttempts >= MAX_ATTEMPTS) {
      const lockedUntil = now + LOCKOUT_DURATION_MS;

      loginAttempts.set(ip, {
        attempts: MAX_ATTEMPTS,
        lockedUntil,
      });

      try {
        await resend.emails.send({
          from: "Apexx Biolabs <orders@apexxbiolabs.com>",
          to: "orders@apexxbiolabs.com",
          subject: "Apexx Admin Login Alert",
          html: `
            <h2>Admin Login Lockout</h2>
            <p>An IP address failed to log in to the Apexx admin orders dashboard five times.</p>
            <p><strong>IP:</strong> ${ip}</p>
            <p><strong>Attempted username:</strong> ${username}</p>
            <p><strong>Lock duration:</strong> 10 minutes</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          `,
        });
      } catch (emailError) {
        console.error(
          "Failed to send admin lockout email:",
          emailError
        );
      }

      return NextResponse.json(
        {
          success: false,
          locked: true,
          retryAfter: LOCKOUT_DURATION_MS / 1000,
          error:
            "Too many failed attempts. Access is locked for 10 minutes.",
        },
        {
          status: 423,
          headers: {
            "Retry-After": String(
              LOCKOUT_DURATION_MS / 1000
            ),
          },
        }
      );
    }

    loginAttempts.set(ip, {
      attempts: nextAttempts,
      lockedUntil: null,
    });

    return NextResponse.json(
      {
        success: false,
        locked: false,
        attemptsLeft: MAX_ATTEMPTS - nextAttempts,
        error: "Invalid username or password.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        locked: false,
        error: "Login failed.",
      },
      { status: 500 }
    );
  }
}