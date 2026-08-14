"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

function buildHref(basePath, params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    usp.set(key, String(value));
  });
  const qs = usp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/**
 * Server-driven search box: submitting pushes a new URL (searchParams) so
 * the route's server component re-fetches, instead of the browser doing a
 * full document GET reload. Resets to page 1 and keeps the current page
 * size. `onPendingChange` reports when a navigation is in flight so the
 * table can show a loading state.
 */
export function DataTableSearch({
  basePath,
  defaultValue,
  pageSize,
  defaultPageSize,
  placeholder,
  className,
  onPendingChange,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  function handleSubmit(event) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q");

    startTransition(() => {
      router.push(
        buildHref(basePath, {
          q: typeof q === "string" ? q.trim() || undefined : undefined,
          pageSize: pageSize !== defaultPageSize ? pageSize : undefined,
        })
      );
    });
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="pl-8"
        disabled={isPending}
      />
    </form>
  );
}
