// src/components/team/data-table/DataTable.tsx
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
import { useDeleteTeamMemberMutation } from '@/redux/team/team-member-api';
import { createTeamMemberColumns } from './columns';
import { TeamMemberTableFilters } from './TableFilters';
import { DataTablePagination } from '@/components/ui/DataTablePagination';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { extractApiError } from '@/utils/extract-api-error';
import { ITeamMembersDataTableProps } from '@/types/team/team-member.types';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users, Plus } from 'lucide-react';

interface TeamMembersDataTableProps extends ITeamMembersDataTableProps {
  onAddMember: () => void;
}

export function TeamMembersDataTable({
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
  onAddMember,
}: TeamMembersDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] =
    React.useState(false);

  const [deleteMember] = useDeleteTeamMemberMutation();

  const columns = React.useMemo(() => createTeamMemberColumns(), []);

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
      toast.error('Please select team members to delete');
      return;
    }
    setDeleteSelectedDialogOpen(true);
  };

  const handleDeleteSelectedMembers = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCount = selectedRows.length;

    setDeleteSelectedDialogOpen(false);

    const toastId = toast.loading(
      `Deleting ${selectedCount} ${selectedCount === 1 ? 'member' : 'members'}...`,
    );

    try {
      await Promise.all(
        selectedRows.map((row) => deleteMember(row.original.id).unwrap()),
      );
      toast.dismiss(toastId);
      toast.success(
        `${selectedCount} ${selectedCount === 1 ? 'member' : 'members'} deleted successfully`,
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

  const hasActiveFilters = !!filters.search || filters.isPublished !== undefined;

  const showFilters = totalCount > 0 || hasActiveFilters;
  const noResultsFromFilters = hasActiveFilters && data.length === 0;
  const noDataAtAll = !loading && totalCount === 0 && !hasActiveFilters;

  if (noDataAtAll) {
    return (
      <EmptyState
        icon={Users}
        onCreateClick={onAddMember}
        title="No Team Members Yet"
        description="Add the people behind Chosen Fintech so they show up on the About page."
        buttonText="Add Your First Member"
        buttonIcon={Plus}
      />
    );
  }

  return (
    <div className="w-full max-w-full space-y-6">
      {showFilters && (
        <TeamMemberTableFilters
          table={table}
          filters={filters}
          onFiltersChange={onFiltersChange}
          totalCount={totalCount}
          onAddMember={onAddMember}
          onDeleteSelected={handleDeleteSelected}
        />
      )}

      {noResultsFromFilters ? (
        <EmptyState
          icon={Users}
          title="No Matching Members"
          description="No team members match your current filters. Try adjusting your search criteria or clear the filters."
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
                            No team members found
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
        title="Delete Selected Members"
        description={`Are you sure you want to delete ${selectedCount} selected ${selectedCount === 1 ? 'member' : 'members'}? This action cannot be undone and will remove their photos from storage.`}
        onConfirm={handleDeleteSelectedMembers}
        confirmText="Delete Selected"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
