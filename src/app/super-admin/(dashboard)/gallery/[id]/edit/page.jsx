import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { GalleryAlbumForm } from "../../components/gallery-album-form";

export default async function EditGalleryAlbumPage({ params }) {
  const { id } = await params;
  const item = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/gallery">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit album</h1>
      </div>
      <GalleryAlbumForm initialItem={item} />
    </div>
  );
}
