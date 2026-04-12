// src/components/gallery/categories/data-table/columns.tsx
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Calendar, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IGalleryCategory } from '@/types/gallery/gallery-category.types';
import { GalleryCategoryActionsDropdown } from './ActionsDropdown';

export const createGalleryCategoryColumns =
  (): ColumnDef<IGalleryCategory>[] => [
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
        const isFeatured = row.original.isFeatured;
        return (
          <div className="flex items-center gap-2 max-w-[200px] sm:max-w-[280px]">
            <span className="font-medium truncate text-sm sm:text-base">
              {name}
            </span>
            {isFeatured && (
              <Star className="h-3.5 w-3.5 text-yellow-500 shrink-0 fill-yellow-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'isFeatured',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold cursor-pointer flex items-center justify-start"
        >
          <Star className="mr-2 h-4 w-4 hidden sm:inline" />
          Featured
          <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const isFeatured = row.getValue('isFeatured') as boolean;
        return isFeatured ? (
          <Badge variant="outline" className="w-fit text-yellow-600 text-xs">
            <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
            Featured
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">Not Featured</span>
        );
      },
    },
    {
      accessorKey: 'totalPhotosCount',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold cursor-pointer flex items-center justify-start"
        >
          Photos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const total = row.getValue('totalPhotosCount') as number;
        const published = row.original.publishedPhotosCount ?? 0;
        const unpublished = row.original.unpublishedPhotosCount ?? 0;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  className="w-fit text-xs cursor-default"
                >
                  {total} {total === 1 ? 'photo' : 'photos'}
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
          Created
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
            <div className="text-muted-foreground">
              {format(date, 'h:mm a')}
            </div>
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
          Updated
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
            <div className="text-muted-foreground">
              {format(date, 'h:mm a')}
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => (
        <GalleryCategoryActionsDropdown category={row.original} />
      ),
    },
  ];
