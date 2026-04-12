// src/app/dashboard/gallery/categories/_components/GalleryCategoriesManageClient.tsx
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GalleryCategoriesDataTable } from '@/components/gallery/categories/data-table/DataTable';
import { useGetAllGalleryCategoriesQuery } from '@/redux/gallery/gallery-category-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IGalleryCategoriesQueryParams } from '@/types/gallery/gallery-category.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const GalleryCategoriesManageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [page, setPage] = useState<number>(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });

  const [pageSize, setPageSize] = useState<number>(() => {
    const limitParam = searchParams.get('limit');
    return limitParam ? parseInt(limitParam, 10) : 10;
  });

  const [filters, setFilters] = useState<
    Omit<IGalleryCategoriesQueryParams, 'page' | 'limit'>
  >(() => {
    const searchParam = searchParams.get('search');
    const sortByParam = searchParams.get('sortBy');
    const sortOrderParam = searchParams.get('sortOrder') as
      | 'asc'
      | 'desc'
      | null;

    return {
      search: searchParam ?? undefined,
      sortBy: sortByParam ?? undefined,
      sortOrder: sortOrderParam ?? undefined,
    };
  });

  useEffect(() => {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('limit', pageSize.toString());

    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, filters, router]);

  const queryParams: IGalleryCategoriesQueryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    ),
  };

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllGalleryCategoriesQuery(queryParams);

  useEffect(() => {
    if (isInitialLoad && categoriesData) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, categoriesData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleFiltersChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(1);
    },
    [],
  );

  const handleCreateCategory = () => {
    router.push('/dashboard/gallery/categories/create');
  };

  const errorMessage = isError
    ? extractApiError(error).message
    : 'An unknown error occurred.';

  if (isError) {
    return <ErrorMessage error={errorMessage} onRetry={refetch} />;
  }

  if (isLoading && isInitialLoad) {
    return (
      <div className="container mx-auto">
        <DataTableSkeleton
          columnCount={6}
          rowCount={pageSize}
          showFilters={true}
          showActions={true}
          showPagination={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <GalleryCategoriesDataTable
        data={categoriesData?.data ?? []}
        loading={isFetching && !isInitialLoad}
        totalCount={categoriesData?.meta.total ?? 0}
        page={page}
        pageSize={pageSize}
        filters={filters}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFiltersChange={handleFiltersChange}
        onRefresh={refetch}
        onCreateCategory={handleCreateCategory}
      />
    </div>
  );
};

export default GalleryCategoriesManageClient;
