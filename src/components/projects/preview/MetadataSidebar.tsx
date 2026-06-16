// src/components/projects/preview/ProjectMetadataSidebar.tsx
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Globe, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { IProject } from '@/types/projects/project.types';
import { format } from 'date-fns';

interface ProjectMetadataSidebarProps {
  project: IProject;
}

export default function ProjectMetadataSidebar({
  project,
}: ProjectMetadataSidebarProps) {
  const projectViewLink = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${project.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(projectViewLink)
      .then(() => {
        toast.success('Project link copied successfully!');
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
        toast.error('Failed to copy link.');
      });
  };

  const formatSafeDate = (date?: string | Date | null) => {
    if (!date) return 'N/A';

    const parsed = date instanceof Date ? date : new Date(date);

    return isNaN(parsed.getTime())
      ? 'Invalid date'
      : format(parsed, 'MMM dd, yyyy • HH:mm');
  };

  return (
    <div className="space-y-6">
      {/* Author Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2 lg:mb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Author
        </h3>
        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <User className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <p className="font-semibold text-foreground text-base sm:text-lg line-clamp-2">
              {project.author.fullname}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.author.email}
            </p>
          </div>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Statistics
        </h3>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 justify-between py-3 px-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Read Time
              </span>
            </div>
            <Badge variant="secondary">{project.readTime} min</Badge>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Project Details
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg border border-border">
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>
            <Badge variant={project.isPublished ? 'default' : 'secondary'}>
              {project.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>Project View Link</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="text-xs sm:text-sm bg-background px-3 py-1.5 rounded border border-border w-full overflow-x-auto font-mono hover:bg-muted/50 text-left cursor-pointer whitespace-nowrap"
            >
              {projectViewLink}
            </button>
          </div>

          <div className="flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg border border-border">
            <span className="text-sm font-medium text-muted-foreground">
              Created
            </span>
            <span className="text-xs sm:text-sm font-semibold">
              {formatSafeDate(project.createdAt)}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg border border-border">
            <span className="text-sm font-medium text-muted-foreground">
              Updated
            </span>
            <span className="text-xs sm:text-sm font-semibold">
              {formatSafeDate(project.updatedAt)}
            </span>
          </div>

          {project.isPublished && (
            <div className="flex justify-between items-center py-3 px-4 bg-primary/5 rounded-lg border border-primary/20">
              <span className="text-sm font-medium text-primary">
                Published
              </span>
              <span className="text-xs sm:text-sm font-semibold">
                {formatSafeDate(project.publishDate)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
