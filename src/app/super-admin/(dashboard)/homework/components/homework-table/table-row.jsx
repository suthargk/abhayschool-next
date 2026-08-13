"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Archive, Check, Circle, CircleDashed, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { libraryClassLabel } from "@/data/library-classes";

const STATUS_META = {
  PUBLISHED: { label: "Published" },
  DRAFT: { label: "Draft" },
  ARCHIVED: { label: "Archived" },
};

export function HomeworkRow({
  item,
  canPublish,
  visibleColumns,
  pending,
  selected,
  onToggleSelected,
  onTogglePublish,
  onArchive,
  onDelete,
}) {
  const statusMeta = STATUS_META[item.status] ?? STATUS_META.DRAFT;
  const isScheduled =
    item.status === "PUBLISHED" &&
    item.publishedAt &&
    new Date(item.publishedAt) > new Date();

  return (
    <TableRow>
      {canPublish ? (
        <TableCell>
          <Checkbox
            checked={selected}
            onCheckedChange={onToggleSelected}
            aria-label={`Select ${item.title}`}
          />
        </TableCell>
      ) : null}
      <TableCell className="font-medium">
        <Link
          href={`/super-admin/homework/${item.id}/edit`}
          className="hover:text-primary hover:underline"
        >
          {item.title}
        </Link>
      </TableCell>
      {visibleColumns.class ? (
        <TableCell className="text-muted-foreground">
          {libraryClassLabel(item.class)}
        </TableCell>
      ) : null}
      {visibleColumns.subject ? (
        <TableCell className="text-muted-foreground">
          {item.subject}
        </TableCell>
      ) : null}
      {visibleColumns.status ? (
        <TableCell>
          <Badge variant="outline">
            {item.status === "PUBLISHED" ? (
              <span className="relative flex size-3.5 items-center justify-center">
                <Circle
                  className="absolute inset-0 size-3.5 fill-emerald-500 text-emerald-500"
                  strokeWidth={0}
                />
                <Check
                  className="relative size-2.5 translate-x-[0.5px] -translate-y-[0.5px] stroke-white"
                  strokeWidth={3}
                />
              </span>
            ) : item.status === "ARCHIVED" ? (
              <Archive className="size-3.5" />
            ) : (
              <CircleDashed className="size-3.5" />
            )}
            {isScheduled ? "Scheduled" : statusMeta.label}
          </Badge>
        </TableCell>
      ) : null}
      {visibleColumns.due ? (
        <TableCell className="text-muted-foreground">
          {format(new Date(item.dueDate), "MMM d, yyyy")}
        </TableCell>
      ) : null}
      {visibleColumns.author ? (
        <TableCell className="text-muted-foreground">
          {item.author?.email}
        </TableCell>
      ) : null}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={pending}
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/super-admin/homework/${item.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            {canPublish ? (
              <>
                <DropdownMenuItem onSelect={onTogglePublish}>
                  {item.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </DropdownMenuItem>
                {item.status !== "ARCHIVED" ? (
                  <DropdownMenuItem onSelect={onArchive}>
                    Archive
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={onDelete}
                >
                  Delete
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
