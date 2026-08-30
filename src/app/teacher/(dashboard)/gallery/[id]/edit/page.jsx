import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherGalleryForm } from "../../components/teacher-gallery-form";

// Not async: the header has no data dependency, so it streams immediately
// instead of waiting on the album query below.
export default async function EditTeacherGalleryPage({ params }) {
  const t = await getTranslations("teacherGallery.form");
  const tActions = await getTranslations("common.actions");
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/gallery">
            <ArrowLeft className="size-4" />
            {tActions("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("editHeading")}</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditGalleryFormSection params={params} />
      </Suspense>
    </div>
  );
}

async function EditGalleryFormSection({ params }) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  const item = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!item || item.authorId !== profile.id) notFound();

  return <TeacherGalleryForm initialItem={item} />;
}
