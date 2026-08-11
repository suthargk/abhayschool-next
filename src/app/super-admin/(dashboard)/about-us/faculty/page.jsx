import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { FacultyTable } from "./components/faculty-table";

export default async function SuperAdminFacultyPage() {
  const [items, profile] = await Promise.all([
    prisma.faculty.findMany({
      orderBy: { position: "asc" },
      include: { author: { select: { email: true } } },
    }),
    getCurrentProfile(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Faculty</h1>
          <p className="text-muted-foreground">
            Manage the staff shown on the public Faculty page.
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/about-us/faculty/new">
            <Plus className="size-4" />
            Add faculty
          </Link>
        </Button>
      </div>

      <FacultyTable initialItems={items} canPublish={profile?.role === "ADMIN"} />
    </div>
  );
}
