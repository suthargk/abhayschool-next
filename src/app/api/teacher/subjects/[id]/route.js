import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toTitleCase } from "@/lib/text-case";

export async function PATCH(request, { params }) {
  try {
    await requireTeacherFeature("SUBJECTS");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.label !== "string" || !body.label.trim()) {
    return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
  }

  const item = await prisma.subject.update({
    where: { id },
    data: { label: toTitleCase(body.label.trim()) },
  });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  try {
    await requireTeacherFeature("SUBJECTS");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [homeworkCount, timeTableCount, assignmentCount, facultyCount] = await Promise.all([
    prisma.homework.count({ where: { subject: existing.label } }),
    prisma.timeTableSlot.count({ where: { subject: existing.label } }),
    prisma.teacherAssignment.count({ where: { subject: existing.label } }),
    prisma.faculty.count({ where: { subjects: { has: existing.label } } }),
  ]);
  const inUseCount = homeworkCount + timeTableCount + assignmentCount + facultyCount;

  if (inUseCount > 0) {
    return NextResponse.json(
      {
        error: `Can't delete "${existing.label}" — ${inUseCount} item${inUseCount === 1 ? "" : "s"} still use it. Move or delete that content first.`,
      },
      { status: 409 },
    );
  }

  await prisma.subject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
