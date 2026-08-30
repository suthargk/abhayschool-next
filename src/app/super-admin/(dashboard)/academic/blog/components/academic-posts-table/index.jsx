"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTablePagination } from "@/components/data-table-pagination";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { getColumns } from "./columns";
import { AcademicPostsDeleteDialog } from "./delete-dialog";
import { AcademicPostRow } from "./table-row";
import { AcademicPostsTableToolbar } from "./toolbar";

export function AcademicPostsTable({
  items,
  canPublish,
  search,
  page,
  totalPages,
  total,
  pageSize,
  defaultPageSize,
}) {
  const router = useRouter();
  const t = useTranslations("superAdminBlog.table");
  const tCommon = useTranslations("common.actions");
  const tTable = useTranslations("common.table");
  const columns = getColumns(t);
  const [pendingId, setPendingId] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(() =>
    Object.fromEntries(columns.map((c) => [c.key, c.defaultVisible]))
  );
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [paginationPending, setPaginationPending] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, search]);

  function toggleColumn(key) {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleSelected(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) =>
      prev.size === items.length ? new Set() : new Set(items.map((item) => item.id))
    );
  }

  async function togglePublish(item) {
    setPendingId(item.id);
    try {
      await fetch(`/api/super-admin/academic-blog/${item.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: item.status !== "PUBLISHED" }),
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  function requestDelete(item) {
    setDeleteTarget({ ids: [item.id], label: `"${item.title}"` });
  }

  function requestBulkDelete() {
    setDeleteTarget({
      ids: Array.from(selectedIds),
      label: t("bulkDeleteLabel", { count: selectedIds.size }),
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await Promise.all(
        deleteTarget.ids.map((id) =>
          fetch(`/api/super-admin/academic-blog/${id}`, { method: "DELETE" })
        )
      );
      setSelectedIds((prev) => {
        const next = new Set(prev);
        deleteTarget.ids.forEach((id) => next.delete(id));
        return next;
      });
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="space-y-3">
      <AcademicPostsTableToolbar
        search={search}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        canPublish={canPublish}
        selectedCount={selectedIds.size}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onBulkDelete={requestBulkDelete}
        onPendingChange={setPaginationPending}
      />

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          {total === 0
            ? t("emptyNoPosts")
            : tTable("noResults")}
        </p>
      ) : (
        <div className="relative rounded-md border">
          {paginationPending ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : null}
          <div className="max-h-[560px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {canPublish ? (
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                        onCheckedChange={toggleSelectAll}
                        aria-label={tCommon("selectAll")}
                      />
                    </TableHead>
                  ) : null}
                  <TableHead>{t("titleHeader")}</TableHead>
                  {visibleColumns.status ? <TableHead>{t("columns.status")}</TableHead> : null}
                  {visibleColumns.author ? <TableHead>{t("columns.author")}</TableHead> : null}
                  {visibleColumns.created ? (
                    <TableHead>{t("columns.created")}</TableHead>
                  ) : null}
                  <TableHead className="w-10">
                    <span className="sr-only">{t("actionsSr")}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <AcademicPostRow
                    key={item.id}
                    item={item}
                    canPublish={canPublish}
                    visibleColumns={visibleColumns}
                    pending={pendingId === item.id}
                    selected={selectedIds.has(item.id)}
                    onToggleSelected={() => toggleSelected(item.id)}
                    onTogglePublish={() => togglePublish(item)}
                    onDelete={() => requestDelete(item)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <DataTablePagination
        basePath="/super-admin/academic/blog"
        onPendingChange={setPaginationPending}
        search={search}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
      />

      <AcademicPostsDeleteDialog
        target={deleteTarget}
        deleting={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
