// src/app/dashboard/gallery/photos/_components/GalleryPhotosManageClient.tsx
'use client';
import { useRouter } from 'next/navigation';
import { GalleryPhotosDataTable } from '@/components/gallery/photos/data-table/DataTable';
import { useGetAllGalleryPhotosQuery } from '@/redux/gallery/gallery-photo-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IGalleryPhotosQueryParams } from '@/types/gallery/gallery-photo.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { useTableUrlState, IParamsReader } from '@/hooks/use-table-url-state';

type IGalleryPhotosFilters = Omit<IGalleryPhotosQueryParams, 'page' | 'limit'>;

// Module-level so the hook's URL-sync effects get stable references.
const parseFilters = (params: IParamsReader): IGalleryPhotosFilters => {
  const isPublishedParam = params.get('isPublished');

  return {
    search: params.get('search') ?? undefined,
    isPublished:
      isPublishedParam !== null ? isPublishedParam === 'true' : undefined,
    categoryId: params.get('categoryId') ?? undefined,
  };
};

const serializeFilters = (
  filters: IGalleryPhotosFilters,
  params: URLSearchParams,
) => {
  if (filters.search) params.set('search', filters.search);
  if (filters.isPublished !== undefined)
    params.set('isPublished', filters.isPublished.toString());
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
};

const GalleryPhotosManageClient = () => {
  const router = useRouter();

  const {
    page,
    pageSize,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
  } = useTableUrlState({ parseFilters, serializeFilters });

  const queryParams: IGalleryPhotosQueryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    ),
  };

  const {
    data: photosData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllGalleryPhotosQuery(queryParams);

  // First render until the first response arrives (derived, no setState-in-effect)
  const isInitialLoad = !photosData;

  const handleUploadPhoto = () => {
    router.push('/dashboard/gallery/photos/upload');
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
      <GalleryPhotosDataTable
        data={photosData?.data ?? []}
        loading={isFetching && !isInitialLoad}
        totalCount={photosData?.meta.total ?? 0}
        page={page}
        pageSize={pageSize}
        filters={filters}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFiltersChange={handleFiltersChange}
        onRefresh={refetch}
        onUploadPhoto={handleUploadPhoto}
      />
    </div>
  );
};

export default GalleryPhotosManageClient;
