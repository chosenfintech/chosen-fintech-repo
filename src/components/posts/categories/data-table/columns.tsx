// src/components/posts/categories/data-table/columns.tsx
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ICategory } from '@/types/posts/category.types';
import { CategoryActionsDropdown } from './ActionsDropdown';
import { format } from 'date-fns';

export const createCategoryColumns = (): ColumnDef<ICategory>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="font-semibold cursor-pointer flex items-center justify-start"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return (
        <div className="max-w-[200px] sm:max-w-[300px]">
          <div className="font-medium truncate text-sm sm:text-base">
            {name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'totalPostsCount',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="font-semibold cursor-pointer flex items-center justify-start"
      >
        Posts
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const totalPostsCount = row.getValue('totalPostsCount') as number;
      return (
        <Badge variant="secondary" className="w-fit text-xs">
          {totalPostsCount} {totalPostsCount === 1 ? 'post' : 'posts'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="cursor-pointer font-semibold flex justify-start items-center flex-nowrap"
      >
        <Calendar className="mr-2 h-4 w-4 hidden sm:inline" />
        CreatedAt
        <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string | null;
      return (
        <div className="text-xs sm:text-sm">
          {createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : '—'}
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="cursor-pointer font-semibold flex justify-start items-center flex-nowrap"
      >
        <Calendar className="mr-2 h-4 w-4 hidden sm:inline" />
        UpdatedAt
        <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt') as string | null;
      return (
        <div className="text-xs sm:text-sm text-muted-foreground">
          <div className="sm:hidden">
            {updatedAt ? format(new Date(updatedAt), 'MMM d, yyyy') : '—'}
          </div>
          <div className="hidden sm:block">
            {updatedAt ? format(new Date(updatedAt), 'MMM d, yyyy') : '—'}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => <CategoryActionsDropdown category={row.original} />,
  },
];
