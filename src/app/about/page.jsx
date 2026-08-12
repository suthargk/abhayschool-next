import { prisma } from "@/lib/prisma";

import { AboutHero } from "./components/about-hero";
import { WhoWeAre } from "./components/who-we-are";
import { VisionMission } from "./components/vision-mission";
import { CoreValues } from "./components/core-values";
import { PrincipalMessagePreview } from "./components/principal-message-preview";
import { WhatMakesUsDifferent } from "./components/what-makes-us-different";
import { AcademicPhilosophy } from "./components/academic-philosophy";
import { FacilitiesPreview } from "./components/facilities-preview";
import { FacultyPreview } from "./components/faculty-preview";
import { AchievementsPreview } from "./components/achievements-preview";
import { GalleryPreview } from "./components/gallery-preview";
import { AboutCta } from "./components/about-cta";

export const revalidate = 60;

export default async function AboutPage() {
  const [facultyRows, principalMessage, facilities, toppers, albums] =
    await Promise.all([
      prisma.faculty.findMany({
        where: { status: "PUBLISHED" },
        select: { experienceYears: true },
      }),
      prisma.principalMessage.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.facility.findMany({
        where: { status: "PUBLISHED", section: "OVERVIEW", featured: true },
        orderBy: { position: "asc" },
        take: 4,
      }),
      prisma.topper.findMany({
        where: { status: "PUBLISHED" },
        select: { percentage: true },
      }),
      prisma.galleryAlbum.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { eventDate: "desc" },
        take: 6,
      }),
    ]);

  const facultyCount = facultyRows.length;
  const experienceYears = facultyRows
    .map((row) => row.experienceYears)
    .filter((years) => years != null);
  const avgExperience = experienceYears.length
    ? Math.round(
        experienceYears.reduce((sum, years) => sum + years, 0) /
          experienceYears.length,
      )
    : null;

  const topperCount = toppers.length;
  const highestPercentage = topperCount
    ? Math.max(...toppers.map((t) => t.percentage))
    : 0;

  return (
    <div className="min-h-screen">
      <AboutHero />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        <WhoWeAre facultyCount={facultyCount} />
        <VisionMission />
        <CoreValues />
        <PrincipalMessagePreview message={principalMessage} />
        <WhatMakesUsDifferent />
        <AcademicPhilosophy />
        <FacilitiesPreview items={facilities} />
        <FacultyPreview facultyCount={facultyCount} avgExperience={avgExperience} />
        <AchievementsPreview
          topperCount={topperCount}
          highestPercentage={highestPercentage}
        />
        <GalleryPreview albums={albums} />
        <AboutCta />
      </div>
    </div>
  );
}
