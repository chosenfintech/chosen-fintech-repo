// src/components/posts/detail/AuthorMetaCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Clock, Calendar } from 'lucide-react';
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
    <Card className="bg-muted/30 backdrop-blur-sm w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4 min-w-0 w-full">
          <Avatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-primary/20 shrink-0">
            <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-base sm:text-lg truncate">
              {post.author.fullname}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1.5 shrink-0">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">
                  {formatSafeDate(post.publishDate)}
                </span>
              </span>

              <Separator
                orientation="vertical"
                className="h-4 hidden sm:block"
              />

              <span className="flex items-center gap-1.5 shrink-0">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">
                  {post.readTime} min read
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
