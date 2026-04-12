// src/app/dashboard/gallery/categories/create/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import GalleryCategoryForm from '@/components/gallery/categories/GalleryCategoryForm';
import {
  IGalleryCategoryFormSchema,
  createGalleryCategorySchema,
} from '@/validations/gallery/gallery-category-validation';
import { useCreateGalleryCategoryMutation } from '@/redux/gallery/gallery-category-api';
import { extractApiError } from '@/utils/extract-api-error';

const CreateGalleryCategoryPage = () => {
  const router = useRouter();
  const [createGalleryCategory, { isLoading }] =
    useCreateGalleryCategoryMutation();

  const form = useForm<IGalleryCategoryFormSchema>({
    resolver: zodResolver(createGalleryCategorySchema),
    defaultValues: {
      name: '',
      isFeatured: false,
    },
  });

  async function onSubmit(data: IGalleryCategoryFormSchema) {
    const toastId = toast.loading('Creating category...');

    try {
      await createGalleryCategory(data).unwrap();
      toast.dismiss(toastId);
      toast.success('Gallery category created successfully!');
      router.push('/dashboard/gallery/categories');
    } catch (err) {
      console.error('Error creating gallery category:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof IGalleryCategoryFormSchema, {
            message: errorMessage,
          });
        });
      }
      toast.error(message);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <GalleryCategoryForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
};

export default CreateGalleryCategoryPage;
