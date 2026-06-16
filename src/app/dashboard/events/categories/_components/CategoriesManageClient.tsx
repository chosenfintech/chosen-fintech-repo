// src/app/dashboard/events/categories/_components/CategoriesManageClient.tsx
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoriesDataTable } from '@/components/events/categories/data-table/DataTable';
import { useGetAllEventCategoriesQuery } from '@/redux/events/category-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { ICategoriesQueryParams } from '@/types/events/category.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const CategoriesManageClient = () => {
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
    Omit<ICategoriesQueryParams, 'page' | 'limit'>
  >(() => {
    const searchParam = searchParams.get('search');
    return {
      search: searchParam || undefined,
    };
  });

  useEffect(() => {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('limit', pageSize.toString());

    if (filters.search) {
      params.set('search', filters.search);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, filters, router]);

  const queryParams: ICategoriesQueryParams = {
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
  } = useGetAllEventCategoriesQuery(queryParams);

  useEffect(() => {
    if (isInitialLoad && categoriesData) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, categoriesData]);

  const categories = categoriesData?.data;

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
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
      setPage(1);
    },
    [],
  );

  const handleRefresh = () => refetch();

  const errorMessage = isError
    ? extractApiError(error).message
    : 'An Unknown Error Occurred!';

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
          filterCount={1}
          showActions={true}
          showPagination={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <CategoriesDataTable
        data={categories || []}
        loading={isFetching && !isInitialLoad}
        totalCount={categoriesData?.meta.total || 0}
        page={page}
        pageSize={pageSize}
        filters={filters}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFiltersChange={handleFiltersChange}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default CategoriesManageClient;
