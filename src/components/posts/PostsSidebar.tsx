// src/components/posts/PostsSidebar.tsx
'use client';

import * as React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Calendar,
  ImageIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ICategory } from '@/types/posts/category.types';
import { IPost } from '@/types/posts/post.types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BlogSidebarProps {
  categories: ICategory[];
  recentPosts: IPost[];
  selectedCategory?: string;
  searchQuery?: string;
  onCategoryFilter: (categoryId: string | null) => void;
  onSearch: (query: string) => void;
  onClearFilters: () => void;
}

interface CategoriesListProps {
  categories: ICategory[];
  selectedCategory?: string;
  onCategoryFilter: (categoryId: string | null) => void;
}

function CategoryButton({
  cat,
  isSelected,
  onCategoryFilter,
}: {
  cat: ICategory;
  isSelected: boolean;
  onCategoryFilter: (id: string | null) => void;
}) {
  const nameRef = React.useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = nameRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.offsetWidth);
    }
  }, [cat.name]);

  const button = (
    <Button
      variant={isSelected ? 'default' : 'ghost'}
      className="justify-between h-11 text-sm font-medium transition-all duration-200 hover:translate-x-1 w-full"
      onClick={() => onCategoryFilter(isSelected ? null : cat.id)}
    >
      <span ref={nameRef} className="truncate min-w-0 text-left">
        {cat.name}
      </span>
      {cat.publishedPostsCount !== undefined && (
        <span className="shrink-0 ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded-md font-mono opacity-70">
          {cat.publishedPostsCount}
        </span>
      )}
    </Button>
  );

  if (!isTruncated) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">
        <p>{cat.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export const CategoriesList = ({
  categories,
  selectedCategory,
  onCategoryFilter,
}: CategoriesListProps) => (
  <TooltipProvider delayDuration={300}>
    <div className="flex flex-col gap-2">
      <Button
        variant={!selectedCategory ? 'default' : 'ghost'}
        className="justify-start h-11 text-sm font-medium transition-all duration-200 hover:translate-x-1"
        onClick={() => onCategoryFilter(null)}
      >
        All
      </Button>
      {categories.map((cat, index) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <CategoryButton
            cat={cat}
            isSelected={selectedCategory === cat.id}
            onCategoryFilter={onCategoryFilter}
          />
        </motion.div>
      ))}
    </div>
  </TooltipProvider>
);

interface RecentPostsListProps {
  recentPosts: IPost[];
}

const RecentPostsList = ({ recentPosts }: RecentPostsListProps) => (
  <div className="space-y-5">
    {recentPosts.map((post, index) => {
      const formattedDate = post.publishDate
        ? new Date(post.publishDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : null;

      return (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + index * 0.08 }}
          whileHover={{ x: 4 }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="flex gap-3 group cursor-pointer"
          >
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden ring-1 ring-border/50 group-hover:ring-primary/50 transition-all duration-300 bg-muted">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-2 leading-snug">
                {post.title}
              </h4>
              {formattedDate && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  {formattedDate}
                </span>
              )}
            </div>
          </Link>
        </motion.div>
      );
    })}
  </div>
);

// --- Main BlogSidebar component ---
export const BlogSidebar = ({
  categories,
  recentPosts,
  selectedCategory,
  searchQuery,
  onCategoryFilter,
  onSearch,
  onClearFilters,
}: BlogSidebarProps) => {
  const [localSearch, setLocalSearch] = React.useState(searchQuery || '');
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const hasActiveFilters = !!(selectedCategory || searchQuery);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => onSearch(value), 400);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearch('');
  };

  return (
    <>
      {/* Mobile Search + Drawer */}
      <div className="lg:hidden flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={18}
          />
          <Input
            type="search"
            placeholder="Search articles..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-11 bg-background border-border/50 focus:border-primary transition-colors"
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 border-border/50"
            >
              <SlidersHorizontal size={18} />
              <span className="sr-only">Open filters</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader className="text-left">
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>
                  Narrow down posts by category.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-6 space-y-8">
                <div>
                  <h3 className="font-display text-base font-semibold mb-4 text-foreground">
                    Categories
                  </h3>
                  <CategoriesList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryFilter={onCategoryFilter}
                  />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold mb-5 text-foreground">
                    Recent Posts
                  </h3>
                  <RecentPostsList recentPosts={recentPosts} />
                </div>
              </div>
              <DrawerFooter className="flex-row gap-2">
                <DrawerClose asChild>
                  <Button className="flex-1">Show Results</Button>
                </DrawerClose>
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={onClearFilters}>
                    Reset
                  </Button>
                )}
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Active Filter Chip */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="lg:hidden mb-4"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-8 gap-1.5"
            >
              <X className="h-3 w-3" />
              Clear filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block space-y-6 lg:space-y-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -2 }}
        >
          <Card className="border-border/50 p-0 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-5 lg:p-6">
              <h3 className="font-display text-base lg:text-lg font-semibold mb-4 text-foreground">
                Search Posts
              </h3>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  size={18}
                />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary transition-colors"
                />
                {localSearch && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 p-0 h-auto text-xs text-muted-foreground"
                  onClick={onClearFilters}
                >
                  Clear all filters
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ y: -2 }}
        >
          <Card className="border-border/50 p-0 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-5 lg:p-6">
              <h3 className="font-display text-base lg:text-lg font-semibold mb-4 text-foreground">
                Categories
              </h3>
              <CategoriesList
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryFilter={onCategoryFilter}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -2 }}
          >
            <Card className="border-border/50 p-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-5 lg:p-6">
                <h3 className="font-display text-base lg:text-lg font-semibold mb-5 text-foreground">
                  Recent Posts
                </h3>
                <RecentPostsList recentPosts={recentPosts} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </aside>
    </>
  );
};
