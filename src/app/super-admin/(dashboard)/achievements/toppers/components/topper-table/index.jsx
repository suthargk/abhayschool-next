"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { TopperDeleteDialog } from "./delete-dialog";
import { TopperPaginationBar } from "./pagination-bar";
import { TopperRow } from "./row";

export function TopperTable({ items, canPublish, search, page, totalPages, total, pageSize }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(() => new Set());

  useEffect(() => {
    setSelected(new Set());
  }, [page, search]);

  async function togglePublish(item) {
    setPendingId(item.id);
    try {
      await fetch(`/api/super-admin/toppers/${item.id}/publish`, {
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
    setDeleteTarget({ ids: [item.id], label: `"${item.name}"` });
  }

  function requestBulkDelete() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setDeleteTarget({ ids, label: `${ids.length} topper${ids.length === 1 ? "" : "s"}` });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await Promise.all(
        deleteTarget.ids.map((id) => fetch(`/api/super-admin/toppers/${id}`, { method: "DELETE" })),
      );
      setSelected((prev) => {
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

  function toggleSelected(id, checked) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAll(checked) {
    setSelected((prev) => {
      const next = new Set(prev);
      items.forEach((item) => (checked ? next.add(item.id) : next.delete(item.id)));
      return next;
    });
  }

  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id));
  const someSelected = items.some((item) => selected.has(item.id));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <form
          className="relative w-full max-w-sm"
          action="/super-admin/achievements/toppers"
          method="GET"
        >
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search by name or year..."
            className="pl-8"
          />
        </form>
        {canPublish && selected.size > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selected.size} selected</span>
            <Button type="button" variant="destructive" size="sm" onClick={requestBulkDelete}>
              Delete selected
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          {total === 0 ? "No toppers yet." : "No results match your search."}
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {canPublish ? (
                  <TableHead className="w-8">
                    <Checkbox
                      checked={allSelected ? true : someSelected ? "indeterminate" : false}
                      onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                      aria-label="Select all"
                    />
                  </TableHead>
                ) : null}
                <TableHead>Name</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Stream</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TopperRow
                  key={item.id}
                  item={item}
                  canPublish={canPublish}
                  pending={pendingId === item.id}
                  selected={selected.has(item.id)}
                  onToggleSelect={(checked) => toggleSelected(item.id, checked)}
                  onTogglePublish={() => togglePublish(item)}
                  onDelete={() => requestDelete(item)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TopperPaginationBar
        search={search}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
      />

      <TopperDeleteDialog
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
