"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function GalleryFilters({
  initialQuery,
  initialYear,
  initialMonth,
  initialCategory,
  years,
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery ?? "");
  const [year, setYear] = useState(initialYear ? String(initialYear) : "all");
  const [month, setMonth] = useState(initialMonth ? String(initialMonth) : "all");

  const hasActiveFilters = Boolean(initialQuery || initialYear || initialMonth);

  function submit(e) {
    e.preventDefault();
    router.push(
      buildGalleryHref({
        q: q.trim(),
        year: year !== "all" ? year : undefined,
        month: month !== "all" ? month : undefined,
        category: initialCategory,
      }),
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search albums…"
          className="h-9 pl-8"
        />
      </div>

      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="h-9 w-32">
          <SelectValue placeholder="All years" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All years</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={month} onValueChange={setMonth}>
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="All months" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All months</SelectItem>
          {MONTHS.map((label, index) => (
            <SelectItem key={label} value={String(index + 1)}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" size="sm" className="h-9">
        Search
      </Button>
      {hasActiveFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9"
          onClick={() => {
            setQ("");
            setYear("all");
            setMonth("all");
            router.push("/gallery");
          }}
        >
          Clear
        </Button>
      ) : null}
    </form>
  );
}
