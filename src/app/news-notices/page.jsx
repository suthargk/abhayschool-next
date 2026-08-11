import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import peppaNewsImage from "../../../public/peppa_news.png";

const PAGE_SIZE = 10;

const TYPE_TABS = [
  { value: "ALL", label: "All" },
  { value: "NEWS", label: "News" },
  { value: "NOTICE", label: "Notices" },
];

function buildHref({ q, type, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type && type !== "ALL") params.set("type", type);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/news-notices?${qs}` : "/news-notices";
}

export default async function NewsNoticesPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const type = ["NEWS", "NOTICE"].includes(params.type) ? params.type : "ALL";
  const page = Math.max(1, Number(params.page) || 1);

  const where = {
    status: "PUBLISHED",
    ...(type !== "ALL" ? { type } : {}),
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
    prisma.newsNotice.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.newsNotice.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            News &amp; Notices
          </h1>
          <p className="text-muted-foreground">
            All announcements, updates, and stories from the school.
          </p>
        </div>
        <Image
          src={peppaNewsImage}
          alt=""
          width={300}
          height={364}
          className="hidden h-auto w-28 shrink-0 -rotate-3 select-none drop-shadow-xl sm:block sm:w-36"
          priority
        />
      </div>

      <div className="space-y-4">
        <form className="flex gap-3" action="/news-notices" method="GET">
          {type !== "ALL" ? (
            <input type="hidden" name="type" value={type} />
          ) : null}
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search news & notices…"
            className="h-11"
          />
          <Button type="submit" className="h-11 px-6">
            Search
          </Button>
        </form>

        <div className="flex gap-2">
          {TYPE_TABS.map((tab) => (
            <Button
              key={tab.value}
              asChild
              variant={type === tab.value ? "default" : "outline"}
              size="sm"
            >
              <Link href={buildHref({ q, type: tab.value, page: 1 })}>
                {tab.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
            <Image
              src={peppaNewsImage}
              alt=""
              width={300}
              height={364}
              className="h-auto w-24 -rotate-2 select-none drop-shadow-md"
            />
            <p className="text-sm text-muted-foreground">
              No results found. Try a different search or check back soon!
            </p>
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/news-notices/${item.slug}`}
              className="block rounded-lg border p-5 transition-colors hover:bg-muted/50 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    item.type === "NOTICE"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-violet-100 text-violet-700 dark:bg-zinc-800 dark:text-zinc-300",
                  )}
                >
                  {item.type === "NEWS" ? "News" : "Notice"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.publishedAt
                    ? format(new Date(item.publishedAt), "MMM d, yyyy")
                    : null}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold leading-snug">
                {item.title}
              </h2>
              {item.summary ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              ) : null}
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
            <Link href={buildHref({ q, type, page: page - 1 })}>
              ← Previous
            </Link>
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
            <Link href={buildHref({ q, type, page: page + 1 })}>
              Next →
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
