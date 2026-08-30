import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export function LatestMoments({ albums }) {
  const t = useTranslations("gallery.latestMoments");

  if (albums.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("heading")}
          </h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <a
          href="#gallery-albums"
          className="shrink-0 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          {t("viewAll")}
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2">
        {albums.map((album, index) => (
          <Link
            key={album.id}
            href={`/gallery/${album.slug}`}
            className={cn(
              "group relative overflow-hidden rounded-lg border bg-muted",
              index === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square",
            )}
          >
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
            <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent p-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {album.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
