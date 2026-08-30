import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, ChevronDown, ImageOff, Images } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGES = [
  "/images/campus_highlight_1.jpg",
  "/images/campus_highlight_2.jpg",
  "/images/campus_highlight_3.jpg",
  "/images/campus_highlight_4.jpg",
  "/images/campus_highlight_6.jpg",
];

const MOSAIC_LAYOUT = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

export function GalleryHero() {
  const t = useTranslations("gallery.galleryHero");

  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <Badge
        variant="purple"
        className="animate-fade-up-from-top [animation-fill-mode:both]"
      >
        <Camera className="size-3.5" />
        {t("badge")}
      </Badge>

      <h1
        className="animate-fade-up-from-top text-3xl font-semibold [animation-delay:60ms] [animation-fill-mode:both] sm:text-5xl"
      >
        <span className="block">{t("headingLine1")}</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          {t("headingLine2")}
        </span>
      </h1>

      <p className="max-w-xl animate-fade-up-from-top text-muted-foreground [animation-delay:120ms] [animation-fill-mode:both]">
        {t("description")}
      </p>

      <Suspense fallback={<HeroMosaicSkeleton />}>
        <HeroMosaic />
      </Suspense>

      <a
        href="#gallery-albums"
        className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("exploreGallery")}
        <ChevronDown className="size-4" />
      </a>
    </section>
  );
}

async function HeroMosaic() {
  const t = await getTranslations("gallery.galleryHero");
  const [albums, photoCount] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where: { status: "PUBLISHED", coverImageUrl: { not: null } },
      orderBy: { eventDate: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, coverImageUrl: true },
    }),
    prisma.galleryImage.count({ where: { album: { status: "PUBLISHED" } } }),
  ]);

  const tiles = [...albums];
  while (tiles.length < 5) {
    tiles.push({
      id: `fallback-${tiles.length}`,
      title: t("fallbackTitle"),
      coverImageUrl: FALLBACK_IMAGES[tiles.length % FALLBACK_IMAGES.length],
      isFallback: true,
    });
  }

  return (
    <>
      {photoCount > 0 ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Images className="size-4" />
          {t("photoCount", { count: photoCount.toLocaleString() })}
        </span>
      ) : null}

      <div className="mt-4 grid aspect-[21/9] w-full max-w-4xl grid-cols-3 grid-rows-2 gap-2 sm:gap-3">
        {tiles.slice(0, 5).map((tile, index) => (
          <Link
            key={tile.id}
            href={tile.isFallback ? "#gallery-albums" : `/gallery/${tile.slug ?? ""}`}
            className={cn(
              "group relative animate-in overflow-hidden rounded-xl border bg-muted shadow-sm fade-in zoom-in-95 duration-700",
              MOSAIC_LAYOUT[index],
            )}
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
          >
            {tile.coverImageUrl ? (
              <Image
                src={tile.coverImageUrl}
                alt={tile.title ?? t("fallbackAlt")}
                fill
                sizes="(max-width: 640px) 33vw, 400px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={!tile.isFallback}
                priority={index === 0}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageOff className="size-6 text-muted-foreground" />
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  );
}

function HeroMosaicSkeleton() {
  return (
    <div className="mt-4 grid aspect-[21/9] w-full max-w-4xl animate-pulse grid-cols-3 grid-rows-2 gap-2 sm:gap-3">
      {MOSAIC_LAYOUT.map((layout, index) => (
        <div key={index} className={cn("rounded-xl bg-muted", layout)} />
      ))}
    </div>
  );
}
