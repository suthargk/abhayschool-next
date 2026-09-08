import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { isStrongPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  let profile;
  try {
    profile = await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  if (!rateLimit(`teacher-change-password:${profile.id}`, { max: 5, windowMs: 15 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword) {
    return NextResponse.json({ error: "Current password is required" }, { status: 400 });
  }
  if (!isStrongPassword(newPassword)) {
    return NextResponse.json(
      {
        error:
          "Password must be at least 8 characters and include one capital letter, one number, and one special character",
      },
      { status: 400 },
    );
  }

  // Re-authenticating confirms the caller actually knows the current
  // password (not just that they hold a valid session cookie) before we let
  // them set a new one, and refreshes the session tied to this request.
  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: currentPassword,
  });
  if (verifyError) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
