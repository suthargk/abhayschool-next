"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function PendingSignOutButton() {
  const router = useRouter();

  async function onClick() {
    await fetch("/api/teacher/logout", { method: "POST" });
    router.replace("/teacher/login");
    router.refresh();
  }

  return (
    <Button variant="outline" className="w-full" onClick={onClick}>
      Sign out
    </Button>
  );
}
