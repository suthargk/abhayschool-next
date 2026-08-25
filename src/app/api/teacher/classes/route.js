import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(label) {
  const base = label
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return base || "CLASS";
}

async function uniqueValue(label) {
  const base = slugify(label);
  let value = base;
  let suffix = 2;
  while (await prisma.schoolClass.findUnique({ where: { value } })) {
    value = `${base}_${suffix++}`;
  }
  return value;
}

export async function GET() {
  try {
    await requireTeacherFeature("CLASSES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.schoolClass.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireTeacherFeature("CLASSES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.label !== "string" || !body.label.trim()) {
    return NextResponse.json({ error: "Class name is required" }, { status: 400 });
  }

  const label = body.label.trim();
  const value = await uniqueValue(label);

  const maxPosition = await prisma.schoolClass.aggregate({ _max: { position: true } });

  const item = await prisma.schoolClass.create({
    data: {
      value,
      label,
      position: (maxPosition._max.position ?? -1) + 1,
      authorId: profile.id,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
