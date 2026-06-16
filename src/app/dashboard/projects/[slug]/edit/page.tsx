// src/app/dashboard/projects/[slug]/edit/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import ProjectForm from '@/components/projects/ProjectForm';
import {
  IProjectFormSchema,
  createProjectSchema,
} from '@/validations/projects/project-validation';
import {
  useGetProjectByIdOrSlugQuery,
  useUpdateProjectMutation,
} from '@/redux/projects/project-api';
import { extractApiError } from '@/utils/extract-api-error';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

const EditProjectPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectSlug = params.slug as string;

  const {
    data: projectData,
    isLoading: isLoadingProject,
    error: projectError,
    isError: isProjectError,
    refetch: refetchProject,
  } = useGetProjectByIdOrSlugQuery(projectSlug);

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

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

  useEffect(() => {
    if (projectData?.data) {
      const project = projectData.data;

      form.reset({
        title: project.title,
        description: project.description,
        content: project.content,
        isPublished: project.isPublished,
        isFeatured: project.isFeatured || false,
        imageUrl: project.imageUrl || undefined,
        publishDate: project.publishDate
          ? new Date(project.publishDate).toISOString()
          : undefined,
        createdAt: project.createdAt
          ? new Date(project.createdAt).toISOString()
          : undefined,
        updatedAt: undefined,
      });
    }
  }, [projectData, form]);

  async function onSubmit(data: IProjectFormSchema) {
    const toastId = toast.loading(
      data.isPublished ? 'Updating project...' : 'Saving draft...',
    );

    try {
      if (data.imageUrl === undefined && projectData?.data.imageUrl) {
        data.imageUrl = null;
      }

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('content', data.content);
      formData.append('isPublished', String(data.isPublished));
      formData.append('isFeatured', String(data.isFeatured));

      if (data.imageUrl === null) {
        formData.append('imageUrl', 'null');
      } else if (data.imageUrl instanceof File) {
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

      if (!projectData?.data.id) {
        toast.dismiss(toastId);
        toast.error('Project ID is missing. Cannot update project.');
        return;
      }

      const result = await updateProject({
        projectId: projectData.data.id,
        formData,
      }).unwrap();

      toast.dismiss(toastId);
      toast.success(
        data.isPublished
          ? 'Project updated successfully!'
          : 'Draft saved successfully!',
      );
      router.push(`/dashboard/projects/${result.data.slug}/preview`);
    } catch (err) {
      console.error('Update project error:', err);
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

  if (isLoadingProject) {
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
  const project = projectData?.data;

  const errorMessage =
    extractApiError(projectError).message ||
    'An error occurred while fetching the project.';

  if (isProjectError || !project) {
    return <ErrorMessage error={errorMessage} onRetry={refetchProject} />;
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <ProjectForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isUpdating}
        initialData={project}
        mode="update"
      />
    </div>
  );
};
export default EditProjectPage;
