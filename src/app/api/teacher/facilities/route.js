import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SECTIONS = ["OVERVIEW", "SPORTS", "SAFETY", "FAQ"];

export async function GET() {
  let profile;
  try {
    profile = await requireTeacherFeature("FACILITIES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.facility.findMany({
    where: { authorId: profile.id },
    orderBy: [{ section: "asc" }, { position: "asc" }],
  });

  return NextResponse.json({ items });
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireTeacherFeature("FACILITIES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const section = SECTIONS.includes(body.section) ? body.section : "OVERVIEW";

  const maxPosition = await prisma.facility.aggregate({
    where: { section },
    _max: { position: true },
  });

  const item = await prisma.facility.create({
    data: {
      section,
      icon: typeof body.icon === "string" ? body.icon.trim() || null : null,
      title: body.title.trim(),
      summary: typeof body.summary === "string" ? body.summary.trim() || null : null,
      description: typeof body.description === "string" ? body.description.trim() || null : null,
      imageUrl: body.imageUrl || null,
      featured: Boolean(body.featured),
      position: (maxPosition._max.position ?? -1) + 1,
      authorId: profile.id,
      // Teachers publish directly — no separate admin review step, unlike
      // EDITOR-authored facility entries in the super-admin dashboard.
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
