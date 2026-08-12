"use client";

import { useRouter } from "next/navigation";

import { GALLERY_CATEGORIES } from "@/data/gallery-categories";
import { cn } from "@/lib/utils";

import { buildGalleryHref } from "../lib/query";

export function GalleryCategoryFilters({ q, year, month, category }) {
  const router = useRouter();

  function go(nextCategory) {
    router.push(
      buildGalleryHref({ q, year, month, category: nextCategory || undefined }),
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => go(null)}
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
