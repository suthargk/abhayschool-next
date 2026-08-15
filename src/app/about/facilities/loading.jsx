import { Skeleton } from "@/components/ui/skeleton";
import { FacilityHero } from "./components/facility-hero";

export default function FacilitiesLoading() {
  return (
    <div className="min-h-screen">
      <FacilityHero />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Skeleton className="mx-auto h-8 w-64" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="mx-auto h-8 w-72" />
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="mx-auto h-8 w-72" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
