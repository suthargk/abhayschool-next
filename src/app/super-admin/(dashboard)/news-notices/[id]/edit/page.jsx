import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { NewsNoticeForm } from "../../components/news-notice-form";

export default async function EditNewsNoticePage({ params }) {
  const { id } = await params;
  const item = await prisma.newsNotice.findUnique({ where: { id } });

  if (!item) notFound();

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
      <NewsNoticeForm initialItem={item} />
    </div>
  );
}
