// src/components/posts/PostsSkeleton.tsx
import { NavBar } from '../NavBar';
import { Footer } from '../Footer';
import { PageHero } from '../ui/PageHero';

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-md ${className ?? ''}`} />
  );
}

function PostCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-0 rounded-lg overflow-hidden border border-border/50">
      <div className="md:col-span-2 animate-pulse bg-muted min-h-[140px]" />
      <div className="md:col-span-3 p-6 lg:p-8 flex flex-col justify-center gap-3">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-5 w-[90%]" />
        <SkeletonBlock className="h-4 w-[75%]" />
        <SkeletonBlock className="h-4 w-[55%]" />
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search card */}
      <div className="rounded-lg border border-border/50 p-5 space-y-3">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-11 w-full" />
      </div>

      {/* Categories card */}
      <div className="rounded-lg border border-border/50 p-5 space-y-2.5">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-10 w-full" />
        <SkeletonBlock className="h-10 w-full" />
        <SkeletonBlock className="h-10 w-full" />
        <SkeletonBlock className="h-10 w-3/4" />
      </div>

      {/* Recent posts card */}
      <div className="rounded-lg border border-border/50 p-5 space-y-4">
        <SkeletonBlock className="h-4 w-28" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <SkeletonBlock className="h-16 w-16 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3.5 w-[90%]" />
              <SkeletonBlock className="h-3 w-[60%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventsPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <PageHero title="Events" />

      {/* Featured post skeleton */}
      <section className="py-8 lg:py-12 bg-muted/20 border-b border-border/50">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 rounded-lg overflow-hidden border border-border/50">
            <div className="animate-pulse bg-muted min-h-[200px] lg:min-h-[360px]" />
            <div className="p-8 lg:p-12 flex flex-col justify-center gap-4">
              <SkeletonBlock className="h-6 w-24 rounded-full" />
              <SkeletonBlock className="h-8 w-[90%]" />
              <SkeletonBlock className="h-5 w-[80%]" />
              <SkeletonBlock className="h-5 w-[65%]" />
              <SkeletonBlock className="h-4 w-20 mt-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Posts + sidebar */}
      <section className="py-12 lg:py-16 xl:py-20 bg-muted/30">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-6 lg:space-y-8">
              <SkeletonBlock className="h-4 w-36" />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
            <div className="hidden lg:block lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <SidebarSkeleton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
