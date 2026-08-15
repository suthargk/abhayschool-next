import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.testimonial.findMany({
    orderBy: [{ position: "asc" }],
    include: { author: { select: { email: true } } },
  });

  return NextResponse.json({ items });
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof body.quote !== "string" || !body.quote.trim()) {
    return NextResponse.json({ error: "Quote is required" }, { status: 400 });
  }

  const maxPosition = await prisma.testimonial.aggregate({ _max: { position: true } });

  const item = await prisma.testimonial.create({
    data: {
      name: body.name.trim(),
      designation: body.designation?.trim() || null,
      quote: body.quote.trim(),
      photoUrl: body.photoUrl || null,
      position: (maxPosition._max.position ?? -1) + 1,
      authorId: profile.id,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
