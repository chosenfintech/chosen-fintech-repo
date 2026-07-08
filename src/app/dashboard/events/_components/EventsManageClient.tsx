// src/app/dashboard/events/_components/EventsManageClient.tsx
'use client';
import { EventsDataTable } from '@/components/events/data-table/DataTable';
import { useGetAllEventsQuery } from '@/redux/events/event-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IEventsQueryParams } from '@/types/events/event.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { useTableUrlState, IParamsReader } from '@/hooks/use-table-url-state';

type IEventsFilters = Omit<IEventsQueryParams, 'page' | 'limit'>;

// Module-level so the hook's URL-sync effects get stable references.
const parseFilters = (params: IParamsReader): IEventsFilters => {
  const isPublishedParam = params.get('isPublished');
  const isFeaturedParam = params.get('isFeatured');

  return {
    search: params.get('search') || undefined,
    isPublished:
      isPublishedParam !== null ? isPublishedParam === 'true' : undefined,
    isFeatured:
      isFeaturedParam !== null ? isFeaturedParam === 'true' : undefined,
    categoryId: params.get('categoryId') || undefined,
    authorId: params.get('authorId') || undefined,
  };
};

const serializeFilters = (filters: IEventsFilters, params: URLSearchParams) => {
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
};

const EventsManageClient = () => {
  const {
    page,
    pageSize,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
  } = useTableUrlState({ parseFilters, serializeFilters });

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

  // First render until the first response arrives (derived, no setState-in-effect)
  const isInitialLoad = !eventsData;

  const events = eventsData?.data;

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
