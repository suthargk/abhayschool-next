import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export function FeaturedFacilities({ items }) {
  const t = useTranslations("facilities.featuredFacilities");

  return (
    <section className="space-y-14">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-14">
        {items.map((item, index) => {
          const reversed = index % 2 === 1;
          const bullets = (item.description || "")
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

          return (
            <div
              key={item.id}
              className={cn(
                "grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12",
                reversed && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-950 dark:to-fuchsia-950">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-6xl" aria-hidden="true">
                    {item.icon || "✨"}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold sm:text-2xl">{item.title}</h3>
                {item.summary ? (
                  <p className="text-muted-foreground">{item.summary}</p>
                ) : null}
                {bullets.length > 0 ? (
                  <ul className="space-y-2">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-violet-500" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
