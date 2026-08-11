import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { LibraryForm } from "../../components/library-form";

export default async function EditLibraryBookPage({ params }) {
  const { id } = await params;
  const [item, profile] = await Promise.all([
    prisma.libraryBook.findUnique({ where: { id } }),
    getCurrentProfile(),
  ]);

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/academic/library">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit book</h1>
      </div>
      <LibraryForm initialItem={item} canPublish={profile?.role === "ADMIN"} />
    </div>
  );
}
