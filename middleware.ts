import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminPage =
    pathname.startsWith("/admin");

  const isAdminApi =
    pathname.startsWith("/api/admin");

  const isProtectedOrderApi =
    pathname ===
    "/api/orders/payment-received";

  const isMasterAuthed =
    request.cookies.get(
      "apexx_master_admin_auth"
    )?.value === "true";

  const requiresAdminAuth =
    isAdminPage ||
    isAdminApi ||
    isProtectedOrderApi;

  if (
    requiresAdminAuth &&
    !isMasterAuthed
  ) {
    /*
     * API routes should return JSON,
     * not redirect to a login page.
     */
    if (
      isAdminApi ||
      isProtectedOrderApi
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    /*
     * Admin pages redirect to the
     * master admin login screen.
     */
    return NextResponse.redirect(
      new URL(
        "/master-admin-login",
        request.url
      )
    );
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