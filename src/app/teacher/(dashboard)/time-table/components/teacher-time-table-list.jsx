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
import { WEEKDAYS, WEEKDAY_LABEL_KEYS } from "@/data/weekdays";
import { classLabel } from "@/lib/classes";
import { cn } from "@/lib/utils";

function formatTimeRange(item) {
  if (item.startTime && item.endTime) return `${item.startTime} – ${item.endTime}`;
  return item.startTime || item.endTime || "—";
}

function RowActionsMenu({ item, onDelete }) {
  const tActions = useTranslations("common.actions");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{tActions("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/teacher/time-table/${item.id}/edit`}>{tActions("edit")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
          {tActions("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TeacherTimeTableFilters({
  filters,
  classes,
  pageSize,
  defaultPageSize,
  onPendingChange,
}) {
  const t = useTranslations("teacherTimeTable.list");
  const tActions = useTranslations("common.actions");
  const tWeekdays = useTranslations("academics.timeTable");
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
    // Any filter/search change resets to page 1 — `page` is deliberately
    // never included here, only added by the pagination controls below.
    const next = { ...filters, ...overrides };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.class && next.class !== "ALL") params.set("class", next.class);
    if (next.day && next.day !== "ALL") params.set("day", next.day);
    if (pageSize !== defaultPageSize) params.set("pageSize", pageSize);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/teacher/time-table?${qs}` : "/teacher/time-table", { scroll: false });
    });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate({ q: search });
  }

  const hasActiveFilters = filters.q || filters.class !== "ALL" || filters.day !== "ALL";

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
          {classes.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.day} onValueChange={(v) => navigate({ day: v })} disabled={isPending}>
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder={t("allDays")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t("allDays")}</SelectItem>
          {WEEKDAYS.map((d) => (
            <SelectItem key={d.value} value={d.value}>
              {tWeekdays(`weekdays.${WEEKDAY_LABEL_KEYS[d.value]}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        {tActions("search")}
      </Button>
      {hasActiveFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setSearch("");
            navigate({ q: "", class: "ALL", day: "ALL" });
          }}
        >
          {t("clearFilters")}
        </Button>
      ) : null}
    </form>
  );
}

export function TeacherTimeTableList({
  initialItems,
  classes,
  filters,
  hasAnySlots,
  page,
  pageSize,
  defaultPageSize,
  total,
  totalPages,
}) {
  const t = useTranslations("teacherTimeTable.list");
  const tActions = useTranslations("common.actions");
  const tWeekdays = useTranslations("academics.timeTable");
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterPending, setFilterPending] = useState(false);
  const [paginationPending, setPaginationPending] = useState(false);
  const navPending = filterPending || paginationPending;

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function requestDelete(item) {
    setDeleteTarget({ id: item.id, label: `"${item.subject}"` });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { id, label } = deleteTarget;
    setDeleting(true);
    try {
      await toast
        .promise(
          fetch(`/api/teacher/time-table/${id}`, { method: "DELETE" }).then((res) => {
            if (!res.ok) throw new Error("Delete failed");
          }),
          {
            loading: t("deletingToast", { label }),
            success: t("deletedToast", { label }),
            error: t("deleteFailedToast", { label }),
          },
        )
        .unwrap();
      setItems((prev) => prev.filter((i) => i.id !== id));
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
    day: filters.day !== "ALL" ? filters.day : undefined,
  };

  return (
    <div className="space-y-4">
      <TeacherTimeTableFilters
        filters={filters}
        classes={classes}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        onPendingChange={setFilterPending}
      />

      <div className={cn("relative transition-opacity", navPending && "opacity-60")} aria-busy={navPending}>
        {navPending ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : null}

        {items.length === 0 ? (
          <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            {hasAnySlots ? t("noResultsFiltered") : t("noResultsEmpty")}
          </p>
        ) : (
          <>
            {/* Mobile: stacked cards — a table can't shrink to fit a phone
                screen without either clipping columns or forcing horizontal
                scroll, so below md we switch to one card per item instead. */}
            <div className="space-y-3 md:hidden">
              {items.map((item) => (
                <div key={item.id} className="space-y-2 rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{item.subject}</span>
                    <RowActionsMenu item={item} onDelete={() => requestDelete(item)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                    <span>{classLabel(classes, item.class)}</span>
                    <span>·</span>
                    <span>{tWeekdays(`weekdays.${WEEKDAY_LABEL_KEYS[item.day]}`)}</span>
                    <span>·</span>
                    <span>{t("periodValue", { period: item.period })}</span>
                    <span>·</span>
                    <span>{formatTimeRange(item)}</span>
                  </div>
                  {item.teacherName ? (
                    <p className="text-sm text-muted-foreground">{item.teacherName}</p>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Desktop/tablet: full table. */}
            <div className="hidden rounded-xl border md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("classColumn")}</TableHead>
                    <TableHead>{t("dayColumn")}</TableHead>
                    <TableHead>{t("periodColumn")}</TableHead>
                    <TableHead>{t("subjectColumn")}</TableHead>
                    <TableHead>{t("teacherColumn")}</TableHead>
                    <TableHead>{t("timeColumn")}</TableHead>
                    <TableHead className="w-0" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{classLabel(classes, item.class)}</TableCell>
                      <TableCell>{tWeekdays(`weekdays.${WEEKDAY_LABEL_KEYS[item.day]}`)}</TableCell>
                      <TableCell>{item.period}</TableCell>
                      <TableCell className="font-medium">{item.subject}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.teacherName || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatTimeRange(item)}
                      </TableCell>
                      <TableCell>
                        <RowActionsMenu item={item} onDelete={() => requestDelete(item)} />
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
        basePath="/teacher/time-table"
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
            <AlertDialogTitle>{t("deleteTitle", { label: deleteTarget?.label ?? "" })}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
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
