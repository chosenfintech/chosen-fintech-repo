// src/app/dashboard/posts/categories/[id]/view/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetCategoryByIdOrNameQuery } from '@/redux/posts/category-api';
import { useGetAllPostsQuery } from '@/redux/posts/post-api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { extractApiError } from '@/utils/extract-api-error';
import CategoryDetailHeader from '@/components/posts/categories/detail/Header';
import CategoryDetailSkeleton from '@/components/posts/categories/detail/Skeleton';
import CategoryPostsList from '@/components/posts/categories/detail/CategoryPostsList';

const ITEMS_PER_PAGE = 5;

const ViewCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params.id as string;

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });

  useEffect(() => {
    router.replace(`?page=${currentPage}`, { scroll: false });
  }, [currentPage, router]);

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
    isError: isCategoryError,
    refetch: refetchCategory,
  } = useGetCategoryByIdOrNameQuery(categoryId);

  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
    isError: isPostsError,
    refetch: refetchPosts,
  } = useGetAllPostsQuery({
    categoryId,
    limit: ITEMS_PER_PAGE,
    page: currentPage,
  });

  const category = categoryData?.data || null;
  const posts = postsData?.data || [];
  const totalPostsCount = postsData?.meta?.total || 0;
  const totalPages = Math.ceil(totalPostsCount / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isCategoryLoading) {
    return <CategoryDetailSkeleton />;
  }

  const categoryErrorMessage = isCategoryError
    ? extractApiError(categoryError).message
    : 'An unknown error occured';

  if (isCategoryError || !category) {
    return (
      <ErrorMessage error={categoryErrorMessage} onRetry={refetchCategory} />
    );
  }

  const postsErrorMessage = isPostsError
    ? extractApiError(postsError).message
    : 'An unknown error occured';

  return (
    <div className="container mx-auto  max-w-6xl space-y-8">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="w-5 h-5" />
        Back
      </Button>

      {/* Category Header */}
      <CategoryDetailHeader
        categoryName={category.name}
        publishedPostsCount={category.publishedPostsCount || 0}
        unpublishedPostsCount={category.unpublishedPostsCount || 0}
        totalPostsCount={category.totalPostsCount}
        createdAt={category.createdAt}
        updatedAt={category.updatedAt}
        onEdit={() =>
          router.push(`/dashboard/posts/categories/${category.id}/edit`)
        }
      />

      {/* Main Content - Posts List */}
      <div className="mx-auto">
        {isPostsError ? (
          <ErrorMessage error={postsErrorMessage} onRetry={refetchPosts} />
        ) : (
          <CategoryPostsList
            posts={posts}
            categoryName={category.name}
            totalPostsCount={totalPostsCount}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isPostsLoading}
            onPostClick={(postId) =>
              router.push(`/dashboard/posts/${postId}/preview`)
            }
            onCreatePost={() =>
              router.push(`/dashboard/posts/create?category=${category.id}`)
            }
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ViewCategoryPage;
