import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ClipboardCheck, MessageSquareQuote, UserCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getPendingCounts } from "./overview-data";

export async function PendingActions() {
  const t = await getTranslations("superAdminDashboard.overview.pendingActions");
  const counts = await getPendingCounts();

  const items = [
    {
      key: "teacherApprovals",
      icon: UserCheck,
      count: counts.pendingTeachers,
      href: "/super-admin/teachers",
    },
    {
      key: "newAdmissions",
      icon: ClipboardCheck,
      count: counts.newAdmissions,
      href: "/super-admin/admissions",
    },
    {
      key: "pendingTestimonials",
      icon: MessageSquareQuote,
      count: counts.pendingTestimonials,
      href: "/super-admin/homepage/testimonials",
    },
  ].filter((item) => item.count > 0);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          {t("empty")}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {items.map(({ key, icon: Icon, count, href }) => (
            <li key={key}>
              <Link
                href={href}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm font-medium">{t(key)}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t(`${key}Description`, { count })}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {count}
                </Badge>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function PendingActionsSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="size-9 shrink-0 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
