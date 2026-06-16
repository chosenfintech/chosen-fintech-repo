// src/components/dashboard/DashboardModuleCard.tsx
import Link from 'next/link';
import { ArrowRight, Star, LucideIcon } from 'lucide-react';
import { IContentModuleStats } from '@/types/dashboard.types';

interface DashboardModuleCardProps {
  label: string;
  icon: LucideIcon;
  stats: IContentModuleStats;
  href: string;
}

export function DashboardModuleCard({
  label,
  icon: Icon,
  stats,
  href,
}: DashboardModuleCardProps) {
  const publishedPct =
    stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <p className="font-semibold text-card-foreground">{label}</p>
        </div>
        <p className="text-2xl font-bold text-card-foreground">
          {stats.total.toLocaleString()}
        </p>
      </div>

      {/* Published / draft distribution */}
      <div className="space-y-1.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${publishedPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {stats.published} published
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            {stats.unpublished} draft
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-amber-500" />
          {stats.featured} featured
        </span>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-1.5 transition-all"
        >
          Manage
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
