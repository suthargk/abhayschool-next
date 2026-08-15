"use client";

import Link from "next/link";
import { Check, Circle, CircleDashed, MoreHorizontal } from "lucide-react";

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
import { weekdayLabel } from "@/data/weekdays";

function formatTimeRange(item) {
  if (item.startTime && item.endTime) return `${item.startTime} – ${item.endTime}`;
  return item.startTime || item.endTime || "—";
}

export function TimeTableRow({
  item,
  canPublish,
  pending,
  selected,
  onToggleSelect,
  onTogglePublish,
  onDelete,
}) {
  return (
    <TableRow>
      {canPublish ? (
        <TableCell className="w-8">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onToggleSelect(Boolean(checked))}
            aria-label={`Select ${item.subject}`}
          />
        </TableCell>
      ) : null}
      <TableCell className="text-muted-foreground">{weekdayLabel(item.day)}</TableCell>
      <TableCell className="text-muted-foreground">{item.period}</TableCell>
      <TableCell className="font-medium">
        <Link
          href={`/super-admin/academic/time-table/${item.id}/edit`}
          className="hover:text-primary hover:underline"
        >
          {item.subject}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">{item.teacherName || "—"}</TableCell>
      <TableCell className="text-muted-foreground">{formatTimeRange(item)}</TableCell>
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
          ) : (
            <CircleDashed className="size-3.5" />
          )}
          {item.status === "PUBLISHED" ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" disabled={pending}>
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/super-admin/academic/time-table/${item.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            {canPublish ? (
              <>
                <DropdownMenuItem onSelect={onTogglePublish}>
                  {item.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
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
