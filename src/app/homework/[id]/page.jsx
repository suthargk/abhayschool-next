import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Calendar, CalendarClock, FileText, User } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { ContentRenderer } from "@/components/news-notices/content-renderer";
import { MarkSeen } from "@/components/seen/mark-seen";
import { RecordView } from "@/components/seen/record-view";
import { ViewCount } from "@/components/seen/view-count";
import { cn } from "@/lib/utils";
import { classLabel } from "@/lib/classes";
import { subjectBadgeClass, subjectIcon } from "@/lib/homework/subjects";
import {
  DUE_STATUS_BADGE_CLASS,
  DUE_STATUS_LABEL_KEYS,
  dueStatus,
} from "@/lib/homework/due-status";
import { VIEWABLE_TYPES } from "@/lib/views/constants";

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function HomeworkDetailPage({ params }) {
  const { id } = await params;
  const t = await getTranslations("homework.detail");
  const tStatus = await getTranslations("homework.dueStatus");

  const [item, classes] = await Promise.all([
    prisma.homework.findFirst({
      where: { id, status: { in: ["PUBLISHED", "ARCHIVED"] } },
      include: { attachments: true },
    }),
    prisma.schoolClass.findMany(),
  ]);

  if (!item) notFound();

  const viewCount = await prisma.itemView.count({
    where: { itemType: VIEWABLE_TYPES.HOMEWORK, itemId: item.id },
  });
  const Icon = subjectIcon(item.subject);
  const status = dueStatus(item.dueDate);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6">
      <MarkSeen scope="homework" id={item.id} />
      <RecordView itemType={VIEWABLE_TYPES.HOMEWORK} itemId={item.id} />
      <Link
        href="/homework"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("backToHomework")}
      </Link>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
              subjectBadgeClass(item.subject),
            )}
          >
            <Icon className="size-3.5" />
            {item.subject}
          </span>
          <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {classLabel(classes, item.class)}
          </span>
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
              DUE_STATUS_BADGE_CLASS[status.value],
            )}
          >
            {tStatus(DUE_STATUS_LABEL_KEYS[status.value])}
          </span>
        </div>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          {item.title}
        </h1>
        <ViewCount count={viewCount} />
      </div>

      <div className="grid gap-4 rounded-lg border bg-muted/30 p-5 sm:grid-cols-3">
        {item.teacherName ? (
          <div className="flex items-start gap-2">
            <User className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">{t("teacher")}</div>
              <div className="text-sm font-medium">{item.teacherName}</div>
            </div>
          </div>
        ) : null}
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">{t("assigned")}</div>
            <div className="text-sm font-medium">
              {format(new Date(item.assignedDate), "MMMM d, yyyy")}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CalendarClock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">{t("due")}</div>
            <div className="text-sm font-medium">
              {format(new Date(item.dueDate), "MMMM d, yyyy")}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold">{t("instructions")}</h2>
        <ContentRenderer content={item.content} />
      </div>

      {item.attachments.length > 0 ? (
        <div className="space-y-2 border-t pt-6">
          <h2 className="text-sm font-semibold">{t("resources")}</h2>
          <ul className="space-y-2">
            {item.attachments.map((a) => (
              <li key={a.id}>
                <a
                  href={a.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {a.fileName}
                  </span>
                  {a.fileSize ? (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatFileSize(a.fileSize)}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
