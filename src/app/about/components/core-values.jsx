import { ShieldCheck, Lightbulb, HeartHandshake, Star, Heart, HandHeart } from "lucide-react";
import { useTranslations } from "next-intl";

const ICONS = [ShieldCheck, Lightbulb, HeartHandshake, Star, Heart, HandHeart];

export function CoreValues() {
  const t = useTranslations("about.coreValues");
  const values = t.raw("items").map((value, index) => ({
    ...value,
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
        {values.map((value) => (
          <div key={value.title} className="space-y-3 rounded-xl border bg-card p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <value.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{value.title}</h3>
            <p className="text-sm text-muted-foreground">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
