import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { NewsNoticeForm } from "../../components/news-notice-form";

export default async function EditNewsNoticePage({ params }) {
  const { id } = await params;
  const item = await prisma.newsNotice.findUnique({ where: { id } });

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edit</h1>
      </div>
      <NewsNoticeForm initialItem={item} />
    </div>
  );
}
