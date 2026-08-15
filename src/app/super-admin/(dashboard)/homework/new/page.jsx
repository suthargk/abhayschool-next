import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { HomeworkForm } from "../components/homework-form";

export default async function NewHomeworkPage() {
  const classes = await prisma.schoolClass.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/homework">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create homework
        </h1>
      </div>
      <HomeworkForm classes={classes} />
    </div>
  );
}
