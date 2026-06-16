// src/components/dashboard/DashboardRecentActivity.tsx
import Link from 'next/link';
import { FileText, CalendarDays, GraduationCap, FolderKanban } from 'lucide-react';
import {
  IRecentContentItem,
  DashboardContentType,
} from '@/types/dashboard.types';

const typeMeta: Record<
  DashboardContentType,
  { label: string; icon: typeof FileText }
> = {
  post: { label: 'Post', icon: FileText },
  event: { label: 'Event', icon: CalendarDays },
  guide: { label: 'Guide', icon: GraduationCap },
  project: { label: 'Project', icon: FolderKanban },
  photo: { label: 'Photo', icon: FileText },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function DashboardRecentActivity({
  items,
}: {
  items: IRecentContentItem[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-semibold text-card-foreground mb-4">
        Recent activity
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No content created yet.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const meta = typeMeta[item.type];
            const Icon = meta.icon;
            return (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 py-3 group"
                >
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {meta.label} · {timeAgo(item.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      item.isPublished
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {item.isPublished ? 'Published' : 'Draft'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
