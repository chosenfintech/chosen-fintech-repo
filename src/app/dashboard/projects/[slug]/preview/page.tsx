// src/app/dashboard/projects/[slug]/preview/page.tsx
'use client';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import ProjectPreview from '@/components/projects/preview/ProjectPreview';
import {
  useGetProjectByIdOrSlugQuery,
  useToggleProjectFeaturedMutation,
  useToggleProjectPublishMutation,
} from '@/redux/projects/project-api';
import { extractApiError } from '@/utils/extract-api-error';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function ProjectPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const projectSlug = params.slug as string;

  const { data, isLoading, isError, error, refetch } =
    useGetProjectByIdOrSlugQuery(projectSlug);

  const [toggleProjectFeatured, { isLoading: isFeaturing }] =
    useToggleProjectFeaturedMutation();

  const [toggleProjectPublish, { isLoading: isPublishing }] =
    useToggleProjectPublishMutation();

  const project = data?.data;

  const handleEdit = () => {
    router.push(`/dashboard/projects/${params.slug}/edit`);
  };

  const handleTogglePublish = async () => {
    if (!project) return;
    const loadingToastId = toast.loading('Updating Publish status...');

    try {
      await toggleProjectPublish(project.id).unwrap();
      toast.dismiss(loadingToastId);
      toast.success('Publish status updated successfully');
    } catch (error) {
      console.error('Error toggling publish status:', error);
      const { message } = extractApiError(error);
      toast.error(message);
    }
  };

  const handleToggleFeature = async () => {
    if (!project) return;
    const loadingToastId = toast.loading('Updating Featured status...');

    try {
      await toggleProjectFeatured(project.id).unwrap();
      toast.dismiss(loadingToastId);
      toast.success('Featured status updated successfully');
    } catch (error) {
      console.error('Error toggling feature status:', error);
      const { message } = extractApiError(error);
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  const errorMessage = extractApiError(error) || 'An unknown error occurred';

  if (isError || !project) {
    return (
      <ErrorMessage
        error={errorMessage}
        onRetry={refetch}
        title="An Error Occurred"
      />
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <ProjectPreview
        project={project}
        onEdit={handleEdit}
        onTogglePublish={handleTogglePublish}
        onToggleFeature={handleToggleFeature}
        isLoading={isPublishing || isFeaturing}
      />
    </div>
  );
}
