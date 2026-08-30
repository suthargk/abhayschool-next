import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";

import { TeacherClassesAdmin } from "./components/teacher-classes-admin";

export default async function TeacherClassesPage() {
  const t = await getTranslations("teacherClasses");
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Suspense fallback={<Skeleton className="h-64 w-full max-w-xl" />}>
        <ClassesSection />
      </Suspense>
    </div>
  );
}

async function ClassesSection() {
  const items = await prisma.schoolClass.findMany({ orderBy: { position: "asc" } });
  return <TeacherClassesAdmin initialItems={items} />;
}
