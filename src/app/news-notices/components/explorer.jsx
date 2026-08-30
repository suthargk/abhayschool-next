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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CATEGORIES, CATEGORY_LABEL_KEYS } from "@/lib/news-notices/categories";
import peppaNewsImage from "../../../../public/peppa_news.png";

import { TAB_TABS, RANGE_OPTIONS } from "../constants";
import { PinnedBanner } from "./pinned-banner";
import { NoticeRow } from "./notice-row";
import { PublicNewsCard } from "./public-news-card";

const TAB_LABEL_KEYS = {
  ALL: "tabAll",
  NEWS: "tabNews",
  NOTICE: "tabNotices",
  EVENTS: "tabEvents",
};

const RANGE_LABEL_KEYS = {
  ALL: "rangeAny",
  "7": "rangeLast7Days",
  "30": "rangeLast30Days",
  "365": "rangeThisYear",
};

export function NewsNoticesExplorer({
  q,
  tab,
  category,
  year,
  range,
  page,
  items,
  total,
  totalPages,
  showingFrom,
  showingTo,
  pinnedItems,
  isArchiveView,
  yearOptions,
  archiveYears,
}) {
  const t = useTranslations("newsNotices.explorer");
  const tCategories = useTranslations("newsNotices.categories");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  function buildHref(overrides) {
    const next = {
      q,
      tab,
      category,
      year,
      range,
      page,
      ...overrides,
    };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.tab && next.tab !== "ALL") params.set("tab", next.tab);
    if (next.category && next.category !== "ALL")
      params.set("category", next.category);
    if (next.year && next.year !== "ALL") params.set("year", next.year);
    if (next.range && next.range !== "ALL") params.set("range", next.range);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    const qs = params.toString();
    return qs ? `/news-notices?${qs}` : "/news-notices";
  }

  function navigate(overrides) {
    startTransition(() => {
      router.push(buildHref(overrides), { scroll: false });
    });
  }

  function handleApply(e) {
    e.preventDefault();
    navigate({ q: search, page: 1 });
  }

  return (
    <>
      {!isArchiveView ? <PinnedBanner items={pinnedItems} /> : null}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {TAB_TABS.map((tabOption) => (
            <Button
              key={tabOption.value}
              variant={tab === tabOption.value ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => navigate({ tab: tabOption.value, page: 1 })}
            >
              {t(TAB_LABEL_KEYS[tabOption.value])}
            </Button>
          ))}
          {isPending ? (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {t("updating")}
            </span>
          ) : null}
        </div>

        <form
          onSubmit={handleApply}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 sm:max-w-xs"
          />
          {tab !== "EVENTS" ? (
            <Select
              value={category}
              onValueChange={(v) => navigate({ category: v, page: 1 })}
              disabled={isPending}
            >
              <SelectTrigger className="h-11 sm:w-44">
                <SelectValue placeholder={t("allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("allCategories")}</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {tCategories(CATEGORY_LABEL_KEYS[c.value])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <Select
            value={year}
            onValueChange={(v) => navigate({ year: v, page: 1 })}
            disabled={isPending}
          >
            <SelectTrigger className="h-11 sm:w-44">
              <SelectValue placeholder={t("allYears")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allYears")}</SelectItem>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={range}
            onValueChange={(v) => navigate({ range: v, page: 1 })}
            disabled={isPending}
          >
            <SelectTrigger className="h-11 sm:w-40">
              <SelectValue placeholder={t(RANGE_LABEL_KEYS.ALL)} />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {t(RANGE_LABEL_KEYS[r.value])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" className="h-11 px-6" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {t("apply")}
          </Button>
        </form>
      </div>

      <div
        className={cn(
          "space-y-4 transition-opacity",
          isPending && "opacity-60",
        )}
        aria-busy={isPending}
      >
        {isArchiveView ? (
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              {t("archiveYear", { year })}
            </h2>
            <button
              type="button"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              onClick={() => navigate({ year: "ALL", page: 1 })}
            >
              {t("clearYear")}
            </button>
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
            <Image
              src={peppaNewsImage}
              alt=""
              width={300}
              height={364}
              className="h-auto w-24 -rotate-2 select-none drop-shadow-md"
            />
            <p className="text-sm text-muted-foreground">{t("noResults")}</p>
          </div>
        ) : tab === "NEWS" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PublicNewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : tab === "NOTICE" ? (
          <div className="space-y-2">
            {items.map((item) => (
              <NoticeRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) =>
              item.type === "NEWS" ? (
                <Link
                  key={item.id}
                  href={`/news-notices/${item.slug}`}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted sm:block">
                    {item.coverImageUrl ? (
                      <Image
                        src={item.coverImageUrl}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl">
                        📰
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-pink-600 dark:text-pink-400">
                      {t("typeNews")}
                    </span>
                    <h3 className="truncate font-semibold leading-snug">
                      {item.title}
                    </h3>
                    {item.summary ? (
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {item.summary}
                      </p>
                    ) : null}
                  </div>
                  <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
                    {item.publishedAt
                      ? format(new Date(item.publishedAt), "d MMM yyyy")
                      : null}
                  </span>
                </Link>
              ) : (
                <NoticeRow key={item.id} item={item} />
              ),
            )}
          </div>
        )}
      </div>

      {total > 0 ? (
        <div className="flex flex-col items-center gap-4 border-t pt-6 text-sm sm:flex-row sm:justify-between">
          <span className="text-muted-foreground">
            {t("showingResults", { from: showingFrom, to: showingTo, total })}
          </span>
          {totalPages > 1 ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={isPending || page <= 1}
                onClick={() => navigate({ page: page - 1 })}
              >
                {t("previousPage")}
              </Button>
              <span className="text-muted-foreground">
                {t("pageOf", { page, totalPages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending || page >= totalPages}
                onClick={() => navigate({ page: page + 1 })}
              >
                {t("nextPage")}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-3 border-t pt-8">
        <h2 className="text-sm font-medium text-muted-foreground">
          {t("browseArchive")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {archiveYears.map((y) => (
            <button
              key={y}
              type="button"
              disabled={isPending}
              onClick={() =>
                navigate({
                  q: "",
                  tab: "ALL",
                  category: "ALL",
                  year: y,
                  range: "ALL",
                  page: 1,
                })
              }
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors hover:bg-muted",
                year === y && "border-primary bg-primary/10 font-medium",
              )}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
