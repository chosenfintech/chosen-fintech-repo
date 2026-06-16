// src/components/guides/data-table/DataTable.tsx
'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDeleteGuideMutation } from '@/redux/guides/guide-api';
import { createGuideColumns } from './columns';
import { TableFilters } from './TableFilters';
import { DataTablePagination } from '@/components/ui/DataTablePagination';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { extractApiError } from '@/utils/extract-api-error';
import { IGuidesDataTableProps } from '@/types/guides/guide.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, FileText } from 'lucide-react';

export function GuidesDataTable({
  data,
  loading = false,
  totalCount = 0,
  page = 1,
  pageSize = 10,
  filters,
  onPageChange,
  onPageSizeChange,
  onFiltersChange,
  onRefresh,
}: IGuidesDataTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] =
    React.useState(false);

  const [deleteGuide] = useDeleteGuideMutation();

  const columns = React.useMemo(() => createGuideColumns(), []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const handleCreateGuide = () => {
    router.push('/dashboard/academy/create');
  };

  const handleDeleteSelected = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      toast.error('Please select guides to delete');
      return;
    }

    setDeleteSelectedDialogOpen(true);
  };

  const handleDeleteSelectedGuides = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCount = selectedRows.length;

    setDeleteSelectedDialogOpen(false);

    const toastId = toast.loading(
      `Deleting ${selectedCount} guides..., please wait`,
    );

    try {
      const deletePromises = selectedRows.map((row) =>
        deleteGuide(row.original.id).unwrap(),
      );

      await Promise.all(deletePromises);

      toast.dismiss(toastId);
      toast.success(`${selectedCount} guides deleted successfully`);
      setRowSelection({});
      onRefresh?.();
    } catch (error) {
      console.error('Delete error:', error);
      toast.dismiss(toastId);
      const { message } = extractApiError(error);
      toast.error(message);
    }
  };

  const selectedCount = table.getSelectedRowModel().rows.length;

  // Check for active filters (tagId removed)
  const hasActiveFilters =
    filters.search ||
    filters.isPublished !== undefined ||
    filters.isFeatured !== undefined ||
    filters.level !== undefined ||
    filters.authorId !== undefined;

  const showFilters = totalCount > 0 || hasActiveFilters;

  const noResultsFromFilters = hasActiveFilters && data.length === 0;
  const noDataAtAll = !loading && totalCount === 0 && !hasActiveFilters;

  // Empty state when no data at all
  if (noDataAtAll) {
    return (
      <EmptyState
        icon={FileText}
        onCreateClick={handleCreateGuide}
        title="No Guides Yet"
        description="Get started by creating your first guide. Share your thoughts, stories, and ideas with your audience."
        buttonText="Create Your First Guide"
        buttonIcon={Plus}
      />
    );
  }

  return (
    <div className="w-full max-w-full space-y-6">
      {showFilters && (
        <TableFilters
          table={table}
          filters={filters}
          onFiltersChange={onFiltersChange}
          totalCount={totalCount}
          onCreateGuide={handleCreateGuide}
          onDeleteSelected={handleDeleteSelected}
        />
      )}

      {noResultsFromFilters ? (
        <EmptyState
          icon={FileText}
          title="No Matching Guides"
          description="There are no guides matching your filters. Try adjusting your search criteria or clear filters to see all guides."
        />
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="whitespace-nowrap"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <DataTableSkeleton
                      rowCount={pageSize}
                      columnCount={table.getVisibleLeafColumns().length}
                    />
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className="hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="text-muted-foreground">
                            No guides found
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Try adjusting your search or filter criteria
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalCount > 10 && (
            <DataTablePagination
              table={table}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </>
      )}

      <ConfirmationDialog
        open={deleteSelectedDialogOpen}
        onOpenChange={setDeleteSelectedDialogOpen}
        title="Delete Selected Guides"
        description={`Are you sure you want to delete ${selectedCount} selected guides? This action cannot be undone.`}
        onConfirm={handleDeleteSelectedGuides}
        confirmText="Delete Selected"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
