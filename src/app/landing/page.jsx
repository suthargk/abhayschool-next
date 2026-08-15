export const revalidate = 60;

import { Suspense } from "react";

import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GlitterBackground } from "@/components/backgrounds/glitter-background";

import { WhatMakesUsDifferent } from "@/app/about/components/what-makes-us-different";
import { AcademicPhilosophy } from "@/app/about/components/academic-philosophy";
import { FacilitiesPreview } from "@/app/about/components/facilities-preview";
import { PrincipalMessagePreview } from "@/app/about/components/principal-message-preview";
import { GalleryPreview } from "@/app/about/components/gallery-preview";
import { FeaturedToppers } from "@/app/achievements/toppers/components/featured-toppers";
import { AchievementStats } from "@/app/achievements/toppers/components/achievement-stats";

import Hero from "./hero";
import { StatsStrip } from "./stats-strip";
import { Welcome } from "./welcome";
import CampusHighlights from "./campus-highlights";
import NewsNotices from "./news-notices";
import Testimonials from "./testimonials";
import FrequentlyAskQuestions from "./frequently-ask-questions";
import { AdmissionsCta } from "./admissions-cta";

async function resolveLatestTopperYear() {
  const latest = await prisma.topper.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { year: "desc" },
    select: { year: true },
  });

  return latest?.year ?? null;
}

async function LandingStats() {
  const latestYear = await resolveLatestTopperYear();

  const [facultyCount, highest] = await Promise.all([
    prisma.faculty.count({ where: { status: "PUBLISHED" } }),
    latestYear
      ? prisma.topper.aggregate({
          where: { status: "PUBLISHED", year: latestYear },
          _max: { percentage: true },
        })
      : Promise.resolve(null),
  ]);

  return (
    <StatsStrip
      facultyCount={facultyCount}
      highestPercentage={highest?._max.percentage ?? 0}
    />
  );
}

async function LandingFacilities() {
  const facilities = await prisma.facility.findMany({
    where: { status: "PUBLISHED", section: "OVERVIEW", featured: true },
    orderBy: { position: "asc" },
    take: 4,
  });

  return <FacilitiesPreview items={facilities} />;
}

async function LandingPrincipalMessage() {
  const principalMessage = await prisma.principalMessage.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return <PrincipalMessagePreview message={principalMessage} />;
}

async function LandingToppers() {
  const latestYear = await resolveLatestTopperYear();

  const toppers = latestYear
    ? await prisma.topper.findMany({
        where: { status: "PUBLISHED", year: latestYear },
        orderBy: [{ rank: "asc" }],
      })
    : [];

  if (toppers.length === 0) return null;

  const featuredToppers = [...toppers]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  return (
    <div className="relative space-y-10">
      <GlitterBackground preset="festive" sparkleCount={20} />
      <FeaturedToppers toppers={featuredToppers} />
      <AchievementStats toppers={toppers} />
      <div className="text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/achievements/toppers">View All Achievements →</Link>
        </Button>
      </div>
    </div>
  );
}

async function LandingTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ position: "asc" }],
  });

  if (testimonials.length === 0) return null;

  return (
    <div className="space-y-6">
      <Testimonials items={testimonials} />
      <div className="text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/testimonials">View All Testimonials →</Link>
        </Button>
      </div>
    </div>
  );
}

async function LandingGallery() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { eventDate: "desc" },
    take: 6,
  });

  return <GalleryPreview albums={albums} />;
}

function StatsStripSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 rounded-xl border bg-card p-5"
        >
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function ImageGridPreviewSkeleton({ tiles = 4, columns = "sm:grid-cols-4" }) {
  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-5 w-80" />
      </div>
      <div className={`grid grid-cols-2 gap-4 ${columns}`}>
        {Array.from({ length: tiles }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function PrincipalMessageSkeleton() {
  return (
    <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border bg-card p-8 sm:grid-cols-[auto_1fr] sm:p-10">
      <Skeleton className="mx-auto size-32 rounded-full sm:size-40" />
      <div className="space-y-3 text-center sm:text-left">
        <Skeleton className="mx-auto h-8 w-64 sm:mx-0" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mx-auto h-4 w-40 sm:mx-0" />
      </div>
    </div>
  );
}

function ToppersSkeleton() {
  return (
    <div className="space-y-10">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <Skeleton className="mx-auto h-8 w-56" />
        <Skeleton className="mx-auto h-5 w-80" />
      </div>
      <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 overflow-hidden rounded-2xl border bg-card">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2 p-5">
              <Skeleton className="mx-auto h-3 w-24" />
              <Skeleton className="mx-auto h-5 w-32" />
              <Skeleton className="mx-auto h-4 w-28" />
              <Skeleton className="mx-auto h-7 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 p-6 sm:p-10 md:p-16 lg:p-20 pb-0 lg:justify-between">
      <div className="w-full lg:w-96 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-[700px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function FaqSkeleton() {
  return (
    <div className="flex flex-col gap-10 items-center px-4">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-8 w-72" />
        <Skeleton className="mx-auto h-5 w-96" />
      </div>
      <div className="flex flex-col lg:flex-row gap-4 sm:px-10 md:px-20 lg:px-36 w-full">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="w-full lg:w-1/2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsNoticesSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-64 rounded-3xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="py-2.5 px-10 space-y-20">
      <Hero />

      <div className="space-y-32">
        <Suspense fallback={<StatsStripSkeleton />}>
          <LandingStats />
        </Suspense>

        <Welcome />

        <WhatMakesUsDifferent />

        <AcademicPhilosophy />

        <Suspense fallback={<ImageGridPreviewSkeleton tiles={4} />}>
          <LandingFacilities />
        </Suspense>

        <Suspense fallback={<PrincipalMessageSkeleton />}>
          <LandingPrincipalMessage />
        </Suspense>

        <Suspense fallback={<ToppersSkeleton />}>
          <LandingToppers />
        </Suspense>

        <Suspense fallback={<NewsNoticesSkeleton />}>
          <NewsNotices />
        </Suspense>

        <CampusHighlights />

        <Suspense
          fallback={<ImageGridPreviewSkeleton tiles={6} columns="sm:grid-cols-6" />}
        >
          <LandingGallery />
        </Suspense>

        <Suspense fallback={<TestimonialsSkeleton />}>
          <LandingTestimonials />
        </Suspense>

        <Suspense fallback={<FaqSkeleton />}>
          <FrequentlyAskQuestions />
        </Suspense>

        <AdmissionsCta />
      </div>
    </div>
  );
}
