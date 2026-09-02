import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { NewBadge } from "@/components/seen/new-badge";

const ASPECTS = ["aspect-[4/3]", "aspect-square", "aspect-[3/4]"];

export function AlbumGrid({ albums, emptyMessage }) {
  const t = useTranslations("gallery.albumGrid");

  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {albums.map((album, index) => (
        <Link
          key={album.id}
          href={`/gallery/${album.slug}`}
          className="group mb-6 block overflow-hidden rounded-lg border transition-shadow hover:shadow-md break-inside-avoid"
        >
          <div className={`relative bg-muted ${ASPECTS[index % ASPECTS.length]}`}>
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
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {format(new Date(album.eventDate), "MMMM d, yyyy")}
              </p>
              <NewBadge scope="gallery" id={album.id} publishedAt={album.publishedAt} />
            </div>
            <h2 className="text-lg font-semibold leading-snug">
              {album.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("photoCount", { count: album._count.images })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
