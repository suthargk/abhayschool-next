import { format } from "date-fns";

import { groupByDueDate } from "@/lib/homework/due-status";

import { HomeworkCard } from "./homework-card";

function groupLabel(group) {
  if (group.key === "overdue") return "Overdue";
  if (group.key === "today") return "Today";
  if (group.key === "tomorrow") return "Tomorrow";
  return format(new Date(group.date), "EEEE, d MMMM");
}

export function HomeworkList({ items }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No homework found. Try a different search or filter.
        </p>
      </div>
    );
  }

  const groups = groupByDueDate(items);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.key} className="space-y-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {groupLabel(group)}
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
