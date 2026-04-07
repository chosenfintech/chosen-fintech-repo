// src/components/posts/data-table/columns.tsx
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Calendar, Image as ImageIcon, Star } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { IPost } from '@/types/posts/post.types';
import { PostActionsDropdown } from './ActionsDropdown';
import { format } from 'date-fns';

export const createPostColumns = (): ColumnDef<IPost>[] => [
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
    accessorKey: 'coverImage',
    header: 'Image',
    cell: ({ row }) => {
      const coverImage = row.getValue('coverImage') as string | null;
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-md overflow-hidden bg-muted flex items-center justify-center">
          {coverImage ? (
            <Image src={coverImage} alt="Cover" fill className="object-cover" />
          ) : (
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="font-semibold cursor-pointer flex items-center justify-start"
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const title = row.getValue('title') as string;
      const excerpt = row.original.excerpt;
      return (
        <div className="max-w-[200px] sm:max-w-[300px]">
          <div className="font-medium truncate text-sm sm:text-base">
            {title}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
            {excerpt}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as IPost['category'];
      return category?.name ? (
        <Badge variant="secondary" className="text-xs">
          {category.name}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs sm:text-sm">
          No category
        </span>
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
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
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
        <span>Featured</span>
        <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const isFeatured = row.getValue('isFeatured') as boolean;
      return isFeatured ? (
        <Badge variant="outline" className="w-fit text-yellow-600 text-xs">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs">Not Featured</span>
      );
    },
  },
  {
    accessorKey: 'publishDate',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="cursor-pointer font-semibold flex justify-start items-center flex-nowrap"
      >
        <Calendar className="mr-2 h-4 w-4 hidden sm:inline" />
        <span>Date</span>
        <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('publishDate') as string);
      return (
        <div className="text-xs sm:text-sm">{format(date, 'MMM dd, yyyy')}</div>
      );
    },
  },
  {
    accessorKey: 'readTime',
    header: () => <span className="hidden lg:inline">Read Time</span>,
    cell: ({ row }) => {
      const readTime = row.getValue('readTime') as string;
      return (
        <span className="text-xs sm:text-sm text-muted-foreground hidden lg:inline">
          {readTime}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => <PostActionsDropdown post={row.original} />,
  },
];
