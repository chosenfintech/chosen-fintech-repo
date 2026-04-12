// src/components/users/data-table/DataTable.tsx
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
import { useDeleteUserMutation } from '@/redux/user-api';
import { createUserColumns } from './columns';
import { TableFilters } from './Filters';
import { DataTablePagination } from '@/components/ui/DataTablePagination';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { extractApiError } from '@/utils/extract-api-error';
import { IUsersDataTableProps } from '@/types/user.types';
import { EmptyState } from '@/components/ui/EmptyState';
import { UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

export function UsersDataTable({
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
}: IUsersDataTableProps) {
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

  const [deleteUser] = useDeleteUserMutation();

  const columns = React.useMemo(() => createUserColumns(), []);

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

  const handleCreateUser = () => {
    router.push('/dashboard/users/create-user');
  };

  const handleDeleteSelected = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error('Please select users to delete');
      return;
    }
    setDeleteSelectedDialogOpen(true);
  };

  const handleDeleteSelectedUsers = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCount = selectedRows.length;
    setDeleteSelectedDialogOpen(false);

    const toastId = toast.loading(
      `Deleting ${selectedCount} user${selectedCount > 1 ? 's' : ''}..., please wait`,
    );

    try {
      const deletePromises = selectedRows.map((row) =>
        deleteUser(row.original.id).unwrap(),
      );
      await Promise.all(deletePromises);
      toast.dismiss(toastId);
      toast.success(
        `${selectedCount} user${selectedCount > 1 ? 's' : ''} deleted successfully`,
      );
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
  const hasActiveFilters = !!filters.search;
  const showFilters = totalCount > 0 || hasActiveFilters;
  const noResultsFromFilters = hasActiveFilters && data.length === 0;
  const noDataAtAll = !loading && totalCount === 0 && !hasActiveFilters;

  if (noDataAtAll) {
    return (
      <EmptyState
        onCreateClick={handleCreateUser}
        title="No Users Yet"
        description="Start building your community by adding users. Manage access and monitor user activity all in one place."
        buttonText="Add Your First User"
        buttonIcon={UserPlus}
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
          onCreateUser={handleCreateUser}
          onDeleteSelected={handleDeleteSelected}
        />
      )}

      {noResultsFromFilters ? (
        <EmptyState
          icon={Users}
          title="No Matching Users"
          description="There are no users matching your filters. Try adjusting your search criteria or clear filters to see all users."
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
                      showAvatar={false}
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
                            No users found
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
        title="Delete Selected Users"
        description={`Are you sure you want to delete ${selectedCount} selected user${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        onConfirm={handleDeleteSelectedUsers}
        confirmText="Delete Selected"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
