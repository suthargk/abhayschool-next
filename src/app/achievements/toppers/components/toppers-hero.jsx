import { PartyPopper } from "lucide-react";
import { useTranslations } from "next-intl";

export function ToppersHero({ children }) {
  const t = useTranslations("achievements.toppersHero");

  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
        <PartyPopper className="size-4" />
        {t("badge")}
      </span>
      <h1 className="text-3xl font-semibold sm:text-5xl">
        <span className="block">{t("headingLine1")}</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          {t("headingLine2")}
        </span>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        {t("description")}
      </p>
      {children}
    </section>
  );
}
