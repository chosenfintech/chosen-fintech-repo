// src/components/posts/detail/AuthorMetaCard.tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { IPost } from '@/types/posts/post.types';
import { format } from 'date-fns';

interface AuthorMetaCardProps {
  post: IPost;
}

const formatSafeDate = (date?: string | Date | null) => {
  if (!date) return 'N/A';
  const parsed = date instanceof Date ? date : new Date(date);
  return isNaN(parsed.getTime())
    ? 'Invalid date'
    : format(parsed, 'MMM dd, yyyy');
};

export const AuthorMetaCard: React.FC<AuthorMetaCardProps> = ({ post }) => {
  return (
    <div className="flex items-center gap-3 py-4 border-b border-border">
      <Avatar className="w-9 h-9 shrink-0">
        <AvatarFallback className="bg-muted text-muted-foreground">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">
          {post.author.fullname}
        </span>
        <span className="hidden sm:inline text-muted-foreground text-xs">
          ·
        </span>
        <span className="text-xs text-muted-foreground">
          {formatSafeDate(post.publishDate)}
        </span>
        <span className="hidden sm:inline text-muted-foreground text-xs">
          ·
        </span>
        <span className="text-xs text-muted-foreground">
          {post.readTime} min read
        </span>
      </div>
    </div>
  );
};
