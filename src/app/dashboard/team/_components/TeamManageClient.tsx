// src/app/dashboard/team/_components/TeamManageClient.tsx
'use client';
import { useRouter } from 'next/navigation';
import { TeamMembersDataTable } from '@/components/team/data-table/DataTable';
import { useGetAllTeamMembersQuery } from '@/redux/team/team-member-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { ITeamMembersQueryParams } from '@/types/team/team-member.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { useTableUrlState, IParamsReader } from '@/hooks/use-table-url-state';

type ITeamMembersFilters = Omit<ITeamMembersQueryParams, 'page' | 'limit'>;

// Module-level so the hook's URL-sync effects get stable references.
const parseFilters = (params: IParamsReader): ITeamMembersFilters => {
  const isPublishedParam = params.get('isPublished');

  return {
    search: params.get('search') ?? undefined,
    isPublished:
      isPublishedParam !== null ? isPublishedParam === 'true' : undefined,
  };
};

const serializeFilters = (
  filters: ITeamMembersFilters,
  params: URLSearchParams,
) => {
  if (filters.search) params.set('search', filters.search);
  if (filters.isPublished !== undefined)
    params.set('isPublished', filters.isPublished.toString());
};

const TeamManageClient = () => {
  const router = useRouter();

  const {
    page,
    pageSize,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
  } = useTableUrlState({ parseFilters, serializeFilters });

  const queryParams: ITeamMembersQueryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    ),
  };

  const {
    data: membersData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllTeamMembersQuery(queryParams);

  // First render until the first response arrives (derived, no setState-in-effect)
  const isInitialLoad = !membersData;

  const handleAddMember = () => {
    router.push('/dashboard/team/create');
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
      <TeamMembersDataTable
        data={membersData?.data ?? []}
        loading={isFetching && !isInitialLoad}
        totalCount={membersData?.meta.total ?? 0}
        page={page}
        pageSize={pageSize}
        filters={filters}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFiltersChange={handleFiltersChange}
        onRefresh={refetch}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default TeamManageClient;
