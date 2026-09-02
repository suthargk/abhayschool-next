import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { GalleryPhotoGrid } from "@/components/gallery/photo-grid";
import { MarkSeen } from "@/components/seen/mark-seen";
import { RecordView } from "@/components/seen/record-view";
import { ViewCount } from "@/components/seen/view-count";
import { VIEWABLE_TYPES } from "@/lib/views/constants";

export default async function GalleryAlbumDetailPage({ params }) {
  const { slug } = await params;
  const t = await getTranslations("gallery.albumDetail");

  const album = await prisma.galleryAlbum.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!album) notFound();

  const viewCount = await prisma.itemView.count({
    where: { itemType: VIEWABLE_TYPES.GALLERY_ALBUM, itemId: album.id },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6">
      <MarkSeen scope="gallery" id={album.id} />
      <RecordView itemType={VIEWABLE_TYPES.GALLERY_ALBUM} itemId={album.id} />
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("backToGallery")}
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {album.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(album.eventDate), "MMMM d, yyyy")}
        </p>
        <ViewCount count={viewCount} />
        {album.description ? (
          <p className="text-base leading-relaxed text-muted-foreground">
            {album.description}
          </p>
        ) : null}
      </div>

      <GalleryPhotoGrid images={album.images} albumTitle={album.title} />
    </div>
  );
}
