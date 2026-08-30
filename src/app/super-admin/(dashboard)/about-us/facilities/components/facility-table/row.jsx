"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Circle, CircleDashed, GripVertical, MoreHorizontal, Sparkles, Star } from "lucide-react";

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
import { cn } from "@/lib/utils";

export function FacilityRow({
  item,
  canPublish,
  dragDisabled,
  pending,
  selected,
  onToggleSelect,
  onTogglePublish,
  onDelete,
}) {
  const tCommon = useTranslations("common.actions");
  const tStatus = useTranslations("common.status");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: dragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={cn(isDragging && "relative z-10 bg-muted")}>
      <TableCell className="w-8">
        <button
          type="button"
          className={cn(
            "flex size-6 items-center justify-center text-muted-foreground",
            dragDisabled ? "cursor-not-allowed opacity-40" : "cursor-grab active:cursor-grabbing"
          )}
          disabled={dragDisabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </TableCell>
      {canPublish ? (
        <TableCell className="w-8">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onToggleSelect(Boolean(checked))}
            aria-label={tCommon("select", { name: item.title })}
          />
        </TableCell>
      ) : null}
      <TableCell className="font-medium">
        <Link
          href={`/super-admin/about-us/facilities/${item.id}/edit`}
          className="flex items-center gap-3 hover:text-primary hover:underline"
        >
          <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted text-base">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt="" fill className="object-cover" unoptimized />
            ) : item.icon ? (
              item.icon
            ) : (
              <Sparkles className="size-4 text-muted-foreground" />
            )}
          </span>
          {item.title}
          {item.featured ? <Star className="size-3.5 fill-amber-400 text-amber-400" /> : null}
        </Link>
      </TableCell>
      <TableCell className="max-w-xs truncate text-muted-foreground">
        {item.summary || "—"}
      </TableCell>
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
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" disabled={pending}>
              <MoreHorizontal className="size-4" />
              <span className="sr-only">{tCommon("openMenu")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/super-admin/about-us/facilities/${item.id}/edit`}>{tCommon("edit")}</Link>
            </DropdownMenuItem>
            {canPublish ? (
              <>
                <DropdownMenuItem onSelect={onTogglePublish}>
                  {item.status === "PUBLISHED" ? tCommon("unpublish") : tCommon("publish")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
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
