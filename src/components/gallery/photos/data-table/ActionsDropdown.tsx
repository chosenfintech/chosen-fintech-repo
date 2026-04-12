'use client';
import * as React from 'react';
import {
  MoreHorizontal,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ZoomIn,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
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
import { Textarea } from '@/components/ui/textarea';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { IGalleryPhoto } from '@/types/gallery/gallery-photo.types';
import {
  useToggleGalleryPhotoPublishMutation,
  useDeleteGalleryPhotoMutation,
  useUpdateGalleryPhotoMutation,
} from '@/redux/gallery/gallery-photo-api';
import { extractApiError } from '@/utils/extract-api-error';

interface GalleryPhotoActionsDropdownProps {
  photo: IGalleryPhoto;
}

export function GalleryPhotoActionsDropdown({
  photo,
}: GalleryPhotoActionsDropdownProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);

  const [altText, setAltText] = React.useState(photo.altText ?? '');
  const [caption, setCaption] = React.useState(photo.caption ?? '');

  const [togglePublish] = useToggleGalleryPhotoPublishMutation();
  const [deletePhoto] = useDeleteGalleryPhotoMutation();
  const [updatePhoto, { isLoading: isUpdating }] =
    useUpdateGalleryPhotoMutation();

  React.useEffect(() => {
    setAltText(photo.altText ?? '');
    setCaption(photo.caption ?? '');
  }, [photo.altText, photo.caption]);

  const handleTogglePublish = async () => {
    const toastId = toast.loading(
      photo.isPublished ? 'Unpublishing photo...' : 'Publishing photo...',
    );
    try {
      await togglePublish(photo.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Photo ${photo.isPublished ? 'unpublished' : 'published'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting photo...');
    try {
      await deletePhoto(photo.id).unwrap();
      toast.dismiss(toastId);
      toast.success('Photo deleted successfully');
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
      await updatePhoto({
        photoId: photo.id,
        data: {
          altText: altText.trim() || null,
          caption: caption.trim() || null,
        },
      }).unwrap();
      toast.dismiss(toastId);
      toast.success('Photo updated successfully');
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
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setViewDialogOpen(true)}
          >
            <ZoomIn className="mr-2 h-4 w-4" />
            View Photo
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={handleTogglePublish}
          >
            {photo.isPublished ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 hover:cursor-pointer"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Photo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Photo Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{photo.altText ?? photo.category.name}</DialogTitle>
          </DialogHeader>
          <div
            className="relative w-full"
            style={{ minHeight: '300px', maxHeight: '60vh' }}
          >
            <Image
              src={photo.url}
              alt={photo.altText ?? photo.category.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {photo.caption && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              {photo.caption}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Details Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Photo Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image for accessibility..."
                maxLength={255}
              />
              <p className="text-xs text-muted-foreground">
                {altText.length}/255 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption for this photo..."
                maxLength={500}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {caption.length}/500 characters
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
        title="Delete Photo"
        description="Are you sure you want to delete this photo? This action cannot be undone and will remove the image from storage."
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
