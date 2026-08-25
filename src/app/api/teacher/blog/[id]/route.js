import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueAcademicPostSlug } from "@/lib/slug";

export async function GET(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("BLOG");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.academicPost.findUnique({ where: { id } });
  if (!item || item.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("BLOG");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.academicPost.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = {};

  if (typeof body.title === "string" && body.title.trim()) {
    data.title = body.title.trim();
    if (data.title !== existing.title) {
      data.slug = await generateUniqueAcademicPostSlug(data.title, id);
    }
  }
  if (typeof body.summary === "string") data.summary = body.summary.trim();
  if (body.content !== undefined) data.content = body.content;
  if (body.coverImageUrl !== undefined) {
    data.coverImageUrl = body.coverImageUrl || null;
  }

  const item = await prisma.academicPost.update({ where: { id }, data });
  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("BLOG");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.academicPost.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.academicPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
