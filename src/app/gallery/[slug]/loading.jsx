import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryAlbumLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6">
      <Skeleton className="h-5 w-32" />

      <div className="space-y-3">
        <Skeleton className="h-9 w-3/4 sm:h-10" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}
