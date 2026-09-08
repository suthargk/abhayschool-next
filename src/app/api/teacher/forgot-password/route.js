import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { RESET_TTL_MS, generateResetToken, hashResetToken } from "@/lib/password-reset";
import { buildTeacherPasswordResetEmail } from "@/lib/email-templates/teacher-password-reset";
import { sendMail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only ACTIVE/PENDING teachers can request a reset — INVITED accounts don't
// have a real password yet (they set one via /teacher/register), and
// REJECTED accounts have no access at all.
const RESETTABLE_STATUSES = ["ACTIVE", "PENDING"];

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (!rateLimit(`teacher-forgot-password:${email}`, { max: 3, windowMs: 15 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Too many requests for this email. Try again later." },
      { status: 429 },
    );
  }
  if (!rateLimit(`teacher-forgot-password-ip:${clientIp(request)}`, { max: 15, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  // Always respond the same way whether or not the email matches a teacher
  // account, so this endpoint can't be used to check who has an account.
  const genericOk = NextResponse.json({ ok: true });

  const profile = await prisma.profile.findUnique({ where: { email } });
  if (!profile || profile.role !== "TEACHER" || !RESETTABLE_STATUSES.includes(profile.status)) {
    return genericOk;
  }

  const rawToken = generateResetToken();
  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      resetTokenHash: hashResetToken(rawToken),
      resetTokenExpiresAt: new Date(Date.now() + RESET_TTL_MS),
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/teacher/reset-password/${rawToken}`;
  const { subject, html, text, attachments } = buildTeacherPasswordResetEmail({
    resetUrl,
    firstName: profile.firstName,
  });
  try {
    await sendMail({ to: email, subject, html, text, attachments });
  } catch (error) {
    console.error("Failed to send teacher password reset email", error);
  }

  return genericOk;
}
