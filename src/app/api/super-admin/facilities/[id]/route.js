import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

import { FACILITY_PHOTO_BUCKET } from "../upload/route";

const SECTIONS = ["OVERVIEW", "SPORTS", "SAFETY", "FAQ"];

function storagePathFromUrl(url) {
  const marker = `/public/${FACILITY_PHOTO_BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}

export async function GET(request, { params }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.facility.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) {
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
  if (body.position !== undefined && Number.isFinite(Number(body.position))) {
    data.position = Number(body.position);
  }

  const item = await prisma.facility.update({ where: { id }, data });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.imageUrl) {
    const path = storagePathFromUrl(existing.imageUrl);
    if (path) {
      const supabase = await createClient();
      await supabase.storage.from(FACILITY_PHOTO_BUCKET).remove([path]);
    }
  }

  await prisma.facility.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
