import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ImageOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import peppaPigImage from "../../../public/peppa_pig.png";

import { GalleryFilters } from "./components/gallery-filters";

const PAGE_SIZE = 12;

function buildHref({ q, year, month, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (year) params.set("year", String(year));
  if (month) params.set("month", String(month));
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/gallery?${qs}` : "/gallery";
}

export default async function GalleryPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const year = Number(params.year) || null;
  const month = Number(params.month) || null;
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
  };

  const [matching, allEventDates] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where,
      orderBy: { eventDate: "desc" },
      include: { _count: { select: { images: true } } },
    }),
    prisma.galleryAlbum.findMany({
      where: { status: "PUBLISHED" },
      select: { eventDate: true },
    }),
  ]);

  const filtered = month
    ? matching.filter((album) => new Date(album.eventDate).getUTCMonth() + 1 === month)
    : matching;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const albums = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const years = Array.from(
    new Set(allEventDates.map((a) => new Date(a.eventDate).getUTCFullYear())),
  ).sort((a, b) => b - a);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">
            Photos from events and moments across the school year.
          </p>
        </div>
        <Image
          src={peppaPigImage}
          alt=""
          width={300}
          height={206}
          className="hidden h-auto w-28 shrink-0 rotate-3 select-none drop-shadow-xl sm:block sm:w-36"
          priority
        />
      </div>

      <GalleryFilters
        initialQuery={q}
        initialYear={year}
        initialMonth={month}
        years={years}
      />

      {albums.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <Image
            src={peppaPigImage}
            alt=""
            width={300}
            height={206}
            className="h-auto w-24 -rotate-2 select-none drop-shadow-md"
          />
          <p className="text-sm text-muted-foreground">
            {total === 0 && !q && !year && !month
              ? "No albums published yet. Check back soon!"
              : "No albums match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/gallery/${album.slug}`}
              className="group overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {album.coverImageUrl ? (
                  <Image
                    src={album.coverImageUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageOff className="size-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="space-y-1 p-4">
                <p className="text-sm text-muted-foreground">
                  {format(new Date(album.eventDate), "MMMM d, yyyy")}
                </p>
                <h2 className="text-lg font-semibold leading-snug">
                  {album.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {album._count.images} photo{album._count.images === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t pt-6 text-sm">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          >
            <Link href={buildHref({ q, year, month, page: page - 1 })}>← Previous</Link>
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
            <Link href={buildHref({ q, year, month, page: page + 1 })}>Next →</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
