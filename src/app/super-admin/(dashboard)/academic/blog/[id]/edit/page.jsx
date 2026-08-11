import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { AcademicPostForm } from "../../components/academic-post-form";

export default async function EditAcademicPostPage({ params }) {
  const { id } = await params;
  const item = await prisma.academicPost.findUnique({ where: { id } });

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/academic/blog">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit</h1>
      </div>
      <AcademicPostForm initialItem={item} />
    </div>
  );
}
