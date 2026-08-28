import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyAdminToken(
  token: string
) {
  try {
    const secret =
      process.env
        .MASTER_ADMIN_SESSION_SECRET;

    if (!secret) {
      return false;
    }

    const parts = token.split(":");

    if (parts.length !== 3) {
      return false;
    }

    const [
      role,
      expiresAtString,
      receivedSignature,
    ] = parts;

    if (role !== "admin") {
      return false;
    }

    const expiresAt = Number(
      expiresAtString
    );

    if (
      !expiresAt ||
      Date.now() > expiresAt
    ) {
      return false;
    }

    const payload =
      `${role}:${expiresAtString}`;

    const encoder =
      new TextEncoder();

    const key =
      await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        {
          name: "HMAC",
          hash: "SHA-256",
        },
        false,
        ["verify"]
      );

    const signatureBytes =
      new Uint8Array(
        receivedSignature
          .match(/.{1,2}/g)
          ?.map((byte) =>
            parseInt(byte, 16)
          ) || []
      );

    if (
      signatureBytes.length !== 32
    ) {
      return false;
    }

    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(payload)
    );
  } catch {
    return false;
  }
}

export async function middleware(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  const isAdminPage =
    pathname.startsWith("/admin");

  const isAdminApi =
    pathname.startsWith(
      "/api/admin"
    );

  const isProtectedOrderApi =
    pathname ===
    "/api/orders/payment-received";

  const token =
    request.cookies.get(
      "apexx_master_admin_auth"
    )?.value;

  const isMasterAuthed =
    token
      ? await verifyAdminToken(token)
      : false;

  const requiresAdminAuth =
    isAdminPage ||
    isAdminApi ||
    isProtectedOrderApi;

  if (
    requiresAdminAuth &&
    !isMasterAuthed
  ) {
    if (
      isAdminApi ||
      isProtectedOrderApi
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const response =
      NextResponse.redirect(
        new URL(
          "/master-admin-login",
          request.url
        )
      );

    /*
     * Delete invalid or expired
     * admin cookies.
     */
    response.cookies.delete(
      "apexx_master_admin_auth"
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/orders/payment-received",
  ],
};