import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HOMEWORK_CACHE_TAG } from "@/lib/homework/cached-queries";

export async function POST(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const existing = await prisma.homework.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let data;
  if (body.status === "ARCHIVED") {
    data = { status: "ARCHIVED" };
  } else if (body.publish === false) {
    data = { status: "DRAFT" };
  } else {
    data = {
      status: "PUBLISHED",
      publishedAt: existing.publishedAt ?? new Date(),
    };
  }

  const item = await prisma.homework.update({ where: { id }, data });

  revalidateTag(HOMEWORK_CACHE_TAG);

  return NextResponse.json({ item });
}
