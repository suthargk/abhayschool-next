"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { COLUMNS } from "./columns";

export function HomeworkTableToolbar({
  search,
  canPublish,
  selectedCount,
  visibleColumns,
  onToggleColumn,
  onBulkDelete,
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <form
        className="relative w-full max-w-sm"
        action="/super-admin/homework"
        method="GET"
      >
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Search by title, subject, or teacher..."
          className="pl-8"
        />
      </form>

      <div className="flex items-center gap-2">
        {canPublish && selectedCount > 0 ? (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <Button variant="destructive" size="sm" onClick={onBulkDelete}>
              Delete selected
            </Button>
          </>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="size-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {COLUMNS.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={visibleColumns[column.key]}
                onCheckedChange={() => onToggleColumn(column.key)}
                onSelect={(event) => event.preventDefault()}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
