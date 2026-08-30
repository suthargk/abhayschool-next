"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function PendingSignOutButton() {
  const t = useTranslations("teacherAuth.pending");
  const router = useRouter();

  async function onClick() {
    await fetch("/api/teacher/logout", { method: "POST" });
    router.replace("/teacher/login");
    router.refresh();
  }

  return (
    <Button variant="outline" className="w-full" onClick={onClick}>
      {t("signOut")}
    </Button>
  );
}
