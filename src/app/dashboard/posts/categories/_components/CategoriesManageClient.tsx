// src/app/dashboard/posts/categories/_components/CategoriesManageClient.tsx
'use client';
import { CategoriesDataTable } from '@/components/posts/categories/data-table/DataTable';
import { useGetAllCategoriesQuery } from '@/redux/posts/category-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { ICategoriesQueryParams } from '@/types/posts/category.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { useTableUrlState, IParamsReader } from '@/hooks/use-table-url-state';

type ICategoriesFilters = Omit<ICategoriesQueryParams, 'page' | 'limit'>;

// Module-level so the hook's URL-sync effects get stable references.
const parseFilters = (params: IParamsReader): ICategoriesFilters => ({
  search: params.get('search') || undefined,
});

const serializeFilters = (
  filters: ICategoriesFilters,
  params: URLSearchParams,
) => {
  if (filters.search) {
    params.set('search', filters.search);
  }
};

const CategoriesManageClient = () => {
  const {
    page,
    pageSize,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
  } = useTableUrlState({ parseFilters, serializeFilters });

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
  } = useGetAllCategoriesQuery(queryParams);

  // First render until the first response arrives (derived, no setState-in-effect)
  const isInitialLoad = !categoriesData;

  const categories = categoriesData?.data;

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
