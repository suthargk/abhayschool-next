"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useIsSeen } from "@/hooks/use-is-seen";
import { isRecentlyPublished } from "@/lib/new-badge";

/** "New" pill for an item this browser hasn't opened yet and that was published recently. */
export function NewBadge({ scope, id, publishedAt, className }) {
  const t = useTranslations("common.badges");
  const isSeen = useIsSeen(scope, id);

  if (isSeen || !isRecentlyPublished(publishedAt)) return null;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
        className,
      )}
    >
      {t("new")}
    </span>
  );
}
