import { Suspense } from "react";

import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TestimonialAdmin } from "./components/testimonial-admin";

export default function SuperAdminTestimonialsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
        <p className="text-muted-foreground">
          Manage the testimonials marquee shown on the public homepage.
        </p>
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
