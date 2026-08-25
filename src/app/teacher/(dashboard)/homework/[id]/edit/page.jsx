import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherHomeworkForm } from "../../components/teacher-homework-form";

// Not async: the header has no data dependency, so it streams immediately
// instead of waiting on the homework/assignments/classes queries below.
export default function EditTeacherHomeworkPage({ params }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/homework">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditHomeworkFormSection params={params} />
      </Suspense>
    </div>
  );
}

async function EditHomeworkFormSection({ params }) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  const [item, assignments, classes] = await Promise.all([
    prisma.homework.findUnique({ where: { id }, include: { attachments: true } }),
    prisma.teacherAssignment.findMany({ where: { teacherId: profile.id } }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!item || item.authorId !== profile.id) notFound();

  return <TeacherHomeworkForm initialItem={item} assignments={assignments} classes={classes} />;
}
