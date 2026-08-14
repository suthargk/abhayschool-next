import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FormSkeleton } from "@/components/form-skeleton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { NewsNoticeForm } from "../../components/news-notice-form";

export default async function EditNewsNoticePage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/news-notices">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditNewsNoticeSection id={id} />
      </Suspense>
    </div>
  );
}

async function EditNewsNoticeSection({ id }) {
  const item = await prisma.newsNotice.findUnique({
    where: { id },
    include: { attachments: true },
  });

  if (!item) notFound();

  return <NewsNoticeForm initialItem={item} />;
}
