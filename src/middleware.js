import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const TEACHER_PUBLIC_PATHS = ["/teacher/login", "/teacher/signup", "/teacher/verify"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/super-admin/login";
  const isTeacherArea = pathname === "/teacher" || pathname.startsWith("/teacher/");
  const isTeacherPublic = TEACHER_PUBLIC_PATHS.includes(pathname);

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isLogin) {
    if (user) {
      return NextResponse.redirect(new URL("/super-admin", request.url));
    }
    return response;
  }

  if (isTeacherArea) {
    // Role/status nuance (pending approval, rejected) is handled by the
    // teacher dashboard layout, which can query Prisma — middleware here
    // only gates on "is there a session at all", same as /super-admin.
    if (isTeacherPublic) return response;
    if (!user) {
      return NextResponse.redirect(new URL("/teacher/login", request.url));
    }
    return response;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/super-admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/super-admin", "/super-admin/:path*", "/teacher", "/teacher/:path*"],
};
