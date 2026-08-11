import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const item = await prisma.principalMessage.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ item });
}

/** Upserts the singleton Principal's Message row (there is only ever one). */
export async function PUT(request) {
  let profile;
  try {
    profile = await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || body.content == null) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const data = {
    principalName:
      typeof body.principalName === "string" ? body.principalName.trim() || null : null,
    content: body.content,
    photoUrl: body.photoUrl || null,
    signatureUrl: body.signatureUrl || null,
  };

  const existing = await prisma.principalMessage.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const item = existing
    ? await prisma.principalMessage.update({ where: { id: existing.id }, data })
    : await prisma.principalMessage.create({ data: { ...data, authorId: profile.id } });

  return NextResponse.json({ item });
}
