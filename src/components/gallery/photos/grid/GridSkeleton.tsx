// src/components/gallery/photos/grid/GridSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

interface GridSkeletonProps {
  count?: number;
}

/** Placeholder cards shaped like the real photo cards while a page loads. */
export function GridSkeleton({ count = 12 }: GridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
