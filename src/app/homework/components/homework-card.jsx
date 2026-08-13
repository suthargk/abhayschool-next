import Link from "next/link";
import { format } from "date-fns";
import { Paperclip } from "lucide-react";

import { cn } from "@/lib/utils";
import { libraryClassLabel } from "@/data/library-classes";
import { subjectBadgeClass, subjectIcon } from "@/lib/homework/subjects";
import { DUE_STATUS_BADGE_CLASS, dueStatus } from "@/lib/homework/due-status";

export function HomeworkCard({ item }) {
  const Icon = subjectIcon(item.subject);
  const status = dueStatus(item.dueDate);

  return (
    <Link
      href={`/homework/${item.id}`}
      className="flex flex-col gap-2 rounded-xl border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            subjectBadgeClass(item.subject),
          )}
        >
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {item.subject} · {libraryClassLabel(item.class)}
            </span>
          </div>
          <h3 className="truncate font-semibold leading-snug">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {item.teacherName ? `${item.teacherName} · ` : ""}
            Due {format(new Date(item.dueDate), "d MMM yyyy")}
            {item.attachments?.length ? (
              <span className="inline-flex items-center gap-1 pl-1.5 align-middle">
                <Paperclip className="size-3" />
                {item.attachments.length}
              </span>
            ) : null}
          </p>
        </div>
      </div>
      <span
        className={cn(
          "shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium sm:self-center",
          DUE_STATUS_BADGE_CLASS[status.value],
        )}
      >
        {status.label}
      </span>
    </Link>
  );
}
