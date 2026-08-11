import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { GalleryPhotoGrid } from "@/components/gallery/photo-grid";

export default async function GalleryAlbumDetailPage({ params }) {
  const { slug } = await params;

  const album = await prisma.galleryAlbum.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!album) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Gallery
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {album.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(album.eventDate), "MMMM d, yyyy")}
        </p>
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
