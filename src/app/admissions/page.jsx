import { Suspense } from "react";
import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";

import { AdmissionForm } from "./components/admission-form";

export default function AdmissionsPage() {
  const t = useTranslations("admissions.page");

  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-2xl space-y-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("heading")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <AdmissionFormSection />
        </Suspense>
      </div>
    </div>
  );
}

async function AdmissionFormSection() {
  const classes = await prisma.schoolClass.findMany({ orderBy: { position: "asc" } });

  return <AdmissionForm classes={classes} />;
}
