import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.libraryBook.findMany({
    orderBy: [{ class: "asc" }, { position: "asc" }],
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
  if (!body || !(await prisma.schoolClass.findUnique({ where: { value: body.class } }))) {
    return NextResponse.json({ error: "A valid class is required" }, { status: 400 });
  }
  if (typeof body.bookName !== "string" || !body.bookName.trim()) {
    return NextResponse.json({ error: "Book name is required" }, { status: 400 });
  }
  if (typeof body.subject !== "string" || !body.subject.trim()) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }
  if (typeof body.publication !== "string" || !body.publication.trim()) {
    return NextResponse.json({ error: "Publication is required" }, { status: 400 });
  }

  const maxPosition = await prisma.libraryBook.aggregate({
    where: { class: body.class },
    _max: { position: true },
  });

  const item = await prisma.libraryBook.create({
    data: {
      class: body.class,
      bookName: body.bookName.trim(),
      subject: body.subject.trim(),
      publication: body.publication.trim(),
      position: (maxPosition._max.position ?? -1) + 1,
      authorId: profile.id,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
