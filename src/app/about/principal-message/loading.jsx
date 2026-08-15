import { Skeleton } from "@/components/ui/skeleton";
import { PrincipalHero } from "./components/principal-hero";

export default function PrincipalMessageLoading() {
  return (
    <div className="min-h-screen">
      <PrincipalHero />

      <div className="mx-auto max-w-6xl space-y-20 px-4 pb-16 pt-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>

        <div className="mx-auto aspect-video w-full max-w-2xl">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
