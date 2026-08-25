import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";

import { TeacherClassesAdmin } from "./components/teacher-classes-admin";

export default function TeacherClassesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">
          Manage the list of classes used across Library, Homework, and Time Table.
        </p>
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
