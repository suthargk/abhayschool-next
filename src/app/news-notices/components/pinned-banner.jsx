import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Pin } from "lucide-react";
import { useTranslations } from "next-intl";

export function PinnedBanner({ items }) {
  const t = useTranslations("newsNotices.pinnedBanner");
  if (!items?.length) return null;
  const [primary, ...rest] = items;

  return (
    <div className="space-y-3">
      <Link
        href={`/news-notices/${primary.slug}`}
        className="block rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 transition-colors hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:hover:bg-amber-500/15"
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          <Pin className="size-3.5 fill-current" />
          {primary.type === "NOTICE"
            ? t("importantNotice")
            : t("importantNews")}
        </div>
        <h2 className="mt-2 text-xl font-semibold leading-snug text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          {primary.title}
        </h2>
        {primary.summary ? (
          <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {primary.summary}
          </p>
        ) : null}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-500">
            {primary.publishedAt
              ? t("publishedOn", {
                  date: format(new Date(primary.publishedAt), "d MMM yyyy"),
                })
              : null}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
            {primary.type === "NOTICE"
              ? t("readFullNotice")
              : t("readFullStory")}
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </Link>

      {rest.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {rest.map((item) => (
            <Link
              key={item.id}
              href={`/news-notices/${item.slug}`}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
            >
              <Pin className="size-3.5 shrink-0 text-amber-500" />
              <span className="truncate font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
