// src/components/posts/categories/data-table/ActionsDropDown.tsx
'use client';
import { useIsAdmin } from '@/hooks/use-is-admin';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Trash2, Eye, Pencil } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ICategory } from '@/types/posts/category.types';
import {
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '@/redux/posts/category-api';
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
  const isAdmin = useIsAdmin();
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const [name, setName] = React.useState(category.name);

  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  React.useEffect(() => {
    setName(category.name);
  }, [category.name]);

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

  const handleUpdate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Category name cannot be empty');
      return;
    }
    const toastId = toast.loading('Saving changes...');
    try {
      await updateCategory({
        categoryId: category.id,
        categoryData: { name: trimmedName },
      }).unwrap();
      toast.dismiss(toastId);
      toast.success('Category updated successfully');
      setEditDialogOpen(false);
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
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
              router.push(`/dashboard/posts?categoryId=${category.id}`)
            }
          >
            <Eye className="mr-2 h-4 w-4" />
            View Posts
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Details
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:cursor-pointer"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Details Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Name</Label>
              <Input
                id="categoryName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name..."
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {name.length}/100 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
