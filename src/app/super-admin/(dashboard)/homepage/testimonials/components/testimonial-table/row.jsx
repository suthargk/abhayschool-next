"use client";

import Image from "next/image";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  Circle,
  CircleDashed,
  GripVertical,
  MoreHorizontal,
  UserRound,
  UserRoundCheck,
} from "lucide-react";

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

export function TestimonialRow({
  item,
  canPublish,
  dragDisabled,
  pending,
  selected,
  onToggleSelect,
  onTogglePublish,
  onDelete,
}) {
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
            aria-label={`Select ${item.name}`}
          />
        </TableCell>
      ) : null}
      <TableCell className="max-w-xs font-medium">
        <Link
          href={`/super-admin/homepage/testimonials/${item.id}/edit`}
          className="flex items-center gap-3 hover:text-primary hover:underline"
        >
          <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
            {item.photoUrl ? (
              <Image src={item.photoUrl} alt="" fill className="object-cover" unoptimized />
            ) : (
              <UserRound className="size-4 text-muted-foreground" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate">{item.name}</span>
            {item.designation ? (
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {item.designation}
              </span>
            ) : null}
          </span>
        </Link>
      </TableCell>
      <TableCell className="max-w-sm">
        <span className="line-clamp-2 text-muted-foreground">{item.quote}</span>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-1.5">
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
          {item.source === "PARENT" ? (
            <Badge variant="secondary" className="gap-1">
              <UserRoundCheck className="size-3" />
              Parent submitted
            </Badge>
          ) : null}
        </div>
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
              <Link href={`/super-admin/homepage/testimonials/${item.id}/edit`}>Edit</Link>
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
