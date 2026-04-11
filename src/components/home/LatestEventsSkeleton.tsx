import { Skeleton } from '@/components/ui/skeleton';

function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border h-full">
      {/* Image placeholder */}
      <Skeleton className="w-full aspect-16/10" />

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Category badge + date */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Read more */}
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function LatestEventsSkeleton() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div className="max-w-2xl space-y-3">
              <Skeleton className="h-10 w-56" />
              <Skeleton className="h-0.5 w-10" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-12 sm:h-14 w-40 rounded-md" />
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
