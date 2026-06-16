// src/app/dashboard/events/[slug]/preview/page.tsx
'use client';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import EventPreview from '@/components/events/preview/EventPreview';
import {
  useGetEventByIdOrSlugQuery,
  useToggleEventFeaturedMutation,
  useToggleEventPublishMutation,
} from '@/redux/events/event-api';
import { extractApiError } from '@/utils/extract-api-error';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function EventPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const eventSlug = params.slug as string;

  const { data, isLoading, isError, error, refetch } =
    useGetEventByIdOrSlugQuery(eventSlug);

  const [toggleEventFeatured, { isLoading: isFeaturing }] =
    useToggleEventFeaturedMutation();

  const [toggleEventPublish, { isLoading: isPublishing }] =
    useToggleEventPublishMutation();

  const event = data?.data;

  const handleEdit = () => {
    router.push(`/dashboard/events/${params.slug}/edit`);
  };

  const handleTogglePublish = async () => {
    if (!event) return;
    const loadingToastId = toast.loading('Updating Publish status...');

    try {
      await toggleEventPublish(event.id).unwrap();
      toast.dismiss(loadingToastId);
      toast.success('Publish status updated successfully');
    } catch (error) {
      console.error('Error toggling publish status:', error);
      const { message } = extractApiError(error);
      toast.error(message);
    }
  };

  const handleToggleFeature = async () => {
    if (!event) return;
    const loadingToastId = toast.loading('Updating Featured status...');

    try {
      await toggleEventFeatured(event.id).unwrap();
      toast.dismiss(loadingToastId);
      toast.success('Featured status updated successfully');
    } catch (error) {
      console.error('Error toggling feature status:', error);
      const { message } = extractApiError(error);
      toast.error(message);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/events');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  const errorMessage = extractApiError(error) || 'An unknown error occurred';

  if (isError || !event) {
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
      <EventPreview
        event={event}
        onEdit={handleEdit}
        onTogglePublish={handleTogglePublish}
        onToggleFeature={handleToggleFeature}
        onBack={handleBack}
        isLoading={isPublishing || isFeaturing}
      />
    </div>
  );
}
