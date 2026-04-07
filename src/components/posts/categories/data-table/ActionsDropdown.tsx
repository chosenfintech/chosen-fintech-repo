// src/components/posts/categories/data-table/ActionsDropDown.tsx
'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ICategory } from '@/types/posts/category.types';
import { useDeleteCategoryMutation } from '@/redux/posts/category-api';
import { extractApiError } from '@/utils/extract-api-error';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface CategoryActionsDropdownProps {
  category: ICategory;
}

export function CategoryActionsDropdown({
  category,
}: CategoryActionsDropdownProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDeleteCategory = async () => {
    const toastId = toast.loading('Deleting category... Please wait');

    try {
      await deleteCategory(category.id).unwrap();
      toast.dismiss(toastId);
      toast.success('Category deleted successfully');
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.dismiss(toastId);
      const { message } = extractApiError(error);
      toast.error(message);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-46 max-w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() =>
              router.push(`/dashboard/posts/categories/${category.id}/view`)
            }
          >
            <Eye className="mr-2 h-4 w-4" />
            View Category
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() =>
              router.push(`/dashboard/posts/categories/${category.id}/edit`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Category
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 hover:cursor-pointer"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteCategory}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
