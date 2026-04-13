// src/components/dashboard/DashboardStatsCard.tsx
import { LucideIcon } from 'lucide-react';

interface DashboardStatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'muted';
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

export function DashboardStatsCard({
  label,
  value,
  icon: Icon,
  variant = 'default',
}: DashboardStatsCardProps) {
  const styles = variantStyles[variant];

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
    </div>
  );
}
