import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LIBRARY_CLASS_VALUES } from "@/data/library-classes";
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
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.homework.findUnique({
    where: { id },
    include: { attachments: true },
  });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.homework.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = {};

  if (typeof body.title === "string" && body.title.trim()) {
    data.title = body.title.trim();
  }
  if (body.class !== undefined) {
    if (!LIBRARY_CLASS_VALUES.includes(body.class)) {
      return NextResponse.json({ error: "Invalid class" }, { status: 400 });
    }
    data.class = body.class;
  }
  if (typeof body.subject === "string" && body.subject.trim()) {
    data.subject = body.subject.trim();
  }
  if (body.content !== undefined) data.content = body.content;
  if (body.teacherName !== undefined) {
    data.teacherName =
      typeof body.teacherName === "string" ? body.teacherName.trim() || null : null;
  }
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

  const item = await prisma.homework.update({
    where: { id },
    data,
    include: { attachments: true },
  });

  revalidateTag(HOMEWORK_CACHE_TAG);

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.homework.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.homework.delete({ where: { id } });

  revalidateTag(HOMEWORK_CACHE_TAG);

  return NextResponse.json({ ok: true });
}
