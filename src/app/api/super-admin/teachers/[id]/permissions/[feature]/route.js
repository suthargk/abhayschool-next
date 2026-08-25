import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id, feature } = await params;
  const existing = await prisma.teacherFeaturePermission.findUnique({
    where: { teacherId_feature: { teacherId: id, feature } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.teacherFeaturePermission.delete({ where: { id: existing.id } });

  return NextResponse.json({ ok: true });
}
