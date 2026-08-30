"use client";

import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

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

import { getColumns } from "./columns";

export function AcademicPostsTableToolbar({
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
  const t = useTranslations("superAdminBlog.table");
  const tTable = useTranslations("common.table");
  const columns = getColumns(t);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <DataTableSearch
        basePath="/super-admin/academic/blog"
        defaultValue={search}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        placeholder={t("searchPlaceholder")}
        className="relative w-full min-w-[200px] flex-1 sm:max-w-sm"
        onPendingChange={onPendingChange}
      />

      <div className="flex flex-wrap items-center gap-2">
        {canPublish && selectedCount > 0 ? (
          <>
            <span className="text-sm text-muted-foreground">
              {tTable("rowsSelected", { count: selectedCount })}
            </span>
            <Button variant="destructive" size="sm" onClick={onBulkDelete}>
              {t("deleteSelected")}
            </Button>
          </>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="size-4" />
              {t("columnsButton")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>{t("toggleColumns")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((column) => (
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
