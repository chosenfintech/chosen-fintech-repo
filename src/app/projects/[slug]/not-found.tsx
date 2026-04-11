// src/app/projects/[slug]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { NavBar } from '@/components/NavBar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-6 pt-12">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-muted-foreground/30 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Project Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The project you&apos;re looking for doesn&apos;t exist or may have
            been moved.
          </p>

          <div className="space-y-4">
            <Link href="/projects">
              <Button className="w-full">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Projects
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
