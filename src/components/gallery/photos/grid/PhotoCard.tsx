// src/components/gallery/photos/grid/PhotoCard.tsx
'use client';
import * as React from 'react';
import Image from 'next/image';
import {
  MoreVertical,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ZoomIn,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useIsAdmin } from '@/hooks/use-is-admin';
import { cn } from '@/lib/utils';

interface PhotoCardProps {
  photo: IGalleryPhoto;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
}

export function PhotoCard({
  photo,
  selected,
  onSelectedChange,
}: PhotoCardProps) {
  const isAdmin = useIsAdmin();
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

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
      toast.dismiss(toastId);
      toast.error(extractApiError(error).message);
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting photo...');
    try {
      await deletePhoto(photo.id).unwrap();
      toast.dismiss(toastId);
      toast.success('Photo deleted successfully');
      setDeleteOpen(false);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(extractApiError(error).message);
      setDeleteOpen(false);
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
      setEditOpen(false);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(extractApiError(error).message);
    }
  };

  return (
    <>
      <div
        className={cn(
          'group relative overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md',
          selected ? 'border-primary ring-2 ring-primary/40' : 'border-border',
        )}
      >
        {/* Photo - clicking opens the full view. A button, so it is keyboard
            reachable and announced. */}
        <button
          type="button"
          onClick={() => setViewOpen(true)}
          className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label={`View ${photo.altText ?? 'photo'}`}
        >
          <Image
            src={photo.url}
            alt={photo.altText ?? 'Gallery photo'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
            <ZoomIn className="h-7 w-7 text-white" strokeWidth={1.5} />
          </span>
        </button>

        {/* Selection checkbox - appears on hover, stays visible once ticked. */}
        <div
          className={cn(
            'absolute left-2 top-2 transition-opacity',
            selected
              ? 'opacity-100'
              : 'opacity-0 focus-within:opacity-100 group-hover:opacity-100',
          )}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={(value) => onSelectedChange(!!value)}
            aria-label="Select photo"
            className="border-white bg-black/40 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>

        {/* Status pill */}
        <Badge
          variant={photo.isPublished ? 'default' : 'secondary'}
          className="absolute right-2 top-2 text-[10px]"
        >
          {photo.isPublished ? 'Published' : 'Hidden'}
        </Badge>

        {/* Footer: caption/category + the 3-dot menu */}
        <div className="flex items-start justify-between gap-2 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {photo.altText ?? (
                <span className="italic text-muted-foreground">
                  No alt text
                </span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {photo.category.name}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 shrink-0 p-0 hover:cursor-pointer"
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => setViewOpen(true)}
              >
                <ZoomIn className="mr-2 h-4 w-4" />
                View photo
              </DropdownMenuItem>

              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit details
              </DropdownMenuItem>

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

              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 hover:cursor-pointer"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete photo
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Full view */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">
              {photo.altText ?? photo.category.name}
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-[60vh] w-full">
            <Image
              src={photo.url}
              alt={photo.altText ?? photo.category.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {photo.caption && (
            <p className="pt-2 text-center text-sm text-muted-foreground">
              {photo.caption}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit details */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Photo Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor={`altText-${photo.id}`}>Alt Text</Label>
              <Input
                id={`altText-${photo.id}`}
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
              <Label htmlFor={`caption-${photo.id}`}>Caption</Label>
              <Textarea
                id={`caption-${photo.id}`}
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
              onClick={() => setEditOpen(false)}
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

      {/* Delete */}
      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
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
