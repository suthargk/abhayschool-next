import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueGallerySlug } from "@/lib/slug";
import { GALLERY_CATEGORIES } from "@/data/gallery-categories";

const CATEGORY_VALUES = GALLERY_CATEGORIES.map((c) => c.value);

export async function GET() {
  let profile;
  try {
    profile = await requireTeacherFeature("GALLERY");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.galleryAlbum.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { images: true } } },
  });

  return NextResponse.json({ items });
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireTeacherFeature("GALLERY");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!body.eventDate || Number.isNaN(new Date(body.eventDate).getTime())) {
    return NextResponse.json({ error: "A valid event date is required" }, { status: 400 });
  }

  const slug = await generateUniqueGallerySlug(body.title);
  const images = Array.isArray(body.images) ? body.images : [];

  const item = await prisma.galleryAlbum.create({
    data: {
      title: body.title.trim(),
      slug,
      description: typeof body.description === "string" ? body.description.trim() : "",
      eventDate: new Date(body.eventDate),
      coverImageUrl: body.coverImageUrl || null,
      category: CATEGORY_VALUES.includes(body.category) ? body.category : "EVENTS",
      featured: body.featured === true,
      authorId: profile.id,
      // Teachers publish directly — no separate admin review step, unlike
      // EDITOR-authored albums in the super-admin dashboard.
      status: "PUBLISHED",
      publishedAt: new Date(),
      images: {
        create: images.map((image, index) => ({
          imageUrl: image.url,
          position: image.position ?? index,
        })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json({ item }, { status: 201 });
}
