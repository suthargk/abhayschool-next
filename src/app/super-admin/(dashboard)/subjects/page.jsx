import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";

import { SubjectsAdmin } from "./components/subjects-admin";

export default function SuperAdminSubjectsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Subjects</h1>
        <p className="text-muted-foreground">
          Manage the list of subjects used across Faculty, Homework, and Time Table.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-64 w-full max-w-xl" />}>
        <SubjectsSection />
      </Suspense>
    </div>
  );
}

async function SubjectsSection() {
  const items = await prisma.subject.findMany({ orderBy: { position: "asc" } });
  return <SubjectsAdmin initialItems={items} />;
}
