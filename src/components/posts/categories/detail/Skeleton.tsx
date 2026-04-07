// src/components/posts/categories/detail/Skeleton.tsx
export default function CategoryDetailSkeleton() {
  return (
    <div className="min-h-screen container mx-auto max-w-6xl animate-pulse">
      <div className="mx-auto space-y-8">
        {/* Back button skeleton */}
        <div className="flex items-center gap-2 p-2">
          <div className="w-5 h-5 bg-muted rounded"></div>
          <div className="h-5 w-16 bg-muted rounded"></div>
        </div>

        {/* Category Header Skeleton */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Title and stats */}
            <div className="space-y-4 flex-1">
              <div className="h-8 w-48 bg-muted rounded"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-24 bg-muted rounded-full"></div>
                <div className="h-6 w-24 bg-muted rounded-full"></div>
                <div className="h-6 w-24 bg-muted rounded-full"></div>
              </div>
            </div>
            {/* Edit button */}
            <div className="h-10 w-24 bg-muted rounded-lg"></div>
          </div>

          {/* Metadata */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List Skeleton */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          {/* List Header */}
          <div className="p-4 sm:p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="h-6 w-48 bg-muted rounded"></div>
              <div className="h-6 w-20 bg-muted rounded-full"></div>
            </div>
            <div className="h-4 w-64 bg-muted rounded mt-2"></div>
          </div>

          {/* Post Items */}
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image skeleton */}
                  <div className="shrink-0 w-full sm:w-24 h-24 rounded-lg bg-muted"></div>

                  {/* Content skeleton */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Title and badge */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="h-6 w-3/4 bg-muted rounded"></div>
                      <div className="h-6 w-20 bg-muted rounded-full"></div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-2/3 bg-muted rounded"></div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4">
                      <div className="h-3 w-24 bg-muted rounded"></div>
                      <div className="h-3 w-20 bg-muted rounded"></div>
                      <div className="h-3 w-16 bg-muted rounded"></div>
                      <div className="h-3 w-12 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
