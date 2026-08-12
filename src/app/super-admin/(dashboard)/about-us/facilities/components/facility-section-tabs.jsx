import Link from "next/link";

import { cn } from "@/lib/utils";

const SECTIONS = [
  { value: "OVERVIEW", label: "Overview" },
  { value: "SPORTS", label: "Sports & Activities" },
  { value: "SAFETY", label: "Safety & Wellbeing" },
  { value: "FAQ", label: "FAQ" },
];

export function FacilitySectionTabs({ active }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border bg-muted/40 p-1">
      {SECTIONS.map((section) => (
        <Link
          key={section.value}
          href={`/super-admin/about-us/facilities?section=${section.value}`}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition",
            active === section.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {section.label}
        </Link>
      ))}
    </div>
  );
}
