// src/components/ui/Pagination.tsx
"use client";
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  onLimitChange,
  showPageSizeSelector = false,
  pageSizeOptions = [6, 9, 20, 30, 50, 100],
  className = "",
}) => {
  const { page: currentPage, limit, totalPages } = meta;

  const getVisiblePages = (maxVisible: number = 7) => {
    const rangeWithDots: (number | string)[] = [];

    if (totalPages <= 1) return [1];

    // If total pages is less than max visible, show all pages
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Special handling for mobile (3 buttons) - always show: 1 ... lastPage
    if (maxVisible === 3) {
      if (totalPages === 2) {
        return [1, 2];
      }
      return [1, "...", totalPages];
    }

    // Always show first page
    rangeWithDots.push(1);

    // Calculate the range around current page
    const showLeftDots = currentPage > 3;
    const showRightDots = currentPage < totalPages - 2;

    if (!showLeftDots && showRightDots) {
      // Near the beginning
      for (let i = 2; i <= Math.min(maxVisible - 2, totalPages - 1); i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push("...");
    } else if (showLeftDots && !showRightDots) {
      // Near the end
      rangeWithDots.push("...");
      for (
        let i = Math.max(totalPages - (maxVisible - 3), 2);
        i < totalPages;
        i++
      ) {
        rangeWithDots.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      // In the middle
      rangeWithDots.push("...");

      const siblingCount = Math.floor((maxVisible - 4) / 2);
      for (
        let i = currentPage - siblingCount;
        i <= currentPage + siblingCount;
        i++
      ) {
        if (i > 1 && i < totalPages) {
          rangeWithDots.push(i);
        }
      }

      rangeWithDots.push("...");
    } else {
      // Very few pages, show all middle pages
      for (let i = 2; i < totalPages; i++) {
        rangeWithDots.push(i);
      }
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Check if current page is hidden in ellipsis
  const isCurrentPageInEllipsis = (
    pages: (number | string)[],
    ellipsisIndex: number,
  ) => {
    if (pages[ellipsisIndex] !== "...") return false;

    // Find the numbers before and after this ellipsis
    let prevNum = 1;
    let nextNum = totalPages;

    for (let i = ellipsisIndex - 1; i >= 0; i--) {
      if (typeof pages[i] === "number") {
        prevNum = pages[i] as number;
        break;
      }
    }

    for (let i = ellipsisIndex + 1; i < pages.length; i++) {
      if (typeof pages[i] === "number") {
        nextNum = pages[i] as number;
        break;
      }
    }

    // Check if current page is between these numbers
    return currentPage > prevNum && currentPage < nextNum;
  };

  const renderPageButtons = (
    pages: (number | string)[],
    isMobile: boolean = false,
  ) => {
    return pages.map((page, index) => {
      if (page === "...") {
        const isActive = isMobile && isCurrentPageInEllipsis(pages, index);

        return (
          <Button
            key={`ellipsis-${index}`}
            disabled={!isActive}
            variant="ghost"
            size="sm"
            className={`h-9 min-w-9 px-2 ${
              isActive
                ? "bg-primary/15 text-foreground border border-primary/30 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40 pointer-events-none font-medium"
                : "cursor-default hover:bg-transparent"
            }`}
            aria-label={isActive ? `Current page ${currentPage}` : "More pages"}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive ? (
              <span className="font-medium">{currentPage}</span>
            ) : (
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        );
      }

      return (
        <Button
          key={page}
          onClick={() => onPageChange(page as number)}
          variant="ghost"
          size="sm"
          className={`h-9 min-w-9 px-2 transition-all duration-200 font-medium ${
            page === currentPage
              ? "bg-primary/15 text-foreground border border-primary/30 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40 pointer-events-none"
              : "hover:bg-primary/10 hover:border hover:border-primary/20 dark:hover:bg-primary/10 dark:hover:border-primary/30"
          }`}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Button>
      );
    });
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 py-4 px-2 ${className}`}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Page Size Selector - Left Side */}
      {showPageSizeSelector && onLimitChange ? (
        <div className="flex items-center gap-2">
          <label
            htmlFor="page-size-selector"
            className="text-sm font-medium text-muted-foreground whitespace-nowrap"
          >
            <span className="hidden sm:inline">Rows per page</span>
            <span className="inline sm:hidden">Rows</span>
          </label>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger
              id="page-size-selector"
              className="h-8 w-auto min-w-15 bg-card border-border hover:bg-accent focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            >
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-15">
              {pageSizeOptions.map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className="cursor-pointer"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div />
      )}

      {/* Page Navigation - Right Side */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 lg:w-auto lg:px-3 sm:hover:bg-accent"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden lg:inline ml-1">Previous</span>
        </Button>

        {/* Page Numbers - Mobile (3-5 buttons max) */}
        <div className="flex sm:hidden items-center gap-1">
          {renderPageButtons(getVisiblePages(3), true)}
        </div>

        {/* Page Numbers - Tablet (5 buttons max) */}
        <div className="hidden sm:flex lg:hidden items-center gap-1">
          {renderPageButtons(getVisiblePages(5), false)}
        </div>

        {/* Page Numbers - Desktop (7 buttons max) */}
        <div className="hidden lg:flex items-center gap-1">
          {renderPageButtons(getVisiblePages(7), false)}
        </div>

        {/* Next Button */}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 lg:w-auto lg:px-3 sm:hover:bg-accent"
          aria-label="Next page"
        >
          <span className="hidden lg:inline mr-1">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
