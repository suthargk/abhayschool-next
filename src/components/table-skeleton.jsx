import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="rounded-md border">
      <div className="border-b p-3">
        <Skeleton className="h-5 w-full max-w-sm" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b p-3 last:border-b-0">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
