import { ChevronDown, NotebookPen } from "lucide-react";
import { useTranslations } from "next-intl";

export function HomeworkHero() {
  const t = useTranslations("homework.hero");

  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
        <NotebookPen className="size-4" />
        {t("badge")}
      </span>
      <h1 className="text-3xl font-semibold sm:text-5xl">
        <span className="block">{t("titleLine1")}</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          {t("titleLine2")}
        </span>
      </h1>
      <p className="max-w-xl text-muted-foreground">{t("description")}</p>
      <a
        href="#homework-list"
        className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("browseHomework")}
        <ChevronDown className="size-4" />
      </a>
    </section>
  );
}
