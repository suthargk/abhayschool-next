import { prisma } from "@/lib/prisma";

import { AcademicsExplorer } from "./components/explorer";

export const revalidate = 60;

const PAGE_SIZE = 10;

export default async function AcademicsPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);

  const where = {
    status: "PUBLISHED",
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.academicPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.academicPost.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Academics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Programs, updates, and stories from our academic team.
          </p>
        </div>

        <AcademicsExplorer
          q={q}
          page={page}
          totalPages={totalPages}
          items={items}
        />
      </div>
    </div>
  );
}
