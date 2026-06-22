import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isMasterAuthed =
    request.cookies.get("apexx_master_admin_auth")?.value === "true";

  if (isAdminPage && !isMasterAuthed) {
    return NextResponse.redirect(new URL("/master-admin-login", request.url));
  }

  return NextResponse.next();
}
