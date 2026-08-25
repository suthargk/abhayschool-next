import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { generateOtp, hashOtp, OTP_TTL_MS } from "@/lib/otp";
import { buildTeacherOtpEmail } from "@/lib/email-templates/teacher-otp";
import { sendMail } from "@/lib/mailer";

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (!rateLimit(`teacher-otp-resend:${email}`, { max: 5, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Too many resend attempts. Try again later." },
      { status: 429 },
    );
  }
  if (!rateLimit(`teacher-otp-resend-ip:${clientIp(request)}`, { max: 15, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const record = await prisma.teacherSignupOtp.findUnique({ where: { email } });
  if (!record) {
    return NextResponse.json(
      { error: "No pending verification for this email. Sign up again." },
      { status: 400 },
    );
  }

  const code = generateOtp();
  await prisma.teacherSignupOtp.update({
    where: { email },
    data: { codeHash: hashOtp(code), attempts: 0, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
  });

  const { subject, html, text, attachments } = buildTeacherOtpEmail({ code, firstName: record.firstName });
  try {
    await sendMail({ to: email, subject, html, text, attachments });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Couldn't send the verification email" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
