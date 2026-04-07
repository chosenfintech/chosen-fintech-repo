// src/app/dashboard/posts/categories/[id]/edit/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import CategoryForm from '@/components/posts/categories/CategoryForm';
import {
  ICategoryFormSchema,
  createCategorySchema,
} from '@/validations/posts/category-validation';
import {
  useGetCategoryByIdOrNameQuery,
  useUpdateCategoryMutation,
} from '@/redux/posts/category-api';
import { extractApiError } from '@/utils/extract-api-error';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

const EditCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    error: categoryError,
    isError: isCategoryError,
    refetch,
  } = useGetCategoryByIdOrNameQuery(categoryId);

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const form = useForm<ICategoryFormSchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (categoryData?.data) {
      const category = categoryData.data;
      form.reset({
        name: category.name,
      });
    }
  }, [categoryData, form]);

  async function onSubmit(data: ICategoryFormSchema) {
    const toastId = toast.loading('Updating category...');

    try {
      if (!categoryId) {
        toast.error('Category ID is missing. Cannot update category.');
        return;
      }

      await updateCategory({
        categoryId,
        categoryData: data,
      }).unwrap();

      toast.dismiss(toastId);
      toast.success('Category updated successfully!');
      router.push('/dashboard/posts/categories');
    } catch (err) {
      console.error('Update category error:', err);
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

  if (isLoadingCategory) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm max-w-2xl">
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between pt-6 border-t">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const category = categoryData?.data;

  const categoryErrorMessage =
    extractApiError(categoryError).message || 'An unknown error occurred.';

  if (isCategoryError || !category) {
    return <ErrorMessage error={categoryErrorMessage} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <CategoryForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isUpdating}
        initialData={category || []}
        mode="update"
      />
    </div>
  );
};

export default EditCategoryPage;
