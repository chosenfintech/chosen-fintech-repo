// src/components/posts/data-table/ActionsDropdown.tsx
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
import { IPost } from '@/types/posts/post.types';
import {
  useTogglePostPublishMutation,
  useTogglePostFeaturedMutation,
  useDeletePostMutation,
} from '@/redux/posts/post-api';
import { extractApiError } from '@/utils/extract-api-error';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface PostActionsDropdownProps {
  post: IPost;
}

export function PostActionsDropdown({ post }: PostActionsDropdownProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const [togglePublish] = useTogglePostPublishMutation();
  const [toggleFeatured] = useTogglePostFeaturedMutation();
  const [deletePost] = useDeletePostMutation();

  const handleTogglePublish = async () => {
    const toastId = toast.loading(
      post.isPublished ? 'Unpublishing post...' : 'Publishing post...',
    );

    try {
      await togglePublish(post.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Post ${post.isPublished ? 'unpublished' : 'published'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleToggleFeatured = async () => {
    const toastId = toast.loading(
      post.isFeatured ? 'Removing from featured...' : 'Featuring post...',
    );

    try {
      await toggleFeatured(post.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Post ${post.isFeatured ? 'unfeatured' : 'featured'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleDeletePost = async () => {
    const toastId = toast.loading('Deleting post...');

    try {
      await deletePost(post.id).unwrap();
      toast.dismiss(toastId);
      toast.success('Post deleted successfully');
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
            onClick={() => router.push(`/dashboard/posts/${post.slug}/preview`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Post
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => router.push(`/dashboard/posts/${post.slug}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Post
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={handleTogglePublish}
          >
            {post.isPublished ? (
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
            {post.isFeatured ? (
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
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Post"
        description={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        onConfirm={handleDeletePost}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
