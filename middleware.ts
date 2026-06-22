import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, password] = atob(authValue).split(":");

    if (
      user === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

return NextResponse.redirect(
  new URL("/master-admin-login", request.url)
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};