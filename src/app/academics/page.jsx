import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const PAGE_SIZE = 10;

function buildHref({ q, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/academics?${qs}` : "/academics";
}

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

        <form className="flex gap-3" action="/academics" method="GET">
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search academic posts…"
            className="h-11"
          />
          <Button type="submit" className="h-11 px-6">
            Search
          </Button>
        </form>

        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              No results found. Try a different search or check back soon!
            </p>
          ) : (
            items.map((item) => (
              <Link
                key={item.id}
                href={`/academics/${item.slug}`}
                className="flex gap-4 rounded-lg border p-5 transition-colors hover:bg-muted/50 sm:p-6"
              >
                {item.coverImageUrl ? (
                  <Image
                    src={item.coverImageUrl}
                    alt=""
                    width={160}
                    height={160}
                    className="hidden size-24 shrink-0 rounded-md border object-cover sm:block"
                    unoptimized
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-muted-foreground">
                    {item.publishedAt
                      ? format(new Date(item.publishedAt), "MMM d, yyyy")
                      : null}
                  </span>
                  <h2 className="mt-1 text-lg font-semibold leading-snug">
                    {item.title}
                  </h2>
                  {item.summary ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))
          )}
        </div>

        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t pt-6 text-sm">
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            >
              <Link href={buildHref({ q, page: page - 1 })}>← Previous</Link>
            </Button>
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }
            >
              <Link href={buildHref({ q, page: page + 1 })}>Next →</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
