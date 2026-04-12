// src/components/gallery/photos/data-table/DataTable.tsx
'use client';
import * as React from 'react';
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
import { useDeleteGalleryPhotoMutation } from '@/redux/gallery/gallery-photo-api';
import { createGalleryPhotoColumns } from './columns';
import { GalleryPhotoTableFilters } from './TableFilters';
import { DataTablePagination } from '@/components/ui/DataTablePagination';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { extractApiError } from '@/utils/extract-api-error';
import { IGalleryPhotosDataTableProps } from '@/types/gallery/gallery-photo.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageIcon, Plus } from 'lucide-react';

interface GalleryPhotosDataTableProps extends IGalleryPhotosDataTableProps {
  onUploadPhoto: () => void;
}

export function GalleryPhotosDataTable({
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
  onUploadPhoto,
}: GalleryPhotosDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] =
    React.useState(false);

  const [deletePhoto] = useDeleteGalleryPhotoMutation();

  const columns = React.useMemo(() => createGalleryPhotoColumns(), []);

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

  const handleDeleteSelected = () => {
    if (table.getSelectedRowModel().rows.length === 0) {
      toast.error('Please select photos to delete');
      return;
    }
    setDeleteSelectedDialogOpen(true);
  };

  const handleDeleteSelectedPhotos = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCount = selectedRows.length;

    setDeleteSelectedDialogOpen(false);

    const toastId = toast.loading(
      `Deleting ${selectedCount} ${selectedCount === 1 ? 'photo' : 'photos'}...`,
    );

    try {
      await Promise.all(
        selectedRows.map((row) => deletePhoto(row.original.id).unwrap()),
      );
      toast.dismiss(toastId);
      toast.success(
        `${selectedCount} ${selectedCount === 1 ? 'photo' : 'photos'} deleted successfully`,
      );
      setRowSelection({});
      onRefresh?.();
    } catch (error) {
      toast.dismiss(toastId);
      const { message } = extractApiError(error);
      toast.error(message);
    }
  };

  const selectedCount = table.getSelectedRowModel().rows.length;

  const hasActiveFilters =
    !!filters.search ||
    filters.isPublished !== undefined ||
    filters.categoryId !== undefined;

  const showFilters = totalCount > 0 || hasActiveFilters;
  const noResultsFromFilters = hasActiveFilters && data.length === 0;
  const noDataAtAll = !loading && totalCount === 0 && !hasActiveFilters;

  if (noDataAtAll) {
    return (
      <EmptyState
        icon={ImageIcon}
        onCreateClick={onUploadPhoto}
        title="No Photos Yet"
        description="Get started by uploading your first photo to the gallery."
        buttonText="Upload Your First Photo"
        buttonIcon={Plus}
      />
    );
  }

  return (
    <div className="w-full max-w-full space-y-6">
      {showFilters && (
        <GalleryPhotoTableFilters
          table={table}
          filters={filters}
          onFiltersChange={onFiltersChange}
          totalCount={totalCount}
          onUploadPhoto={onUploadPhoto}
          onDeleteSelected={handleDeleteSelected}
        />
      )}

      {noResultsFromFilters ? (
        <EmptyState
          icon={ImageIcon}
          title="No Matching Photos"
          description="No photos match your current filters. Try adjusting your search criteria or clear the filters."
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
                            No photos found
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
        title="Delete Selected Photos"
        description={`Are you sure you want to delete ${selectedCount} selected ${selectedCount === 1 ? 'photo' : 'photos'}? This action cannot be undone and will remove the images from storage.`}
        onConfirm={handleDeleteSelectedPhotos}
        confirmText="Delete Selected"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
