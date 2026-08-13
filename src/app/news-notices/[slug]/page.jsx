import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, FileText, MapPin, Pin } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { ContentRenderer } from "@/components/news-notices/content-renderer";
import { cn } from "@/lib/utils";
import { categoryBadgeClass, categoryLabel } from "@/lib/news-notices/categories";

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function NewsNoticeDetailPage({ params }) {
  const { slug } = await params;

  const item = await prisma.newsNotice.findFirst({
    where: { slug, status: { in: ["PUBLISHED", "ARCHIVED"] } },
    include: { author: { select: { email: true } }, attachments: true },
  });

  if (!item) notFound();

  const hasEventInfo = item.eventDate || item.eventTime || item.venue;
  const wasUpdated =
    item.updatedAt &&
    item.publishedAt &&
    new Date(item.updatedAt).toDateString() !==
      new Date(item.publishedAt).toDateString();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6">
      <Link
        href="/news-notices"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to News &amp; Notices
      </Link>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.pinned ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <Pin className="size-3" />
              Pinned
            </span>
          ) : null}
          <span
            className={cn(
              "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
              item.type === "NOTICE"
                ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                : "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300",
            )}
          >
            {item.type === "NEWS" ? "News" : "Notice"}
          </span>
          <span
            className={cn(
              "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
              categoryBadgeClass(item.category),
            )}
          >
            {categoryLabel(item.category)}
          </span>
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {item.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {item.publishedAt
            ? `Published ${format(new Date(item.publishedAt), "MMMM d, yyyy")}`
            : null}
          {wasUpdated
            ? ` · Last updated ${format(new Date(item.updatedAt), "MMMM d, yyyy")}`
            : null}
          {item.author?.email ? ` · ${item.author.email}` : null}
        </p>
      </div>

      {item.coverImageUrl ? (
        <Image
          src={item.coverImageUrl}
          alt=""
          width={1200}
          height={630}
          className="h-auto w-full rounded-lg border object-cover"
          unoptimized
        />
      ) : null}

      {hasEventInfo ? (
        <div className="grid gap-4 rounded-lg border bg-muted/30 p-5 sm:grid-cols-3">
          {item.eventDate ? (
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Event date</div>
                <div className="text-sm font-medium">
                  {format(new Date(item.eventDate), "MMMM d, yyyy")}
                </div>
              </div>
            </div>
          ) : null}
          {item.eventTime ? (
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Time</div>
                <div className="text-sm font-medium">{item.eventTime}</div>
              </div>
            </div>
          ) : null}
          {item.venue ? (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Venue</div>
                <div className="text-sm font-medium">{item.venue}</div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="pt-2">
        <ContentRenderer content={item.content} />
      </div>

      {item.attachments.length > 0 ? (
        <div className="space-y-2 border-t pt-6">
          <h2 className="text-sm font-semibold">Attachments</h2>
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
