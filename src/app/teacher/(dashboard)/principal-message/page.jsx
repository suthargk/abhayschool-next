import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";

import { TeacherPrincipalMessageForm } from "./components/teacher-principal-message-form";

export default function TeacherPrincipalMessagePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Principal&apos;s Message</h1>
        <p className="text-muted-foreground">
          Manage the content and photo shown on the public Principal&apos;s Message page.
        </p>
      </div>

      <Suspense fallback={<PrincipalMessageFormSkeleton />}>
        <PrincipalMessageSection />
      </Suspense>
    </div>
  );
}

async function PrincipalMessageSection() {
  const item = await prisma.principalMessage.findFirst({ orderBy: { createdAt: "desc" } });

  return <TeacherPrincipalMessageForm initialItem={item} />;
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
