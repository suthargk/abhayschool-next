import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherFacultyList } from "./components/teacher-faculty-list";

// Not async: the header below has no data dependency, so it streams
// immediately on every nav click instead of waiting on the list's queries.
export default function TeacherFacultyPage({ searchParams }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Faculty</h1>
          <p className="text-muted-foreground">Faculty profiles you&apos;ve added.</p>
        </div>
        <Button asChild>
          <Link href="/teacher/faculty/new">
            <Plus className="size-4" />
            Add faculty
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <FacultyListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FacultyListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";

  const where = { authorId: profile.id };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { designation: { contains: q, mode: "insensitive" } },
      { department: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, totalCount] = await Promise.all([
    prisma.faculty.findMany({
      where,
      orderBy: { position: "asc" },
    }),
    prisma.faculty.count({ where: { authorId: profile.id } }),
  ]);

  return (
    <TeacherFacultyList initialItems={items} hasAnyFaculty={totalCount > 0} filters={{ q }} />
  );
}
