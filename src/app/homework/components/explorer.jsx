"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
import { classLabel } from "@/lib/classes";

import { RANGE_OPTIONS } from "../constants";
import { SummaryStats } from "./summary-stats";
import { HomeworkList } from "./homework-list";

const RANGE_LABEL_KEYS = {
  THIS_WEEK: "rangeThisWeek",
  NEXT_WEEK: "rangeNextWeek",
  ALL: "rangeAll",
};

export function HomeworkExplorer({
  q,
  classFilter,
  subject,
  range,
  page,
  items,
  total,
  totalPages,
  showingFrom,
  showingTo,
  counts,
  classes,
  classOptions,
  subjectOptions,
}) {
  const t = useTranslations("homework.explorer");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  function buildHref(overrides) {
    const next = { q, class: classFilter, subject, range, page, ...overrides };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.class && next.class !== "ALL") params.set("class", next.class);
    if (next.subject && next.subject !== "ALL")
      params.set("subject", next.subject);
    if (next.range && next.range !== "THIS_WEEK")
      params.set("range", next.range);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    const qs = params.toString();
    return qs ? `/homework?${qs}` : "/homework";
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
      <SummaryStats counts={counts} />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {RANGE_OPTIONS.map((r) => (
            <Button
              key={r.value}
              variant={range === r.value ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => navigate({ range: r.value, page: 1 })}
            >
              {t(RANGE_LABEL_KEYS[r.value])}
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
          <Select
            value={classFilter}
            onValueChange={(v) => navigate({ class: v, page: 1 })}
            disabled={isPending}
          >
            <SelectTrigger className="h-11 sm:w-44">
              <SelectValue placeholder={t("allClasses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allClasses")}</SelectItem>
              {classOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {classLabel(classes, c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={subject}
            onValueChange={(v) => navigate({ subject: v, page: 1 })}
            disabled={isPending}
          >
            <SelectTrigger className="h-11 sm:w-44">
              <SelectValue placeholder={t("allSubjects")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allSubjects")}</SelectItem>
              {subjectOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
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
        className={cn("space-y-6 transition-opacity", isPending && "opacity-60")}
        aria-busy={isPending}
      >
        <HomeworkList items={items} />
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
                {t("previous")}
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
                {t("next")}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
