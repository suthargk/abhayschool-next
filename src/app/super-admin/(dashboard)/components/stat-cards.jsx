import { getTranslations } from "next-intl/server";
import {
  ClipboardList,
  Eye,
  FileText,
  GraduationCap,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getAdmissionsTrend,
  getContentStatusBreakdown,
  getPageViewsTrend,
  getTeacherStatusCounts,
} from "./overview-data";

function trendPercent(current, previous) {
  if (previous === 0) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function Trend({ percent, t }) {
  if (percent === null) {
    return <span>{t("trendNew")}</span>;
  }
  if (percent === 0) {
    return <span>{t("trendFlat")}</span>;
  }

  const Icon = percent > 0 ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 ${
        percent > 0
          ? "text-emerald-600 dark:text-emerald-500"
          : "text-red-600 dark:text-red-500"
      }`}
    >
      <Icon className="size-3.5 shrink-0" />
      {t(percent > 0 ? "trendUp" : "trendDown", { percent: Math.abs(percent) })}
    </span>
  );
}

export async function StatCards() {
  const t = await getTranslations("superAdminDashboard.overview.stats");

  const [teacherCounts, contentBreakdown, admissions, pageViews] = await Promise.all([
    getTeacherStatusCounts(),
    getContentStatusBreakdown(),
    getAdmissionsTrend(),
    getPageViewsTrend(),
  ]);

  const publishedTotal = contentBreakdown.reduce((sum, item) => sum + item.published, 0);
  const draftTotal = contentBreakdown.reduce((sum, item) => sum + item.draft, 0);

  const cards = [
    {
      key: "activeTeachers",
      icon: GraduationCap,
      value: teacherCounts.ACTIVE,
      sub: t("activeTeachersSub", { count: teacherCounts.PENDING }),
    },
    {
      key: "publishedContent",
      icon: FileText,
      value: publishedTotal,
      sub: t("publishedContentSub", { count: draftTotal }),
    },
    {
      key: "newAdmissions",
      icon: ClipboardList,
      value: admissions.current,
      sub: <Trend percent={trendPercent(admissions.current, admissions.previous)} t={t} />,
    },
    {
      key: "pageViews",
      icon: Eye,
      value: pageViews.current,
      sub: <Trend percent={trendPercent(pageViews.current, pageViews.previous)} t={t} />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, icon: Icon, value, sub }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t(key)}
            </CardTitle>
            <Icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="mt-2 h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
