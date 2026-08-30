import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherNewsNoticeForm } from "../../components/teacher-news-notices-form";

// Not async: the header has no data dependency, so it streams immediately
// instead of waiting on the item query below.
export default function EditTeacherNewsNoticePage({ params }) {
  const t = useTranslations("teacherNewsNotices.editPage");
  const tActions = useTranslations("common.actions");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/news-notices">
            <ArrowLeft className="size-4" />
            {tActions("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditNewsNoticeFormSection params={params} />
      </Suspense>
    </div>
  );
}

async function EditNewsNoticeFormSection({ params }) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  const item = await prisma.newsNotice.findUnique({
    where: { id },
    include: { attachments: true },
  });

  if (!item || item.authorId !== profile.id) notFound();

  return <TeacherNewsNoticeForm initialItem={item} />;
}
