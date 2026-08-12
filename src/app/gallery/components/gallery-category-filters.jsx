"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { GALLERY_CATEGORIES } from "@/data/gallery-categories";
import { cn } from "@/lib/utils";

import { buildGalleryHref } from "../lib/query";
import { useScrollAlbumsOnSettle } from "../lib/use-scroll-albums-on-settle";

export function GalleryCategoryFilters({ q, year, month, category }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  useScrollAlbumsOnSettle(isPending);

  function go(nextCategory) {
    const href = buildGalleryHref({ q, year, month, category: nextCategory || undefined });
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 transition-opacity",
        isPending && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={() => go(null)}
        disabled={isPending}
        className={cn(
          "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          !category
            ? "border-primary bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </button>
      {GALLERY_CATEGORIES.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => go(c.value)}
          disabled={isPending}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            category === c.value
              ? "border-primary bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
