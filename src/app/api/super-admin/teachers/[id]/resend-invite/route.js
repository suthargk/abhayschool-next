import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { INVITE_TTL_MS, generateInviteToken, hashInviteToken } from "@/lib/teacher-invite";
import { buildTeacherInviteEmail } from "@/lib/email-templates/teacher-invite";
import { sendMail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.profile.findUnique({ where: { id } });
  if (!existing || existing.role !== "TEACHER" || existing.status !== "INVITED") {
    return NextResponse.json({ error: "Only pending invites can be resent" }, { status: 400 });
  }

  if (!rateLimit(`teacher-invite-resend:${id}`, { max: 10, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many resend attempts. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  let email = existing.email;
  const requestedEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (requestedEmail && requestedEmail !== existing.email) {
    if (!EMAIL_RE.test(requestedEmail)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    const conflict = await prisma.profile.findUnique({ where: { email: requestedEmail } });
    if (conflict) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 },
      );
    }
    const { error: updateAuthError } = await createAdminClient().auth.admin.updateUserById(id, {
      email: requestedEmail,
      email_confirm: true,
    });
    if (updateAuthError) {
      return NextResponse.json({ error: updateAuthError.message }, { status: 400 });
    }
    email = requestedEmail;
  }

  const rawToken = generateInviteToken();
  const profile = await prisma.profile.update({
    where: { id },
    data: {
      email,
      inviteTokenHash: hashInviteToken(rawToken),
      inviteTokenExpiresAt: new Date(Date.now() + INVITE_TTL_MS),
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      firstName: true,
      lastName: true,
      phone: true,
      photoUrl: true,
      inviteTokenExpiresAt: true,
      createdAt: true,
      teacherAssignments: { orderBy: [{ class: "asc" }, { subject: "asc" }] },
      teacherFeaturePermissions: true,
    },
  });

  const registerUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/teacher/register/${rawToken}`;
  const { subject, html, text, attachments } = buildTeacherInviteEmail({
    registerUrl,
    firstName: profile.firstName,
  });
  try {
    await sendMail({ to: email, subject, html, text, attachments });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Couldn't send the invite email" },
      { status: 500 },
    );
  }

  return NextResponse.json({ item: profile });
}
