"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LibraryDeleteDialog } from "./library-table/delete-dialog";
import { LibraryTable } from "./library-table";

export function LibraryAdmin({ initialItems, classes, canPublish }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const countsByClass = useMemo(() => {
    const counts = {};
    for (const item of items) counts[item.class] = (counts[item.class] ?? 0) + 1;
    return counts;
  }, [items]);

  async function togglePublish(item) {
    setPendingId(item.id);
    try {
      await fetch(`/api/super-admin/library/${item.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: item.status !== "PUBLISHED" }),
      });
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: i.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }
            : i,
        ),
      );
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  function requestDelete(item) {
    setDeleteTarget({ ids: [item.id], label: `"${item.bookName}"` });
  }

  function requestBulkDelete(selectedItems) {
    if (selectedItems.length === 0) return;
    setDeleteTarget({
      ids: selectedItems.map((item) => item.id),
      label: `${selectedItems.length} book${selectedItems.length === 1 ? "" : "s"}`,
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await Promise.all(
        deleteTarget.ids.map((id) => fetch(`/api/super-admin/library/${id}`, { method: "DELETE" })),
      );
      setItems((prev) => prev.filter((item) => !deleteTarget.ids.includes(item.id)));
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  async function reorderClass(classValue, orderedIds) {
    setItems((prev) => {
      const positionById = new Map(orderedIds.map((id, index) => [id, index]));
      return prev.map((item) =>
        item.class === classValue && positionById.has(item.id)
          ? { ...item, position: positionById.get(item.id) }
          : item,
      );
    });

    await fetch("/api/super-admin/library/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderedIds }),
    });
    router.refresh();
  }

  if (classes.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        No classes configured yet.{" "}
        <Link href="/super-admin/classes" className="underline">
          Add a class
        </Link>{" "}
        to start building the library catalogue.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue={classes[0].value} className="w-full">
        <TabsList
          aria-label="Library catalogue by class"
          className="h-auto w-full flex-wrap justify-start gap-1"
        >
          {classes.map((klass) => (
            <TabsTrigger key={klass.value} value={klass.value} className="gap-1.5">
              {klass.label}
              <Badge variant="secondary" className="px-1.5">
                {countsByClass[klass.value] ?? 0}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {classes.map((klass) => (
          <TabsContent key={klass.value} value={klass.value} className="space-y-3 pt-4">
            <div className="flex justify-end">
              <Button asChild size="sm">
                <Link href={`/super-admin/academic/library/new?class=${klass.value}`}>
                  <Plus className="size-4" />
                  Add book to {klass.label}
                </Link>
              </Button>
            </div>
            <LibraryTable
              items={items.filter((item) => item.class === klass.value)}
              canPublish={canPublish}
              pendingId={pendingId}
              onReorder={(orderedIds) => reorderClass(klass.value, orderedIds)}
              onTogglePublish={togglePublish}
              onDelete={requestDelete}
              onBulkDelete={requestBulkDelete}
            />
          </TabsContent>
        ))}
      </Tabs>

      <LibraryDeleteDialog
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
