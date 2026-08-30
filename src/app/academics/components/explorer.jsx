"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function buildHref({ q, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/academics?${qs}` : "/academics";
}

export function AcademicsExplorer({ q, page, totalPages, items }) {
  const t = useTranslations("academics.explorer");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  function navigate(overrides) {
    startTransition(() => {
      router.push(buildHref({ q, page, ...overrides }), { scroll: false });
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate({ q: search, page: 1 });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11"
        />
        <Button type="submit" className="h-11 px-6" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {t("search")}
        </Button>
      </form>

      <div
        className={cn("space-y-4 transition-opacity", isPending && "opacity-60")}
        aria-busy={isPending}
      >
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            {t("empty")}
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
            variant="outline"
            size="sm"
            disabled={isPending || page <= 1}
            onClick={() => navigate({ page: page - 1 })}
          >
            {t("previous")}
          </Button>
          {isPending ? (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {t("loading")}
            </span>
          ) : (
            <span className="text-muted-foreground">
              {t("pageOf", { page, totalPages })}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={isPending || page >= totalPages}
            onClick={() => navigate({ page: page + 1 })}
          >
            {t("next")}
          </Button>
        </div>
      ) : null}
    </>
  );
}
