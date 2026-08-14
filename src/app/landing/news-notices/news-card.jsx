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
    badgeOnDark: "bg-white/15 text-white backdrop-blur-sm",
    iconWrap: "bg-pink-500 text-white",
    gradient: "bg-gradient-to-br from-pink-500 via-pink-500 to-rose-600",
  },
  NOTICE: {
    label: "Notice",
    icon: Megaphone,
    badge: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    badgeOnDark: "bg-white/15 text-white backdrop-blur-sm",
    iconWrap: "bg-red-500 text-white",
    gradient: "bg-gradient-to-br from-red-500 via-red-500 to-orange-500",
  },
};

export const FeaturedNewsCard = ({ item }) => {
  const meta = TYPE_META[item.type] ?? TYPE_META.NEWS;
  const Icon = meta.icon;
  const hasImage = Boolean(item.coverImageUrl);

  return (
    <Link
      href={`/news-notices/${item.slug}`}
      className={cn(
        "group relative flex min-h-[260px] flex-col overflow-hidden rounded-3xl duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-300/30",
        !hasImage && meta.gradient,
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        </>
      ) : (
        <Icon
          aria-hidden
          className="pointer-events-none absolute -bottom-8 -right-8 size-56 rotate-[-8deg] text-white/10"
          strokeWidth={1.25}
        />
      )}

      <div className="relative flex h-full flex-col justify-between p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
              meta.badgeOnDark,
            )}
          >
            <Icon className="size-3.5" />
            {meta.label}
          </span>
          {item.pinned ? (
            <span className="flex size-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <Pin className="size-3.5 text-white" />
            </span>
          ) : null}
        </div>

        <div className="mt-auto max-w-xl">
          <h3 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
            {item.title}
          </h3>
          {item.summary ? (
            <p className="mt-3 line-clamp-2 text-sm font-light text-white/80 sm:text-base">
              {item.summary}
            </p>
          ) : null}
          <div className="mt-5 flex items-center gap-2 text-sm text-white/70">
            {item.publishedAt ? (
              <span>{format(new Date(item.publishedAt), "MMM d, yyyy")}</span>
            ) : null}
            <span className="flex items-center gap-1 font-medium text-white transition-transform duration-200 group-hover:translate-x-0.5">
              Read more
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const NewsCard = ({ item }) => {
  const meta = TYPE_META[item.type] ?? TYPE_META.NEWS;
  const Icon = meta.icon;

  return (
    <Link
      href={`/news-notices/${item.slug}`}
      className="group relative flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-4 duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md hover:shadow-pink-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          meta.iconWrap,
        )}
      >
        <Icon className="size-4.5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              meta.badge,
            )}
          >
            {meta.label}
          </span>
          {item.pinned ? <Pin className="size-3 text-amber-500" /> : null}
          {item.publishedAt ? (
            <span className="ml-auto shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
              {format(new Date(item.publishedAt), "MMM d, yyyy")}
            </span>
          ) : null}
        </div>

        <h3 className="mt-1.5 truncate font-semibold text-zinc-900 group-hover:text-pink-600 dark:text-zinc-50 dark:group-hover:text-pink-400">
          {item.title}
        </h3>
        {item.summary ? (
          <p className="mt-0.5 line-clamp-1 text-sm font-light text-zinc-500 dark:text-zinc-400">
            {item.summary}
          </p>
        ) : null}
      </div>

      <ArrowUpRight className="mt-1 size-4 shrink-0 text-zinc-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-zinc-600" />
    </Link>
  );
};
