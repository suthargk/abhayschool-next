import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { createAdminClient, findAuthUserIdByEmail } from "@/lib/supabase/admin";
import {
  INVITE_TTL_MS,
  generateInviteToken,
  generateTempPassword,
  hashInviteToken,
} from "@/lib/teacher-invite";
import { buildTeacherInviteEmail } from "@/lib/email-templates/teacher-invite";
import { sendMail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fields safe to send to the browser — omits inviteTokenHash.
const PROFILE_SELECT = {
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
};

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.profile.findMany({
    where: { role: "TEACHER" },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      ...PROFILE_SELECT,
      teacherAssignments: { orderBy: [{ class: "asc" }, { subject: "asc" }] },
      teacherFeaturePermissions: true,
    },
  });

  return NextResponse.json({ items });
}

export async function POST(request) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  try {
    const siteUrl = getSiteUrl();

    const existingProfile = await prisma.profile.findUnique({ where: { email } });
    if (existingProfile) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 },
      );
    }

    // A previous invite attempt for this email may have created the Auth user
    // but died before the Profile below was created — clean it up so we can
    // create a fresh one.
    const existingUserId = await findAuthUserIdByEmail(email);
    if (existingUserId) {
      await createAdminClient().auth.admin.deleteUser(existingUserId);
    }

    const userMetadata = { firstName: firstName || null, lastName: lastName || null };
    const { data, error: createError } = await createAdminClient().auth.admin.createUser({
      email,
      password: generateTempPassword(),
      email_confirm: true,
      user_metadata: userMetadata,
    });
    if (createError || !data?.user) {
      return NextResponse.json(
        { error: createError?.message || "Couldn't create the account" },
        { status: 500 },
      );
    }

    const rawToken = generateInviteToken();
    const profile = await prisma.profile.create({
      data: {
        id: data.user.id,
        email,
        role: "TEACHER",
        status: "INVITED",
        firstName: firstName || null,
        lastName: lastName || null,
        inviteTokenHash: hashInviteToken(rawToken),
        inviteTokenExpiresAt: new Date(Date.now() + INVITE_TTL_MS),
      },
      select: PROFILE_SELECT,
    });

    const registerUrl = `${siteUrl}/teacher/register/${rawToken}`;
    const { subject, html, text, attachments } = buildTeacherInviteEmail({
      registerUrl,
      firstName,
    });
    try {
      await sendMail({ to: email, subject, html, text, attachments });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error.message ||
            "Account created, but the invite email couldn't be sent. Use Resend invite to try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      item: { ...profile, teacherAssignments: [], teacherFeaturePermissions: [] },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Couldn't invite the teacher" },
      { status: 500 },
    );
  }
}
