// src/hooks/use-table-url-state.ts
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/** Minimal read surface shared by URLSearchParams and Next's readonly params. */
export interface IParamsReader {
  get(name: string): string | null;
}

interface IUseTableUrlStateOptions<TFilters extends object> {
  /**
   * Parses this table's filters out of a query string. Must be a stable
   * (module-level) function — the URL-sync effects depend on it.
   */
  parseFilters: (params: IParamsReader) => TFilters;
  /** Writes the active filters into `params`. Must be stable too. */
  serializeFilters: (filters: TFilters, params: URLSearchParams) => void;
  defaultPageSize?: number;
}

/**
 * URL-synced table state (page + page size + filters) with per-table session
 * memory, shared by the dashboard manage tables.
 *
 * - State seeds once from the URL, then mirrors back into the query string via
 *   `router.replace` (no scroll, no stacked history entries), so browser Back
 *   from a detail page lands on the exact list view the user left.
 * - The mirror also remembers the query string in `sessionStorage`; re-entering
 *   the table through the sidebar (a bare URL) restores the last page, page
 *   size and filters. An explicit URL always wins, and a fresh browser session
 *   starts clean.
 * - A `popstate` listener adopts the URL on browser back/forward. The mirror
 *   uses `router.replace` (history.replaceState), which emits no `popstate`,
 *   so our own writes can't feed back into it.
 */
export function useTableUrlState<TFilters extends object>({
  parseFilters,
  serializeFilters,
  defaultPageSize = 10,
}: IUseTableUrlStateOptions<TFilters>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState<number>(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });

  const [pageSize, setPageSize] = useState<number>(() => {
    const limitParam = searchParams.get('limit');
    return limitParam ? parseInt(limitParam, 10) : defaultPageSize;
  });

  const [filters, setFilters] = useState<TFilters>(() =>
    parseFilters(searchParams),
  );

  // Session memory: entering the table on a BARE url (a sidebar link) restores
  // where the user left it. Registered before the mirror effect below so it
  // reads the live URL before the mirror writes to it.
  const storageKey = `cf-table:${pathname}`;
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    if (window.location.search) return; // explicit URL wins
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return;
    const params = new URLSearchParams(saved);
    const savedPage = parseInt(params.get('page') ?? '1', 10);
    const savedLimit = parseInt(params.get('limit') ?? '', 10);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot restore on mount
    setPage(savedPage > 0 ? savedPage : 1);
    setPageSize(savedLimit > 0 ? savedLimit : defaultPageSize);
    setFilters(parseFilters(params));
  }, [storageKey, parseFilters, defaultPageSize]);

  // State → URL + session memory. Reads nothing reactive from the URL, so
  // writing the URL can't feed back and loop.
  useEffect(() => {
    // A popped navigation away from this table can still tick this effect
    // before unmount; never rewrite (or remember) another route's URL.
    if (window.location.pathname !== pathname) return;

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', pageSize.toString());
    serializeFilters(filters, params);

    router.replace(`?${params.toString()}`, { scroll: false });
    sessionStorage.setItem(storageKey, params.toString());
  }, [page, pageSize, filters, serializeFilters, pathname, router, storageKey]);

  // URL → state, for browser back/forward that lands on this table while it
  // stays mounted.
  useEffect(() => {
    const syncFromUrl = () => {
      if (window.location.pathname !== pathname) return;
      const params = new URLSearchParams(window.location.search);
      const poppedPage = parseInt(params.get('page') ?? '1', 10);
      const poppedLimit = parseInt(params.get('limit') ?? '', 10);
      setPage(poppedPage > 0 ? poppedPage : 1);
      setPageSize(poppedLimit > 0 ? poppedLimit : defaultPageSize);
      setFilters(parseFilters(params));
    };
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [pathname, parseFilters, defaultPageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Partial<TFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  return {
    page,
    pageSize,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
  };
}
