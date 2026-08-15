"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { AdmissionsDeleteDialog } from "./admissions-delete-dialog";

const STATUS_META = {
  NEW: { label: "New", variant: "blue" },
  CONTACTED: { label: "Contacted", variant: "warning" },
  CLOSED: { label: "Closed", variant: "outline" },
};

function buildHref(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    usp.set(key, String(value));
  });
  const qs = usp.toString();
  return qs ? `/super-admin/admissions?${qs}` : "/super-admin/admissions";
}

export function AdmissionsTable({
  items,
  search,
  status,
  page,
  totalPages,
  total,
  pageSize,
  defaultPageSize,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(search);
  const [pendingId, setPendingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [items]);

  function navigate(overrides) {
    startTransition(() => {
      router.push(
        buildHref({
          q: search || undefined,
          status: status || undefined,
          pageSize: pageSize !== defaultPageSize ? pageSize : undefined,
          ...overrides,
        }),
      );
    });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate({ q: searchValue.trim() || undefined, page: undefined });
  }

  function handleStatusChangeFilter(value) {
    navigate({ status: value === "ALL" ? undefined : value, page: undefined });
  }

  async function updateStatus(item, newStatus) {
    setPendingId(item.id);
    try {
      const res = await fetch(`/api/super-admin/admissions/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPendingId(null);
    }
  }

  function toggleSelected(id, checked) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAll(checked) {
    setSelectedIds(checked ? new Set(items.map((item) => item.id)) : new Set());
  }

  function requestDelete(item) {
    setDeleteTarget({ ids: [item.id], label: `"${item.studentName}"` });
  }

  function requestBulkDelete() {
    if (selectedIds.size === 0) return;
    setDeleteTarget({
      ids: Array.from(selectedIds),
      label: `${selectedIds.size} enquir${selectedIds.size === 1 ? "y" : "ies"}`,
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { ids, label } = deleteTarget;
    setDeleting(true);
    try {
      await toast
        .promise(
          Promise.all(
            ids.map(async (id) => {
              const res = await fetch(`/api/super-admin/admissions/${id}`, { method: "DELETE" });
              if (!res.ok) throw new Error("Delete failed");
            }),
          ),
          {
            loading: `Deleting ${label}…`,
            success: `Deleted ${label}`,
            error: `Failed to delete ${label}`,
          },
        )
        .unwrap();
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      setDeleteTarget(null);
      router.refresh();
    } catch {
      // toast.promise already surfaced the error
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <form onSubmit={handleSearchSubmit} className="relative w-full min-w-[200px] flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by student, parent, phone, or email..."
            className="pl-8"
            disabled={isPending}
          />
        </form>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 ? (
            <>
              <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
              <Button variant="destructive" size="sm" onClick={requestBulkDelete}>
                <Trash2 className="size-4" />
                Delete selected
              </Button>
            </>
          ) : null}

          <Select value={status || "ALL"} onValueChange={handleStatusChangeFilter} disabled={isPending}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          {total === 0 ? "No admission enquiries yet." : "No results match your search."}
        </p>
      ) : (
        <div className="relative rounded-md border">
          {isPending ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox
                    checked={
                      items.length > 0 && selectedIds.size === items.length
                        ? true
                        : selectedIds.size > 0
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                    aria-label="Select all rows"
                  />
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const statusMeta = STATUS_META[item.status] ?? STATUS_META.NEW;
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={(checked) => toggleSelected(item.id, Boolean(checked))}
                        aria-label={`Select ${item.studentName}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/super-admin/admissions/${item.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {item.studentName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.classAppliedFor}</TableCell>
                    <TableCell className="text-muted-foreground">{item.parentName}</TableCell>
                    <TableCell className="text-muted-foreground">{item.phone}</TableCell>
                    <TableCell>
                      <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8" disabled={pendingId === item.id}>
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/super-admin/admissions/${item.id}`}>View details</Link>
                          </DropdownMenuItem>
                          {item.status !== "NEW" ? (
                            <DropdownMenuItem onSelect={() => updateStatus(item, "NEW")}>
                              Mark as new
                            </DropdownMenuItem>
                          ) : null}
                          {item.status !== "CONTACTED" ? (
                            <DropdownMenuItem onSelect={() => updateStatus(item, "CONTACTED")}>
                              Mark as contacted
                            </DropdownMenuItem>
                          ) : null}
                          {item.status !== "CLOSED" ? (
                            <DropdownMenuItem onSelect={() => updateStatus(item, "CLOSED")}>
                              Mark as closed
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => requestDelete(item)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {total > 0 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Previous page"
              disabled={isPending || page <= 1}
              onClick={() => navigate({ page: page - 1 > 1 ? page - 1 : undefined })}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Next page"
              disabled={isPending || page >= totalPages}
              onClick={() => navigate({ page: page + 1 })}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <AdmissionsDeleteDialog
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
