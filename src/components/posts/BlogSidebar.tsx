// src/components/posts/BlogSidebar.tsx
'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Hash,
  Folder,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { ICategory } from '@/types/posts/category.types';

interface IBlogSidebarProps {
  categories: ICategory[];
  selectedCategory?: string;
  searchQuery?: string;
  onCategoryFilter: (categoryId: string | null) => void;
  onSearch: (query: string) => void;
  onClearFilters: () => void;
}

interface IFilterSectionsProps {
  categories: ICategory[];
  selectedCategory?: string;
  onCategoryFilter: (categoryId: string | null) => void;
}

function FilterSections({
  categories,
  selectedCategory,
  onCategoryFilter,
}: IFilterSectionsProps) {
  return (
    <div className="space-y-8">
      {/* Category Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
            Categories
          </h3>
        </div>
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(val) => onCategoryFilter(val === 'all' ? null : val)}
        >
          <SelectTrigger className="w-full border-muted-foreground/20">
            <SelectValue placeholder="Browse Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {categories.map((cat) => (
              <SelectItem
                key={cat.id}
                value={cat.id}
                className="[&>span]:w-full"
              >
                <div className="flex items-center justify-between w-full min-w-[200px]">
                  <span>{cat.name}</span>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md font-mono opacity-70">
                    {cat.publishedPostsCount || 0}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="opacity-50" />

      {/* Tags Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
            Popular Tags
          </h3>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  icon,
  onClear,
}: {
  label: string;
  icon: React.ReactNode;
  onClear: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <Badge
        variant="secondary"
        className="pl-2 pr-1 py-1 gap-1.5 bg-primary/5 border-primary/10 text-foreground hover:bg-primary/10"
      >
        <span className="text-primary/70">{icon}</span>
        <span className="max-w-[120px] truncate text-xs font-medium">
          {label}
        </span>
        <button
          onClick={onClear}
          className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    </motion.div>
  );
}

export default function BlogSidebar({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryFilter,
  onSearch,
  onClearFilters,
}: IBlogSidebarProps) {
  const [localSearchQuery, setLocalSearchQuery] = React.useState(
    searchQuery || '',
  );
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const hasActiveFilters = !!(selectedCategory || searchQuery);

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => onSearch(value), 400);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    onSearch('');
  };

  const filterSectionsProps: IFilterSectionsProps = {
    categories,
    selectedCategory,
    onCategoryFilter,
  };

  return (
    <aside className="w-full space-y-6">
      {/* Search Bar Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search posts..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-11 bg-card border-input focus-visible:ring-primary"
          />
          {localSearchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Drawer Trigger */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader className="text-left">
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>
                  Narrow down your search by category or tags.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-6">
                <FilterSections {...filterSectionsProps} />
              </div>
              <DrawerFooter className="flex-row gap-2">
                <DrawerClose asChild>
                  <Button className="flex-1">Show Results</Button>
                </DrawerClose>
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={onClearFilters}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop View: Static Filters */}
      <div className="hidden lg:block space-y-8">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-[11px] cursor-pointer text-primary hover:underline font-bold uppercase tracking-widest"
            >
              Reset All
            </button>
          )}
        </div>
        <FilterSections {...filterSectionsProps} />
      </div>

      {/* Active Filter Chips (Always visible if filters active) */}
      <AnimatePresence mode="popLayout">
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 pb-4"
          >
            {searchQuery && (
              <FilterChip
                label={searchQuery}
                icon={<Search className="h-3 w-3" />}
                onClear={handleClearSearch}
              />
            )}
            {selectedCategory && (
              <FilterChip
                label={
                  categories.find((c) => c.id === selectedCategory)?.name ||
                  'Category'
                }
                icon={<Folder className="h-3 w-3" />}
                onClear={() => onCategoryFilter(null)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
