"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2, MoreHorizontal } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { classLabel } from "@/lib/classes";
import { cn } from "@/lib/utils";

const STATUS_LABEL_KEYS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};
const STATUS_VARIANT = {
  DRAFT: "outline",
  PUBLISHED: "success",
  ARCHIVED: "secondary",
};
const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

function RowActionsMenu({ item, pending, onToggleStatus, onDelete }) {
  const tCommon = useTranslations("common.actions");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={pending}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{tCommon("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/teacher/homework/${item.id}/edit`}>{tCommon("edit")}</Link>
        </DropdownMenuItem>
        {item.status !== "ARCHIVED" ? (
          <DropdownMenuItem onSelect={onToggleStatus}>
            {item.status === "PUBLISHED" ? tCommon("unpublish") : tCommon("publish")}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
          {tCommon("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function toDateParam(iso) {
  if (!iso) return "";
  return format(new Date(iso), "yyyy-MM-dd");
}

function TeacherHomeworkFilters({
  filters,
  classes,
  assignments,
  pageSize,
  defaultPageSize,
  onPendingChange,
}) {
  const t = useTranslations("teacherHomework.list");
  const tCommon = useTranslations("common.actions");
  const tStatus = useTranslations("common.status");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.q);

  useEffect(() => {
    setSearch(filters.q);
  }, [filters.q]);

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const classOptions = [...new Set(assignments.map((a) => a.class))];
  const subjectOptions = [...new Set(assignments.map((a) => a.subject))];

  function navigate(overrides) {
    // Any filter/search change resets to page 1 — `page` is deliberately
    // never included here, only added by the pagination controls below.
    const next = { ...filters, ...overrides };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.class && next.class !== "ALL") params.set("class", next.class);
    if (next.subject && next.subject !== "ALL") params.set("subject", next.subject);
    if (next.status && next.status !== "ALL") params.set("status", next.status);
    if (next.due) params.set("due", next.due);
    if (pageSize !== defaultPageSize) params.set("pageSize", pageSize);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/teacher/homework?${qs}` : "/teacher/homework", { scroll: false });
    });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate({ q: search });
  }

  const hasActiveFilters =
    filters.q || filters.class !== "ALL" || filters.subject !== "ALL" || filters.status !== "ALL" || filters.due;

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <Input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="sm:max-w-xs"
        disabled={isPending}
      />

      <Select value={filters.class} onValueChange={(v) => navigate({ class: v })} disabled={isPending}>
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder={t("allClasses")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t("allClasses")}</SelectItem>
          {classOptions.map((c) => (
            <SelectItem key={c} value={c}>
              {classLabel(classes, c)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.subject} onValueChange={(v) => navigate({ subject: v })} disabled={isPending}>
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder={t("allSubjects")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t("allSubjects")}</SelectItem>
          {subjectOptions.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(v) => navigate({ status: v })} disabled={isPending}>
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder={t("allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t("allStatuses")}</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {tStatus(STATUS_LABEL_KEYS[s])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="sm:w-44">
        <DatePicker
          value={filters.due ? new Date(filters.due).toISOString() : null}
          onChange={(iso) => navigate({ due: toDateParam(iso) })}
          placeholder={t("dueDatePlaceholder")}
        />
      </div>

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        {tCommon("search")}
      </Button>
      {hasActiveFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setSearch("");
            navigate({ q: "", class: "ALL", subject: "ALL", status: "ALL", due: "" });
          }}
        >
          {t("clearFilters")}
        </Button>
      ) : null}
    </form>
  );
}

export function TeacherHomeworkList({
  initialItems,
  classes,
  assignments,
  filters,
  hasAnyHomework,
  page,
  pageSize,
  defaultPageSize,
  total,
  totalPages,
}) {
  const t = useTranslations("teacherHomework.list");
  const tCommon = useTranslations("common.actions");
  const tStatus = useTranslations("common.status");
  const tTable = useTranslations("common.table");
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [pendingId, setPendingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterPending, setFilterPending] = useState(false);
  const [paginationPending, setPaginationPending] = useState(false);
  const navPending = filterPending || paginationPending;

  useEffect(() => {
    setItems(initialItems);
    setSelectedIds(new Set());
  }, [initialItems]);

  function toggleSelected(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  function toggleSelectAll() {
    setSelectedIds((prev) =>
      prev.size === items.length ? new Set() : new Set(items.map((item) => item.id)),
    );
  }

  async function toggleStatus(item) {
    const nextStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setPendingId(item.id);
    try {
      const res = await fetch(`/api/teacher/homework/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("statusUpdateFailed"));
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i)));
    } catch (err) {
      toast.error(err.message);
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
    const { ids, label } = deleteTarget;
    setDeleting(true);
    try {
      await toast
        .promise(
          Promise.all(
            ids.map(async (id) => {
              const res = await fetch(`/api/teacher/homework/${id}`, { method: "DELETE" });
              if (!res.ok) throw new Error("Delete failed");
            }),
          ),
          {
            loading: t("deletingToast", { label }),
            success: t("deletedToast", { label }),
            error: t("deleteFailedToast", { label }),
          },
        )
        .unwrap();
      setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
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

  const extraParams = {
    class: filters.class !== "ALL" ? filters.class : undefined,
    subject: filters.subject !== "ALL" ? filters.subject : undefined,
    status: filters.status !== "ALL" ? filters.status : undefined,
    due: filters.due || undefined,
  };

  return (
    <div className="space-y-4">
      <TeacherHomeworkFilters
        filters={filters}
        classes={classes}
        assignments={assignments}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        onPendingChange={setFilterPending}
      />

      {selectedIds.size > 0 ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {tTable("rowsSelected", { count: selectedIds.size })}
          </span>
          <Button variant="destructive" size="sm" onClick={requestBulkDelete}>
            {t("deleteSelected")}
          </Button>
        </div>
      ) : null}

      <div className={cn("relative transition-opacity", navPending && "opacity-60")} aria-busy={navPending}>
        {navPending ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : null}

        {items.length === 0 ? (
          <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            {hasAnyHomework ? t("noResultsFiltered") : t("noResultsEmpty")}
          </p>
        ) : (
          <>
            {/* Mobile: stacked cards — a table can't shrink to fit a phone
                screen without either clipping columns or forcing horizontal
                scroll, so below md we switch to one card per item instead. */}
            <div className="space-y-3 md:hidden">
              {items.length > 1 ? (
                <label className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleSelectAll}
                    aria-label={tCommon("selectAll")}
                  />
                  {tCommon("selectAll")}
                </label>
              ) : null}
              {items.map((item) => (
                <div key={item.id} className="space-y-2 rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        className="mt-1"
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleSelected(item.id)}
                        aria-label={tCommon("select", { name: item.title })}
                      />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <RowActionsMenu
                      item={item}
                      pending={pendingId === item.id}
                      onToggleStatus={() => toggleStatus(item)}
                      onDelete={() => requestDelete(item)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pl-6 text-sm text-muted-foreground">
                    <span>{classLabel(classes, item.class)}</span>
                    <span>·</span>
                    <span>{item.subject}</span>
                    <span>·</span>
                    <span>{t("dueOn", { date: format(new Date(item.dueDate), "d MMM yyyy") })}</span>
                  </div>
                  <div className="pl-6">
                    <Badge variant={STATUS_VARIANT[item.status]}>
                      {tStatus(STATUS_LABEL_KEYS[item.status])}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/tablet: full table. */}
            <div className="hidden rounded-xl border md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                        onCheckedChange={toggleSelectAll}
                        aria-label={tCommon("selectAll")}
                      />
                    </TableHead>
                    <TableHead>{t("titleColumn")}</TableHead>
                    <TableHead>{t("classColumn")}</TableHead>
                    <TableHead>{t("subjectColumn")}</TableHead>
                    <TableHead>{t("dueColumn")}</TableHead>
                    <TableHead>{t("statusColumn")}</TableHead>
                    <TableHead className="w-0" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(item.id)}
                          onCheckedChange={() => toggleSelected(item.id)}
                          aria-label={tCommon("select", { name: item.title })}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{classLabel(classes, item.class)}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>{format(new Date(item.dueDate), "d MMM yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[item.status]}>
                          {tStatus(STATUS_LABEL_KEYS[item.status])}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <RowActionsMenu
                          item={item}
                          pending={pendingId === item.id}
                          onToggleStatus={() => toggleStatus(item)}
                          onDelete={() => requestDelete(item)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      <DataTablePagination
        basePath="/teacher/homework"
        search={filters.q}
        page={page}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        total={total}
        totalPages={totalPages}
        extraParams={extraParams}
        onPendingChange={setPaginationPending}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tTable("deleteConfirmTitle", { label: deleteTarget?.label })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tTable("deleteConfirmDescription")}{" "}
              {deleteTarget?.ids.length === 1
                ? tTable("confirmDeleteOne")
                : tTable("confirmDeleteMany")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
              className={buttonVariants({ variant: "destructive" })}
            >
              {deleting ? tCommon("deleting") : tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
