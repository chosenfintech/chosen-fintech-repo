// src/app/dashboard/events/create/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import EventForm from '@/components/events/EventForm';
import {
  IEventFormSchema,
  createEventSchema,
} from '@/validations/events/event-validation';
import { useCreateEventMutation } from '@/redux/events/event-api';
import { extractApiError } from '@/utils/extract-api-error';

const CreateEventPage = () => {
  const router = useRouter();
  const [createEvent, { isLoading }] = useCreateEventMutation();

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
      eventDate: undefined,
      location: undefined,
      startTime: undefined,
      endTime: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });

  async function onSubmit(data: IEventFormSchema) {
    const toastId = toast.loading('Publishing event...');

    try {
      if (data.categoryId === 'none') {
        data.categoryId = null;
      }

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('isPublished', String(data.isPublished));
      formData.append('isFeatured', String(data.isFeatured));

      if (data.categoryId) {
        formData.append('categoryId', data.categoryId);
      }

      if (data.coverImage instanceof File) {
        formData.append('coverImage', data.coverImage);
      }

      if (data.publishDate) {
        formData.append('publishDate', data.publishDate);
      }

      if (data.eventDate) {
        formData.append('eventDate', data.eventDate);
      }

      if (data.location) {
        formData.append('location', data.location);
      }

      if (data.startTime) {
        formData.append('startTime', data.startTime);
      }

      if (data.endTime) {
        formData.append('endTime', data.endTime);
      }

      if (data.createdAt) {
        formData.append('createdAt', data.createdAt);
      }

      if (data.updatedAt) {
        formData.append('updatedAt', data.updatedAt);
      }

      const result = await createEvent(formData).unwrap();
      toast.dismiss(toastId);
      toast.success('Event created successfully!');
      router.push(`/dashboard/events/${result.data.slug}/preview`);
    } catch (err) {
      console.error('Error creating event:', err);
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

  return (
    <div className="container mx-auto max-w-7xl">
      <EventForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
};

export default CreateEventPage;
