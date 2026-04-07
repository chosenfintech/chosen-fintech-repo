// src/app/dashboard/posts/create/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import PostForm from '@/components/posts/PostForm';
import {
  IPostFormSchema,
  createPostSchema,
} from '@/validations/posts/post-validation';
import { useCreatePostMutation } from '@/redux/posts/post-api';
import { extractApiError } from '@/utils/extract-api-error';

const CreatePostPage = () => {
  const router = useRouter();
  const [createPost, { isLoading }] = useCreatePostMutation();

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

  async function onSubmit(data: IPostFormSchema) {
    const toastId = toast.loading('Publishing post...');

    try {
      if (data.categoryId === 'none') {
        data.categoryId = null;
      }

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('isPublished', String(data.isPublished));
      formData.append('isFeatured', String(data.isFeatured));

      if (data.categoryId) {
        formData.append('categoryId', data.categoryId);
      }

      if (data.coverImage instanceof File) {
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

      const result = await createPost(formData).unwrap();
      toast.dismiss(toastId);
      toast.success('Post created successfully!');
      router.push(`/dashboard/posts/${result.data.slug}/preview`);
    } catch (err) {
      console.error('Error creating post:', err);
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

  return (
    <div className="container mx-auto max-w-7xl">
      <PostForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
};

export default CreatePostPage;
