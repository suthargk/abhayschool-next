import { NextResponse } from "next/server";

import { isStrongPassword } from "@/lib/password";
import { hashResetToken } from "@/lib/password-reset";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!token) {
    return NextResponse.json({ error: "Invalid reset link" }, { status: 400 });
  }
  if (!rateLimit(`teacher-reset-password:${token}`, { max: 8, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  if (!isStrongPassword(password)) {
    return NextResponse.json(
      {
        error:
          "Password must be at least 8 characters and include one capital letter, one number, and one special character",
      },
      { status: 400 },
    );
  }

  const profile = await prisma.profile.findUnique({ where: { resetTokenHash: hashResetToken(token) } });
  if (!profile || profile.role !== "TEACHER") {
    return NextResponse.json(
      { error: "This reset link is invalid or has already been used" },
      { status: 400 },
    );
  }
  if (!profile.resetTokenExpiresAt || profile.resetTokenExpiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link has expired. Request a new one." },
      { status: 400 },
    );
  }

  const { error: updateError } = await createAdminClient().auth.admin.updateUserById(profile.id, {
    password,
  });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: { resetTokenHash: null, resetTokenExpiresAt: null },
  });

  return NextResponse.json({ ok: true });
}
