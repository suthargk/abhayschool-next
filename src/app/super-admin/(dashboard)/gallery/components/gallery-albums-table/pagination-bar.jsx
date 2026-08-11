import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { buildHref } from "./columns";

export function GalleryAlbumsPaginationBar({
  search,
  page,
  totalPages,
  total,
  pageSize,
}) {
  if (totalPages <= 1) return null;

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {rangeStart}-{rangeEnd} of {total}
      </p>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <Link
              href={buildHref({ q: search, page: page - 1 })}
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : undefined}
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "gap-1 pl-2.5",
                page <= 1 && "pointer-events-none opacity-50"
              )}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Link>
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <Link
              href={buildHref({ q: search, page: page + 1 })}
              aria-disabled={page >= totalPages}
              tabIndex={page >= totalPages ? -1 : undefined}
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "gap-1 pr-2.5",
                page >= totalPages && "pointer-events-none opacity-50"
              )}
            >
              Next
              <ChevronRight className="size-4" />
            </Link>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
