import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueGallerySlug } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

import { GALLERY_IMAGE_BUCKET } from "../upload/route";

function storagePathFromUrl(url) {
  const marker = `/public/${GALLERY_IMAGE_BUCKET}/`;
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
  const item = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
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
  const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
  if (!existing) {
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
      data.slug = await generateUniqueGallerySlug(data.title, id);
    }
  }
  if (typeof body.description === "string") data.description = body.description.trim();
  if (body.eventDate !== undefined) {
    if (!body.eventDate || Number.isNaN(new Date(body.eventDate).getTime())) {
      return NextResponse.json({ error: "Invalid event date" }, { status: 400 });
    }
    data.eventDate = new Date(body.eventDate);
  }
  if (body.coverImageUrl !== undefined) {
    data.coverImageUrl = body.coverImageUrl || null;
  }

  const images = Array.isArray(body.images) ? body.images : null;

  const item = await prisma.$transaction(async (tx) => {
    if (images) {
      await tx.galleryImage.deleteMany({ where: { albumId: id } });
      if (images.length > 0) {
        await tx.galleryImage.createMany({
          data: images.map((image, index) => ({
            albumId: id,
            imageUrl: image.url,
            position: image.position ?? index,
          })),
        });
      }
    }
    return tx.galleryAlbum.update({
      where: { id },
      data,
      include: { images: { orderBy: { position: "asc" } } },
    });
  });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const paths = existing.images
    .map((image) => storagePathFromUrl(image.imageUrl))
    .filter(Boolean);

  if (paths.length > 0) {
    const supabase = await createClient();
    await supabase.storage.from(GALLERY_IMAGE_BUCKET).remove(paths);
  }

  await prisma.galleryAlbum.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
