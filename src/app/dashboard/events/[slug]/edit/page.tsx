// src/app/dashboard/events/[slug]/edit/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import EventForm from '@/components/events/EventForm';
import {
  IEventFormSchema,
  createEventSchema,
} from '@/validations/events/event-validation';
import {
  useGetEventByIdOrSlugQuery,
  useUpdateEventMutation,
} from '@/redux/events/event-api';
import { extractApiError } from '@/utils/extract-api-error';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

const EditEventPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventSlug = params.slug as string;

  const {
    data: eventData,
    isLoading: isLoadingEvent,
    error: eventError,
    isError: isEventError,
    refetch: refetchEvent,
  } = useGetEventByIdOrSlugQuery(eventSlug);

  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const form = useForm<IEventFormSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      categoryId: '',
      isPublished: false,
      isFeatured: false,
      coverImage: undefined,
      publishDate: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });

  useEffect(() => {
    if (eventData?.data) {
      const event = eventData.data;

      form.reset({
        title: event.title,
        excerpt: event.excerpt,
        content: event.content,
        categoryId: event.category?.id ?? 'none',
        isPublished: event.isPublished,
        isFeatured: event.isFeatured || false,
        coverImage: event.coverImage || undefined,
        publishDate: event.publishDate
          ? new Date(event.publishDate).toISOString()
          : undefined,
        eventDate: event.eventDate
          ? new Date(event.eventDate).toISOString()
          : undefined,
        location: event.location ?? undefined,
        startTime: event.startTime ?? undefined,
        endTime: event.endTime ?? undefined,
        createdAt: event.createdAt
          ? new Date(event.createdAt).toISOString()
          : undefined,
        updatedAt: undefined,
      });
    }
  }, [eventData, form]);

  async function onSubmit(data: IEventFormSchema) {
    const toastId = toast.loading(
      data.isPublished ? 'Updating event...' : 'Saving draft...',
    );

    try {
      if (data.coverImage === undefined && eventData?.data.coverImage) {
        data.coverImage = null;
      }

      if (data.categoryId === 'none') {
        data.categoryId = null;
      }

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('isPublished', String(data.isPublished));
      formData.append('isFeatured', String(data.isFeatured));

      if (
        data.categoryId === null ||
        (eventData?.data.category?.id && !data.categoryId)
      ) {
        formData.append('categoryId', 'null');
      } else if (data.categoryId) {
        formData.append('categoryId', data.categoryId);
      }

      if (data.coverImage === null) {
        formData.append('coverImage', 'null');
      } else if (data.coverImage instanceof File) {
        formData.append('coverImage', data.coverImage);
      }

      if (data.publishDate) {
        formData.append('publishDate', data.publishDate);
      }

      formData.append('eventDate', data.eventDate ?? '');
      formData.append('location', data.location ?? '');
      formData.append('startTime', data.startTime ?? '');
      formData.append('endTime', data.endTime ?? '');

      if (data.createdAt) {
        formData.append('createdAt', data.createdAt);
      }

      if (data.updatedAt) {
        formData.append('updatedAt', data.updatedAt);
      }

      if (!eventData?.data.id) {
        toast.dismiss(toastId);
        toast.error('Event ID is missing. Cannot update event.');
        return;
      }

      const result = await updateEvent({
        eventId: eventData.data.id,
        formData,
      }).unwrap();

      toast.dismiss(toastId);
      toast.success(
        data.isPublished
          ? 'Event updated successfully!'
          : 'Draft saved successfully!',
      );
      router.push(`/dashboard/events/${result.data.slug}/preview`);
    } catch (err) {
      console.error('Update event error:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof IEventFormSchema, {
            message: errorMessage,
          });
        });
        toast.error(message);
      } else {
        toast.error(message);
      }
    }
  }

  if (isLoadingEvent) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-3/4" />
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }
  const event = eventData?.data;

  const errorMessage =
    extractApiError(eventError).message ||
    'An error occurred while fetching the event.';

  if (isEventError || !event) {
    return <ErrorMessage error={errorMessage} onRetry={refetchEvent} />;
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <EventForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isUpdating}
        initialData={event}
        mode="update"
      />
    </div>
  );
};
export default EditEventPage;
