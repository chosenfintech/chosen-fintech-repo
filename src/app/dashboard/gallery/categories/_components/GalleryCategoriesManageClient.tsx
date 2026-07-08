// src/app/dashboard/gallery/categories/_components/GalleryCategoriesManageClient.tsx
'use client';
import { useRouter } from 'next/navigation';
import { GalleryCategoriesDataTable } from '@/components/gallery/categories/data-table/DataTable';
import { useGetAllGalleryCategoriesQuery } from '@/redux/gallery/gallery-category-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IGalleryCategoriesQueryParams } from '@/types/gallery/gallery-category.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { useTableUrlState, IParamsReader } from '@/hooks/use-table-url-state';

type IGalleryCategoriesFilters = Omit<
  IGalleryCategoriesQueryParams,
  'page' | 'limit'
>;

// Module-level so the hook's URL-sync effects get stable references.
const parseFilters = (params: IParamsReader): IGalleryCategoriesFilters => ({
  search: params.get('search') ?? undefined,
  sortBy: params.get('sortBy') ?? undefined,
  sortOrder: (params.get('sortOrder') as 'asc' | 'desc' | null) ?? undefined,
});

const serializeFilters = (
  filters: IGalleryCategoriesFilters,
  params: URLSearchParams,
) => {
  if (filters.search) params.set('search', filters.search);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
};

const GalleryCategoriesManageClient = () => {
  const router = useRouter();

  const {
    page,
    pageSize,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
  } = useTableUrlState({ parseFilters, serializeFilters });

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

  // First render until the first response arrives (derived, no setState-in-effect)
  const isInitialLoad = !categoriesData;

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
