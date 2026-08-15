import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FormSkeleton } from "@/components/form-skeleton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { HomeworkForm } from "../../components/homework-form";

export default async function EditHomeworkPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/homework">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditHomeworkSection id={id} />
      </Suspense>
    </div>
  );
}

async function EditHomeworkSection({ id }) {
  const [item, classes] = await Promise.all([
    prisma.homework.findUnique({
      where: { id },
      include: { attachments: true },
    }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!item) notFound();

  return <HomeworkForm initialItem={item} classes={classes} />;
}
