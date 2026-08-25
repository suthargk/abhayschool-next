import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { TeacherTestimonialsList } from "./components/teacher-testimonials-list";

const DEFAULT_PAGE_SIZE = 10;

// Not async: the header below has no data dependency, so it streams
// immediately on every nav click instead of waiting on the list's queries.
export default function TeacherTestimonialsPage({ searchParams }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">Testimonials you&apos;ve added.</p>
        </div>
        <Button asChild>
          <Link href="/teacher/testimonials/new">
            <Plus className="size-4" />
            Add testimonial
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <TestimonialsListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function TestimonialsListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  const where = { authorId: profile.id };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { designation: { contains: q, mode: "insensitive" } },
      { quote: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total, totalCount] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      orderBy: { position: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.testimonial.count({ where }),
    prisma.testimonial.count({ where: { authorId: profile.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <TeacherTestimonialsList
      initialItems={items}
      hasAnyTestimonials={totalCount > 0}
      filters={{ q }}
      page={page}
      pageSize={pageSize}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      total={total}
      totalPages={totalPages}
    />
  );
}
