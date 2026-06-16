// src/app/dashboard/events/categories/create/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import EventCategoryForm from '@/components/events/categories/EventCategoryForm';
import {
  IEventCategoryFormSchema,
  createEventCategorySchema,
} from '@/validations/events/category-validation';
import { useCreateEventCategoryMutation } from '@/redux/events/category-api';
import { extractApiError } from '@/utils/extract-api-error';

const CreateEventCategoryPage = () => {
  const router = useRouter();
  const [createEventCategory, { isLoading }] = useCreateEventCategoryMutation();

  const form = useForm<IEventCategoryFormSchema>({
    resolver: zodResolver(createEventCategorySchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: IEventCategoryFormSchema) {
    const toastId = toast.loading('Creating category...');

    try {
      await createEventCategory(data).unwrap();
      toast.dismiss(toastId);
      toast.success('EventCategory created successfully!');
      router.push('/dashboard/events/categories');
    } catch (err) {
      console.error('Error creating category:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof IEventCategoryFormSchema, {
            message: errorMessage,
          });
        });
      }
      toast.error(message);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <EventCategoryForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
};

export default CreateEventCategoryPage;
