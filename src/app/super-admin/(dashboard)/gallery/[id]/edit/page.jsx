import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FormSkeleton } from "@/components/form-skeleton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { GalleryAlbumForm } from "../../components/gallery-album-form";

export default async function EditGalleryAlbumPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/gallery">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit album
        </h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditGalleryAlbumSection id={id} />
      </Suspense>
    </div>
  );
}

async function EditGalleryAlbumSection({ id }) {
  const item = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!item) notFound();

  return <GalleryAlbumForm initialItem={item} />;
}
