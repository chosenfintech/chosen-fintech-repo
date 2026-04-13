// src/components/dashboard/DashboardPeriodFilter.tsx
import { DashboardPeriod } from '@/types/dashboard.types';

interface DashboardPeriodFilterProps {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
}

const periods: { label: string; value: DashboardPeriod }[] = [
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'All Time', value: 'all_time' },
];

export function DashboardPeriodFilter({
  value,
  onChange,
}: DashboardPeriodFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {periods.map((period) => {
        const isActive = value === period.value;
        return (
          <button
            key={period.value}
            onClick={() => onChange(period.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
}
