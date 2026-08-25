import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let profile;
  try {
    profile = await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.teacherAssignment.findMany({
    where: { teacherId: profile.id },
    orderBy: [{ class: "asc" }, { subject: "asc" }],
  });

  return NextResponse.json({ items });
}
