import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowUpRight, Megaphone, Newspaper, Pin } from "lucide-react";

import { cn } from "@/lib/utils";

const TYPE_META = {
  NEWS: {
    label: "News",
    icon: Newspaper,
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300",
    iconWrap: "bg-pink-400 text-white",
  },
  NOTICE: {
    label: "Notice",
    icon: Megaphone,
    badge: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    iconWrap: "bg-red-500 text-white",
  },
};

export const NewsCard = ({ item, featured }) => {
  const meta = TYPE_META[item.type] ?? TYPE_META.NEWS;
  const Icon = meta.icon;
  const hasImage = featured && item.coverImageUrl;

  const badgeRow = (
    <div className="relative flex items-start justify-between gap-4">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          meta.iconWrap,
        )}
      >
        <Icon className="size-4" />
      </div>
      <span className="flex shrink-0 items-center gap-1.5">
        {item.pinned ? (
          <Pin
            className={cn(
              "size-3.5",
              hasImage ? "text-white" : "text-amber-500",
            )}
          />
        ) : null}
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            meta.badge,
          )}
        >
          {meta.label}
        </span>
      </span>
    </div>
  );

  const textBlock = (
    <div className="relative">
      <h3
        className={cn(
          "font-semibold",
          hasImage ? "text-white" : "text-zinc-900 dark:text-zinc-50",
          featured ? "text-2xl leading-snug" : "text-base leading-snug",
        )}
      >
        {item.title}
      </h3>
      {item.summary ? (
        <p
          className={cn(
            "mt-2 font-light",
            hasImage ? "text-zinc-200" : "text-zinc-600 dark:text-zinc-400",
            featured ? "text-sm line-clamp-3" : "text-sm line-clamp-2",
          )}
        >
          {item.summary}
        </p>
      ) : null}
      {item.publishedAt ? (
        <div
          className={cn(
            "mt-4 text-xs",
            hasImage ? "text-zinc-300" : "text-zinc-500 dark:text-zinc-500",
          )}
        >
          {format(new Date(item.publishedAt), "MMM d, yyyy")}
        </div>
      ) : null}
    </div>
  );

  return (
    <Link
      href={`/news-notices/${item.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[2rem] border-2 border-transparent duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-200/50 dark:border-zinc-800 dark:hover:border-zinc-700",
        hasImage ? "bg-zinc-900" : "bg-pink-50 p-6 dark:bg-zinc-900",
        featured ? "h-full" : "min-h-[128px]",
      )}
    >
      {hasImage ? (
        <>
          <Image
            src={item.coverImageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="relative flex h-full flex-col justify-between p-6">
            {badgeRow}
            {textBlock}
          </div>
        </>
      ) : featured ? (
        <div className="relative flex h-full flex-col">
          {badgeRow}
          <div className="flex flex-1 items-center justify-center py-6">
            <div
              className={cn(
                "flex size-20 items-center justify-center rounded-3xl",
                meta.iconWrap,
              )}
            >
              <Icon className="size-9" />
            </div>
          </div>
          <div className="mt-auto">{textBlock}</div>
        </div>
      ) : (
        <>
          {badgeRow}
          <div className="mt-4">{textBlock}</div>
        </>
      )}

      <ArrowUpRight
        className={cn(
          "absolute right-5 top-5 size-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          hasImage ? "text-white" : "text-zinc-400",
        )}
      />
    </Link>
  );
};
