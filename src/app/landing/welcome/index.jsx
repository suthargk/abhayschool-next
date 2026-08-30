import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { GlitterBackground } from "@/components/backgrounds/glitter-background";

export function Welcome() {
  const t = useTranslations("landing.welcome");

  return (
    <section className="relative grid grid-cols-1 items-center gap-8 sm:grid-cols-2 py-6">
      <GlitterBackground sparkleCount={10} />
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
        <Image
          src="/images/campus_highlight_1.jpg"
          alt="Shri Abhay Nobles campus"
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-4 text-center sm:text-left">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground">{t("description")}</p>
        <Button asChild variant="link" className="h-auto p-0">
          <Link href="/about">{t("discoverStory")}</Link>
        </Button>
      </div>
    </section>
  );
}
