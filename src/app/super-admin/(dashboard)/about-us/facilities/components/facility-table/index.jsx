"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { FacilityDeleteDialog } from "./delete-dialog";
import { FacilityRow } from "./row";

export function FacilityTable({ initialItems, canPublish }) {
  const t = useTranslations("superAdminFacilities.table");
  const tCommon = useTranslations("common.actions");
  const tTable = useTranslations("common.table");
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(() => new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.summary || "").toLowerCase().includes(q),
    );
  }, [items, search]);

  const dragDisabled = Boolean(search.trim());

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);

    await fetch("/api/super-admin/facilities/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((item) => item.id) }),
    });
    router.refresh();
  }

  async function togglePublish(item) {
    setPendingId(item.id);
    try {
      await fetch(`/api/super-admin/facilities/${item.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: item.status !== "PUBLISHED" }),
      });
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: i.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" } : i,
        ),
      );
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  function requestDelete(item) {
    setDeleteTarget({ ids: [item.id], label: `"${item.title}"` });
  }

  function requestBulkDelete() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setDeleteTarget({ ids, label: t("bulkDeleteLabel", { count: ids.length }) });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await Promise.all(
        deleteTarget.ids.map((id) => fetch(`/api/super-admin/facilities/${id}`, { method: "DELETE" })),
      );
      setItems((prev) => prev.filter((item) => !deleteTarget.ids.includes(item.id)));
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

  function toggleSelectAllFiltered(checked) {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((item) => (checked ? next.add(item.id) : next.delete(item.id)));
      return next;
    });
  }

  const allFilteredSelected = filtered.length > 0 && filtered.every((item) => selected.has(item.id));
  const someFilteredSelected = filtered.some((item) => selected.has(item.id));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-8"
          />
        </div>
        {canPublish && selected.size > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{tTable("rowsSelected", { count: selected.size })}</span>
            <Button type="button" variant="destructive" size="sm" onClick={requestBulkDelete}>
              {t("deleteSelected")}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              {tCommon("clear")}
            </Button>
          </div>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          {t("emptySection")}
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          {tTable("noResults")}
        </p>
      ) : (
        <div className="rounded-md border">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <span className="sr-only">{t("columns.reorder")}</span>
                  </TableHead>
                  {canPublish ? (
                    <TableHead className="w-8">
                      <Checkbox
                        checked={allFilteredSelected ? true : someFilteredSelected ? "indeterminate" : false}
                        onCheckedChange={(checked) => toggleSelectAllFiltered(Boolean(checked))}
                        aria-label={tCommon("selectAll")}
                      />
                    </TableHead>
                  ) : null}
                  <TableHead>{t("columns.title")}</TableHead>
                  <TableHead>{t("columns.description")}</TableHead>
                  <TableHead>{t("columns.status")}</TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">{t("columns.actions")}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext items={filtered.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                  {filtered.map((item) => (
                    <FacilityRow
                      key={item.id}
                      item={item}
                      canPublish={canPublish}
                      dragDisabled={dragDisabled}
                      pending={pendingId === item.id}
                      selected={selected.has(item.id)}
                      onToggleSelect={(checked) => toggleSelected(item.id, checked)}
                      onTogglePublish={() => togglePublish(item)}
                      onDelete={() => requestDelete(item)}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      )}

      {dragDisabled ? (
        <p className="text-xs text-muted-foreground">{t("dragHintDisabled")}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{t("dragHint")}</p>
      )}

      <FacilityDeleteDialog
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
