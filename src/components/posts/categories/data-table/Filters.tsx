// src/components/posts/categories/data-table/Filters.tsx
'use client';
import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { ChevronDown, Plus, Trash2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ICategory,
  ICategoriesQueryParams,
} from '@/types/posts/category.types';
import { useDebounce } from '@/hooks/useDebounce';

interface ICategoryTableFiltersProps {
  table: Table<ICategory>;
  filters: Omit<ICategoriesQueryParams, 'page' | 'limit'>;
  onFiltersChange: (
    filters: Partial<Omit<ICategoriesQueryParams, 'page' | 'limit'>>,
  ) => void;
  totalCount: number;
  onCreateCategory: () => void;
  onDeleteSelected: () => void;
}

export function CategoryTableFilters({
  table,
  filters,
  onFiltersChange,
  totalCount,
  onCreateCategory,
  onDeleteSelected,
}: ICategoryTableFiltersProps) {
  const selectedCount = table.getSelectedRowModel().rows.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  const [searchInput, setSearchInput] = React.useState(filters.search || '');

  const debouncedSearch = useDebounce(searchInput, 500);

  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ search: debouncedSearch || undefined });
    }
  }, [debouncedSearch, filters.search, onFiltersChange]);

  const hasFiltersApplied = filters.search !== undefined;

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      search: undefined,
    });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFiltersChange({ search: undefined });
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar - Selection Info & Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Selection Info & Delete Action */}
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
              {totalCount} total categories
            </div>
          )}
        </div>

        {/* Create Button */}
        <Button
          onClick={onCreateCategory}
          className="w-full sm:w-auto"
          size="default"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>

      {/* Search and Column Visibility */}
      <div className="flex gap-3">
        {/* Search Input */}
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

        {/* Column Visibility */}
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

        {/* Clear All Button */}
        {hasFiltersApplied && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-11 text-destructive hover:bg-destructive/10 shrink-0"
          >
            <span className="hidden sm:inline">Clear all</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
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
                className="h-4 w-4 p-0 hover:bg-transparent ml-1 text-foreground/70 hover:text-foreground dark:text-primary-foreground/70 dark:hover:text-primary-foreground"
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
