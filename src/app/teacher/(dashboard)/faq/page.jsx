import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherFaqList } from "./components/teacher-faq-list";

// Async only for the translations lookup — the header itself has no data
// dependency, so it still streams immediately instead of waiting on the
// list's queries below.
export default async function TeacherFaqPage({ searchParams }) {
  const t = await getTranslations("teacherFaq.page");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/teacher/faq/new">
            <Plus className="size-4" />
            {t("addButton")}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <FaqListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FaqListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";

  const where = { authorId: profile.id };
  if (q) {
    where.OR = [
      { question: { contains: q, mode: "insensitive" } },
      { answer: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, totalCount] = await Promise.all([
    prisma.faq.findMany({
      where,
      orderBy: { position: "asc" },
    }),
    prisma.faq.count({ where: { authorId: profile.id } }),
  ]);

  return (
    <TeacherFaqList initialItems={items} hasAnyFaqs={totalCount > 0} filters={{ q }} />
  );
}
