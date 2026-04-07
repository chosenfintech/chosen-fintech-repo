// src/components/posts/BlogPageSkeleton.tsx
import { NavBar } from '../NavBar';
import { Footer } from '../Footer';
import { PageHero } from '../PageHero';

export default function BlogPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <PageHero title="Blog" />

      {/* Featured Post Skeleton */}
      <section className="container mx-auto px-4 max-w-7xl border-b border-muted">
        <div className="animate-pulse py-8">
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </section>

      <section className="py-16 bg-linear-to-br from-background via-muted to-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Posts Grid Skeleton */}
            <div className="lg:col-span-2">
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded w-48 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-muted rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
            {/* Sidebar Skeleton */}
            <aside className="lg:col-span-1">
              <div className="animate-pulse space-y-6">
                <div className="h-12 bg-muted rounded"></div>
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
