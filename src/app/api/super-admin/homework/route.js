import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LIBRARY_CLASS_VALUES } from "@/data/library-classes";
import { HOMEWORK_CACHE_TAG } from "@/lib/homework/cached-queries";

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.homework.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { email: true } }, attachments: true },
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
    profile = await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!LIBRARY_CLASS_VALUES.includes(body.class)) {
    return NextResponse.json({ error: "Invalid class" }, { status: 400 });
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

  const item = await prisma.homework.create({
    data: {
      class: body.class,
      subject: body.subject.trim(),
      title: body.title.trim(),
      content: body.content ?? null,
      teacherName:
        typeof body.teacherName === "string" ? body.teacherName.trim() || null : null,
      assignedDate: new Date(body.assignedDate),
      dueDate: new Date(body.dueDate),
      authorId: profile.id,
      attachments: { create: parseAttachments(body.attachments) },
    },
    include: { attachments: true },
  });

  revalidateTag(HOMEWORK_CACHE_TAG);

  return NextResponse.json({ item }, { status: 201 });
}
