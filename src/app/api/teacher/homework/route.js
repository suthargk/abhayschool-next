import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teacherFullName } from "@/lib/teacher";
import { HOMEWORK_CACHE_TAG } from "@/lib/homework/cached-queries";

export async function GET() {
  let profile;
  try {
    profile = await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.homework.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
    include: { attachments: true },
  });

  return NextResponse.json({ items });
}

function parseAttachments(attachments) {
  if (!Array.isArray(attachments)) return [];
  return attachments
    .filter((a) => a && typeof a.fileUrl === "string" && a.fileUrl)
    .map((a) => ({
      fileName: typeof a.fileName === "string" ? a.fileName : "attachment",
      fileUrl: a.fileUrl,
      fileType: typeof a.fileType === "string" ? a.fileType : null,
      fileSize: Number.isFinite(a.fileSize) ? a.fileSize : null,
    }));
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (typeof body.subject !== "string" || !body.subject.trim()) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }
  if (!body.assignedDate || !body.dueDate) {
    return NextResponse.json(
      { error: "Assigned date and due date are required" },
      { status: 400 },
    );
  }

  const assignment = await prisma.teacherAssignment.findUnique({
    where: {
      teacherId_class_subject: {
        teacherId: profile.id,
        class: body.class,
        subject: body.subject.trim(),
      },
    },
  });
  if (!assignment) {
    return NextResponse.json(
      { error: "You aren't assigned to that class/subject" },
      { status: 403 },
    );
  }

  const item = await prisma.homework.create({
    data: {
      class: body.class,
      subject: body.subject.trim(),
      title: body.title.trim(),
      content: body.content ?? null,
      teacherName: teacherFullName(profile) || null,
      assignedDate: new Date(body.assignedDate),
      dueDate: new Date(body.dueDate),
      authorId: profile.id,
      // Teachers publish directly — no separate admin review step, unlike
      // EDITOR-authored homework in the super-admin dashboard.
      status: "PUBLISHED",
      publishedAt: new Date(),
      attachments: { create: parseAttachments(body.attachments) },
    },
    include: { attachments: true },
  });

  revalidateTag(HOMEWORK_CACHE_TAG);

  return NextResponse.json({ item }, { status: 201 });
}
