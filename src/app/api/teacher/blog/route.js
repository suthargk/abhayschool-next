import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueAcademicPostSlug } from "@/lib/slug";

export async function GET() {
  let profile;
  try {
    profile = await requireTeacherFeature("BLOG");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.academicPost.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireTeacherFeature("BLOG");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = await generateUniqueAcademicPostSlug(body.title);

  const item = await prisma.academicPost.create({
    data: {
      title: body.title.trim(),
      slug,
      summary: typeof body.summary === "string" ? body.summary.trim() : "",
      content: body.content ?? null,
      coverImageUrl: body.coverImageUrl || null,
      authorId: profile.id,
      // Teachers publish directly — no separate admin review step, unlike
      // EDITOR-authored blog posts in the super-admin dashboard.
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
