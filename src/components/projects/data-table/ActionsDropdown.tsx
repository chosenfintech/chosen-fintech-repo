// src/components/projects/data-table/ActionsDropdown.tsx
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
import { IProject } from '@/types/projects/project.types';
import {
  useToggleProjectPublishMutation,
  useToggleProjectFeaturedMutation,
  useDeleteProjectMutation,
} from '@/redux/projects/project-api';
import { extractApiError } from '@/utils/extract-api-error';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface ProjectActionsDropdownProps {
  project: IProject;
}

export function ProjectActionsDropdown({ project }: ProjectActionsDropdownProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const [togglePublish] = useToggleProjectPublishMutation();
  const [toggleFeatured] = useToggleProjectFeaturedMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const handleTogglePublish = async () => {
    const toastId = toast.loading(
      project.isPublished ? 'Unpublishing project...' : 'Publishing project...',
    );

    try {
      await togglePublish(project.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Project ${project.isPublished ? 'unpublished' : 'published'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleToggleFeatured = async () => {
    const toastId = toast.loading(
      project.isFeatured ? 'Removing from featured...' : 'Featuring project...',
    );

    try {
      await toggleFeatured(project.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Project ${project.isFeatured ? 'unfeatured' : 'featured'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleDeleteProject = async () => {
    const toastId = toast.loading('Deleting project...');

    try {
      await deleteProject(project.id).unwrap();
      toast.dismiss(toastId);
      toast.success('Project deleted successfully');
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
            onClick={() => router.push(`/dashboard/projects/${project.slug}/preview`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Project
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => router.push(`/dashboard/projects/${project.slug}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={handleTogglePublish}
          >
            {project.isPublished ? (
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
            {project.isFeatured ? (
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
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteProject}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
