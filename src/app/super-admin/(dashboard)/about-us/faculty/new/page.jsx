import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { prisma } from "@/lib/prisma";

import { FacultyForm } from "../components/faculty-form";

export default async function NewFacultyPage() {
  const t = await getTranslations("superAdminFaculty.newPage");
  const tCommon = await getTranslations("common.actions");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/about-us/faculty">
            <ArrowLeft className="size-4" />
            {tCommon("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <NewFacultyFormSection />
      </Suspense>
    </div>
  );
}

async function NewFacultyFormSection() {
  const [classes, subjects] = await Promise.all([
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    prisma.subject.findMany({ orderBy: { position: "asc" } }),
  ]);

  return <FacultyForm classes={classes} subjects={subjects} />;
}
