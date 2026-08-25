import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = ["ACTIVE", "PENDING", "REJECTED"];

export async function PATCH(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.profile.findUnique({ where: { id } });
  if (!existing || existing.role !== "TEACHER") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !ALLOWED_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const item = await prisma.profile.update({
    where: { id },
    data: { status: body.status },
    include: { teacherAssignments: true },
  });

  return NextResponse.json({ item });
}
