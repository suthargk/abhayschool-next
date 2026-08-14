import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton({ fields = 4 }) {
  return (
    <div className="max-w-2xl space-y-6 rounded-md border p-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-9 w-28" />
    </div>
  );
}
