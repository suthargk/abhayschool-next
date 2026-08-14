"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

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
 * Server-driven pagination bar: every page/page-size change pushes a new URL
 * (searchParams), so the route's server component re-fetches and re-renders
 * — nothing here is client-side-only state. `onPendingChange` reports when a
 * navigation is in flight so the table can show a loading state.
 */
export function DataTablePagination({
  basePath,
  search,
  page,
  pageSize,
  defaultPageSize = 10,
  total,
  totalPages,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPendingChange,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  if (total === 0) return null;

  function navigate(href) {
    startTransition(() => {
      router.push(href);
    });
  }

  function hrefFor(targetPage) {
    return buildHref(basePath, {
      q: search || undefined,
      page: targetPage > 1 ? targetPage : undefined,
      pageSize: pageSize !== defaultPageSize ? pageSize : undefined,
    });
  }

  function handlePageSizeChange(value) {
    navigate(
      buildHref(basePath, {
        q: search || undefined,
        pageSize: Number(value) !== defaultPageSize ? value : undefined,
      })
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select
          value={String(pageSize)}
          onValueChange={handlePageSizeChange}
          disabled={isPending}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="First page"
            disabled={isPending || page <= 1}
            onClick={() => navigate(hrefFor(1))}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Previous page"
            disabled={isPending || page <= 1}
            onClick={() => navigate(hrefFor(page - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Next page"
            disabled={isPending || page >= totalPages}
            onClick={() => navigate(hrefFor(page + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Last page"
            disabled={isPending || page >= totalPages}
            onClick={() => navigate(hrefFor(totalPages))}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
