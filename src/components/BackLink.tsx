// src/components/BackLink.tsx
'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Counts in-app route changes for this tab. More than one distinct pathname
// means there IS app history to go back to; a deep link (a detail page opened
// directly) has none, so BackLink falls back to a plain navigation.
let internalNavs = 0;

/**
 * Mount once in the root layout so every route change is counted, whether or
 * not the page renders a BackLink.
 */
export function NavHistoryTracker() {
  const pathname = usePathname();
  const lastPathname = useRef<string | null>(null);

  useEffect(() => {
    if (lastPathname.current !== pathname) {
      lastPathname.current = pathname;
      internalNavs += 1;
    }
  }, [pathname]);

  return null;
}

interface IBackLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * "Back"-style link for detail, edit and create pages. When the user arrived
 * from inside the app it goes BACK in history — returning to the list exactly
 * as they left it (page, filters, scroll). Opened as a deep link, it simply
 * navigates to `href`, so it never dumps the user out of the site.
 */
export function BackLink({ href, children, className }: IBackLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={(e) => {
        // Let modified clicks (new tab etc.) behave like a normal link.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (internalNavs > 1) {
          e.preventDefault();
          router.back();
        }
      }}
      className={cn(buttonVariants({ variant: 'ghost' }), className)}
    >
      {children}
    </Link>
  );
}
