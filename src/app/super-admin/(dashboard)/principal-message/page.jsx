import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { PrincipalMessageForm } from "./components/principal-message-form";

export default async function SuperAdminPrincipalMessagePage() {
  const t = await getTranslations("superAdminPrincipalMessage.page");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("heading")}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Suspense fallback={<PrincipalMessageFormSkeleton />}>
        <PrincipalMessageSection />
      </Suspense>
    </div>
  );
}

async function PrincipalMessageSection() {
  const [item, profile] = await Promise.all([
    prisma.principalMessage.findFirst({ orderBy: { createdAt: "desc" } }),
    getCurrentProfile(),
  ]);

  return (
    <PrincipalMessageForm
      initialItem={item}
      canPublish={profile?.role === "ADMIN"}
    />
  );
}

function PrincipalMessageFormSkeleton() {
  return (
    <div className="max-w-2xl space-y-4 rounded-md border p-6">
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-9 w-28" />
    </div>
  );
}
