// src/components/posts/preview/Header.tsx
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Eye, EyeOff, Star, StarOff } from 'lucide-react';
import { IPost } from '@/types/posts/post.types';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { formatDistanceToNow } from 'date-fns';

interface PostPreviewHeaderProps {
  post: IPost;
  onEdit?: () => void;
  onTogglePublish?: () => void;
  onToggleFeature?: () => void;
  isLoading?: boolean;
}

export default function PostPreviewHeader({
  post,
  onEdit,
  onTogglePublish,
  onToggleFeature,
  isLoading = false,
}: PostPreviewHeaderProps) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);

  const handlePublishToggle = () => {
    onTogglePublish?.();
    setShowPublishDialog(false);
  };

  const handleFeatureToggle = () => {
    onToggleFeature?.();
    setShowFeatureDialog(false);
  };

  return (
    <>
      <div className="bg-primary/10 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg mb-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col gap-3">
              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {post.isPublished ? (
                  <Badge className="bg-primary/15 text-primary border border-primary/30 px-3 py-1">
                    <Eye className="w-3 h-3 mr-1" /> Published
                  </Badge>
                ) : (
                  <Badge className="bg-muted text-muted-foreground border border-border px-3 py-1">
                    <EyeOff className="w-3 h-3 mr-1" /> Draft
                  </Badge>
                )}

                {post.isFeatured && (
                  <Badge className="bg-accent text-accent-foreground border border-border px-3 py-1">
                    <Star className="w-3 h-3 mr-1" /> Featured
                  </Badge>
                )}

                {post.category && (
                  <Badge className="bg-secondary text-secondary-foreground border border-border px-3 py-1">
                    {post.category.name}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                  {post.excerpt}
                </p>
              )}

              {/* Date */}
              <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Published{' '}
                  {post.publishDate
                    ? formatDistanceToNow(new Date(post.publishDate), {
                        addSuffix: true,
                      })
                    : 'N/A'}
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {onEdit && (
              <Button
                onClick={onEdit}
                disabled={isLoading}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </Button>
            )}

            {onTogglePublish && (
              <Button
                onClick={() => setShowPublishDialog(true)}
                disabled={isLoading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {post.isPublished ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
            )}

            {onToggleFeature && (
              <Button
                onClick={() => setShowFeatureDialog(true)}
                disabled={isLoading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {post.isFeatured ? (
                  <>
                    <StarOff className="w-4 h-4 mr-2" />
                    Unfeature
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Feature
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Publish Dialog */}
      <ConfirmationDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        onConfirm={handlePublishToggle}
        title={post.isPublished ? 'Unpublish Post?' : 'Publish Post?'}
        description={
          post.isPublished
            ? 'This post will no longer be visible to the public.'
            : 'This post will be visible to all users.'
        }
        confirmText={post.isPublished ? 'Unpublish' : 'Publish'}
        isDestructive={post.isPublished}
      />

      {/* Feature Dialog */}
      <ConfirmationDialog
        open={showFeatureDialog}
        onOpenChange={setShowFeatureDialog}
        onConfirm={handleFeatureToggle}
        title={post.isFeatured ? 'Remove from Featured?' : 'Feature Post?'}
        description={
          post.isFeatured
            ? 'This post will be removed from the featured section.'
            : 'This post will be highlighted in the featured section.'
        }
        confirmText={post.isFeatured ? 'Remove' : 'Feature'}
      />
    </>
  );
}
