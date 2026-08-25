import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HOMEWORK_CACHE_TAG } from "@/lib/homework/cached-queries";

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

export async function GET(request, { params }) {
  let profile;
  try {
    profile = await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.homework.findUnique({
    where: { id },
    include: { attachments: true },
  });
  if (!item || item.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  let profile;
  try {
    profile = await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.homework.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const nextClass = body.class !== undefined ? body.class : existing.class;
  const nextSubject =
    typeof body.subject === "string" && body.subject.trim()
      ? body.subject.trim()
      : existing.subject;

  if (nextClass !== existing.class || nextSubject !== existing.subject) {
    const assignment = await prisma.teacherAssignment.findUnique({
      where: {
        teacherId_class_subject: {
          teacherId: profile.id,
          class: nextClass,
          subject: nextSubject,
        },
      },
    });
    if (!assignment) {
      return NextResponse.json(
        { error: "You aren't assigned to that class/subject" },
        { status: 403 },
      );
    }
  }

  const data = { class: nextClass, subject: nextSubject };

  if (typeof body.title === "string" && body.title.trim()) {
    data.title = body.title.trim();
  }
  if (body.content !== undefined) data.content = body.content;
  if (body.assignedDate !== undefined) {
    data.assignedDate = body.assignedDate ? new Date(body.assignedDate) : existing.assignedDate;
  }
  if (body.dueDate !== undefined) {
    data.dueDate = body.dueDate ? new Date(body.dueDate) : existing.dueDate;
  }
  if (body.attachments !== undefined) {
    data.attachments = {
      deleteMany: {},
      create: parseAttachments(body.attachments),
    };
  }
  if (body.status === "PUBLISHED" || body.status === "DRAFT") {
    data.status = body.status;
    if (body.status === "PUBLISHED" && !existing.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  const item = await prisma.homework.update({
    where: { id },
    data,
    include: { attachments: true },
  });

  revalidateTag(HOMEWORK_CACHE_TAG);

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  let profile;
  try {
    profile = await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.homework.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.homework.delete({ where: { id } });

  revalidateTag(HOMEWORK_CACHE_TAG);

  return NextResponse.json({ ok: true });
}
