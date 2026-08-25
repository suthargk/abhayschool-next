import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.profile.findMany({
    where: { role: "TEACHER" },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { teacherAssignments: { orderBy: [{ class: "asc" }, { subject: "asc" }] } },
  });

  return NextResponse.json({ items });
}
