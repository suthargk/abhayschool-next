"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Circle, CircleDashed, MoreHorizontal, UserRound } from "lucide-react";

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
import { topperClassLabel, topperStreamLabel } from "@/data/topper-classes";

export function TopperRow({
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
            aria-label={`Select ${item.name}`}
          />
        </TableCell>
      ) : null}
      <TableCell className="font-medium">
        <Link
          href={`/super-admin/achievements/toppers/${item.id}/edit`}
          className="flex items-center gap-3 hover:text-primary hover:underline"
        >
          <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
            {item.photoUrl ? (
              <Image src={item.photoUrl} alt="" fill className="object-cover" unoptimized />
            ) : (
              <UserRound className="size-4 text-muted-foreground" />
            )}
          </span>
          {item.name}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">{item.year}</TableCell>
      <TableCell className="text-muted-foreground">{topperClassLabel(item.class)}</TableCell>
      <TableCell className="text-muted-foreground">
        {item.stream ? topperStreamLabel(item.stream) : "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">#{item.rank}</TableCell>
      <TableCell className="text-muted-foreground">{item.percentage}%</TableCell>
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
              <Link href={`/super-admin/achievements/toppers/${item.id}/edit`}>Edit</Link>
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
