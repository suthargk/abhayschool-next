import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function GalleryPreview({ albums }) {
  const t = useTranslations("about.galleryPreview");

  if (albums.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/gallery/${album.slug}`}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
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
                <ImageOff className="size-5 text-muted-foreground" />
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/gallery">{t("viewGallery")}</Link>
        </Button>
      </div>
    </section>
  );
}
