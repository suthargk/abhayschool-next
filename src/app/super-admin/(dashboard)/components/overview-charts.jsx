import { getTranslations } from "next-intl/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getAdmissionsTrend,
  getContentStatusBreakdown,
  getHomeworkByClass,
  getHomeworkTrend,
  getPageViewsTrend,
} from "./overview-data";
import {
  AdmissionsTrendChart,
  ContentStatusChart,
  HomeworkByClassChart,
  HomeworkTrendChart,
  PageViewsTrendChart,
} from "./overview-charts-client";

export async function AdmissionsTrendCard() {
  const t = await getTranslations("superAdminDashboard.overview.charts");
  const { daily } = await getAdmissionsTrend();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admissionsTitle")}</CardTitle>
        <CardDescription>{t("admissionsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <AdmissionsTrendChart data={daily} label={t("enquiries")} />
      </CardContent>
    </Card>
  );
}

export async function PageViewsTrendCard() {
  const t = await getTranslations("superAdminDashboard.overview.charts");
  const { daily } = await getPageViewsTrend();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pageViewsTitle")}</CardTitle>
        <CardDescription>{t("pageViewsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <PageViewsTrendChart data={daily} label={t("views")} />
      </CardContent>
    </Card>
  );
}

export async function HomeworkTrendCard() {
  const t = await getTranslations("superAdminDashboard.overview.charts");
  const { daily } = await getHomeworkTrend();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("homeworkTrendTitle")}</CardTitle>
        <CardDescription>{t("homeworkTrendDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <HomeworkTrendChart data={daily} label={t("homework")} />
      </CardContent>
    </Card>
  );
}

export async function HomeworkByClassCard() {
  const t = await getTranslations("superAdminDashboard.overview.charts");
  const data = await getHomeworkByClass();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("homeworkByClassTitle")}</CardTitle>
        <CardDescription>{t("homeworkByClassDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <HomeworkByClassChart data={data} label={t("homework")} />
      </CardContent>
    </Card>
  );
}

export async function ContentStatusCard() {
  const t = await getTranslations("superAdminDashboard.overview.charts");
  const tKinds = await getTranslations("superAdminDashboard.recentChanges.kinds");
  const breakdown = await getContentStatusBreakdown();

  const data = breakdown.map((item) => ({
    name: tKinds(item.kindKey),
    published: item.published,
    draft: item.draft,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("contentTitle")}</CardTitle>
        <CardDescription>{t("contentDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ContentStatusChart
          data={data}
          publishedLabel={t("published")}
          draftLabel={t("draft")}
        />
      </CardContent>
    </Card>
  );
}

function ChartCardSkeleton({ height = "h-[250px]" }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`${height} w-full`} />
      </CardContent>
    </Card>
  );
}

export function AdmissionsTrendCardSkeleton() {
  return <ChartCardSkeleton />;
}

export function PageViewsTrendCardSkeleton() {
  return <ChartCardSkeleton />;
}

export function HomeworkTrendCardSkeleton() {
  return <ChartCardSkeleton />;
}

export function HomeworkByClassCardSkeleton() {
  return <ChartCardSkeleton />;
}

export function ContentStatusCardSkeleton() {
  return <ChartCardSkeleton height="h-[300px]" />;
}
