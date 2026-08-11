import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NewsNoticeForm } from "../components/news-notice-form";

export default function NewNewsNoticePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/news-notices">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create news / notice
        </h1>
      </div>
      <NewsNoticeForm />
    </div>
  );
}
