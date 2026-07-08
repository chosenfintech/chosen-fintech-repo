// src/app/dashboard/posts/_components/PostsManageClient.tsx
'use client';
import { PostsDataTable } from '@/components/posts/data-table/DataTable';
import { useGetAllPostsQuery } from '@/redux/posts/post-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import { IPostsQueryParams } from '@/types/posts/post.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { useTableUrlState, IParamsReader } from '@/hooks/use-table-url-state';

type IPostsFilters = Omit<IPostsQueryParams, 'page' | 'limit'>;

// Module-level so the hook's URL-sync effects get stable references.
const parseFilters = (params: IParamsReader): IPostsFilters => {
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

const serializeFilters = (filters: IPostsFilters, params: URLSearchParams) => {
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

const PostsManageClient = () => {
  const {
    page,
    pageSize,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
  } = useTableUrlState({ parseFilters, serializeFilters });

  const queryParams: IPostsQueryParams = {
    page,
    limit: pageSize,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    ),
  };

  const {
    data: postsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllPostsQuery(queryParams);

  // First render until the first response arrives (derived, no setState-in-effect)
  const isInitialLoad = !postsData;

  const posts = postsData?.data;

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
      <PostsDataTable
        data={posts || []}
        loading={isFetching && !isInitialLoad}
        totalCount={postsData?.meta.total || 0}
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

export default PostsManageClient;
