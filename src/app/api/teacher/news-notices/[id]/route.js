import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { CATEGORIES } from "@/lib/news-notices/categories";
import { NEWS_NOTICES_CACHE_TAG } from "@/lib/news-notices/cached-queries";

const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

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

export async function GET(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("NEWS_NOTICES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.newsNotice.findUnique({
    where: { id },
    include: { attachments: true },
  });
  if (!item || item.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("NEWS_NOTICES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.newsNotice.findUnique({ where: { id } });
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
      data.slug = await generateUniqueSlug(data.title, id);
    }
  }
  if (body.type !== undefined) {
    if (!["NEWS", "NOTICE"].includes(body.type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    data.type = body.type;
  }
  if (typeof body.summary === "string") data.summary = body.summary.trim();
  if (body.content !== undefined) data.content = body.content;
  if (body.coverImageUrl !== undefined) {
    data.coverImageUrl = body.coverImageUrl || null;
  }
  if (body.category !== undefined) {
    if (!CATEGORY_VALUES.includes(body.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    data.category = body.category;
  }
  if (body.pinned !== undefined) data.pinned = Boolean(body.pinned);
  if (body.featured !== undefined) data.featured = Boolean(body.featured);
  if (body.academicYear !== undefined) {
    data.academicYear =
      typeof body.academicYear === "string" && body.academicYear.trim()
        ? body.academicYear.trim()
        : null;
  }
  if (body.expiresAt !== undefined) {
    data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
  }
  if (body.eventDate !== undefined) {
    data.eventDate = body.eventDate ? new Date(body.eventDate) : null;
  }
  if (body.eventTime !== undefined) {
    data.eventTime = typeof body.eventTime === "string" ? body.eventTime.trim() || null : null;
  }
  if (body.venue !== undefined) {
    data.venue = typeof body.venue === "string" ? body.venue.trim() || null : null;
  }
  if (body.attachments !== undefined) {
    data.attachments = {
      deleteMany: {},
      create: parseAttachments(body.attachments),
    };
  }

  const item = await prisma.newsNotice.update({
    where: { id },
    data,
    include: { attachments: true },
  });

  revalidateTag(NEWS_NOTICES_CACHE_TAG);

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("NEWS_NOTICES");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.newsNotice.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.newsNotice.delete({ where: { id } });

  revalidateTag(NEWS_NOTICES_CACHE_TAG);

  return NextResponse.json({ ok: true });
}
