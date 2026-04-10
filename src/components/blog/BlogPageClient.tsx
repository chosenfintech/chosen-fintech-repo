// components/blog/BlogPageClient.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPostCard } from './BlogPostCard';
import { BlogSidebar } from './BlogSidebar';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/ui/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IPost } from '@/types/posts/post.types';
import { ICategory } from '@/types/posts/category.types';
import { Calendar, ArrowRight, ImageIcon } from 'lucide-react';
import { cardVariants } from '@/static-data/motion-variants';

export interface IBlogPageClientProps {
  posts: IPost[];
  featuredPost: IPost | null;
  recentPosts: IPost[];
  categories: ICategory[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  selectedCategory?: string;
  searchQuery?: string;
}

// Featured post card (horizontal hero-style)
function FeaturedPostCard({ post }: { post: IPost }) {
  const formattedDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Link href={`/events/${post.slug}`}>
      <Card className="group overflow-hidden p-0 border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-video lg:aspect-auto lg:min-h-[360px] overflow-hidden bg-muted">
            {post.coverImage ? (
              <>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
            {/* Featured badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg">
                Featured
              </span>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
            {post.category?.name && (
              <span className="inline-block mb-4 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide w-fit">
                {post.category.name}
              </span>
            )}
            <h2 className="font-display text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
              {post.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3 text-sm lg:text-base">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              {formattedDate && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={13} />
                  {formattedDate}
                </span>
              )}
              <Button
                variant="link"
                className="p-0 h-auto group/btn text-sm font-semibold ml-auto"
              >
                Read More
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

export default function BlogPageClient({
  posts,
  featuredPost,
  recentPosts,
  categories,
  totalPages,
  currentPage,
  pageSize,
  totalCount,
  selectedCategory,
  searchQuery,
}: IBlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasActiveFilters = !!(selectedCategory || searchQuery);
  const noDataAtAll = totalCount === 0 && !hasActiveFilters;
  const noResultsFromFilters = hasActiveFilters && posts.length === 0;

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`/events?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    updateParams({ page: '1', categoryId: categoryId ?? null });
  };

  const handleSearch = (query: string) => {
    updateParams({ page: '1', search: query || null });
  };

  const clearFilters = () => {
    router.push('/events');
  };

  // Pagination helpers
  const showPagination = totalPages > 1;

  return (
    <div className="min-h-screen">
      <NavBar />
      <PageHero title="Events" />

      {/* Featured Post */}
      {featuredPost && !hasActiveFilters && (
        <section className="py-8 lg:py-12 bg-muted/20 border-b border-border/50">
          <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FeaturedPostCard post={featuredPost} />
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-12 lg:py-16 xl:py-20 bg-muted/30">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {noDataAtAll ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-dashed border-2 border-border/50">
                <CardContent className="text-center py-16 lg:py-20">
                  <FileText className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-base lg:text-lg mb-2">
                    No blog posts yet
                  </p>
                  <p className="text-muted-foreground/70 text-sm">
                    Check back soon for new content.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main Content */}
              <div className="lg:col-span-8">
                {/* Mobile sidebar (search + drawer) */}
                <div className="lg:hidden">
                  <BlogSidebar
                    categories={categories}
                    recentPosts={recentPosts}
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                    onCategoryFilter={handleCategoryFilter}
                    onSearch={handleSearch}
                    onClearFilters={clearFilters}
                  />
                </div>

                {/* Posts count */}
                {!noDataAtAll && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Showing {posts.length} of {totalCount} posts
                  </p>
                )}

                {/* No results from filters */}
                {noResultsFromFilters ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-dashed border-2 border-border/50">
                      <CardContent className="text-center py-16 lg:py-20">
                        <div className="max-w-md mx-auto">
                          <p className="text-muted-foreground text-base lg:text-lg mb-2">
                            No posts found
                          </p>
                          <p className="text-muted-foreground/70 text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPage}
                        className="space-y-6 lg:space-y-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {posts.map((post, index) => (
                          <motion.div
                            key={post.id}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <BlogPostCard post={post} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {/* Pagination */}
                    {showPagination && (
                      <motion.div
                        className="flex items-center justify-center gap-2 pt-8 lg:pt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-10 px-3 border-border/50 hover:border-primary/50 disabled:opacity-40"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                          </Button>
                        </motion.div>

                        <div className="flex items-center gap-1 lg:gap-2">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                          ).map((page) => {
                            const showPage =
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1);
                            const showEllipsis =
                              (page === currentPage - 2 && currentPage > 3) ||
                              (page === currentPage + 2 &&
                                currentPage < totalPages - 2);

                            if (showEllipsis)
                              return (
                                <span
                                  key={page}
                                  className="px-2 text-muted-foreground text-sm"
                                >
                                  ...
                                </span>
                              );
                            if (!showPage) return null;

                            return (
                              <motion.div
                                key={page}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant={
                                    currentPage === page ? 'default' : 'outline'
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(page)}
                                  className="min-w-10 h-10 border-border/50 hover:border-primary/50 font-medium"
                                >
                                  {page}
                                </Button>
                              </motion.div>
                            );
                          })}
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="h-10 px-3 border-border/50 hover:border-primary/50 disabled:opacity-40"
                          >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Desktop Sidebar */}
              <motion.div
                className="hidden lg:block lg:col-span-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="lg:sticky lg:top-24 space-y-6">
                  <BlogSidebar
                    categories={categories}
                    recentPosts={recentPosts}
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                    onCategoryFilter={handleCategoryFilter}
                    onSearch={handleSearch}
                    onClearFilters={clearFilters}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
