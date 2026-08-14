"use client";

import { SlidersHorizontal } from "lucide-react";

import { DataTableSearch } from "@/components/data-table-search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { COLUMNS } from "./columns";

export function GalleryAlbumsTableToolbar({
  search,
  pageSize,
  defaultPageSize,
  canPublish,
  selectedCount,
  visibleColumns,
  onToggleColumn,
  onBulkDelete,
  onPendingChange,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <DataTableSearch
        basePath="/super-admin/gallery"
        defaultValue={search}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        placeholder="Search by title or author..."
        className="relative w-full min-w-[200px] flex-1 sm:max-w-sm"
        onPendingChange={onPendingChange}
      />

      <div className="flex flex-wrap items-center gap-2">
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
