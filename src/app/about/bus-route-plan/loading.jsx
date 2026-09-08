import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";

export default function BusRoutePlanLoading() {
  const t = useTranslations("busRoutePlan");

  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {t("heading")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <Skeleton className="h-4 w-56" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-11 w-full" />

          <div className="hidden overflow-hidden rounded-md border border-zinc-200 md:block dark:border-zinc-800">
            <Skeleton className="h-10 w-full rounded-none" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-12 w-full rounded-none border-t border-zinc-200 dark:border-zinc-800"
              />
            ))}
          </div>

          <div className="space-y-3 md:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
