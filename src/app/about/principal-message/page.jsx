import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";

import { PrincipalHero } from "./components/principal-hero";
import { PrincipalMessageSection } from "./components/principal-message-section";
import { PrincipalPhilosophy } from "./components/principal-philosophy";
import { PrincipalProfile } from "./components/principal-profile";
import { PrincipalVision } from "./components/principal-vision";
import { PrincipalParentPartnership } from "./components/principal-parent-partnership";
import { PrincipalStudentMessage } from "./components/principal-student-message";
import { PrincipalVideo } from "./components/principal-video";
import { PrincipalExploreLinks } from "./components/principal-explore-links";

export const revalidate = 60;

export default async function PrincipalMessagePage() {
  const t = await getTranslations("principalMessage.page");
  const item = await prisma.principalMessage.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <PrincipalHero item={item} />

      <div className="mx-auto max-w-6xl space-y-20 px-4 pb-16 pt-4 sm:px-6">
        {item ? (
          <>
            <PrincipalMessageSection item={item} />
            <PrincipalPhilosophy />
            <PrincipalProfile item={item} />
            <PrincipalVision />
            <PrincipalParentPartnership />
            <PrincipalStudentMessage />
            <PrincipalVideo videoUrl={item.videoUrl} />
          </>
        ) : (
          <p className="mx-auto max-w-3xl text-center text-muted-foreground">
            {t("emptyState")}
          </p>
        )}

        <PrincipalExploreLinks />
      </div>
    </div>
  );
}
