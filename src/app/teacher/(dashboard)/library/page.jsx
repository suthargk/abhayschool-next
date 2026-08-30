import Link from "next/link";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherLibraryList } from "./components/teacher-library-list";

// Not async: the header below has no data dependency, so it streams
// immediately on every nav click instead of waiting on the list's queries.
export default function TeacherLibraryPage({ searchParams }) {
  const t = useTranslations("teacherLibrary.page");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/teacher/library/new">
            <Plus className="size-4" />
            {t("addBook")}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <LibraryListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LibraryListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const classFilter = typeof params.class === "string" ? params.class : "ALL";

  const where = { authorId: profile.id };
  if (classFilter !== "ALL") where.class = classFilter;
  if (q) {
    where.OR = [
      { bookName: { contains: q, mode: "insensitive" } },
      { subject: { contains: q, mode: "insensitive" } },
      { publication: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, classes, totalCount] = await Promise.all([
    prisma.libraryBook.findMany({
      where,
      orderBy: [{ class: "asc" }, { position: "asc" }],
    }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    prisma.libraryBook.count({ where: { authorId: profile.id } }),
  ]);

  return (
    <TeacherLibraryList
      initialItems={items}
      classes={classes}
      hasAnyBooks={totalCount > 0}
      filters={{ q, class: classFilter }}
    />
  );
}
