import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.newsNotice.findMany({
    orderBy: { createdAt: "desc" },
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
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!["NEWS", "NOTICE"].includes(body.type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const slug = await generateUniqueSlug(body.title);

  const item = await prisma.newsNotice.create({
    data: {
      type: body.type,
      title: body.title.trim(),
      slug,
      summary: typeof body.summary === "string" ? body.summary.trim() : "",
      content: body.content ?? null,
      coverImageUrl: body.coverImageUrl || null,
      authorId: profile.id,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
