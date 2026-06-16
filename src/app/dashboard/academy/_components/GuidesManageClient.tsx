// src/app/dashboard/academy/_components/GuidesManageClient.tsx
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuidesDataTable } from '@/components/academy/data-table/DataTable';
import { useGetAllGuidesQuery } from '@/redux/guides/guide-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IGuidesQueryParams } from '@/types/guides/guide.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const GuidesManageClient = () => {
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
    Omit<IGuidesQueryParams, 'page' | 'limit'>
  >(() => {
    const searchParam = searchParams.get('search');
    const isPublishedParam = searchParams.get('isPublished');
    const isFeaturedParam = searchParams.get('isFeatured');
    const levelParam = searchParams.get('level');
    const authorIdParam = searchParams.get('authorId');

    return {
      search: searchParam || undefined,
      isPublished:
        isPublishedParam !== null ? isPublishedParam === 'true' : undefined,
      isFeatured:
        isFeaturedParam !== null ? isFeaturedParam === 'true' : undefined,
      level: (levelParam as IGuidesQueryParams['level']) || undefined,
      authorId: authorIdParam || undefined,
    };
  });

  useEffect(() => {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('limit', pageSize.toString());

    if (filters.search) {
      params.set('search', filters.search);
    }
    if (filters.isPublished !== undefined) {
      params.set('isPublished', filters.isPublished.toString());
    }
    if (filters.isFeatured !== undefined) {
      params.set('isFeatured', filters.isFeatured.toString());
    }
    if (filters.level) {
      params.set('level', filters.level);
    }
    if (filters.authorId) {
      params.set('authorId', filters.authorId);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, filters, router]);

  const queryParams: IGuidesQueryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    ),
  };

  const {
    data: guidesData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllGuidesQuery(queryParams);

  useEffect(() => {
    if (isInitialLoad && guidesData) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, guidesData]);

  const guides = guidesData?.data;

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
          columnCount={7}
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
      <GuidesDataTable
        data={guides || []}
        loading={isFetching && !isInitialLoad}
        totalCount={guidesData?.meta.total || 0}
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

export default GuidesManageClient;
