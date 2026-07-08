// src/app/dashboard/academy/[slug]/preview/page.tsx
'use client';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import GuidePreview from '@/components/academy/preview/GuidePreview';
import {
  useGetGuideByIdOrSlugQuery,
  useToggleGuideFeaturedMutation,
  useToggleGuidePublishMutation,
} from '@/redux/guides/guide-api';
import { extractApiError } from '@/utils/extract-api-error';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function GuidePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const guideSlug = params.slug as string;

  const { data, isLoading, isError, error, refetch } =
    useGetGuideByIdOrSlugQuery(guideSlug);

  const [toggleGuideFeatured, { isLoading: isFeaturing }] =
    useToggleGuideFeaturedMutation();

  const [toggleGuidePublish, { isLoading: isPublishing }] =
    useToggleGuidePublishMutation();

  const guide = data?.data;

  const handleEdit = () => {
    router.push(`/dashboard/academy/${params.slug}/edit`);
  };

  const handleTogglePublish = async () => {
    if (!guide) return;
    const loadingToastId = toast.loading('Updating Publish status...');

    try {
      await toggleGuidePublish(guide.id).unwrap();
      toast.dismiss(loadingToastId);
      toast.success('Publish status updated successfully');
    } catch (error) {
      console.error('Error toggling publish status:', error);
      const { message } = extractApiError(error);
      toast.error(message);
    }
  };

  const handleToggleFeature = async () => {
    if (!guide) return;
    const loadingToastId = toast.loading('Updating Featured status...');

    try {
      await toggleGuideFeatured(guide.id).unwrap();
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
          <p className="text-muted-foreground">Loading guide...</p>
        </div>
      </div>
    );
  }

  const errorMessage = extractApiError(error) || 'An unknown error occurred';

  if (isError || !guide) {
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
      <GuidePreview
        guide={guide}
        onEdit={handleEdit}
        onTogglePublish={handleTogglePublish}
        onToggleFeature={handleToggleFeature}
        isLoading={isPublishing || isFeaturing}
      />
    </div>
  );
}
