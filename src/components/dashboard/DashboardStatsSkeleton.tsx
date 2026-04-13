// src/components/dashboard/DashboardStatsSkeleton.tsx
export function DashboardStatsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Greeting skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-64 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-40 rounded-md bg-muted animate-pulse" />
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-md bg-muted animate-pulse" />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
            </div>
            <div className="h-8 w-16 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
