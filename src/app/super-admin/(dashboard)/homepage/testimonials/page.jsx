import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TestimonialAdmin } from "./components/testimonial-admin";

export default async function SuperAdminTestimonialsPage() {
  const t = await getTranslations("superAdminTestimonials.page");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <TestimonialSection />
      </Suspense>
    </div>
  );
}

async function TestimonialSection() {
  const [items, profile] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: [{ position: "asc" }] }),
    getCurrentProfile(),
  ]);

  return <TestimonialAdmin initialItems={items} canPublish={profile?.role === "ADMIN"} />;
}
