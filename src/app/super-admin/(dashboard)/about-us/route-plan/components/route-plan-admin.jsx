"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { RoutePlanImportDialog } from "./route-plan-import-dialog";
import { RoutePlanDeleteDialog } from "./route-plan-table/delete-dialog";
import { RoutePlanTable } from "./route-plan-table";

export function RoutePlanAdmin({ initialItems, canPublish }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function togglePublish(item) {
    setPendingId(item.id);
    try {
      await fetch(`/api/super-admin/bus-routes/${item.id}/publish`, {
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
    setDeleteTarget({ ids: [item.id], label: `"${item.place}"` });
  }

  function requestBulkDelete(selectedItems) {
    if (selectedItems.length === 0) return;
    setDeleteTarget({
      ids: selectedItems.map((item) => item.id),
      label: `${selectedItems.length} stop${selectedItems.length === 1 ? "" : "s"}`,
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await Promise.all(
        deleteTarget.ids.map((id) => fetch(`/api/super-admin/bus-routes/${id}`, { method: "DELETE" })),
      );
      setItems((prev) => prev.filter((item) => !deleteTarget.ids.includes(item.id)));
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  async function refreshItems() {
    const res = await fetch("/api/super-admin/bus-routes");
    const data = await res.json();
    setItems(data.items ?? []);
    router.refresh();
  }

  async function reorder(orderedIds) {
    setItems((prev) => {
      const positionById = new Map(orderedIds.map((id, index) => [id, index]));
      return [...prev]
        .map((item) => ({ ...item, position: positionById.get(item.id) ?? item.position }))
        .sort((a, b) => a.position - b.position);
    });

    await fetch("/api/super-admin/bus-routes/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderedIds }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <RoutePlanImportDialog onImported={refreshItems} />
        <Button asChild size="sm">
          <Link href="/super-admin/about-us/route-plan/new">
            <Plus className="size-4" />
            Add stop
          </Link>
        </Button>
      </div>

      <RoutePlanTable
        items={items}
        canPublish={canPublish}
        pendingId={pendingId}
        onReorder={reorder}
        onTogglePublish={togglePublish}
        onDelete={requestDelete}
        onBulkDelete={requestBulkDelete}
      />

      <RoutePlanDeleteDialog
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
