import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueGallerySlug } from "@/lib/slug";

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.galleryAlbum.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { email: true } }, _count: { select: { images: true } } },
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
      authorId: profile.id,
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
