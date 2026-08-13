const STATS = [
  { key: "assigned", label: "Assigned" },
  { key: "dueSoon", label: "Due Soon" },
  { key: "overdue", label: "Overdue" },
  { key: "thisWeek", label: "This Week" },
];

export function SummaryStats({ counts }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={stat.key}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <div className="text-2xl font-semibold tracking-tight">
            {counts[stat.key] ?? 0}
          </div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
