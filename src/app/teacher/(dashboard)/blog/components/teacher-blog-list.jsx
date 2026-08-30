"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table-pagination";
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
          <Link href={`/teacher/blog/${item.id}/edit`}>{tActions("edit")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
          {tActions("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TeacherBlogFilters({ filters, pageSize, defaultPageSize, onPendingChange }) {
  const t = useTranslations("teacherBlog.list");
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
    // Any filter/search change resets to page 1 — `page` is deliberately
    // never included here, only added by the pagination controls below.
    const next = { ...filters, ...overrides };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (pageSize !== defaultPageSize) params.set("pageSize", pageSize);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/teacher/blog?${qs}` : "/teacher/blog", { scroll: false });
    });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate({ q: search });
  }

  const hasActiveFilters = Boolean(filters.q);

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
      {hasActiveFilters ? (
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

export function TeacherBlogList({
  initialItems,
  filters,
  hasAnyPosts,
  page,
  pageSize,
  defaultPageSize,
  total,
  totalPages,
}) {
  const t = useTranslations("teacherBlog.list");
  const tActions = useTranslations("common.actions");
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
    setDeleteTarget({ id: item.id, label: `"${item.title}"` });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { id, label } = deleteTarget;
    setDeleting(true);
    try {
      await toast
        .promise(
          fetch(`/api/teacher/blog/${id}`, { method: "DELETE" }).then((res) => {
            if (!res.ok) throw new Error(t("toast.deleteFailed", { label }));
          }),
          {
            loading: t("toast.deleting", { label }),
            success: t("toast.deleted", { label }),
            error: t("toast.deleteFailed", { label }),
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

  return (
    <div className="space-y-4">
      <TeacherBlogFilters
        filters={filters}
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
            {hasAnyPosts ? t("emptyNoMatches") : t("emptyNoPosts")}
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
                    <span className="font-medium">{item.title}</span>
                    <RowActionsMenu item={item} onDelete={() => requestDelete(item)} />
                  </div>
                  {item.summary ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {t("publishedOn", {
                      date: format(new Date(item.publishedAt ?? item.createdAt), "d MMM yyyy"),
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop/tablet: full table. */}
            <div className="hidden rounded-xl border md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("columnTitle")}</TableHead>
                    <TableHead>{t("columnSummary")}</TableHead>
                    <TableHead>{t("columnPublished")}</TableHead>
                    <TableHead className="w-0" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="max-w-sm truncate text-muted-foreground">
                        {item.summary}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.publishedAt ?? item.createdAt), "d MMM yyyy")}
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
        basePath="/teacher/blog"
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
            <AlertDialogTitle>
              {t("deleteDialog.title", { label: deleteTarget?.label ?? "" })}
            </AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDialog.description")}</AlertDialogDescription>
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
