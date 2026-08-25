import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    await requireTeacherFeature("CLASSES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.schoolClass.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.label !== "string" || !body.label.trim()) {
    return NextResponse.json({ error: "Class name is required" }, { status: 400 });
  }

  const item = await prisma.schoolClass.update({
    where: { id },
    data: { label: body.label.trim() },
  });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  try {
    await requireTeacherFeature("CLASSES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.schoolClass.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [libraryCount, homeworkCount, timeTableCount] = await Promise.all([
    prisma.libraryBook.count({ where: { class: existing.value } }),
    prisma.homework.count({ where: { class: existing.value } }),
    prisma.timeTableSlot.count({ where: { class: existing.value } }),
  ]);
  const inUseCount = libraryCount + homeworkCount + timeTableCount;

  if (inUseCount > 0) {
    return NextResponse.json(
      {
        error: `Can't delete "${existing.label}" — ${inUseCount} item${inUseCount === 1 ? "" : "s"} still use it. Move or delete that content first.`,
      },
      { status: 409 },
    );
  }

  await prisma.schoolClass.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
