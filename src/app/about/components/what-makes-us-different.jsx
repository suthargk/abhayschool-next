import { Users, Sparkles, BookMarked, Trophy, ShieldCheck, HandHeart } from "lucide-react";
import { useTranslations } from "next-intl";

const ICONS = [Users, Sparkles, BookMarked, Trophy, ShieldCheck, HandHeart];

export function WhatMakesUsDifferent() {
  const t = useTranslations("about.whatMakesUsDifferent");
  const differentiators = t.raw("items").map((item, index) => ({
    ...item,
    icon: ICONS[index],
  }));

  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {differentiators.map((item) => (
          <div key={item.title} className="space-y-3 rounded-xl border bg-card p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <item.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
