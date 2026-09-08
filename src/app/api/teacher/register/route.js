import { NextResponse } from "next/server";

import { normalizePhone } from "@/lib/phone";
import { isStrongPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashInviteToken } from "@/lib/teacher-invite";

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const phone = normalizePhone(body?.phone);
  const classes = Array.isArray(body?.classes)
    ? [...new Set(body.classes.filter((c) => typeof c === "string" && c))]
    : [];
  const subjects = Array.isArray(body?.subjects)
    ? [...new Set(body.subjects.filter((s) => typeof s === "string" && s))]
    : [];

  if (!token) {
    return NextResponse.json({ error: "Invalid invite link" }, { status: 400 });
  }
  if (!rateLimit(`teacher-register:${token}`, { max: 8, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  if (!rateLimit(`teacher-register-ip:${clientIp(request)}`, { max: 20, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
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
  if (classes.length === 0) {
    return NextResponse.json({ error: "Select at least one class" }, { status: 400 });
  }
  if (subjects.length === 0) {
    return NextResponse.json({ error: "Select at least one subject" }, { status: 400 });
  }

  const [validClasses, validSubjects] = await Promise.all([
    prisma.schoolClass.findMany({ where: { value: { in: classes } }, select: { value: true } }),
    prisma.subject.findMany({ where: { label: { in: subjects } }, select: { label: true } }),
  ]);
  if (validClasses.length !== classes.length) {
    return NextResponse.json({ error: "One or more selected classes is invalid" }, { status: 400 });
  }
  if (validSubjects.length !== subjects.length) {
    return NextResponse.json({ error: "One or more selected subjects is invalid" }, { status: 400 });
  }

  const profile = await prisma.profile.findUnique({ where: { inviteTokenHash: hashInviteToken(token) } });
  if (!profile || profile.status !== "INVITED") {
    return NextResponse.json(
      { error: "This invite link is invalid or has already been used" },
      { status: 400 },
    );
  }
  if (!profile.inviteTokenExpiresAt || profile.inviteTokenExpiresAt < new Date()) {
    return NextResponse.json(
      { error: "This invite link has expired. Ask an admin to resend it." },
      { status: 400 },
    );
  }

  const { error: updateError } = await createAdminClient().auth.admin.updateUserById(profile.id, {
    password,
    email_confirm: true,
    user_metadata: { firstName: profile.firstName, lastName: profile.lastName, phone },
  });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  const assignments = classes.flatMap((classValue) =>
    subjects.map((subject) => ({ teacherId: profile.id, class: classValue, subject })),
  );

  await prisma.$transaction([
    prisma.profile.update({
      where: { id: profile.id },
      data: { phone, status: "PENDING", inviteTokenHash: null, inviteTokenExpiresAt: null },
    }),
    prisma.teacherAssignment.createMany({ data: assignments, skipDuplicates: true }),
  ]);

  return NextResponse.json({ ok: true });
}
