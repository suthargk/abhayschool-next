import { NextResponse } from "next/server";

import { LOCALES, LOCALE_COOKIE } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { id: data.user.id } });

  if (!profile || profile.role !== "TEACHER") {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "This account isn't a teacher account." },
      { status: 403 },
    );
  }

  if (profile.status === "REJECTED") {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "This account no longer has access. Contact the school office." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ ok: true, status: profile.status });
  // Apply the teacher's saved language preference to this browser, so it
  // shows up correctly even on a device/browser they haven't used before.
  if (LOCALES.includes(profile.locale)) {
    response.cookies.set(LOCALE_COOKIE, profile.locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}
