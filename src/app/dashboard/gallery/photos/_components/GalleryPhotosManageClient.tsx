// src/app/dashboard/gallery/photos/_components/GalleryPhotosManageClient.tsx
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GalleryPhotosDataTable } from '@/components/gallery/photos/data-table/DataTable';
import { useGetAllGalleryPhotosQuery } from '@/redux/gallery/gallery-photo-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IGalleryPhotosQueryParams } from '@/types/gallery/gallery-photo.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const GalleryPhotosManageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState<number>(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });

  const [pageSize, setPageSize] = useState<number>(() => {
    const limitParam = searchParams.get('limit');
    return limitParam ? parseInt(limitParam, 10) : 10;
  });

  const [filters, setFilters] = useState<
    Omit<IGalleryPhotosQueryParams, 'page' | 'limit'>
  >(() => {
    const searchParam = searchParams.get('search');
    const isPublishedParam = searchParams.get('isPublished');
    const categoryIdParam = searchParams.get('categoryId');

    return {
      search: searchParam ?? undefined,
      isPublished:
        isPublishedParam !== null ? isPublishedParam === 'true' : undefined,
      categoryId: categoryIdParam ?? undefined,
    };
  });

  useEffect(() => {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('limit', pageSize.toString());

    if (filters.search) params.set('search', filters.search);
    if (filters.isPublished !== undefined)
      params.set('isPublished', filters.isPublished.toString());
    if (filters.categoryId) params.set('categoryId', filters.categoryId);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, filters, router]);

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
