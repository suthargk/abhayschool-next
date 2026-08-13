import Link from "next/link";
import { format } from "date-fns";
import { Pin } from "lucide-react";

import { categoryLabel } from "@/lib/news-notices/categories";

export function NoticeRow({ item }) {
  return (
    <Link
      href={`/news-notices/${item.slug}`}
      className="flex items-center gap-4 rounded-lg border px-4 py-3 text-sm transition-colors hover:bg-muted/50"
    >
      <span className="w-20 shrink-0 text-xs text-muted-foreground sm:w-24">
        {item.publishedAt
          ? format(new Date(item.publishedAt), "d MMM yyyy")
          : null}
      </span>
      {item.pinned ? (
        <Pin className="size-3.5 shrink-0 text-amber-500" />
      ) : null}
      <span className="min-w-0 flex-1 truncate font-medium">
        {item.title}
      </span>
      <span className="hidden shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline-block">
        {categoryLabel(item.category)}
      </span>
    </Link>
  );
}
