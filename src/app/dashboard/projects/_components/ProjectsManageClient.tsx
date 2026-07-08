// src/app/dashboard/projects/_components/ProjectsManageClient.tsx
'use client';
import { ProjectsDataTable } from '@/components/projects/data-table/DataTable';
import { useGetAllProjectsQuery } from '@/redux/projects/project-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IProjectsQueryParams } from '@/types/projects/project.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { useTableUrlState, IParamsReader } from '@/hooks/use-table-url-state';

type IProjectsFilters = Omit<IProjectsQueryParams, 'page' | 'limit'>;

// Module-level so the hook's URL-sync effects get stable references.
const parseFilters = (params: IParamsReader): IProjectsFilters => {
  const isPublishedParam = params.get('isPublished');
  const isFeaturedParam = params.get('isFeatured');

  return {
    search: params.get('search') || undefined,
    isPublished:
      isPublishedParam !== null ? isPublishedParam === 'true' : undefined,
    isFeatured:
      isFeaturedParam !== null ? isFeaturedParam === 'true' : undefined,
    authorId: params.get('authorId') || undefined,
  };
};

const serializeFilters = (
  filters: IProjectsFilters,
  params: URLSearchParams,
) => {
  if (filters.search) {
    params.set('search', filters.search);
  }
  if (filters.isPublished !== undefined) {
    params.set('isPublished', filters.isPublished.toString());
  }
  if (filters.isFeatured !== undefined) {
    params.set('isFeatured', filters.isFeatured.toString());
  }
  if (filters.authorId) {
    params.set('authorId', filters.authorId);
  }
};

const ProjectsManageClient = () => {
  const {
    page,
    pageSize,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
  } = useTableUrlState({ parseFilters, serializeFilters });

  const queryParams: IProjectsQueryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    ),
  };

  const {
    data: projectsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllProjectsQuery(queryParams);

  // First render until the first response arrives (derived, no setState-in-effect)
  const isInitialLoad = !projectsData;

  const projects = projectsData?.data;

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
      <ProjectsDataTable
        data={projects || []}
        loading={isFetching && !isInitialLoad}
        totalCount={projectsData?.meta.total || 0}
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

export default ProjectsManageClient;
