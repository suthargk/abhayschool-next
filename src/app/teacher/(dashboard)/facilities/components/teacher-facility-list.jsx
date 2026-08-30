"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Sparkles } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function FacilityThumb({ item }) {
  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
      {item.imageUrl ? (
        <Image src={item.imageUrl} alt="" fill className="object-cover" unoptimized />
      ) : item.icon ? (
        <span className="text-lg">{item.icon}</span>
      ) : (
        <Sparkles className="size-4 text-muted-foreground" />
      )}
    </span>
  );
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
          <Link href={`/teacher/facilities/${item.id}/edit`}>{tActions("edit")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onDelete}>
          {tActions("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TeacherFacilityList({ initialItems, section }) {
  const t = useTranslations("teacherFacilities.list");
  const tActions = useTranslations("common.actions");
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const isFaq = section === "FAQ";

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
          fetch(`/api/teacher/facilities/${id}`, { method: "DELETE" }).then((res) => {
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
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          {t("empty")}
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
                    <FacilityThumb item={item} />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <RowActionsMenu item={item} onDelete={() => requestDelete(item)} />
                </div>
                {item.summary ? (
                  <p className="pl-[52px] text-sm text-muted-foreground">{item.summary}</p>
                ) : null}
                {!isFaq && item.featured ? (
                  <div className="pl-[52px]">
                    <Badge variant="secondary">{t("featuredBadge")}</Badge>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Desktop/tablet: full table. */}
          <div className="hidden rounded-xl border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isFaq ? t("columnQuestion") : t("columnTitle")}</TableHead>
                  <TableHead>{isFaq ? t("columnAnswer") : t("columnSummary")}</TableHead>
                  {!isFaq ? <TableHead>{t("columnFeatured")}</TableHead> : null}
                  <TableHead className="w-0" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/teacher/facilities/${item.id}/edit`}
                        className="flex items-center gap-3 hover:text-primary hover:underline"
                      >
                        <FacilityThumb item={item} />
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-sm truncate text-muted-foreground">
                      {item.summary || "—"}
                    </TableCell>
                    {!isFaq ? (
                      <TableCell>
                        {item.featured ? (
                          <Badge variant="secondary">{t("featuredBadge")}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    ) : null}
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
