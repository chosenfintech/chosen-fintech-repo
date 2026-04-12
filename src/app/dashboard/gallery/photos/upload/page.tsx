// src/app/dashboard/posts/create/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import GalleryPhotoForm from '@/components/gallery/GalleryPhotoForm';
import {
  IGalleryPhotoFormSchema,
  createGalleryPhotoSchema,
} from '@/validations/gallery/gallery-photo-validation';
import { useCreateGalleryPhotoMutation } from '@/redux/gallery/gallery-photo-api';
import { extractApiError } from '@/utils/extract-api-error';

const CreateGalleryPhotoPage = () => {
  const router = useRouter();
  const [createGalleryPhoto, { isLoading }] = useCreateGalleryPhotoMutation();

  const form = useForm<IGalleryPhotoFormSchema>({
    resolver: zodResolver(createGalleryPhotoSchema),
    defaultValues: {
      categoryId: '',
      altText: '',
      caption: '',
      isPublished: false,
    },
  });

  async function onSubmit(data: IGalleryPhotoFormSchema, imageFile: File) {
    const toastId = toast.loading(
      data.isPublished ? 'Publishing photo...' : 'Saving photo...',
    );

    try {
      const formData = new FormData();

      formData.append('image', imageFile);
      formData.append('categoryId', data.categoryId);
      formData.append('isPublished', String(data.isPublished));

      if (data.altText) {
        formData.append('altText', data.altText);
      }

      if (data.caption) {
        formData.append('caption', data.caption);
      }

      await createGalleryPhoto(formData).unwrap();

      toast.dismiss(toastId);
      toast.success('Photo uploaded successfully!');
      router.push('/dashboard/gallery/photos');
    } catch (err) {
      console.error('Error uploading photo:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof IGalleryPhotoFormSchema, {
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
      <GalleryPhotoForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateGalleryPhotoPage;
