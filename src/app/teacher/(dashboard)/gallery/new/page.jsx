import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { TeacherGalleryForm } from "../components/teacher-gallery-form";

export default async function NewTeacherGalleryPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">{t("newHeading")}</h1>
      </div>
      <TeacherGalleryForm />
    </div>
  );
}
