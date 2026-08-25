import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TEACHER_FEATURE_KEYS } from "@/lib/teacher-features";

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
  const feature = typeof body?.feature === "string" ? body.feature : "";
  if (!TEACHER_FEATURE_KEYS.includes(feature)) {
    return NextResponse.json({ error: "Invalid feature" }, { status: 400 });
  }

  const item = await prisma.teacherFeaturePermission.upsert({
    where: { teacherId_feature: { teacherId: id, feature } },
    update: {},
    create: { teacherId: id, feature },
  });

  return NextResponse.json({ item }, { status: 201 });
}
