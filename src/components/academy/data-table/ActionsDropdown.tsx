// src/components/guides/data-table/ActionsDropdown.tsx
'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  MoreHorizontal,
  Eye,
  Edit,
  EyeOff,
  Star,
  StarOff,
  Trash2,
} from 'lucide-react';
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
import { IGuide } from '@/types/guides/guide.types';
import {
  useToggleGuidePublishMutation,
  useToggleGuideFeaturedMutation,
  useDeleteGuideMutation,
} from '@/redux/guides/guide-api';
import { extractApiError } from '@/utils/extract-api-error';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface GuideActionsDropdownProps {
  guide: IGuide;
}

export function GuideActionsDropdown({ guide }: GuideActionsDropdownProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const [togglePublish] = useToggleGuidePublishMutation();
  const [toggleFeatured] = useToggleGuideFeaturedMutation();
  const [deleteGuide] = useDeleteGuideMutation();

  const handleTogglePublish = async () => {
    const toastId = toast.loading(
      guide.isPublished ? 'Unpublishing guide...' : 'Publishing guide...',
    );

    try {
      await togglePublish(guide.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Guide ${guide.isPublished ? 'unpublished' : 'published'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleToggleFeatured = async () => {
    const toastId = toast.loading(
      guide.isFeatured ? 'Removing from featured...' : 'Featuring guide...',
    );

    try {
      await toggleFeatured(guide.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Guide ${guide.isFeatured ? 'unfeatured' : 'featured'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleDeleteGuide = async () => {
    const toastId = toast.loading('Deleting guide...');

    try {
      await deleteGuide(guide.id).unwrap();
      toast.dismiss(toastId);
      toast.success('Guide deleted successfully');
      setDeleteDialogOpen(false);
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
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
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => router.push(`/dashboard/academy/${guide.slug}/preview`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Guide
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => router.push(`/dashboard/academy/${guide.slug}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Guide
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={handleTogglePublish}
          >
            {guide.isPublished ? (
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

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={handleToggleFeatured}
          >
            {guide.isFeatured ? (
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
            Delete Guide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Guide"
        description={`Are you sure you want to delete "${guide.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteGuide}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
