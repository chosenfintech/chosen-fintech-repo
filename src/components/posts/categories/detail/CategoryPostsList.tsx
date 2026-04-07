// src/components/posts/categories/detail/CategoryPostsList.tsx
import { FileText, Clock, User, CheckCircle, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { IPost } from '@/types/posts/post.types';
import Pagination from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { format, parseISO, isValid } from 'date-fns';

interface CategoryPostsListProps {
  posts: IPost[];
  categoryName: string;
  totalPostsCount: number;
  currentPage: number;
  totalPages: number;
  onPostClick: (postId: string) => void;
  onCreatePost: () => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  pageLimit?: number;
}

const formatDisplayDate = (value: string | Date | undefined | null): string => {
  if (!value) return '—';
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    return isValid(date) ? format(date, 'MMM d, yyyy') : '—';
  } catch {
    return '—';
  }
};

export default function CategoryPostsList({
  posts,
  categoryName,
  totalPostsCount,
  currentPage,
  totalPages,
  onPostClick,
  onCreatePost,
  onPageChange,
  isLoading = false,
  pageLimit = 5,
}: CategoryPostsListProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-muted rounded mt-2 animate-pulse"></div>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 w-full bg-muted rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow duration-200">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Posts in Category
          </h2>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary font-semibold shrink-0 w-fit"
          >
            {totalPostsCount} {totalPostsCount === 1 ? 'post' : 'posts'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Manage and view posts in {categoryName}
        </p>
      </div>

      <div className="p-0">
        {posts && posts.length > 0 ? (
          <>
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group relative p-4 sm:p-6 transition-all duration-200 hover:bg-muted/30 cursor-pointer"
                  onClick={() => onPostClick(post.id)}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Cover Image */}
                    <div className="shrink-0 w-full sm:w-24 h-24 rounded-lg overflow-hidden border border-border">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors flex-1 min-w-0 line-clamp-2">
                          {post.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={`shrink-0 text-xs ${
                            post.isPublished
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}
                        >
                          {post.isPublished ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Draft
                            </>
                          )}
                        </Badge>
                      </div>

                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Post metadata */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[150px]">
                            {post.author.fullname}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">
                            {formatDisplayDate(post.publishDate)}
                          </span>
                        </div>

                        {post.readTime && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span className="whitespace-nowrap">
                              {post.readTime}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Icon */}
                    <div className="hidden lg:flex shrink-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPostsCount > 5 && (
              <div className="border-t border-border">
                <Pagination
                  meta={{
                    total: totalPostsCount,
                    page: currentPage,
                    limit: pageLimit,
                    totalPages: totalPages,
                  }}
                  onPageChange={onPageChange}
                  showPageSizeSelector={false}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={FileText}
            title="No posts yet"
            description={`This category doesn't have any posts yet. Start creating content to populate this category.`}
            buttonText="Create First Post"
            buttonIcon={FileText}
            onCreateClick={onCreatePost}
            showCreateButton={true}
          />
        )}
      </div>
    </div>
  );
}
