import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherFacilityForm } from "../../components/teacher-facility-form";

export default async function EditTeacherFacilityPage({ params }) {
  const t = await getTranslations("teacherFacilities.form");
  const tActions = await getTranslations("common.actions");
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/facilities">
            <ArrowLeft className="size-4" />
            {tActions("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("editHeading")}</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditFacilityFormSection params={params} />
      </Suspense>
    </div>
  );
}

async function EditFacilityFormSection({ params }) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  const item = await prisma.facility.findUnique({ where: { id } });

  if (!item || item.authorId !== profile.id) notFound();

  return <TeacherFacilityForm initialItem={item} />;
}
