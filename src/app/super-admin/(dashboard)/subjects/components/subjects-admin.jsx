"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Pencil, Plus, Trash2, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toTitleCase } from "@/lib/text-case";
import { cn } from "@/lib/utils";

export function SubjectsAdmin({ initialItems }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/super-admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add subject");
      setItems((prev) => [...prev, data.item]);
      setNewLabel("");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditLabel(item.label);
  }

  async function saveEdit(item) {
    if (!editLabel.trim()) return;
    setSavingId(item.id);
    setError("");
    try {
      const res = await fetch(`/api/super-admin/subjects/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: editLabel.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rename subject");
      setItems((prev) => prev.map((i) => (i.id === item.id ? data.item : i)));
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    await fetch("/api/super-admin/subjects/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: reordered.map((i) => i.id) }),
    });
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/super-admin/subjects/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete subject");
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(toTitleCase(e.target.value))}
          placeholder="e.g. Mathematics, Physics, Political Science"
        />
        <Button type="submit" disabled={adding || !newLabel.trim()}>
          <Plus className="size-4" />
          Add
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No subjects yet. Add one above.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <ul className="divide-y rounded-md border">
              {items.map((item) => (
                <SortableSubjectItem key={item.id} item={item}>
                  {editingId === item.id ? (
                    <>
                      <Input
                        autoFocus
                        value={editLabel}
                        onChange={(e) => setEditLabel(toTitleCase(e.target.value))}
                        className="h-8 flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        disabled={savingId === item.id}
                        onClick={() => saveEdit(item)}
                      >
                        <Check className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="size-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </SortableSubjectItem>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      {items.length > 1 ? (
        <p className="text-xs text-muted-foreground">Drag to reorder.</p>
      ) : null}

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deleteTarget?.label}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone. Deletion is blocked if any faculty, homework, or time
              table entry still uses this subject.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
              className={buttonVariants({ variant: "destructive" })}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SortableSubjectItem({ item, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn("flex items-center gap-2 px-3 py-2", isDragging && "relative z-10 bg-muted")}
    >
      <button
        type="button"
        className="flex size-6 shrink-0 cursor-grab items-center justify-center text-muted-foreground active:cursor-grabbing"
        aria-label={`Drag to reorder ${item.label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      {children}
    </li>
  );
}
