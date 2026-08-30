"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
import { Button, buttonVariants } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { TOPPER_CLASS_LABEL_KEYS, TOPPER_STREAM_LABEL_KEYS } from "@/data/topper-classes";
import { cn } from "@/lib/utils";

function RowActionsMenu({ item, pending, onDelete }) {
  const tActions = useTranslations("common.actions");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={pending}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{tActions("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/teacher/toppers/${item.id}/edit`}>{tActions("edit")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
          {tActions("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TeacherToppersFilters({ filters, pageSize, defaultPageSize, onPendingChange }) {
  const t = useTranslations("teacherToppers.list");
  const tActions = useTranslations("common.actions");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.q);

  useEffect(() => {
    setSearch(filters.q);
  }, [filters.q]);

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  function navigate(overrides) {
    // Any search change resets to page 1 — `page` is deliberately never
    // included here, only added by the pagination controls below.
    const next = { ...filters, ...overrides };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (pageSize !== defaultPageSize) params.set("pageSize", pageSize);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/teacher/toppers?${qs}` : "/teacher/toppers", { scroll: false });
    });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate({ q: search });
  }

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
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        {tActions("search")}
      </Button>
      {filters.q ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setSearch("");
            navigate({ q: "" });
          }}
        >
          {t("clearFilters")}
        </Button>
      ) : null}
    </form>
  );
}

export function TeacherToppersList({
  initialItems,
  filters,
  hasAnyToppers,
  page,
  pageSize,
  defaultPageSize,
  total,
  totalPages,
}) {
  const t = useTranslations("teacherToppers.list");
  const tActions = useTranslations("common.actions");
  const tToppers = useTranslations("achievements.featuredToppers");
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

  function requestDelete(item) {
    setDeleteTarget({ ids: [item.id], label: `"${item.name}"` });
  }

  function requestBulkDelete() {
    setDeleteTarget({
      ids: Array.from(selectedIds),
      label: t("itemsLabel", { count: selectedIds.size }),
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
              const res = await fetch(`/api/teacher/toppers/${id}`, { method: "DELETE" });
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

  return (
    <div className="space-y-4">
      <TeacherToppersFilters
        filters={filters}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        onPendingChange={setFilterPending}
      />

      {selectedIds.size > 0 ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t("selectedCount", { count: selectedIds.size })}
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
            {hasAnyToppers ? t("noResultsFiltered") : t("noResultsEmpty")}
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
                    aria-label={t("selectAllRows")}
                  />
                  {t("selectAllLabel")}
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
                        aria-label={t("selectRow", { name: item.name })}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <RowActionsMenu
                      item={item}
                      pending={pendingId === item.id}
                      onDelete={() => requestDelete(item)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pl-6 text-sm text-muted-foreground">
                    <span>{tToppers(TOPPER_CLASS_LABEL_KEYS[item.class])}</span>
                    {item.stream ? (
                      <>
                        <span>·</span>
                        <span>{tToppers(TOPPER_STREAM_LABEL_KEYS[item.stream])}</span>
                      </>
                    ) : null}
                    <span>·</span>
                    <span>{item.year}</span>
                    <span>·</span>
                    <span>{t("rankValue", { rank: item.rank })}</span>
                    <span>·</span>
                    <span>{item.percentage}%</span>
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
                        aria-label={t("selectAllRows")}
                      />
                    </TableHead>
                    <TableHead>{t("nameColumn")}</TableHead>
                    <TableHead>{t("classColumn")}</TableHead>
                    <TableHead>{t("streamColumn")}</TableHead>
                    <TableHead>{t("yearColumn")}</TableHead>
                    <TableHead>{t("rankColumn")}</TableHead>
                    <TableHead>{t("percentageColumn")}</TableHead>
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
                          aria-label={t("selectRow", { name: item.name })}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{tToppers(TOPPER_CLASS_LABEL_KEYS[item.class])}</TableCell>
                      <TableCell>
                        {item.stream ? tToppers(TOPPER_STREAM_LABEL_KEYS[item.stream]) : "—"}
                      </TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>{item.rank}</TableCell>
                      <TableCell>{item.percentage}%</TableCell>
                      <TableCell>
                        <RowActionsMenu
                          item={item}
                          pending={pendingId === item.id}
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
        basePath="/teacher/toppers"
        search={filters.q}
        page={page}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        total={total}
        totalPages={totalPages}
        onPendingChange={setPaginationPending}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle", { label: deleteTarget?.label ?? "" })}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription", { count: deleteTarget?.ids.length ?? 1 })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{tActions("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
              className={buttonVariants({ variant: "destructive" })}
            >
              {deleting ? tActions("deleting") : tActions("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
