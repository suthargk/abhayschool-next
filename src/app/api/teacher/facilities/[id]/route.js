import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SECTIONS = ["OVERVIEW", "SPORTS", "SAFETY", "FAQ"];

export async function GET(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("FACILITIES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.facility.findUnique({ where: { id } });
  if (!item || item.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("FACILITIES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = {};

  if (body.section !== undefined) {
    if (!SECTIONS.includes(body.section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
    data.section = body.section;
  }
  if (typeof body.title === "string") {
    if (!body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    data.title = body.title.trim();
  }
  if (body.icon !== undefined) {
    data.icon = typeof body.icon === "string" ? body.icon.trim() || null : null;
  }
  if (body.summary !== undefined) {
    data.summary = typeof body.summary === "string" ? body.summary.trim() || null : null;
  }
  if (body.description !== undefined) {
    data.description =
      typeof body.description === "string" ? body.description.trim() || null : null;
  }
  if (body.imageUrl !== undefined) {
    data.imageUrl = body.imageUrl || null;
  }
  if (body.featured !== undefined) {
    data.featured = Boolean(body.featured);
  }

  const item = await prisma.facility.update({ where: { id }, data });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("FACILITIES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.facility.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
