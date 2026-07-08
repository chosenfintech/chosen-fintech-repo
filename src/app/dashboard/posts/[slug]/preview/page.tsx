// src/app/dashboard/posts/[slug]/preview/page.tsx
'use client';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import PostPreview from '@/components/posts/preview/PostPreview';
import {
  useGetPostByIdOrSlugQuery,
  useTogglePostFeaturedMutation,
  useTogglePostPublishMutation,
} from '@/redux/posts/post-api';
import { extractApiError } from '@/utils/extract-api-error';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function PostPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const postSlug = params.slug as string;

  const { data, isLoading, isError, error, refetch } =
    useGetPostByIdOrSlugQuery(postSlug);

  const [togglePostFeatured, { isLoading: isFeaturing }] =
    useTogglePostFeaturedMutation();

  const [togglePostPublish, { isLoading: isPublishing }] =
    useTogglePostPublishMutation();

  const post = data?.data;

  const handleEdit = () => {
    router.push(`/dashboard/posts/${params.slug}/edit`);
  };

  const handleTogglePublish = async () => {
    if (!post) return;
    const loadingToastId = toast.loading('Updating Publish status...');

    try {
      await togglePostPublish(post.id).unwrap();
      toast.dismiss(loadingToastId);
      toast.success('Publish status updated successfully');
    } catch (error) {
      console.error('Error toggling publish status:', error);
      const { message } = extractApiError(error);
      toast.error(message);
    }
  };

  const handleToggleFeature = async () => {
    if (!post) return;
    const loadingToastId = toast.loading('Updating Featured status...');

    try {
      await togglePostFeatured(post.id).unwrap();
      toast.dismiss(loadingToastId);
      toast.success('Featured status updated successfully');
    } catch (error) {
      console.error('Error toggling feature status:', error);
      const { message } = extractApiError(error);
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  const errorMessage = extractApiError(error) || 'An unknown error occurred';

  if (isError || !post) {
    return (
      <ErrorMessage
        error={errorMessage}
        onRetry={refetch}
        title="An Error Occurred"
      />
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <PostPreview
        post={post}
        onEdit={handleEdit}
        onTogglePublish={handleTogglePublish}
        onToggleFeature={handleToggleFeature}
        isLoading={isPublishing || isFeaturing}
      />
    </div>
  );
}
