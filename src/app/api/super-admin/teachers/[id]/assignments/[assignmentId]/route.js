import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id, assignmentId } = await params;
  const existing = await prisma.teacherAssignment.findUnique({ where: { id: assignmentId } });
  if (!existing || existing.teacherId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.teacherAssignment.delete({ where: { id: assignmentId } });

  return NextResponse.json({ ok: true });
}
