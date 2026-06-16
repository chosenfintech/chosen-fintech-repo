// src/app/dashboard/events/_components/EventsManageClient.tsx
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EventsDataTable } from '@/components/events/data-table/DataTable';
import { useGetAllEventsQuery } from '@/redux/events/event-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IEventsQueryParams } from '@/types/events/event.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const EventsManageClient = () => {
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
    Omit<IEventsQueryParams, 'page' | 'limit'>
  >(() => {
    const searchParam = searchParams.get('search');
    const isPublishedParam = searchParams.get('isPublished');
    const isFeaturedParam = searchParams.get('isFeatured');
    const categoryIdParam = searchParams.get('categoryId');
    const authorIdParam = searchParams.get('authorId');

    return {
      search: searchParam || undefined,
      isPublished:
        isPublishedParam !== null ? isPublishedParam === 'true' : undefined,
      isFeatured:
        isFeaturedParam !== null ? isFeaturedParam === 'true' : undefined,
      categoryId: categoryIdParam || undefined,
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
    if (filters.categoryId) {
      params.set('categoryId', filters.categoryId);
    }
    if (filters.authorId) {
      params.set('authorId', filters.authorId);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, filters, router]);

  const queryParams: IEventsQueryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    ),
  };

  const {
    data: eventsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllEventsQuery(queryParams);

  useEffect(() => {
    if (isInitialLoad && eventsData) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, eventsData]);

  const events = eventsData?.data;

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
      <EventsDataTable
        data={events || []}
        loading={isFetching && !isInitialLoad}
        totalCount={eventsData?.meta.total || 0}
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

export default EventsManageClient;
