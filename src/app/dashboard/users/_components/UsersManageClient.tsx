// src/app/dashboard/users/_components/UsersManageClient.tsx
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UsersDataTable } from '@/components/users/data-table/DataTable';
import { useGetAllUsersQuery } from '@/redux/user-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IUsersQueryParams } from '@/types/user.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const UsersManageClient = () => {
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
    Omit<IUsersQueryParams, 'page' | 'limit'>
  >(() => {
    const searchParam = searchParams.get('search') ?? undefined;
    return { search: searchParam };
  });

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', pageSize.toString());
    if (filters.search) params.set('search', filters.search);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, filters, router]);

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

  useEffect(() => {
    if (isInitialLoad && usersData) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, usersData]);

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
