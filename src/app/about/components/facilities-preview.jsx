import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function FacilitiesPreview({ items }) {
  const t = useTranslations("about.facilitiesPreview");

  if (items.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageOff className="size-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-center text-sm font-medium">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/about/facilities">{t("exploreFacilities")}</Link>
        </Button>
      </div>
    </section>
  );
}
