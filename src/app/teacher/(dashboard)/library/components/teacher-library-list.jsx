"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
import { classLabel } from "@/lib/classes";
import { cn } from "@/lib/utils";

function RowActionsMenu({ item, onDelete }) {
  const tCommon = useTranslations("common.actions");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{tCommon("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/teacher/library/${item.id}/edit`}>{tCommon("edit")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
          {tCommon("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TeacherLibraryFilters({ filters, classes, onPendingChange }) {
  const t = useTranslations("teacherLibrary.list");
  const tCommon = useTranslations("common.actions");
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
    const next = { ...filters, ...overrides };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.class && next.class !== "ALL") params.set("class", next.class);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/teacher/library?${qs}` : "/teacher/library", { scroll: false });
    });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate({ q: search });
  }

  const hasActiveFilters = filters.q || filters.class !== "ALL";

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
            navigate({ q: "", class: "ALL" });
          }}
        >
          {t("clearFilters")}
        </Button>
      ) : null}
    </form>
  );
}

export function TeacherLibraryList({ initialItems, classes, filters, hasAnyBooks }) {
  const t = useTranslations("teacherLibrary.list");
  const tCommon = useTranslations("common.actions");
  const tTable = useTranslations("common.table");
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterPending, setFilterPending] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function requestDelete(item) {
    setDeleteTarget({ id: item.id, label: `"${item.bookName}"` });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { id, label } = deleteTarget;
    setDeleting(true);
    try {
      await toast
        .promise(
          fetch(`/api/teacher/library/${id}`, { method: "DELETE" }).then((res) => {
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

  return (
    <div className="space-y-4">
      <TeacherLibraryFilters filters={filters} classes={classes} onPendingChange={setFilterPending} />

      <div className={cn("relative transition-opacity", filterPending && "opacity-60")} aria-busy={filterPending}>
        {filterPending ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : null}

        {items.length === 0 ? (
          <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            {hasAnyBooks ? t("noResultsFiltered") : t("noResultsEmpty")}
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
                    <span className="font-medium">{item.bookName}</span>
                    <RowActionsMenu item={item} onDelete={() => requestDelete(item)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                    <span>{classLabel(classes, item.class)}</span>
                    <span>·</span>
                    <span>{item.subject}</span>
                    <span>·</span>
                    <span>{item.publication}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/tablet: full table. */}
            <div className="hidden rounded-xl border md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("bookColumn")}</TableHead>
                    <TableHead>{t("classColumn")}</TableHead>
                    <TableHead>{t("subjectColumn")}</TableHead>
                    <TableHead>{t("publicationColumn")}</TableHead>
                    <TableHead className="w-0" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.bookName}</TableCell>
                      <TableCell>{classLabel(classes, item.class)}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>{item.publication}</TableCell>
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
              {tTable("deleteConfirmDescription")} {tTable("confirmDeleteOne")}
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
