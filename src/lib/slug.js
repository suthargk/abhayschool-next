import { prisma } from "@/lib/prisma";

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Generates a unique slug for a NewsNotice, suffixing on collision. */
export async function generateUniqueSlug(title, excludeId) {
  const base = slugify(title) || "post";
  let slug = base;
  let suffix = 1;

  while (
    await prisma.newsNotice.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  return slug;
}

/** Generates a unique slug for a GalleryAlbum, suffixing on collision. */
export async function generateUniqueGallerySlug(title, excludeId) {
  const base = slugify(title) || "album";
  let slug = base;
  let suffix = 1;

  while (
    await prisma.galleryAlbum.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  return slug;
}
