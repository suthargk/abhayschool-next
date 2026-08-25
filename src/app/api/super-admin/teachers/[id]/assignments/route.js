import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const teacher = await prisma.profile.findUnique({ where: { id } });
  if (!teacher || teacher.role !== "TEACHER") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const classValue = typeof body?.class === "string" ? body.class : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";

  if (!classValue || !(await prisma.schoolClass.findUnique({ where: { value: classValue } }))) {
    return NextResponse.json({ error: "Invalid class" }, { status: 400 });
  }
  if (!subject) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }

  const item = await prisma.teacherAssignment.upsert({
    where: { teacherId_class_subject: { teacherId: id, class: classValue, subject } },
    update: {},
    create: { teacherId: id, class: classValue, subject },
  });

  return NextResponse.json({ item }, { status: 201 });
}
