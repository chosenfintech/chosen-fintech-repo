'use client';

import { useEffect } from 'react';
import './globals.css';

// Replaces the root layout when it crashes, so it must render its own
// <html>/<body> and stay dependency-free (no theme provider, no motion).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <section className="px-4 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="font-display text-8xl md:text-9xl font-bold gradient-text mb-4">
              Oops!
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Something Went Wrong
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              An unexpected error occurred. Please try again, or reload the
              page.
            </p>

            <div className="flex flex-row gap-4 justify-center">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-300 cursor-pointer"
              >
                Try Again
              </button>

              {/* Plain <a> on purpose: a full reload escapes the crashed
                  root layout, which client-side navigation would keep. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="inline-flex items-center justify-center h-10 px-6 rounded-md border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors duration-300"
              >
                Go Home
              </a>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
