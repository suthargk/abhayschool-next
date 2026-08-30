import { format } from "date-fns";
import { useTranslations } from "next-intl";

import { groupByDueDate } from "@/lib/homework/due-status";

import { HomeworkCard } from "./homework-card";

function groupLabel(group, t) {
  if (group.key === "overdue") return t("overdue");
  if (group.key === "today") return t("today");
  if (group.key === "tomorrow") return t("tomorrow");
  return format(new Date(group.date), "EEEE, d MMMM");
}

export function HomeworkList({ items }) {
  const t = useTranslations("homework.list");

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      </div>
    );
  }

  const groups = groupByDueDate(items);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.key} className="space-y-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {groupLabel(group, t)}
          </h2>
          <div className="space-y-2">
            {group.items.map((item) => (
              <HomeworkCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
