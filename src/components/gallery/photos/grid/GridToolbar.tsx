// src/components/gallery/photos/grid/GridToolbar.tsx
'use client';
import * as React from 'react';
import { Plus, Trash2, Search, X, SlidersHorizontal, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { IGalleryPhotosQueryParams } from '@/types/gallery/gallery-photo.types';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetGalleryCategoriesForSelectQuery } from '@/redux/gallery/gallery-category-api';
import { cn } from '@/lib/utils';

type IGalleryPhotoFilters = Omit<IGalleryPhotosQueryParams, 'page' | 'limit'>;

interface IGalleryPhotoGridToolbarProps {
  filters: IGalleryPhotoFilters;
  onFiltersChange: (filters: Partial<IGalleryPhotoFilters>) => void;
  totalCount: number;
  selectedCount: number;
  /** Photos on the current page, used by "select all on this page". */
  pageCount: number;
  onSelectPage: () => void;
  onClearSelection: () => void;
  onUploadPhoto: () => void;
  onDeleteSelected: () => void;
}

export function GalleryPhotoGridToolbar({
  filters,
  onFiltersChange,
  totalCount,
  selectedCount,
  pageCount,
  onSelectPage,
  onClearSelection,
  onUploadPhoto,
  onDeleteSelected,
}: IGalleryPhotoGridToolbarProps) {
  const [searchInput, setSearchInput] = React.useState(filters.search ?? '');
  const [showFilters, setShowFilters] = React.useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: categories = [] } = useGetGalleryCategoriesForSelectQuery();

  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ search: debouncedSearch || undefined });
    }
  }, [debouncedSearch, filters.search, onFiltersChange]);

  const getPublishFilterValue = () => {
    if (filters.isPublished === true) return 'published';
    if (filters.isPublished === false) return 'hidden';
    return 'all';
  };

  const handlePublishFilterChange = (value: string) => {
    let isPublished: boolean | undefined;
    if (value === 'published') isPublished = true;
    else if (value === 'hidden') isPublished = false;
    onFiltersChange({ isPublished });
  };

  const hasFiltersApplied =
    filters.isPublished !== undefined ||
    filters.categoryId !== undefined ||
    !!filters.search;

  const filterCount = [filters.isPublished, filters.categoryId].filter(
    (f) => f !== undefined,
  ).length;

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      search: undefined,
      isPublished: undefined,
      categoryId: undefined,
    });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFiltersChange({ search: undefined });
  };

  const selectedCategoryName = categories.find(
    (c) => c.id === filters.categoryId,
  )?.name;

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {selectedCount > 0 ? (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/50 px-3 py-2">
            <Badge variant="secondary" className="font-medium">
              {selectedCount} selected
            </Badge>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              className="h-8"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-8"
            >
              Clear
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {totalCount} total {totalCount === 1 ? 'photo' : 'photos'}
            </span>
            {pageCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSelectPage}
                className="h-8 text-muted-foreground"
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Select page
              </Button>
            )}
          </div>
        )}

        <Button onClick={onUploadPhoto} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </div>

      {/* Search + filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by alt text or caption..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-11 border-input bg-card pl-10 pr-10 focus-visible:ring-primary"
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 text-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant={hasFiltersApplied ? 'default' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'relative h-11 shrink-0 gap-2',
            hasFiltersApplied
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'border-border text-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {filterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {filterCount}
            </Badge>
          )}
        </Button>

        {hasFiltersApplied && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="hidden h-11 shrink-0 text-destructive hover:bg-destructive/10 lg:flex"
          >
            Clear all
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
          {hasFiltersApplied && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-10 w-full text-destructive hover:bg-destructive/10 lg:hidden"
            >
              Clear all filters
            </Button>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <Select
                value={getPublishFilterValue()}
                onValueChange={handlePublishFilterChange}
              >
                <SelectTrigger className="h-10 border-border bg-input text-foreground focus:ring-primary">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <Select
                value={filters.categoryId ?? 'all'}
                onValueChange={(value) =>
                  onFiltersChange({
                    categoryId: value === 'all' ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="h-10 border-border bg-input text-foreground focus:ring-primary">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active filters */}
      {hasFiltersApplied && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Active Filters:
          </span>

          {filters.search && (
            <Badge
              variant="secondary"
              className="gap-1 border border-primary/30 bg-primary/15 py-1.5 pl-3 pr-2 text-foreground"
            >
              <Search className="h-3 w-3" />
              <span className="max-w-[150px] truncate sm:max-w-[200px]">
                {filters.search}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="ml-1 h-4 w-4 p-0 text-foreground/70 hover:bg-transparent hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.isPublished !== undefined && (
            <Badge
              variant="secondary"
              className="gap-1 border border-primary/30 bg-primary/15 py-1.5 pl-3 pr-2 text-foreground"
            >
              Status: {filters.isPublished ? 'Published' : 'Hidden'}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ isPublished: undefined })}
                className="ml-1 h-4 w-4 p-0 text-foreground/70 hover:bg-transparent hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.categoryId !== undefined && (
            <Badge
              variant="secondary"
              className="gap-1 border border-primary/30 bg-primary/15 py-1.5 pl-3 pr-2 text-foreground"
            >
              Category: {selectedCategoryName ?? filters.categoryId}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ categoryId: undefined })}
                className="ml-1 h-4 w-4 p-0 text-foreground/70 hover:bg-transparent hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
