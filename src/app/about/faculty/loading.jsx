import { Skeleton } from "@/components/ui/skeleton";
import { FacultyHero } from "./components/faculty-hero";

export default function FacultyLoading() {
  return (
    <div className="min-h-screen">
      <FacultyHero />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>

        <div className="space-y-6">
          <Skeleton className="mx-auto h-8 w-56" />
          <Skeleton className="mx-auto h-64 w-full max-w-2xl rounded-2xl" />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>

        <div className="space-y-4">
          <Skeleton className="mx-auto h-11 w-full max-w-md" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
