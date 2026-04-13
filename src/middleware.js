import { NextResponse } from "next/server";

const AUTH_COOKIE = "super_admin_auth";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/super-admin/login";
  const hasSession = request.cookies.get(AUTH_COOKIE)?.value === "1";

  if (isLogin) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/super-admin", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL("/super-admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin", "/super-admin/:path*"],
};
