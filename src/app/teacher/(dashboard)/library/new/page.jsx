import Link from "next/link";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { prisma } from "@/lib/prisma";

import { TeacherLibraryForm } from "../components/teacher-library-form";

// Not async: the header has no data dependency, so it streams immediately
// instead of waiting on the classes query below.
export default function NewTeacherLibraryPage() {
  const t = useTranslations("teacherLibrary.newPage");
  const tActions = useTranslations("common.actions");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/library">
            <ArrowLeft className="size-4" />
            {tActions("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <NewLibraryFormSection />
      </Suspense>
    </div>
  );
}

async function NewLibraryFormSection() {
  const classes = await prisma.schoolClass.findMany({ orderBy: { position: "asc" } });

  return <TeacherLibraryForm classes={classes} />;
}
