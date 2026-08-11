import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { ContentRenderer } from "@/components/news-notices/content-renderer";

export const revalidate = 60;

export default async function AcademicPostDetailPage({ params }) {
  const { slug } = await params;

  const item = await prisma.academicPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { email: true } } },
  });

  if (!item) notFound();

  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          href="/academics"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Academics
        </Link>

        <div className="space-y-4">
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
    </div>
  );
}
