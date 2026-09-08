import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toTitleCase } from "@/lib/text-case";

function slugify(label) {
  const base = label
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return base || "SUBJECT";
}

async function uniqueValue(label) {
  const base = slugify(label);
  let value = base;
  let suffix = 2;
  while (await prisma.subject.findUnique({ where: { value } })) {
    value = `${base}_${suffix++}`;
  }
  return value;
}

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.subject.findMany({ orderBy: { position: "asc" } });
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
  if (!body || typeof body.label !== "string" || !body.label.trim()) {
    return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
  }

  const label = toTitleCase(body.label.trim());
  const value = await uniqueValue(label);

  // New subjects are inserted alphabetically rather than appended, so the
  // list stays A-Z by default while still allowing manual drag-to-reorder.
  const existing = await prisma.subject.findMany({ orderBy: { position: "asc" } });
  const insertIndex = existing.findIndex((s) => s.label.localeCompare(label, "en") > 0);
  const position = insertIndex === -1 ? existing.length : insertIndex;

  const results = await prisma.$transaction([
    ...existing
      .filter((s) => s.position >= position)
      .map((s) => prisma.subject.update({ where: { id: s.id }, data: { position: s.position + 1 } })),
    prisma.subject.create({ data: { value, label, position, authorId: profile.id } }),
  ]);
  const item = results.at(-1);

  return NextResponse.json({ item }, { status: 201 });
}
