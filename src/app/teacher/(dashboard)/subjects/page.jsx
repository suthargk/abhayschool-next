import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";

import { TeacherSubjectsAdmin } from "./components/teacher-subjects-admin";

export default async function TeacherSubjectsPage() {
  const t = await getTranslations("teacherSubjects");
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Suspense fallback={<Skeleton className="h-64 w-full max-w-xl" />}>
        <SubjectsSection />
      </Suspense>
    </div>
  );
}

async function SubjectsSection() {
  const items = await prisma.subject.findMany({ orderBy: { position: "asc" } });
  return <TeacherSubjectsAdmin initialItems={items} />;
}
