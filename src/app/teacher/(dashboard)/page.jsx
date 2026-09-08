import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, GraduationCap, Layers, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
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
  const t = await getTranslations("teacherDashboard.home");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("welcome", { name: teacherFullName(profile) || t("defaultTeacherName") })}
        </h1>
        <p className="text-muted-foreground">{t("subheading")}</p>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats profileId={profile.id} />
      </Suspense>
    </div>
  );
}

async function DashboardStats({ profileId }) {
  const t = await getTranslations("teacherDashboard.home");
  const [assignments, classes, homeworkCount] = await Promise.all([
    prisma.teacherAssignment.findMany({
      where: { teacherId: profileId },
    }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    prisma.homework.count({ where: { authorId: profileId } }),
  ]);

  // Group by class and sort by the school's configured class order (not the
  // raw enum value), so e.g. Nursery sorts before Class II instead of after.
  const classPosition = new Map(classes.map((c, i) => [c.value, i]));
  const byClass = new Map();
  for (const a of assignments) {
    if (!byClass.has(a.class)) byClass.set(a.class, []);
    byClass.get(a.class).push(a.subject);
  }
  const groups = [...byClass.entries()]
    .sort(([a], [b]) => (classPosition.get(a) ?? 0) - (classPosition.get(b) ?? 0))
    .map(([classValue, subjects]) => ({
      classValue,
      label: classLabel(classes, classValue),
      subjects: [...subjects].sort(),
    }));
  const subjectsAssignedCount = new Set(assignments.map((a) => a.subject)).size;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile icon={GraduationCap} label={t("homeworkPosted")} value={homeworkCount} />
        <StatTile icon={BookOpen} label={t("classesAssigned")} value={groups.length} />
        <StatTile icon={Layers} label={t("subjectsAssigned")} value={subjectsAssignedCount} />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              {t("yourAssignments")}
            </h2>
            {groups.length > 0 && (
              <p className="text-xs text-muted-foreground/70">
                {t("assignmentsCount", { count: groups.length })}
              </p>
            )}
          </div>
          <Button asChild size="sm">
            <Link href="/teacher/homework/new">
              <Plus className="size-4" />
              {t("addHomework")}
            </Link>
          </Button>
        </div>

        {groups.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
            <GraduationCap className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t("noAssignments")}</p>
          </div>
        ) : (
          <div className="mt-4 grid max-h-[26rem] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {groups.map((g) => (
              <div key={g.classValue} className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm font-semibold">{g.label}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {g.subjects.map((s) => (
                    <Badge key={s} variant="outline" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function DashboardStatsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6">
        <Skeleton className="h-4 w-40" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
