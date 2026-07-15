'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Images,
  Loader2,
} from 'lucide-react';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import type { IGalleryCategory } from '@/types/gallery/gallery-category.types';
import type { IGalleryPhoto } from '@/types/gallery/gallery-photo.types';

const baseUrl =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chosenfintech.org';

async function fetchPhotosByCategory(
  categoryId: string,
): Promise<IGalleryPhoto[]> {
  const url = new URL('/api/gallery/photos/published', baseUrl);
  url.searchParams.set('categoryId', categoryId);
  url.searchParams.set('limit', '50');
  url.searchParams.set('page', '1');

  const response = await fetch(url.toString());
  if (!response.ok) return [];
  const data = await response.json();
  return data.data ?? [];
}

interface CategoryCardProps {
  category: IGalleryCategory;
  onClick: (category: IGalleryCategory) => void;
  index: number;
}

function CategoryCard({ category, onClick, index }: CategoryCardProps) {
  const [coverUrl, setCoverUrl] = React.useState<string | null>(null);
  const [loadingCover, setLoadingCover] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function loadCover() {
      try {
        const url = new URL('/api/gallery/photos/published', baseUrl);
        url.searchParams.set('categoryId', category.id);
        url.searchParams.set('limit', '1');
        url.searchParams.set('page', '1');

        const response = await fetch(url.toString());
        if (!response.ok || cancelled) return;
        const data = await response.json();
        const photo: IGalleryPhoto | undefined = data.data?.[0];
        if (!cancelled) setCoverUrl(photo?.url ?? null);
      } catch {
        // cover stays null — fallback renders
      } finally {
        if (!cancelled) setLoadingCover(false);
      }
    }
    loadCover();
    return () => {
      cancelled = true;
    };
  }, [category.id]);

  return (
    <motion.button
      type="button"
      onClick={() => onClick(category)}
      className="group relative cursor-pointer overflow-hidden aspect-[4/3] bg-muted w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      {/* Cover image */}
      {loadingCover ? (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      ) : coverUrl ? (
        <Image
          src={coverUrl}
          alt={category.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageOff className="w-10 h-10 text-muted-foreground/30" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Viewfinder corners */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/90 opacity-0 -translate-x-1.5 -translate-y-1.5 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0" />
        <span className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/90 opacity-0 translate-x-1.5 translate-y-1.5 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0" />
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-semibold text-base leading-snug truncate">
          {category.name}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <Images className="w-3.5 h-3.5 text-white/70" />
          <span className="text-white/70 text-xs">
            {category.publishedPhotosCount ?? category.totalPhotosCount} photo
            {(category.publishedPhotosCount ?? category.totalPhotosCount) === 1
              ? ''
              : 's'}
          </span>
        </div>
      </div>

      {/* Featured badge */}
      {category.isFeatured && (
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
            Featured
          </span>
        </div>
      )}
    </motion.button>
  );
}

interface GalleryPageClientProps {
  categories: IGalleryCategory[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function GalleryPageClient({
  categories,
  currentPage,
  totalPages,
  totalCount,
}: GalleryPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lightboxPhotos, setLightboxPhotos] = React.useState<IGalleryPhoto[]>(
    [],
  );
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [activeCategory, setActiveCategory] =
    React.useState<IGalleryCategory | null>(null);
  const [loadingCategory, setLoadingCategory] = React.useState(false);

  const isEmpty = totalCount === 0;
  const showPagination = totalPages > 1;

  const handleCategoryClick = async (category: IGalleryCategory) => {
    setActiveCategory(category);
    setLoadingCategory(true);
    try {
      const photos = await fetchPhotosByCategory(category.id);
      setLightboxPhotos(photos);
      setLightboxIndex(0);
      setLightboxOpen(true);
    } catch {
      // silently fail — nothing opens
    } finally {
      setLoadingCategory(false);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/about/gallery?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <PageHero title="Gallery" />

      <section className="py-12 lg:py-16 xl:py-20 bg-muted/30 min-h-[60vh]">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center py-24"
            >
              <div className="flex flex-col items-center gap-5 text-center max-w-sm px-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <ImageOff
                    className="w-7 h-7 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold text-foreground tracking-tight">
                    No photos yet
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We&apos;re putting together something worth seeing. Check
                    back soon.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Count */}
              <motion.p
                className="text-sm text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {totalCount} album{totalCount === 1 ? '' : 's'}
              </motion.p>

              {/* Category grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                <AnimatePresence mode="wait">
                  {categories.map((category, index) => (
                    <div key={category.id} className="relative">
                      <CategoryCard
                        category={category}
                        onClick={handleCategoryClick}
                        index={index}
                      />
                      {/* Loading overlay for this card */}
                      {loadingCategory &&
                        activeCategory?.id === category.id && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          </div>
                        )}
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {showPagination && (
                <motion.div
                  className="flex items-center justify-center gap-2 pt-12"
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);
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
                      },
                    )}
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
      </section>

      {/* Lightbox */}
      <GalleryLightbox
        open={lightboxOpen}
        photos={lightboxPhotos}
        index={lightboxIndex}
        title={activeCategory?.name}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
