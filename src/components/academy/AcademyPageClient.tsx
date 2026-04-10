// src/components/academy/AcademyPageClient.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPostCard } from '../blog/BlogPostCard';
import { AcademySidebar } from './AcademySidebar';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/ui/PageHero';
import { EducationalGuides } from './EducationalGuides';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { IPost } from '@/types/posts/post.types';
import { cardVariants } from '@/static-data/motion-variants';
import { Wallet, Coins, Vote, Code, Shield, BookOpen } from 'lucide-react';

const guides = [
  {
    icon: Wallet,
    title: 'Getting Started with Cardano',
    description:
      'Learn the basics: what is Cardano, how to set up a wallet, and buy your first ADA.',
    level: 'Beginner' as const,
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    link: '#',
  },
  {
    icon: Coins,
    title: 'Staking & Delegation',
    description:
      'Understand how to stake your ADA, choose stake pools, and earn passive rewards.',
    level: 'Beginner' as const,
    image:
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
    link: '#',
  },
  {
    icon: Vote,
    title: 'Project Catalyst & Governance',
    description:
      "Participate in Cardano's decentralized governance and vote on funding proposals.",
    level: 'Intermediate' as const,
    image:
      'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80',
    link: '#',
  },
  {
    icon: Code,
    title: 'Smart Contracts on Cardano',
    description:
      'Introduction to Plutus and Marlowe for building decentralized applications.',
    level: 'Advanced' as const,
    image:
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80',
    link: '#',
  },
  {
    icon: Shield,
    title: 'NFTs on Cardano',
    description:
      'Explore the native NFT ecosystem, marketplaces, and how to mint your own NFTs.',
    level: 'Intermediate' as const,
    image:
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
    link: '#',
  },
  {
    icon: BookOpen,
    title: 'DeFi on Cardano',
    description:
      'Navigate DEXs, lending protocols, and yield opportunities in the Cardano ecosystem.',
    level: 'Intermediate' as const,
    image:
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80',
    link: '#',
  },
];

export interface IAcademyPageClientProps {
  posts: IPost[];
  recentPosts: IPost[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  searchQuery?: string;
}

export default function AcademyPageClient({
  posts,
  recentPosts,
  totalPages,
  currentPage,
  totalCount,
  searchQuery,
}: IAcademyPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasActiveSearch = !!searchQuery;
  const noDataAtAll = totalCount === 0 && !hasActiveSearch;
  const noResultsFromSearch = hasActiveSearch && posts.length === 0;
  const showPagination = totalPages > 1;

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`/academy?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    updateParams({ page: '1', search: query || null });
  };

  const handleClearSearch = () => {
    router.push('/academy');
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <PageHero title="Academy" />

      {/* Educational Guides — static, untouched */}
      <EducationalGuides guides={guides} />

      {/* Education & Blogs — API-driven */}
      <section className="py-12 lg:py-16 xl:py-20 bg-muted/30">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                EDUCATION & BLOGS
              </h2>
            </div>
          </motion.div>

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
                    No posts yet
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
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Main Content */}
              <div className="lg:col-span-8">
                {/* Posts count */}
                {!noDataAtAll && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Showing {posts.length} of {totalCount} posts
                  </p>
                )}

                {noResultsFromSearch ? (
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
                            Try adjusting your search criteria
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

              {/* Sidebar */}
              <motion.div
                className="hidden lg:block lg:col-span-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="lg:sticky lg:top-24">
                  <AcademySidebar
                    recentPosts={recentPosts}
                    searchQuery={searchQuery}
                    onSearch={handleSearch}
                    onClearSearch={handleClearSearch}
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