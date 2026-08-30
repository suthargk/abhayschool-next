import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturedAlbum({ album }) {
  const t = useTranslations("gallery.featuredAlbum");

  if (!album) return null;

  return (
    <section className="space-y-6">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
      </div>

      <Link
        href={`/gallery/${album.slug}`}
        className="group grid overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md sm:grid-cols-2"
      >
        <div className="relative aspect-[4/3] bg-muted sm:aspect-auto">
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
              <ImageOff className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
          <p className="text-sm text-muted-foreground">
            {format(new Date(album.eventDate), "MMMM d, yyyy")}
          </p>
          <h3 className="text-2xl font-semibold leading-snug">
            {album.title}
          </h3>
          {album.description ? (
            <p className="line-clamp-3 text-muted-foreground">
              {album.description}
            </p>
          ) : null}
          <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
            {t("photoCount", { count: album._count.images })}
          </span>
        </div>
      </Link>
    </section>
  );
}
