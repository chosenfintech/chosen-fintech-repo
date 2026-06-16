// src/components/events/categories/data-table/columns.tsx
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IEventCategory } from '@/types/events/category.types';
import { EventCategoryActionsDropdown } from './ActionsDropdown';
import { format } from 'date-fns';

export const createEventCategoryColumns = (): ColumnDef<IEventCategory>[] => [
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
    accessorKey: 'totalEventsCount',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="font-semibold cursor-pointer flex items-center justify-start"
      >
        Events
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const category = row.original;
      const total = category.totalEventsCount;
      const published = category.publishedEventsCount ?? 0;
      const unpublished = category.unpublishedEventsCount ?? 0;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="w-fit text-xs cursor-default"
              >
                {total} {total === 1 ? 'event' : 'events'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs space-y-1">
              <p className="text-green-600 font-medium">
                {published} published
              </p>
              <p className="text-muted-foreground">{unpublished} hidden</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
      if (!createdAt) return <span className="text-muted-foreground">—</span>;
      const date = new Date(createdAt);
      return (
        <div className="text-xs sm:text-sm space-y-0.5">
          <div className="font-medium">{format(date, 'MMM dd, yyyy')}</div>
          <div className="text-muted-foreground">{format(date, 'h:mm a')}</div>
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
      if (!updatedAt) return <span className="text-muted-foreground">—</span>;
      const date = new Date(updatedAt);
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
    cell: ({ row }) => <EventCategoryActionsDropdown category={row.original} />,
  },
];
