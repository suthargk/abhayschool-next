import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("LIBRARY");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.libraryBook.findUnique({ where: { id } });
  if (!item || item.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("LIBRARY");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.libraryBook.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = {};

  if (body.class !== undefined) {
    if (!(await prisma.schoolClass.findUnique({ where: { value: body.class } }))) {
      return NextResponse.json({ error: "A valid class is required" }, { status: 400 });
    }
    data.class = body.class;
  }
  if (body.bookName !== undefined) {
    if (typeof body.bookName !== "string" || !body.bookName.trim()) {
      return NextResponse.json({ error: "Book name is required" }, { status: 400 });
    }
    data.bookName = body.bookName.trim();
  }
  if (body.subject !== undefined) {
    if (typeof body.subject !== "string" || !body.subject.trim()) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }
    data.subject = body.subject.trim();
  }
  if (body.publication !== undefined) {
    if (typeof body.publication !== "string" || !body.publication.trim()) {
      return NextResponse.json({ error: "Publication is required" }, { status: 400 });
    }
    data.publication = body.publication.trim();
  }

  const item = await prisma.libraryBook.update({ where: { id }, data });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("LIBRARY");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.libraryBook.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.libraryBook.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
