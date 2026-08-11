"use client";

import { useEffect, useMemo, useState } from "react";
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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { LibraryRow } from "./row";

export function LibraryTable({
  items,
  canPublish,
  pendingId,
  onReorder,
  onTogglePublish,
  onDelete,
  onBulkDelete,
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(() => new Set());

  useEffect(() => {
    setSelected((prev) => {
      const ids = new Set(items.map((item) => item.id));
      const next = new Set(Array.from(prev).filter((id) => ids.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.bookName.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.publication.toLowerCase().includes(q),
    );
  }, [items, search]);

  const dragDisabled = Boolean(search.trim());

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    onReorder(arrayMove(items, oldIndex, newIndex).map((item) => item.id));
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
            placeholder="Search by book name, subject, or publication..."
            className="pl-8"
          />
        </div>
        {canPublish && selected.size > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selected.size} selected</span>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                const selectedItems = items.filter((item) => selected.has(item.id));
                onBulkDelete(selectedItems);
              }}
            >
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
          No books in this class yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No results match your search.
        </p>
      ) : (
        <div className="rounded-md border">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <span className="sr-only">Reorder</span>
                  </TableHead>
                  {canPublish ? (
                    <TableHead className="w-8">
                      <Checkbox
                        checked={allFilteredSelected ? true : someFilteredSelected ? "indeterminate" : false}
                        onCheckedChange={(checked) => toggleSelectAllFiltered(Boolean(checked))}
                        aria-label="Select all"
                      />
                    </TableHead>
                  ) : null}
                  <TableHead>Book name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Publication</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={filtered.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filtered.map((item) => (
                    <LibraryRow
                      key={item.id}
                      item={item}
                      canPublish={canPublish}
                      dragDisabled={dragDisabled}
                      pending={pendingId === item.id}
                      selected={selected.has(item.id)}
                      onToggleSelect={(checked) => toggleSelected(item.id, checked)}
                      onTogglePublish={() => onTogglePublish(item)}
                      onDelete={() => onDelete(item)}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      )}

      {items.length > 0 ? (
        dragDisabled ? (
          <p className="text-xs text-muted-foreground">Clear the search to drag and reorder.</p>
        ) : (
          <p className="text-xs text-muted-foreground">Drag rows to change display order.</p>
        )
      ) : null}
    </div>
  );
}
