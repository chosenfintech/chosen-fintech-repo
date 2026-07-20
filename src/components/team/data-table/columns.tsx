// src/components/team/data-table/columns.tsx
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Calendar, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ITeamMember } from '@/types/team/team-member.types';
import { TeamMemberActionsDropdown } from './ActionsDropdown';

export const createTeamMemberColumns = (): ColumnDef<ITeamMember>[] => [
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
    accessorKey: 'imageUrl',
    header: 'Photo',
    cell: ({ row }) => {
      const imageUrl = row.getValue('imageUrl') as string;
      return (
        <div className="w-14 h-14 relative rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.original.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <UserIcon className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="font-semibold cursor-pointer flex items-center justify-start"
      >
        Member
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] sm:max-w-[280px]">
        <div className="font-medium truncate text-sm">{row.original.name}</div>
        <div className="text-xs text-muted-foreground truncate mt-1">
          {row.original.role}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'displayOrder',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="font-semibold cursor-pointer flex items-center justify-start whitespace-nowrap"
      >
        Order
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs w-fit">
        #{row.original.displayOrder}
      </Badge>
    ),
  },
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') as boolean;
      return (
        <Badge
          variant={isPublished ? 'default' : 'secondary'}
          className="w-fit text-xs"
        >
          {isPublished ? 'Published' : 'Hidden'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="cursor-pointer font-semibold flex items-center justify-start flex-nowrap"
      >
        <Calendar className="mr-2 h-4 w-4 hidden sm:inline" />
        <span>Added</span>
        <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string);
      return (
        <div className="text-xs sm:text-sm space-y-0.5">
          <div className="font-medium">{format(date, 'MMM dd, yyyy')}</div>
          <div className="text-muted-foreground">{format(date, 'h:mm a')}</div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => <TeamMemberActionsDropdown member={row.original} />,
  },
];
