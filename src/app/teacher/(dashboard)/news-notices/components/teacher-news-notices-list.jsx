"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ImageOff, Loader2, MoreHorizontal, Pin } from "lucide-react";

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
import { cn } from "@/lib/utils";

function ItemThumb({ item }) {
  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
      {item.coverImageUrl ? (
        <Image src={item.coverImageUrl} alt="" fill className="object-cover" unoptimized />
      ) : (
        <ImageOff className="size-4 text-muted-foreground" />
      )}
    </span>
  );
}

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
          <Link href={`/teacher/news-notices/${item.id}/edit`}>{tCommon("edit")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
          {tCommon("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TeacherNewsNoticesFilters({ filters, onPendingChange }) {
  const t = useTranslations("teacherNewsNotices.list");
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

  function handleSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/teacher/news-notices?${qs}` : "/teacher/news-notices", {
        scroll: false,
      });
    });
  }

  return (
    <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
        {tCommon("search")}
      </Button>
      {filters.q ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setSearch("");
            startTransition(() => {
              router.push("/teacher/news-notices", { scroll: false });
            });
          }}
        >
          {tCommon("clear")}
        </Button>
      ) : null}
    </form>
  );
}

export function TeacherNewsNoticesList({ initialItems, filters, hasAnyItems }) {
  const t = useTranslations("teacherNewsNotices.list");
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
    setDeleteTarget({ id: item.id, label: `"${item.title}"` });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { id, label } = deleteTarget;
    setDeleting(true);
    try {
      await toast
        .promise(
          fetch(`/api/teacher/news-notices/${id}`, { method: "DELETE" }).then((res) => {
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
      <TeacherNewsNoticesFilters filters={filters} onPendingChange={setFilterPending} />

      <div
        className={cn("relative transition-opacity", filterPending && "opacity-60")}
        aria-busy={filterPending}
      >
        {filterPending ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : null}

        {items.length === 0 ? (
          <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            {hasAnyItems ? t("noResultsFiltered") : t("noResultsEmpty")}
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
                    <div className="flex items-center gap-3">
                      <ItemThumb item={item} />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <RowActionsMenu item={item} onDelete={() => requestDelete(item)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pl-[52px] text-sm text-muted-foreground">
                    <Badge variant="secondary">
                      {item.type === "NEWS" ? t("typeNews") : t("typeNotice")}
                    </Badge>
                    {item.pinned ? <Pin className="size-3.5" /> : null}
                    <span>{format(new Date(item.createdAt), "d MMM yyyy")}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/tablet: full table. */}
            <div className="hidden rounded-xl border md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("titleColumn")}</TableHead>
                    <TableHead>{t("typeColumn")}</TableHead>
                    <TableHead>{t("postedColumn")}</TableHead>
                    <TableHead className="w-0" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/teacher/news-notices/${item.id}/edit`}
                          className="flex items-center gap-3 hover:text-primary hover:underline"
                        >
                          <ItemThumb item={item} />
                          <span className="flex items-center gap-1.5">
                            {item.pinned ? <Pin className="size-3.5 shrink-0" /> : null}
                            {item.title}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.type === "NEWS" ? t("typeNews") : t("typeNotice")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(item.createdAt), "d MMM yyyy")}
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
