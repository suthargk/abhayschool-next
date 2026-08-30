"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
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

import { buildGalleryHref } from "../lib/query";
import { useScrollAlbumsOnSettle } from "../lib/use-scroll-albums-on-settle";

export function GalleryFilters({
  initialQuery,
  initialYear,
  initialMonth,
  initialCategory,
  years,
}) {
  const router = useRouter();
  const t = useTranslations("gallery.filters");
  const MONTHS = t.raw("months");
  const [isPending, startTransition] = useTransition();
  useScrollAlbumsOnSettle(isPending);
  const [q, setQ] = useState(initialQuery ?? "");
  const [year, setYear] = useState(initialYear ? String(initialYear) : "all");
  const [month, setMonth] = useState(initialMonth ? String(initialMonth) : "all");

  const hasActiveFilters = Boolean(initialQuery || initialYear || initialMonth);

  function submit(e) {
    e.preventDefault();
    const href = buildGalleryHref({
      q: q.trim(),
      year: year !== "all" ? year : undefined,
      month: month !== "all" ? month : undefined,
      category: initialCategory,
    });
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-9 pl-8"
        />
      </div>

      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="h-9 w-32">
          <SelectValue placeholder={t("allYears")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allYears")}</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={month} onValueChange={setMonth}>
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder={t("allMonths")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allMonths")}</SelectItem>
          {MONTHS.map((label, index) => (
            <SelectItem key={label} value={String(index + 1)}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" size="sm" className="h-9" disabled={isPending}>
        {isPending ? t("searching") : t("search")}
      </Button>
      {hasActiveFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9"
          disabled={isPending}
          onClick={() => {
            setQ("");
            setYear("all");
            setMonth("all");
            startTransition(() => {
              router.push("/gallery", { scroll: false });
            });
          }}
        >
          {t("clear")}
        </Button>
      ) : null}
    </form>
  );
}
