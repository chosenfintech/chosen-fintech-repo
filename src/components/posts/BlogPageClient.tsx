// src/components/blog/BlogPageClient.tsx
'use client';
import { motion } from 'motion/react';
import { useRouter, useSearchParams } from 'next/navigation';
import FeaturedPostCard from './FeaturedPostCard';
import BlogPostCard from './BlogPostCard';
import BlogSidebar from './BlogSidebar';
import Pagination from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { IPost } from '@/types/posts/post.types';
import { ICategory } from '@/types/posts/category.types';
import { NavBar } from '../NavBar';
import { Footer } from '../Footer';
import { FileText, Search } from 'lucide-react';
import {
  containerVariants,
  contentVariants,
} from '@/static-data/motion-variants';
import { PageHero } from '../ui/PageHero';

export interface IBlogPageClientProps {
  posts: IPost[];
  featuredPost?: IPost | null;
  categories: ICategory[];
  totalPages: number;
  currentPage: number;
  pageSize?: number;
  totalCount: number;
  selectedCategory?: string;
  selectedTag?: string;
  searchQuery?: string;
}

export default function BlogPageClient({
  posts,
  featuredPost,
  categories,
  totalPages,
  currentPage,
  pageSize = 6,
  totalCount,
  selectedCategory,
  selectedTag,
  searchQuery,
}: IBlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/blog?${params.toString()}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('limit', newPageSize.toString());
    router.push(`/blog?${params.toString()}`);
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (categoryId) {
      params.set('categoryId', categoryId);
    } else {
      params.delete('categoryId');
    }
    router.push(`/blog?${params.toString()}`);
  };
  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`/blog?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/blog');
  };

  const paginationMeta = {
    total: totalCount,
    page: currentPage,
    limit: pageSize,
    totalPages: totalPages,
  };

  // Check for active filters
  const hasActiveFilters = !!selectedCategory || !!selectedTag || !!searchQuery;

  const noResultsFromFilters = hasActiveFilters && posts.length === 0;
  const noDataAtAll = totalCount === 0 && !hasActiveFilters;

  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <PageHero title="Blog" />

      {featuredPost && totalCount > 0 && !hasActiveFilters && (
        <section className="py-12 bg-background border-b border-border  ">
          <div className="container mx-auto max-w-7xl px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.div variants={contentVariants}>
                <FeaturedPostCard post={featuredPost} />
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-8 md:py-12 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          {noDataAtAll ? (
            <EmptyState
              icon={FileText}
              title="No Blog Posts Available"
              description="There are currently no blog posts to display. Check back soon for new content and insights."
              showCreateButton={false}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
              <aside className="lg:col-span-1 lg:order-2">
                <div className="lg:sticky lg:top-33 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto ">
                  <BlogSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                    onCategoryFilter={handleCategoryFilter}
                    onSearch={handleSearch}
                    onClearFilters={clearFilters}
                  />
                </div>
              </aside>

              {/* Posts Grid - Second on mobile */}
              <div className="lg:col-span-2 lg:order-1">
                {/* Posts Count */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {posts.length} of {totalCount} posts
                  </p>
                </div>

                {/* Empty state for filtered results with no matches */}
                {noResultsFromFilters ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="max-w-md mx-auto">
                      <div className="mb-4 text-muted-foreground">
                        <Search className="mx-auto h-16 w-16 opacity-50" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No posts found
                      </h3>
                      <p className="text-muted-foreground">
                        No posts found matching your criteria. Try adjusting
                        your filters or search terms.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-6 lg:mb-12"
                    >
                      {posts.map((post) => (
                        <BlogPostCard key={post.id} post={post} />
                      ))}
                    </motion.div>

                    {paginationMeta.total > 6 && (
                      <Pagination
                        meta={paginationMeta}
                        onPageChange={handlePageChange}
                        onLimitChange={handlePageSizeChange}
                        showPageSizeSelector={true}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
