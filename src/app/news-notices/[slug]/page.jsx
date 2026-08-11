import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { ContentRenderer } from "@/components/news-notices/content-renderer";
import { cn } from "@/lib/utils";

export default async function NewsNoticeDetailPage({ params }) {
  const { slug } = await params;

  const item = await prisma.newsNotice.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { email: true } } },
  });

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6">
      <Link
        href="/news-notices"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to News &amp; Notices
      </Link>

      <div className="space-y-4">
        <span
          className={cn(
            "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
            item.type === "NOTICE"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              : "bg-violet-100 text-violet-700 dark:bg-zinc-800 dark:text-zinc-300",
          )}
        >
          {item.type === "NEWS" ? "News" : "Notice"}
        </span>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {item.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {item.publishedAt
            ? format(new Date(item.publishedAt), "MMMM d, yyyy")
            : null}
          {item.author?.email ? ` · ${item.author.email}` : null}
        </p>
      </div>

      {item.coverImageUrl ? (
        <Image
          src={item.coverImageUrl}
          alt=""
          width={1200}
          height={630}
          className="h-auto w-full rounded-lg border object-cover"
          unoptimized
        />
      ) : null}

      <div className="pt-2">
        <ContentRenderer content={item.content} />
      </div>
    </div>
  );
}
