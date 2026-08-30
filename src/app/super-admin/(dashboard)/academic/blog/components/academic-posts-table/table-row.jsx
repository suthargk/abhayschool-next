"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Check, Circle, CircleDashed, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

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

export function AcademicPostRow({
  item,
  canPublish,
  visibleColumns,
  pending,
  selected,
  onToggleSelected,
  onTogglePublish,
  onDelete,
}) {
  const tCommon = useTranslations("common.actions");
  const tStatus = useTranslations("common.status");

  return (
    <TableRow>
      {canPublish ? (
        <TableCell>
          <Checkbox
            checked={selected}
            onCheckedChange={onToggleSelected}
            aria-label={tCommon("select", { name: item.title })}
          />
        </TableCell>
      ) : null}
      <TableCell className="font-medium">
        <Link
          href={`/super-admin/academic/blog/${item.id}/edit`}
          className="hover:text-primary hover:underline"
        >
          {item.title}
        </Link>
      </TableCell>
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
            ) : (
              <CircleDashed className="size-3.5" />
            )}
            {item.status === "PUBLISHED" ? tStatus("published") : tStatus("draft")}
          </Badge>
        </TableCell>
      ) : null}
      {visibleColumns.author ? (
        <TableCell className="text-muted-foreground">
          {item.author?.email}
        </TableCell>
      ) : null}
      {visibleColumns.created ? (
        <TableCell className="text-muted-foreground">
          {format(new Date(item.createdAt), "MMM d, yyyy")}
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
              <span className="sr-only">{tCommon("openMenu")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/super-admin/academic/blog/${item.id}/edit`}>
                {tCommon("edit")}
              </Link>
            </DropdownMenuItem>
            {canPublish ? (
              <>
                <DropdownMenuItem onSelect={onTogglePublish}>
                  {item.status === "PUBLISHED" ? tCommon("unpublish") : tCommon("publish")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={onDelete}
                >
                  {tCommon("delete")}
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
