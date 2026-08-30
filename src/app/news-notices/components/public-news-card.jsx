import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { CATEGORY_LABEL_KEYS, categoryBadgeClass } from "@/lib/news-notices/categories";

export function PublicNewsCard({ item }) {
  const t = useTranslations("newsNotices.publicNewsCard");
  const tCategories = useTranslations("newsNotices.categories");

  return (
    <Link
      href={`/news-notices/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {item.coverImageUrl ? (
          <Image
            src={item.coverImageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            📰
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span
          className={cn(
            "w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
            categoryBadgeClass(item.category),
          )}
        >
          {tCategories(CATEGORY_LABEL_KEYS[item.category])}
        </span>
        <h3 className="font-semibold leading-snug">{item.title}</h3>
        {item.summary ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.summary}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>
            {item.publishedAt
              ? format(new Date(item.publishedAt), "d MMM yyyy")
              : null}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {t("readMore")}
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
