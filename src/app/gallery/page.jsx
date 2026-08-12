import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { GALLERY_CATEGORIES } from "@/data/gallery-categories";

import { GalleryHero } from "./components/gallery-hero";
import { GalleryCategoryFilters } from "./components/gallery-category-filters";
import { GalleryFilters } from "./components/gallery-filters";
import { FeaturedAlbum } from "./components/featured-album";
import { LatestMoments } from "./components/latest-moments";
import { AlbumGrid } from "./components/album-grid";
import { YearArchive } from "./components/year-archive";
import { GalleryCta } from "./components/gallery-cta";
import { buildGalleryHref } from "./lib/query";

const PAGE_SIZE = 12;
const CATEGORY_VALUES = GALLERY_CATEGORIES.map((c) => c.value);

export default async function GalleryPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const year = Number(params.year) || null;
  const month = Number(params.month) || null;
  const category = CATEGORY_VALUES.includes(params.category) ? params.category : null;
  const page = Math.max(1, Number(params.page) || 1);

  const where = {
    status: "PUBLISHED",
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(year
      ? {
          eventDate: {
            gte: new Date(Date.UTC(year, 0, 1)),
            lt: new Date(Date.UTC(year + 1, 0, 1)),
          },
        }
      : {}),
    ...(category ? { category } : {}),
  };

  const [matching, allEventDates, featuredAlbum, recentAlbums] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where,
      orderBy: { eventDate: "desc" },
      include: { _count: { select: { images: true } } },
    }),
    prisma.galleryAlbum.findMany({
      where: { status: "PUBLISHED" },
      select: { eventDate: true },
    }),
    prisma.galleryAlbum.findFirst({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { eventDate: "desc" },
      include: { _count: { select: { images: true } } },
    }),
    prisma.galleryAlbum.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { eventDate: "desc" },
      take: 9,
      include: { _count: { select: { images: true } } },
    }),
  ]);

  const featured = featuredAlbum ?? recentAlbums[0] ?? null;
  const latestMoments = recentAlbums.filter((a) => a.id !== featured?.id).slice(0, 8);

  const filtered = month
    ? matching.filter((album) => new Date(album.eventDate).getUTCMonth() + 1 === month)
    : matching;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const albums = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const years = Array.from(
    new Set(allEventDates.map((a) => new Date(a.eventDate).getUTCFullYear())),
  ).sort((a, b) => b - a);

  const yearCounts = years.map((y) => ({
    year: y,
    count: allEventDates.filter((a) => new Date(a.eventDate).getUTCFullYear() === y).length,
  }));

  const isFiltered = Boolean(q || year || month || category);

  return (
    <div className="space-y-16 px-4 pb-16 sm:px-6">
      <GalleryHero />

      <div className="mx-auto max-w-5xl space-y-16">
        {!isFiltered ? <FeaturedAlbum album={featured} /> : null}
        {!isFiltered ? <LatestMoments albums={latestMoments} /> : null}

        <section id="gallery-albums" className="scroll-mt-24 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Photo Albums
            </h2>
            <p className="text-muted-foreground">
              Browse every album from our campus and events.
            </p>
          </div>

          <GalleryCategoryFilters q={q} year={year} month={month} category={category} />
          <GalleryFilters
            initialQuery={q}
            initialYear={year}
            initialMonth={month}
            initialCategory={category}
            years={years}
          />

          <AlbumGrid
            albums={albums}
            emptyMessage={
              total === 0 && !isFiltered
                ? "No albums published yet. Check back soon!"
                : "No albums match your search."
            }
          />

          {totalPages > 1 ? (
            <div className="flex items-center justify-between border-t pt-6 text-sm">
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              >
                <Link href={buildGalleryHref({ q, year, month, category, page: page - 1 })}>
                  ← Previous
                </Link>
              </Button>
              <span className="text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              >
                <Link href={buildGalleryHref({ q, year, month, category, page: page + 1 })}>
                  Next →
                </Link>
              </Button>
            </div>
          ) : null}
        </section>

        <YearArchive years={yearCounts} />
        <GalleryCta />
      </div>
    </div>
  );
}
