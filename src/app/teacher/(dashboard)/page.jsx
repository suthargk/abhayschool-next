import Link from "next/link";
import { Suspense } from "react";
import { GraduationCap, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { classLabel } from "@/lib/classes";
import { prisma } from "@/lib/prisma";
import { teacherFullName } from "@/lib/teacher";

export default async function TeacherDashboardPage() {
  // Cheap/cached (already resolved once by the dashboard layout for this
  // request) — kept at the top level so the header renders immediately
  // instead of waiting on the stats/assignments queries below.
  const profile = await getCurrentProfile();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {teacherFullName(profile) || "Teacher"}
        </h1>
        <p className="text-muted-foreground">Post and manage homework for your classes.</p>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats profileId={profile.id} />
      </Suspense>
    </div>
  );
}

async function DashboardStats({ profileId }) {
  const [assignments, classes, homeworkCount] = await Promise.all([
    prisma.teacherAssignment.findMany({
      where: { teacherId: profileId },
      orderBy: [{ class: "asc" }, { subject: "asc" }],
    }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    prisma.homework.count({ where: { authorId: profileId } }),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <GraduationCap className="size-4" />
          <span className="text-sm font-medium">Homework posted</span>
        </div>
        <p className="mt-2 text-3xl font-semibold">{homeworkCount}</p>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Your assignments</span>
          <Button asChild size="sm">
            <Link href="/teacher/homework/new">
              <Plus className="size-4" />
              Add homework
            </Link>
          </Button>
        </div>
        {assignments.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No classes/subjects assigned yet. Contact an admin.
          </p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm">
            {assignments.map((a) => (
              <li key={a.id}>
                {classLabel(classes, a.class)} — {a.subject}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
