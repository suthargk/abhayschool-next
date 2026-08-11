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
  const body = await request.json().catch(() => ({}));
  const publish = body.publish !== false;

  const existing = await prisma.faculty.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const item = await prisma.faculty.update({
    where: { id },
    data: publish
      ? {
          status: "PUBLISHED",
          publishedAt: existing.publishedAt ?? new Date(),
        }
      : { status: "DRAFT" },
  });

  return NextResponse.json({ item });
}
