// src/components/gallery/GalleryPageSkeleton.tsx
import { NavBar } from '../NavBar';
import { Footer } from '../Footer';
import { PageHero } from '../ui/PageHero';

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-md ${className ?? ''}`} />
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden aspect-[4/3] bg-muted animate-pulse relative">
      {/* Simulated gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5">
        <SkeletonBlock className="h-4 w-3/4 bg-muted-foreground/20" />
        <SkeletonBlock className="h-3 w-1/4 bg-muted-foreground/20" />
      </div>
    </div>
  );
}

export default function GalleryPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <PageHero title="Gallery" />

      <section className="py-12 lg:py-16 xl:py-20 bg-muted/30 min-h-[60vh]">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Count line */}
          <SkeletonBlock className="h-4 w-24 mb-8" />

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
