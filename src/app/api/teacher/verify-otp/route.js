import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { hashOtp, decryptPendingSecret, MAX_OTP_ATTEMPTS } from "@/lib/otp";
import { createAdminClient, findAuthUserIdByEmail } from "@/lib/supabase/admin";

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!email || !token) {
    return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
  }

  if (!rateLimit(`teacher-otp-check:${email}`, { max: 8, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }
  if (!rateLimit(`teacher-otp-check-ip:${clientIp(request)}`, { max: 20, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const record = await prisma.teacherSignupOtp.findUnique({ where: { email } });
  if (!record) {
    return NextResponse.json(
      { error: "No pending verification for this email. Sign up again." },
      { status: 400 },
    );
  }
  if (record.expiresAt < new Date()) {
    await prisma.teacherSignupOtp.delete({ where: { email } });
    return NextResponse.json(
      { error: "That code has expired. Sign up again to get a new one." },
      { status: 400 },
    );
  }
  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.teacherSignupOtp.delete({ where: { email } });
    return NextResponse.json(
      { error: "Too many incorrect attempts. Sign up again to get a new code." },
      { status: 400 },
    );
  }
  if (hashOtp(token) !== record.codeHash) {
    await prisma.teacherSignupOtp.update({
      where: { email },
      data: { attempts: { increment: 1 } },
    });
    return NextResponse.json({ error: "That code is incorrect" }, { status: 400 });
  }

  // The code checks out. Guard against a Profile having appeared for this
  // email since signup (e.g. another verify-otp request racing this one, or
  // one created directly) — creating the Auth user below would otherwise
  // crash on the profiles.email unique constraint.
  const existingProfile = await prisma.profile.findUnique({ where: { email } });
  if (existingProfile) {
    await prisma.teacherSignupOtp.delete({ where: { email } });
    return NextResponse.json(
      { error: "An account with this email already exists. Try logging in instead." },
      { status: 400 },
    );
  }

  // This is the only point in the signup flow where a Supabase Auth user is
  // created for the teacher.
  const supabaseAdmin = createAdminClient();
  const userMetadata = {
    firstName: record.firstName,
    lastName: record.lastName,
    phone: record.phone,
    photoUrl: record.photoUrl,
  };

  let password;
  try {
    password = decryptPendingSecret(record.passwordEnc);
  } catch {
    await prisma.teacherSignupOtp.delete({ where: { email } });
    return NextResponse.json(
      { error: "Something went wrong. Sign up again." },
      { status: 400 },
    );
  }

  let userId;
  const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userMetadata,
  });
  if (createError) {
    // Most likely an orphaned Auth user from an interrupted previous
    // verification attempt (Auth user created, but the request died before
    // the Profile below was). Reuse it instead of failing the teacher out.
    userId = await findAuthUserIdByEmail(email);
    if (!userId) {
      return NextResponse.json(
        { error: createError.message || "Something went wrong. Sign up again." },
        { status: 400 },
      );
    }
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: userMetadata,
    });
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }
  } else {
    userId = data.user.id;
  }

  try {
    await prisma.profile.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email,
        role: "TEACHER",
        status: "PENDING",
        ...userMetadata,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in instead." },
        { status: 400 },
      );
    }
    throw error;
  }

  await prisma.teacherSignupOtp.delete({ where: { email } });

  return NextResponse.json({ ok: true });
}
