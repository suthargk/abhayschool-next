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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <Link href={`/teacher/faq/${item.id}/edit`}>{tCommon("edit")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
          {tCommon("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TeacherFaqFilters({ filters, onPendingChange }) {
  const t = useTranslations("teacherFaq.list");
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
      router.push(qs ? `/teacher/faq?${qs}` : "/teacher/faq", { scroll: false });
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
              router.push("/teacher/faq", { scroll: false });
            });
          }}
        >
          {tCommon("clear")}
        </Button>
      ) : null}
    </form>
  );
}

export function TeacherFaqList({ initialItems, filters, hasAnyFaqs }) {
  const t = useTranslations("teacherFaq.list");
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterPending, setFilterPending] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function requestDelete(item) {
    setDeleteTarget({ id: item.id, label: `"${item.question}"` });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { id, label } = deleteTarget;
    setDeleting(true);
    try {
      await toast
        .promise(
          fetch(`/api/teacher/faq/${id}`, { method: "DELETE" }).then((res) => {
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
      <TeacherFaqFilters filters={filters} onPendingChange={setFilterPending} />

      <div className={cn("relative transition-opacity", filterPending && "opacity-60")} aria-busy={filterPending}>
        {filterPending ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : null}

        {items.length === 0 ? (
          <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            {hasAnyFaqs ? t("noResultsFiltered") : t("noResultsEmpty")}
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
                    <span className="font-medium">{item.question}</span>
                    <RowActionsMenu item={item} onDelete={() => requestDelete(item)} />
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>

            {/* Desktop/tablet: full table. */}
            <div className="hidden rounded-xl border md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("questionColumn")}</TableHead>
                    <TableHead>{t("answerColumn")}</TableHead>
                    <TableHead className="w-0" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="max-w-xs font-medium">{item.question}</TableCell>
                      <TableCell className="max-w-md truncate text-muted-foreground">
                        {item.answer}
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
            <AlertDialogTitle>{t("deleteTitle", { label: deleteTarget?.label })}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t("deleteCancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
              className={buttonVariants({ variant: "destructive" })}
            >
              {deleting ? t("deleting") : t("deleteConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
