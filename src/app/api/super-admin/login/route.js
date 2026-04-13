import { NextResponse } from "next/server";

const AUTH_COOKIE = "super_admin_auth";

/** Dummy credentials for local super admin access (replace with real auth later). */
const DUMMY_EMAIL = "superadmin@school.local";
const DUMMY_PASSWORD = "SuperAdmin123!";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
}
