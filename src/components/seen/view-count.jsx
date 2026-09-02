import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

/** Unique-visitor view total for a detail page, e.g. "142 views". */
export function ViewCount({ count }) {
  const t = useTranslations("common.badges");

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Eye className="size-3.5" />
      {t("views", { count })}
    </span>
  );
}
