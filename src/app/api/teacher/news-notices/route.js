import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { CATEGORIES } from "@/lib/news-notices/categories";
import { currentAcademicYear } from "@/lib/news-notices/academic-year";
import { NEWS_NOTICES_CACHE_TAG } from "@/lib/news-notices/cached-queries";

const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

export async function GET() {
  let profile;
  try {
    profile = await requireTeacherFeature("NEWS_NOTICES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.newsNotice.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
    include: { attachments: true },
  });

  return NextResponse.json({ items });
}

function parseAttachments(attachments) {
  if (!Array.isArray(attachments)) return [];
  return attachments
    .filter((a) => a && typeof a.fileUrl === "string" && a.fileUrl)
    .map((a) => ({
      fileName: typeof a.fileName === "string" ? a.fileName : "attachment",
      fileUrl: a.fileUrl,
      fileType: typeof a.fileType === "string" ? a.fileType : null,
      fileSize: Number.isFinite(a.fileSize) ? a.fileSize : null,
    }));
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireTeacherFeature("NEWS_NOTICES");
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
  if (body.category !== undefined && !CATEGORY_VALUES.includes(body.category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const slug = await generateUniqueSlug(body.title);

  const item = await prisma.newsNotice.create({
    data: {
      type: body.type,
      category: body.category ?? "GENERAL",
      title: body.title.trim(),
      slug,
      summary: typeof body.summary === "string" ? body.summary.trim() : "",
      content: body.content ?? null,
      coverImageUrl: body.coverImageUrl || null,
      pinned: Boolean(body.pinned),
      featured: Boolean(body.featured),
      academicYear:
        typeof body.academicYear === "string" && body.academicYear.trim()
          ? body.academicYear.trim()
          : currentAcademicYear(),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      eventTime: typeof body.eventTime === "string" ? body.eventTime.trim() || null : null,
      venue: typeof body.venue === "string" ? body.venue.trim() || null : null,
      authorId: profile.id,
      // Teachers publish directly — no separate admin review step, unlike
      // EDITOR-authored news/notices in the super-admin dashboard.
      status: "PUBLISHED",
      publishedAt: new Date(),
      attachments: { create: parseAttachments(body.attachments) },
    },
    include: { attachments: true },
  });

  revalidateTag(NEWS_NOTICES_CACHE_TAG);

  return NextResponse.json({ item }, { status: 201 });
}
