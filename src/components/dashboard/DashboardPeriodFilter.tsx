// src/components/dashboard/DashboardPeriodFilter.tsx
import { DashboardPeriod } from '@/types/dashboard.types';

interface DashboardPeriodFilterProps {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
  from: string;
  to: string;
  onRangeChange: (range: { from: string; to: string }) => void;
}

const periods: { label: string; value: DashboardPeriod }[] = [
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'All Time', value: 'all_time' },
  { label: 'Custom', value: 'custom' },
];

export function DashboardPeriodFilter({
  value,
  onChange,
  from,
  to,
  onRangeChange,
}: DashboardPeriodFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex gap-2 flex-wrap"
        role="group"
        aria-label="Filter dashboard by time period"
      >
        {periods.map((period) => {
          const isActive = value === period.value;
          return (
            <button
              key={period.value}
              type="button"
              onClick={() => onChange(period.value)}
              aria-pressed={isActive}
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

      {value === 'custom' && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="dashboard-from"
              className="text-xs font-medium text-muted-foreground"
            >
              From
            </label>
            <input
              id="dashboard-from"
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => onRangeChange({ from: e.target.value, to })}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="dashboard-to"
              className="text-xs font-medium text-muted-foreground"
            >
              To
            </label>
            <input
              id="dashboard-to"
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => onRangeChange({ from, to: e.target.value })}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      )}
    </div>
  );
}
