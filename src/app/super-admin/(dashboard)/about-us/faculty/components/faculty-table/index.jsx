"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { FacultyDeleteDialog } from "./delete-dialog";
import { FacultyRow } from "./row";

export function FacultyTable({ initialItems, canPublish }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.designation.toLowerCase().includes(q) ||
        (item.department || "").toLowerCase().includes(q),
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

    await fetch("/api/super-admin/faculty/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((item) => item.id) }),
    });
    router.refresh();
  }

  async function togglePublish(item) {
    setPendingId(item.id);
    try {
      await fetch(`/api/super-admin/faculty/${item.id}/publish`, {
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
    setDeleteTarget({ ids: [item.id], label: `"${item.name}"` });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await Promise.all(
        deleteTarget.ids.map((id) => fetch(`/api/super-admin/faculty/${id}`, { method: "DELETE" })),
      );
      setItems((prev) => prev.filter((item) => !deleteTarget.ids.includes(item.id)));
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, designation, or department..."
          className="pl-8"
        />
      </div>

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No faculty members yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No results match your search.
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
                    <span className="sr-only">Reorder</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext items={filtered.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                  {filtered.map((item) => (
                    <FacultyRow
                      key={item.id}
                      item={item}
                      canPublish={canPublish}
                      dragDisabled={dragDisabled}
                      pending={pendingId === item.id}
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
        <p className="text-xs text-muted-foreground">Clear the search to drag and reorder.</p>
      ) : (
        <p className="text-xs text-muted-foreground">Drag rows to change display order.</p>
      )}

      <FacultyDeleteDialog
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
