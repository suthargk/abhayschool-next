"use client";

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
import { buttonVariants } from "@/components/ui/button";

export function FacultyDeleteDialog({ target, deleting, onOpenChange, onConfirm }) {
  const t = useTranslations("superAdminFaculty.table");
  const tCommon = useTranslations("common.actions");
  const tTable = useTranslations("common.table");

  return (
    <AlertDialog open={target !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tTable("deleteConfirmTitle", { label: target?.label })}</AlertDialogTitle>
          <AlertDialogDescription>
            {tTable("deleteConfirmDescription")}{" "}
            {target?.ids.length === 1 ? t("deleteDescriptionOne") : t("deleteDescriptionMany")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>{tCommon("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className={buttonVariants({ variant: "destructive" })}
          >
            {deleting ? tCommon("deleting") : tCommon("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
