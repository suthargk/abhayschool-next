import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function PrincipalParentPartnership() {
  const t = useTranslations("principalMessage.principalParentPartnership");
  const commitments = t.raw("commitments");

  return (
    <section className="mx-auto max-w-4xl space-y-8">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <ul className="grid grid-cols-1 gap-4 rounded-2xl border bg-card p-8 sm:grid-cols-2 sm:p-10">
        {commitments.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-violet-600 dark:text-violet-400" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
