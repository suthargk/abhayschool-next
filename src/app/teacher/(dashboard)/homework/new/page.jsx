import Link from "next/link";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherHomeworkForm } from "../components/teacher-homework-form";

// Not async: the header has no data dependency, so it streams immediately
// instead of waiting on the assignments/classes queries below.
export default function NewTeacherHomeworkPage() {
  const t = useTranslations("teacherHomework.newPage");
  const tActions = useTranslations("common.actions");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/homework">
            <ArrowLeft className="size-4" />
            {tActions("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <NewHomeworkFormSection />
      </Suspense>
    </div>
  );
}

async function NewHomeworkFormSection() {
  const profile = await getCurrentProfile();

  const [assignments, classes] = await Promise.all([
    prisma.teacherAssignment.findMany({ where: { teacherId: profile.id } }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  return <TeacherHomeworkForm assignments={assignments} classes={classes} />;
}
