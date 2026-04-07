// src/app/dashboard/posts/categories/create/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import CategoryForm from '@/components/posts/categories/CategoryForm';
import {
  ICategoryFormSchema,
  createCategorySchema,
} from '@/validations/posts/category-validation';
import { useCreateCategoryMutation } from '@/redux/posts/category-api';
import { extractApiError } from '@/utils/extract-api-error';

const CreateCategoryPage = () => {
  const router = useRouter();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const form = useForm<ICategoryFormSchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: ICategoryFormSchema) {
    const toastId = toast.loading('Creating category...');

    try {
      await createCategory(data).unwrap();
      toast.dismiss(toastId);
      toast.success('Category created successfully!');
      router.push('/dashboard/posts/categories');
    } catch (err) {
      console.error('Error creating category:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof ICategoryFormSchema, {
            message: errorMessage,
          });
        });
      }
      toast.error(message);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <CategoryForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
};

export default CreateCategoryPage;
