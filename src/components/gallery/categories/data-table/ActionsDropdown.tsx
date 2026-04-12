// src/components/gallery/categories/data-table/ActionsDropdown.tsx
'use client';
import * as React from 'react';
import { MoreHorizontal, Trash2, Pencil, Star, StarOff } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { IGalleryCategory } from '@/types/gallery/gallery-category.types';
import {
  useDeleteGalleryCategoryMutation,
  useUpdateGalleryCategoryMutation,
  useToggleGalleryCategoryFeaturedMutation,
} from '@/redux/gallery/gallery-category-api';
import { extractApiError } from '@/utils/extract-api-error';

interface GalleryCategoryActionsDropdownProps {
  category: IGalleryCategory;
}

export function GalleryCategoryActionsDropdown({
  category,
}: GalleryCategoryActionsDropdownProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const [name, setName] = React.useState(category.name);
  const [isFeatured, setIsFeatured] = React.useState(category.isFeatured);

  const [deleteCategory] = useDeleteGalleryCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateGalleryCategoryMutation();
  const [toggleFeatured] = useToggleGalleryCategoryFeaturedMutation();

  // Keep local state in sync when category prop changes
  React.useEffect(() => {
    setName(category.name);
    setIsFeatured(category.isFeatured);
  }, [category.name, category.isFeatured]);

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting category and its photos...');
    try {
      await deleteCategory(category.id).unwrap();
      toast.dismiss(toastId);
      toast.success('Gallery category deleted successfully');
      setDeleteDialogOpen(false);
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdate = async () => {
    const toastId = toast.loading('Saving changes...');
    try {
      await updateCategory({
        categoryId: category.id,
        data: {
          name: name.trim(),
          isFeatured,
        },
      }).unwrap();
      toast.dismiss(toastId);
      toast.success('Gallery category updated successfully');
      setEditDialogOpen(false);
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleToggleFeatured = async () => {
    const toastId = toast.loading(
      category.isFeatured
        ? 'Removing from featured...'
        : 'Featuring category...',
    );
    try {
      await toggleFeatured(category.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Category ${category.isFeatured ? 'unfeatured' : 'featured'} successfully`,
      );
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
        <DropdownMenuContent align="end" className="min-w-48 max-w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Category
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={handleToggleFeatured}
          >
            {category.isFeatured ? (
              <>
                <StarOff className="mr-2 h-4 w-4" />
                Unfeature
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Feature
              </>
            )}
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Gallery Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
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

            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div className="space-y-0.5">
                <Label htmlFor="isFeatured" className="text-sm font-medium">
                  Featured Category
                </Label>
                <p className="text-xs text-muted-foreground">
                  Featured categories are highlighted in the public gallery.
                </p>
              </div>
              <Switch
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
              />
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
            <Button
              onClick={handleUpdate}
              disabled={isUpdating || !name.trim()}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Gallery Category"
        description={`Are you sure you want to delete "${category.name}"? This will permanently delete the category and all ${category.totalPhotosCount} photo(s) within it. This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
