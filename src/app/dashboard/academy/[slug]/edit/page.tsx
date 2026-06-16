// src/app/dashboard/academy/[slug]/edit/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import GuideForm from '@/components/academy/GuideForm';
import {
  IGuideFormSchema,
  createGuideSchema,
} from '@/validations/guides/guide-validation';
import {
  useGetGuideByIdOrSlugQuery,
  useUpdateGuideMutation,
} from '@/redux/guides/guide-api';
import { extractApiError } from '@/utils/extract-api-error';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

const EditGuidePage = () => {
  const router = useRouter();
  const params = useParams();
  const guideSlug = params.slug as string;

  const {
    data: guideData,
    isLoading: isLoadingGuide,
    error: guideError,
    isError: isGuideError,
    refetch: refetchGuide,
  } = useGetGuideByIdOrSlugQuery(guideSlug);

  const [updateGuide, { isLoading: isUpdating }] = useUpdateGuideMutation();

  const form = useForm<IGuideFormSchema>({
    resolver: zodResolver(createGuideSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      level: 'BEGINNER',
      isPublished: false,
      isFeatured: false,
      image: undefined,
      publishDate: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });

  useEffect(() => {
    if (guideData?.data) {
      const guide = guideData.data;

      form.reset({
        title: guide.title,
        description: guide.description,
        content: guide.content,
        level: guide.level,
        isPublished: guide.isPublished,
        isFeatured: guide.isFeatured || false,
        image: guide.image || undefined,
        publishDate: guide.publishDate
          ? new Date(guide.publishDate).toISOString()
          : undefined,
        createdAt: guide.createdAt
          ? new Date(guide.createdAt).toISOString()
          : undefined,
        updatedAt: undefined,
      });
    }
  }, [guideData, form]);

  async function onSubmit(data: IGuideFormSchema) {
    const toastId = toast.loading(
      data.isPublished ? 'Updating guide...' : 'Saving draft...',
    );

    try {
      if (data.image === undefined && guideData?.data.image) {
        data.image = null;
      }

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('content', data.content);
      formData.append('isPublished', String(data.isPublished));
      formData.append('isFeatured', String(data.isFeatured));

      if (data.level) {
        formData.append('level', data.level);
      }

      if (data.image === null) {
        formData.append('image', 'null');
      } else if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      if (data.publishDate) {
        formData.append('publishDate', data.publishDate);
      }

      if (data.createdAt) {
        formData.append('createdAt', data.createdAt);
      }

      if (data.updatedAt) {
        formData.append('updatedAt', data.updatedAt);
      }

      if (!guideData?.data.id) {
        toast.dismiss(toastId);
        toast.error('Guide ID is missing. Cannot update guide.');
        return;
      }

      const result = await updateGuide({
        guideId: guideData.data.id,
        formData,
      }).unwrap();

      toast.dismiss(toastId);
      toast.success(
        data.isPublished
          ? 'Guide updated successfully!'
          : 'Draft saved successfully!',
      );
      router.push(`/dashboard/academy/${result.data.slug}/preview`);
    } catch (err) {
      console.error('Update guide error:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof IGuideFormSchema, {
            message: errorMessage,
          });
        });
        toast.error(message);
      } else {
        toast.error(message);
      }
    }
  }

  if (isLoadingGuide) {
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
  const guide = guideData?.data;

  const errorMessage =
    extractApiError(guideError).message ||
    'An error occurred while fetching the guide.';

  if (isGuideError || !guide) {
    return <ErrorMessage error={errorMessage} onRetry={refetchGuide} />;
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <GuideForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isUpdating}
        initialData={guide}
        mode="update"
      />
    </div>
  );
};
export default EditGuidePage;
