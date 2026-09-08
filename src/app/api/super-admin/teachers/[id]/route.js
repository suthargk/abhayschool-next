import { NextResponse, after } from "next/server";
import { Prisma } from "@prisma/client";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/mailer";
import { buildTeacherApprovedEmail } from "@/lib/email-templates/teacher-approved";

const ALLOWED_STATUSES = ["ACTIVE", "PENDING", "REJECTED"];

// Content models with a required (non-nullable) authorId → Profile relation.
// Prisma's default onDelete for a required relation is Restrict, so deleting
// a Profile that still has any of these fails at the DB level. Checked
// up front so DELETE can refuse with a clear reason instead of leaving the
// Auth user and Profile out of sync (see the comment on DELETE below).
const CONTENT_CHECKS = [
  { model: "newsNotice", label: "news post" },
  { model: "galleryAlbum", label: "gallery album" },
  { model: "principalMessage", label: "principal's message" },
  { model: "faculty", label: "faculty entry" },
  { model: "libraryBook", label: "library book" },
  { model: "academicPost", label: "academic post" },
  { model: "topper", label: "topper entry" },
  { model: "facility", label: "facility entry" },
  { model: "homework", label: "homework post" },
  { model: "faq", label: "FAQ" },
  { model: "timeTableSlot", label: "time table slot" },
  { model: "schoolClass", label: "class" },
];

function pluralize(count, label) {
  return `${count} ${label}${count === 1 ? "" : "s"}`;
}

export async function PATCH(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.profile.findUnique({ where: { id } });
  if (!existing || existing.role !== "TEACHER") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !ALLOWED_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const item = await prisma.profile.update({
    where: { id },
    data: { status: body.status },
    include: { teacherAssignments: true },
  });

  if (body.status === "ACTIVE" && existing.status !== "ACTIVE" && item.email) {
    const loginUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/teacher/login`
      : undefined;

    // Status is already updated, so don't make the admin's browser wait on
    // an SMTP round trip — schedule the teacher notification after the
    // response is sent.
    after(() => {
      const { subject, html, text, attachments } = buildTeacherApprovedEmail({
        firstName: item.firstName,
        loginUrl,
      });
      return sendMail({ to: item.email, subject, html, text, attachments }).catch((error) => {
        console.error("Failed to send teacher approval email:", error);
      });
    });
  }

  return NextResponse.json({ item });
}

// Permanently removes a teacher: the Profile row and (via onDelete: Cascade
// on TeacherAssignment/TeacherFeaturePermission) their class/subject
// assignments and feature permissions, then the Supabase Auth user. Works
// for any status — for an outstanding INVITED row this is "cancel invite";
// for an ACTIVE/PENDING/REJECTED row it's a real, irreversible delete rather
// than just revoking access (see the PATCH handler above for revoke).
//
// Refuses up front if the teacher authored any content (required authorId
// relations default to onDelete: Restrict, so the Profile delete would fail
// at the DB level anyway) — deleting that content isn't this endpoint's
// call to make, and doing the Auth-user delete first would otherwise leave
// the account in a broken half-deleted state (Profile stuck with no login,
// blocking a future re-invite of the same email) if the Profile delete then
// failed. Order matters here: Profile is deleted before the Auth user, so a
// late failure leaves at worst an orphaned Auth user, which the invite POST
// handler already cleans up on its own.
export async function DELETE(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.profile.findUnique({ where: { id } });
  if (!existing || existing.role !== "TEACHER") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const counts = await Promise.all(
    CONTENT_CHECKS.map(({ model }) => prisma[model].count({ where: { authorId: id } })),
  );
  const blocking = CONTENT_CHECKS.map((check, i) => ({ ...check, count: counts[i] })).filter(
    (c) => c.count > 0,
  );
  if (blocking.length > 0) {
    return NextResponse.json(
      {
        error: `Can't delete — this teacher has authored ${blocking
          .map((b) => pluralize(b.count, b.label))
          .join(", ")}. Revoke their access instead, or reassign/remove that content first.`,
      },
      { status: 409 },
    );
  }

  try {
    await prisma.profile.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return NextResponse.json(
        { error: "Can't delete — this teacher still has content referencing them." },
        { status: 409 },
      );
    }
    throw error;
  }

  await createAdminClient().auth.admin.deleteUser(id);

  return NextResponse.json({ ok: true });
}
