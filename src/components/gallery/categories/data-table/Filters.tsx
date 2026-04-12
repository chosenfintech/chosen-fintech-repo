// src/components/gallery/categories/data-table/Filters.tsx
'use client';
import * as React from 'react';
import { Table } from '@tanstack/react-table';
import {
  ChevronDown,
  Plus,
  Trash2,
  Search,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  IGalleryCategory,
  IGalleryCategoriesQueryParams,
} from '@/types/gallery/gallery-category.types';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface IGalleryCategoryTableFiltersProps {
  table: Table<IGalleryCategory>;
  filters: Omit<IGalleryCategoriesQueryParams, 'page' | 'limit'>;
  onFiltersChange: (
    filters: Partial<Omit<IGalleryCategoriesQueryParams, 'page' | 'limit'>>,
  ) => void;
  totalCount: number;
  onCreateCategory: () => void;
  onDeleteSelected: () => void;
}

export function GalleryCategoryTableFilters({
  table,
  filters,
  onFiltersChange,
  totalCount,
  onCreateCategory,
  onDeleteSelected,
}: IGalleryCategoryTableFiltersProps) {
  const selectedCount = table.getSelectedRowModel().rows.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  const [searchInput, setSearchInput] = React.useState(filters.search ?? '');
  const [showFilters, setShowFilters] = React.useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ search: debouncedSearch || undefined });
    }
  }, [debouncedSearch, filters.search, onFiltersChange]);

  const getSortByValue = () => filters.sortBy ?? 'createdAt';
  const getSortOrderValue = () => filters.sortOrder ?? 'desc';

  const hasFiltersApplied =
    !!filters.search ||
    (filters.sortBy !== undefined && filters.sortBy !== 'createdAt') ||
    (filters.sortOrder !== undefined && filters.sortOrder !== 'desc');

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      search: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFiltersChange({ search: undefined });
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedCount > 0 ? (
            <div className="flex items-center gap-3 bg-muted/50 px-3 py-2 rounded-lg border border-border">
              <Badge
                variant="secondary"
                className="font-medium bg-secondary text-secondary-foreground"
              >
                {selectedCount} selected {isAllSelected && '(All)'}
              </Badge>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDeleteSelected}
                className="h-8"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isAllSelected ? 'Delete All' : 'Delete Selected'}
              </Button>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground font-medium">
              {totalCount} total {totalCount === 1 ? 'category' : 'categories'}
            </div>
          )}
        </div>

        <Button onClick={onCreateCategory} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>

      {/* Search + Filter Toggle + Columns */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-10 h-11 bg-card border-input focus-visible:ring-primary"
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant={hasFiltersApplied ? 'default' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'h-11 gap-2 shrink-0',
            hasFiltersApplied
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'border-border text-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Sort</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-11 gap-2 shrink-0 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronDown className="w-4 h-4" />
              <span className="hidden sm:inline">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[200px] bg-popover text-popover-foreground"
          >
            <div className="p-2">
              <div className="text-sm font-medium mb-2 text-foreground">
                Toggle columns
              </div>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id.replace(/([A-Z])/g, ' $1').trim()}
                  </DropdownMenuCheckboxItem>
                ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasFiltersApplied && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-11 text-destructive hover:bg-destructive/10 hidden lg:flex shrink-0"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Sort Panel */}
      {showFilters && (
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm space-y-4">
          {hasFiltersApplied && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full h-10 text-destructive hover:bg-destructive/10 lg:hidden"
            >
              Reset sorting
            </Button>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Sort By
              </label>
              <Select
                value={getSortByValue()}
                onValueChange={(value) => onFiltersChange({ sortBy: value })}
              >
                <SelectTrigger className="h-10 bg-input text-foreground border-border">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="updatedAt">Date Updated</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="photoCount">Photo Count</SelectItem>
                  <SelectItem value="totalPhotoCount">
                    Total Photo Count
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Sort Order
              </label>
              <Select
                value={getSortOrderValue()}
                onValueChange={(value) =>
                  onFiltersChange({ sortOrder: value as 'asc' | 'desc' })
                }
              >
                <SelectTrigger className="h-10 bg-input text-foreground border-border">
                  <SelectValue placeholder="Order..." />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasFiltersApplied && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">
            Active Filters:
          </span>

          {filters.search && (
            <Badge
              variant="secondary"
              className="gap-1 pl-3 pr-2 py-1.5 bg-primary/15 text-foreground border border-primary/30 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40"
            >
              <Search className="h-3 w-3" />
              <span className="max-w-[150px] sm:max-w-[200px] truncate">
                {filters.search}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="h-4 w-4 p-0 hover:bg-transparent ml-1 text-foreground/70 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.sortBy && filters.sortBy !== 'createdAt' && (
            <Badge
              variant="secondary"
              className="gap-1 pl-3 pr-2 py-1.5 bg-primary/15 text-foreground border border-primary/30 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40"
            >
              Sort: {filters.sortBy}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ sortBy: undefined })}
                className="h-4 w-4 p-0 hover:bg-transparent ml-1 text-foreground/70 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.sortOrder && filters.sortOrder !== 'desc' && (
            <Badge
              variant="secondary"
              className="gap-1 pl-3 pr-2 py-1.5 bg-primary/15 text-foreground border border-primary/30 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40"
            >
              Order:{' '}
              {filters.sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ sortOrder: undefined })}
                className="h-4 w-4 p-0 hover:bg-transparent ml-1 text-foreground/70 hover:text-foreground"
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
