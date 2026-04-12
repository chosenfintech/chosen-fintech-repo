// src/components/gallery/photos/data-table/columns.tsx
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Calendar, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { IGalleryPhoto } from '@/types/gallery/gallery-photo.types';
import { GalleryPhotoActionsDropdown } from './ActionsDropdown';

export const createGalleryPhotoColumns = (): ColumnDef<IGalleryPhoto>[] => [
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
    accessorKey: 'url',
    header: 'Photo',
    cell: ({ row }) => {
      const url = row.getValue('url') as string;
      const altText = row.original.altText ?? 'Gallery photo';
      return (
        <div className="w-14 h-14 relative rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
          {url ? (
            <Image
              src={url}
              alt={altText}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'altText',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="font-semibold cursor-pointer flex items-center justify-start"
      >
        Details
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const altText = row.getValue('altText') as string | null;
      const caption = row.original.caption;
      return (
        <div className="max-w-[200px] sm:max-w-[280px]">
          <div className="font-medium truncate text-sm">
            {altText ?? (
              <span className="text-muted-foreground italic">No alt text</span>
            )}
          </div>
          {caption && (
            <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {caption}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as IGalleryPhoto['category'];
      return (
        <div className="flex flex-col gap-1">
          <Badge variant="secondary" className="text-xs w-fit">
            {category.name}
          </Badge>
          {category.isFeatured && (
            <Badge variant="outline" className="text-xs w-fit text-yellow-600">
              Featured
            </Badge>
          )}
        </div>
      );
    },
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
        <span>Uploaded</span>
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
    cell: ({ row }) => <GalleryPhotoActionsDropdown photo={row.original} />,
  },
];
