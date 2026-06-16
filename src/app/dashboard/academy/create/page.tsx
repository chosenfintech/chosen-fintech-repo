// src/app/dashboard/academy/create/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import GuideForm from '@/components/academy/GuideForm';
import {
  IGuideFormSchema,
  createGuideSchema,
} from '@/validations/guides/guide-validation';
import { useCreateGuideMutation } from '@/redux/guides/guide-api';
import { extractApiError } from '@/utils/extract-api-error';

const CreateGuidePage = () => {
  const router = useRouter();
  const [createGuide, { isLoading }] = useCreateGuideMutation();

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

  async function onSubmit(data: IGuideFormSchema) {
    const toastId = toast.loading('Publishing guide...');

    try {
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('content', data.content);
      formData.append('isPublished', String(data.isPublished));
      formData.append('isFeatured', String(data.isFeatured));

      if (data.level) {
        formData.append('level', data.level);
      }

      if (data.image instanceof File) {
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

      const result = await createGuide(formData).unwrap();
      toast.dismiss(toastId);
      toast.success('Guide created successfully!');
      router.push(`/dashboard/academy/${result.data.slug}/preview`);
    } catch (err) {
      console.error('Error creating guide:', err);
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

  return (
    <div className="container mx-auto max-w-7xl">
      <GuideForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
};

export default CreateGuidePage;
