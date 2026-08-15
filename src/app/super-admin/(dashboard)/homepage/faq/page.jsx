import { Suspense } from "react";

import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { FaqAdmin } from "./components/faq-admin";

export default function SuperAdminFaqPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground">
          Manage the FAQ accordion shown on the public homepage.
        </p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <FaqSection />
      </Suspense>
    </div>
  );
}

async function FaqSection() {
  const [items, profile] = await Promise.all([
    prisma.faq.findMany({ orderBy: [{ position: "asc" }] }),
    getCurrentProfile(),
  ]);

  return <FaqAdmin initialItems={items} canPublish={profile?.role === "ADMIN"} />;
}
