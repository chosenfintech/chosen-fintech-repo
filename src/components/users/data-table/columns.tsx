// src/components/users/data-table/columns.tsx
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { IUser } from '@/types/user.types';
import { UserActionsDropdown } from './ActionsDropdown';

export const createUserColumns = (): ColumnDef<IUser>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
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
    accessorKey: 'fullname',
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
      const fullname = row.getValue('fullname') as string;
      const email = row.original.email;

      return (
        <div className="max-w-50 sm:max-w-75">
          <div className="font-medium truncate text-sm sm:text-base">
            {fullname}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">
            {email}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null;
      return (
        <span className="text-xs sm:text-sm">
          {phone ?? <span className="text-muted-foreground">—</span>}
        </span>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string | undefined;
      return (
        <span
          className={`inline-block text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full ${
            role === 'ADMIN'
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {role === 'ADMIN' ? 'Admin' : 'Editor'}
        </span>
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
        <Calendar className="hidden lg:block mr-2 h-4 w-4" />
        <span>CreatedAt</span>
        <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string);
      return (
        <div className="text-xs sm:text-sm">{format(date, 'MMM d, yyyy')}</div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => <UserActionsDropdown user={row.original} />,
  },
];
