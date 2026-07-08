// src/components/ListQueryMemory.tsx
'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Session memory for the public list pages (academy, events, projects,
 * gallery), whose page/search/filter state lives entirely in the URL.
 *
 * Mounted on a list page it remembers the page's query string for the session
 * and, when the visitor re-enters through the nav on a bare URL, restores the
 * last view with `router.replace`. An explicit URL always wins, and a fresh
 * browser session starts clean.
 */
export default function ListQueryMemory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const storageKey = `cf-list:${pathname}`;

  // Restore once on mount. Registered before the mirror effect below so it
  // reads the saved entry before a bare URL overwrites it.
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    if (window.location.search) return; // explicit URL wins
    const saved = sessionStorage.getItem(storageKey);
    if (saved) router.replace(`${pathname}?${saved}`, { scroll: false });
  }, [pathname, storageKey, router]);

  // Query string → session memory.
  useEffect(() => {
    const queryString = searchParams.toString();
    if (queryString) sessionStorage.setItem(storageKey, queryString);
    else sessionStorage.removeItem(storageKey);
  }, [searchParams, storageKey]);

  return null;
}
