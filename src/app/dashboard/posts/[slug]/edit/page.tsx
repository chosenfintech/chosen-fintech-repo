// src/app/dashboard/posts/[slug]/edit/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import PostForm from '@/components/posts/PostForm';
import {
  IPostFormSchema,
  createPostSchema,
} from '@/validations/posts/post-validation';
import {
  useGetPostByIdOrSlugQuery,
  useUpdatePostMutation,
} from '@/redux/posts/post-api';
import { extractApiError } from '@/utils/extract-api-error';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

const EditPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const postSlug = params.slug as string;

  const {
    data: postData,
    isLoading: isLoadingPost,
    error: postError,
    isError: isPostError,
    refetch: refetchPost,
  } = useGetPostByIdOrSlugQuery(postSlug);

  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

  const form = useForm<IPostFormSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      categoryId: '',
      isPublished: false,
      isFeatured: false,
      coverImage: undefined,
      publishDate: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });

  useEffect(() => {
    if (postData?.data) {
      const post = postData.data;

      form.reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: post.category?.id ?? 'none',
        isPublished: post.isPublished,
        isFeatured: post.isFeatured || false,
        coverImage: post.coverImage || undefined,
        publishDate: post.publishDate
          ? new Date(post.publishDate).toISOString()
          : undefined,
        createdAt: post.createdAt
          ? new Date(post.createdAt).toISOString()
          : undefined,
        updatedAt: undefined,
      });
    }
  }, [postData, form]);

  async function onSubmit(data: IPostFormSchema) {
    const toastId = toast.loading(
      data.isPublished ? 'Updating post...' : 'Saving draft...',
    );

    try {
      if (data.coverImage === undefined && postData?.data.coverImage) {
        data.coverImage = null;
      }

      if (data.categoryId === 'none') {
        data.categoryId = null;
      }

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('isPublished', String(data.isPublished));
      formData.append('isFeatured', String(data.isFeatured));

      if (
        data.categoryId === null ||
        (postData?.data.category?.id && !data.categoryId)
      ) {
        formData.append('categoryId', 'null');
      } else if (data.categoryId) {
        formData.append('categoryId', data.categoryId);
      }

      if (data.coverImage === null) {
        formData.append('coverImage', 'null');
      } else if (data.coverImage instanceof File) {
        formData.append('coverImage', data.coverImage);
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

      if (!postData?.data.id) {
        toast.dismiss(toastId);
        toast.error('Post ID is missing. Cannot update post.');
        return;
      }

      const result = await updatePost({
        postId: postData.data.id,
        formData,
      }).unwrap();

      toast.dismiss(toastId);
      toast.success(
        data.isPublished
          ? 'Post updated successfully!'
          : 'Draft saved successfully!',
      );
      router.push(`/dashboard/posts/${result.data.slug}/preview`);
    } catch (err) {
      console.error('Update post error:', err);
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof IPostFormSchema, {
            message: errorMessage,
          });
        });
        toast.error(message);
      } else {
        toast.error(message);
      }
    }
  }

  if (isLoadingPost) {
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
  const post = postData?.data;

  const errorMessage =
    extractApiError(postError).message ||
    'An error occurred while fetching the post.';

  if (isPostError || !post) {
    return <ErrorMessage error={errorMessage} onRetry={refetchPost} />;
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <PostForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isUpdating}
        initialData={post}
        mode="update"
      />
    </div>
  );
};
export default EditPostPage;
