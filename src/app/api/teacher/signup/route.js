import { NextResponse } from "next/server";

import { normalizePhone } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";
import { isSchoolEmail, TEACHER_EMAIL_DOMAIN } from "@/lib/teacher";
import { uploadToS3 } from "@/lib/s3";
import { createAdminClient, findAuthUserIdByEmail } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp, encryptPendingSecret, OTP_TTL_MS } from "@/lib/otp";
import { buildTeacherOtpEmail } from "@/lib/email-templates/teacher-otp";
import { sendMail } from "@/lib/mailer";

const PHOTO_PREFIX = "teacher-photos";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = normalizePhone(formData.get("phone"));
  const photo = formData.get("photo");

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "First and last name are required" },
      { status: 400 },
    );
  }
  if (!isSchoolEmail(email)) {
    return NextResponse.json(
      { error: `Use your @${TEACHER_EMAIL_DOMAIN} email address` },
      { status: 400 },
    );
  }
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  if (!rateLimit(`teacher-signup:${email}`, { max: 3, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Too many signup attempts for this email. Try again later." },
      { status: 429 },
    );
  }
  if (!rateLimit(`teacher-signup-ip:${clientIp(request)}`, { max: 10, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let photoUrl = null;
  if (photo instanceof File && photo.size > 0) {
    if (!ALLOWED_PHOTO_TYPES.includes(photo.type)) {
      return NextResponse.json(
        { error: "Photo must be a PNG, JPEG, or WEBP image" },
        { status: 400 },
      );
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "Photo must be 5MB or smaller" }, { status: 400 });
    }
    try {
      photoUrl = await uploadToS3(PHOTO_PREFIX, photo);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // The Profile is the source of truth for "does this teacher already have
  // an account" — checking auth.users instead would miss a Profile whose
  // Auth user is gone for any reason, and let a duplicate through OTP only
  // to crash on the profiles.email unique constraint in verify-otp.
  const existingProfile = await prisma.profile.findUnique({ where: { email } });
  if (existingProfile) {
    return NextResponse.json(
      { error: "An account with this email already exists. Try logging in instead." },
      { status: 400 },
    );
  }

  // Nothing is written to Supabase Auth at this point — the account is only
  // created once the OTP is verified (see /api/teacher/verify-otp). If a
  // previous signup attempt left an orphaned, unverified Auth user (no
  // Profile) for this email, clean it up so verify-otp can create a fresh
  // one from this attempt's data once the code is confirmed.
  const existingUserId = await findAuthUserIdByEmail(email);
  if (existingUserId) {
    await createAdminClient().auth.admin.deleteUser(existingUserId);
  }

  const code = generateOtp();
  const pendingData = {
    firstName,
    lastName,
    phone,
    photoUrl,
    passwordEnc: encryptPendingSecret(password),
    codeHash: hashOtp(code),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  };
  await prisma.teacherSignupOtp.upsert({
    where: { email },
    update: { ...pendingData, attempts: 0 },
    create: { email, ...pendingData },
  });

  const { subject, html, text, attachments } = buildTeacherOtpEmail({ code, firstName });
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
