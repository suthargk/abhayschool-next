import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { prisma } from "@/lib/prisma";

import { TeacherFacultyForm } from "../components/teacher-faculty-form";

// Not async: the header has no data dependency, so it streams immediately
// instead of waiting on the classes query below.
export default function NewTeacherFacultyPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/faculty">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add faculty</h1>
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

  return <TeacherFacultyForm classes={classes} subjects={subjects} />;
}
