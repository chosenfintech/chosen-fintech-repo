// src/components/events/data-table/ActionsDropdown.tsx
'use client';
import { useIsAdmin } from '@/hooks/use-is-admin';
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
import { IEvent } from '@/types/events/event.types';
import {
  useToggleEventPublishMutation,
  useToggleEventFeaturedMutation,
  useDeleteEventMutation,
} from '@/redux/events/event-api';
import { extractApiError } from '@/utils/extract-api-error';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface EventActionsDropdownProps {
  event: IEvent;
}

export function EventActionsDropdown({ event }: EventActionsDropdownProps) {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const [togglePublish] = useToggleEventPublishMutation();
  const [toggleFeatured] = useToggleEventFeaturedMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const handleTogglePublish = async () => {
    const toastId = toast.loading(
      event.isPublished ? 'Unpublishing event...' : 'Publishing event...',
    );

    try {
      await togglePublish(event.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Event ${event.isPublished ? 'unpublished' : 'published'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleToggleFeatured = async () => {
    const toastId = toast.loading(
      event.isFeatured ? 'Removing from featured...' : 'Featuring event...',
    );

    try {
      await toggleFeatured(event.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Event ${event.isFeatured ? 'unfeatured' : 'featured'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleDeleteEvent = async () => {
    const toastId = toast.loading('Deleting event...');

    try {
      await deleteEvent(event.id).unwrap();
      toast.dismiss(toastId);
      toast.success('Event deleted successfully');
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
            onClick={() => router.push(`/dashboard/events/${event.slug}/preview`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Event
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => router.push(`/dashboard/events/${event.slug}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={handleTogglePublish}
          >
            {event.isPublished ? (
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
            {event.isFeatured ? (
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

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:cursor-pointer"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Event"
        description={`Are you sure you want to delete "${event.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteEvent}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
