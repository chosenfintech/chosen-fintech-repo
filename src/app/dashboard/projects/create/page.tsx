// src/app/dashboard/projects/create/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import ProjectForm from '@/components/projects/ProjectForm';
import {
  IProjectFormSchema,
  createProjectSchema,
} from '@/validations/projects/project-validation';
import { useCreateProjectMutation } from '@/redux/projects/project-api';
import { extractApiError } from '@/utils/extract-api-error';

const CreateProjectPage = () => {
  const router = useRouter();
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const form = useForm<IProjectFormSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      isPublished: false,
      isFeatured: false,
      imageUrl: undefined,
      publishDate: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });

  async function onSubmit(data: IProjectFormSchema) {
    const toastId = toast.loading('Publishing project...');

    try {
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('content', data.content);
      formData.append('isPublished', String(data.isPublished));
      formData.append('isFeatured', String(data.isFeatured));

      if (data.imageUrl instanceof File) {
        formData.append('imageUrl', data.imageUrl);
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

      const result = await createProject(formData).unwrap();
      toast.dismiss(toastId);
      toast.success('Project created successfully!');
      router.push(`/dashboard/projects/${result.data.slug}/preview`);
    } catch (err) {
      console.error('Error creating project:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof IProjectFormSchema, {
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
      <ProjectForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
};

export default CreateProjectPage;
