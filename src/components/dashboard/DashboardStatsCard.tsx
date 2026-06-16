// src/components/dashboard/DashboardStatsCard.tsx
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardStatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'muted';
  /**
   * Comparable value from the previous equal-length period. When provided,
   * the card renders a trend delta (▲/▼ %) versus this baseline.
   */
  previous?: number | null;
}

const variantStyles: Record<
  NonNullable<DashboardStatsCardProps['variant']>,
  { icon: string; badge: string }
> = {
  default: {
    icon: 'bg-primary/10 text-primary',
    badge: 'bg-primary/10 text-primary',
  },
  success: {
    icon: 'bg-green-500/10 text-green-600 dark:text-green-400',
    badge: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  warning: {
    icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  muted: {
    icon: 'bg-muted text-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
};

/** Build the trend descriptor versus the previous period, or null if N/A. */
function getTrend(value: number, previous?: number | null) {
  if (previous === undefined || previous === null) return null;

  const diff = value - previous;
  // No prior baseline to grow from: show "new" only when there's something now.
  if (previous === 0) {
    if (diff === 0) return { dir: 'flat' as const, text: 'No change' };
    return { dir: 'up' as const, text: 'New' };
  }

  const pct = Math.round((diff / previous) * 100);
  if (diff === 0) return { dir: 'flat' as const, text: 'No change' };
  return {
    dir: diff > 0 ? ('up' as const) : ('down' as const),
    text: `${diff > 0 ? '+' : ''}${pct}% vs prev.`,
  };
}

const trendStyles = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
  flat: 'text-muted-foreground',
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

export function DashboardStatsCard({
  label,
  value,
  icon: Icon,
  variant = 'default',
  previous,
}: DashboardStatsCardProps) {
  const styles = variantStyles[variant];
  const trend = getTrend(value, previous);
  const TrendIcon = trend ? trendIcons[trend.dir] : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <div className={`p-2 rounded-lg ${styles.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-card-foreground">
        {value.toLocaleString()}
      </p>
      {trend && TrendIcon && (
        <p
          className={`flex items-center gap-1 text-xs font-medium ${trendStyles[trend.dir]}`}
        >
          <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {trend.text}
        </p>
      )}
    </div>
  );
}
