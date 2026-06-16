// src/components/projects/preview/Header.tsx
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Eye, EyeOff, Star, StarOff } from 'lucide-react';
import { IProject } from '@/types/projects/project.types';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { formatDistanceToNow } from 'date-fns';

interface ProjectPreviewHeaderProps {
  project: IProject;
  onEdit?: () => void;
  onTogglePublish?: () => void;
  onToggleFeature?: () => void;
  isLoading?: boolean;
}

export default function ProjectPreviewHeader({
  project,
  onEdit,
  onTogglePublish,
  onToggleFeature,
  isLoading = false,
}: ProjectPreviewHeaderProps) {
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
                {project.isPublished ? (
                  <Badge className="bg-primary/15 text-primary border border-primary/30 px-3 py-1">
                    <Eye className="w-3 h-3 mr-1" /> Published
                  </Badge>
                ) : (
                  <Badge className="bg-muted text-muted-foreground border border-border px-3 py-1">
                    <EyeOff className="w-3 h-3 mr-1" /> Draft
                  </Badge>
                )}

                {project.isFeatured && (
                  <Badge className="bg-accent text-accent-foreground border border-border px-3 py-1">
                    <Star className="w-3 h-3 mr-1" /> Featured
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                {project.title}
              </h1>

              {/* Description */}
              {project.description && (
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                  {project.description}
                </p>
              )}

              {/* Date */}
              <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Published{' '}
                  {project.publishDate
                    ? formatDistanceToNow(new Date(project.publishDate), {
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
                Edit Project
              </Button>
            )}

            {onTogglePublish && (
              <Button
                onClick={() => setShowPublishDialog(true)}
                disabled={isLoading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {project.isPublished ? (
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
                {project.isFeatured ? (
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
        title={project.isPublished ? 'Unpublish Project?' : 'Publish Project?'}
        description={
          project.isPublished
            ? 'This project will no longer be visible to the public.'
            : 'This project will be visible to all users.'
        }
        confirmText={project.isPublished ? 'Unpublish' : 'Publish'}
        isDestructive={project.isPublished}
      />

      {/* Feature Dialog */}
      <ConfirmationDialog
        open={showFeatureDialog}
        onOpenChange={setShowFeatureDialog}
        onConfirm={handleFeatureToggle}
        title={project.isFeatured ? 'Remove from Featured?' : 'Feature Project?'}
        description={
          project.isFeatured
            ? 'This project will be removed from the featured section.'
            : 'This project will be highlighted in the featured section.'
        }
        confirmText={project.isFeatured ? 'Remove' : 'Feature'}
      />
    </>
  );
}
