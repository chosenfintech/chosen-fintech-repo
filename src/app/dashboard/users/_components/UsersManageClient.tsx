// src/app/dashboard/users/_components/UsersManageClient.tsx
'use client';
import { UsersDataTable } from '@/components/users/data-table/DataTable';
import { useGetAllUsersQuery } from '@/redux/user-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IUsersQueryParams } from '@/types/user.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { useTableUrlState, IParamsReader } from '@/hooks/use-table-url-state';

type IUsersFilters = Omit<IUsersQueryParams, 'page' | 'limit'>;

// Module-level so the hook's URL-sync effects get stable references.
const parseFilters = (params: IParamsReader): IUsersFilters => ({
  search: params.get('search') ?? undefined,
});

const serializeFilters = (filters: IUsersFilters, params: URLSearchParams) => {
  if (filters.search) params.set('search', filters.search);
};

const UsersManageClient = () => {
  const {
    page,
    pageSize,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
  } = useTableUrlState({ parseFilters, serializeFilters });

  const queryParams: IUsersQueryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    ),
  };

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllUsersQuery(queryParams);

  // First render until the first response arrives (derived, no setState-in-effect)
  const isInitialLoad = !usersData;

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
          columnCount={5}
          rowCount={pageSize}
          showFilters={true}
          filterCount={1}
          showActions={true}
          showPagination={true}
          showAvatar={false}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <UsersDataTable
        data={usersData?.data || []}
        loading={isFetching && !isInitialLoad}
        totalCount={usersData?.meta.total || 0}
        page={page}
        pageSize={pageSize}
        filters={filters}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFiltersChange={handleFiltersChange}
        onRefresh={refetch}
      />
    </div>
  );
};

export default UsersManageClient;
