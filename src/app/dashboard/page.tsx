// src/app/dashboard/page.tsx
import { DashboardStatsGrid } from '@/components/dashboard/DashboardStatsGrid';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <DashboardStatsGrid />
    </div>
  );
}
