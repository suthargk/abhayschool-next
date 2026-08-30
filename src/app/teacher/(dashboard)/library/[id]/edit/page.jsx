import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherLibraryForm } from "../../components/teacher-library-form";

// Not async: the header has no data dependency, so it streams immediately
// instead of waiting on the book/classes queries below.
export default function EditTeacherLibraryPage({ params }) {
  const t = useTranslations("teacherLibrary.editPage");
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
        <EditLibraryFormSection params={params} />
      </Suspense>
    </div>
  );
}

async function EditLibraryFormSection({ params }) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  const [item, classes] = await Promise.all([
    prisma.libraryBook.findUnique({ where: { id } }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!item || item.authorId !== profile.id) notFound();

  return <TeacherLibraryForm initialItem={item} classes={classes} />;
}
