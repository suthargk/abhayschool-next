import Link from "next/link";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const SECTIONS = ["OVERVIEW", "SPORTS", "SAFETY", "FAQ"];

export function FacilitySectionTabs({ active }) {
  const t = useTranslations("superAdminFacilities.sections");
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border bg-muted/40 p-1">
      {SECTIONS.map((section) => (
        <Link
          key={section}
          href={`/super-admin/about-us/facilities?section=${section}`}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition",
            active === section
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(section)}
        </Link>
      ))}
    </div>
  );
}
