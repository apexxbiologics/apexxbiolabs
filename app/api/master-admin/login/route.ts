import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const failedAttempts = new Map<
  string,
  number
>();

async function createAdminToken() {
  const secret =
    process.env.MASTER_ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "MASTER_ADMIN_SESSION_SECRET is not configured."
    );
  }

  const expiresAt =
    Date.now() + 1000 * 60 * 60 * 8;

  const payload = `admin:${expiresAt}`;

  const encoder = new TextEncoder();

  const key =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );

  const signature =
    await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payload)
    );

  const signatureHex = Array.from(
    new Uint8Array(signature)
  )
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");

  return `${payload}:${signatureHex}`;
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const { username, password } = body;

    const forwardedFor =
      request.headers.get(
        "x-forwarded-for"
      );

    const ip =
      forwardedFor
        ?.split(",")[0]
        ?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const currentAttempts =
      failedAttempts.get(ip) || 0;

    if (currentAttempts >= 5) {
      return NextResponse.json(
        {
          success: false,
          locked: true,
          error:
            "Too many failed attempts.",
        },
        {
          status: 423,
        }
      );
    }

    const storedUsername =
      process.env.MASTER_ADMIN_USERNAME;

    const storedPassword =
      process.env.MASTER_ADMIN_PASSWORD;

    if (
      !storedUsername ||
      !storedPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Master admin credentials are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const isValid =
      username?.trim() ===
        storedUsername.trim() &&
      password === storedPassword;

    if (!isValid) {
      const nextAttempts =
        currentAttempts + 1;

      failedAttempts.set(
        ip,
        nextAttempts
      );

      if (nextAttempts >= 5) {
        try {
          await resend.emails.send({
            from:
              "Apexx Biolabs <orders@apexxbiolabs.com>",
            to:
              "orders@apexxbiolabs.com",
            subject:
              "Apexx Master Admin Login Alert",
            html: `
              <h2>Master Admin Login Lockout</h2>
              <p>Someone failed to log into the Apexx master admin dashboard 5 times.</p>
              <p><strong>IP:</strong> ${ip}</p>
              <p><strong>Attempted username:</strong> ${
                username || "Unknown"
              }</p>
            `,
          });
        } catch (emailError) {
          console.error(
            "Admin alert email error:",
            emailError
          );
        }

        return NextResponse.json(
          {
            success: false,
            locked: true,
            error:
              "Too many failed attempts.",
          },
          {
            status: 423,
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          locked: false,
          attemptsLeft:
            5 - nextAttempts,
          error: `Invalid username or password. ${
            5 - nextAttempts
          } attempts left.`,
        },
        {
          status: 401,
        }
      );
    }

    failedAttempts.delete(ip);

    const adminToken =
      await createAdminToken();

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      "apexx_master_admin_auth",
      adminToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Master admin login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Login failed.",
      },
      {
        status: 500,
      }
    );
  }
}