// src/components/dashboard/DashboardStatsGrid.tsx
'use client';
import * as React from 'react';
import {
  FileText,
  CalendarDays,
  GraduationCap,
  FolderKanban,
  Images,
  Layers,
  Users,
  ShieldCheck,
  UserRound,
  CheckCircle,
  EyeOff,
  LayoutDashboard,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useGetDashboardStatsQuery } from '@/redux/dashboard-api';
import { DashboardStatsCard } from './DashboardStatsCard';
import { DashboardModuleCard } from './DashboardModuleCard';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { DashboardPeriodFilter } from './DashboardPeriodFilter';
import { DashboardStatsSkeleton } from './DashboardStatsSkeleton';
import { DashboardPeriod } from '@/types/dashboard.types';
import ErrorMessage from '@/components/ui/ErrorMessage';

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name} 👋`;
  if (hour < 17) return `Good afternoon, ${name} 👋`;
  return `Good evening, ${name} 👋`;
}

export function DashboardStatsGrid() {
  const [period, setPeriod] = React.useState<DashboardPeriod>('all_time');

  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.fullname?.split(' ')[0] ?? 'there';

  const { data, isLoading, isError, refetch } = useGetDashboardStatsQuery({
    period,
  });

  const stats = data?.data;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting(firstName)}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s an overview of everything across your site.
        </p>
      </div>

      <DashboardPeriodFilter value={period} onChange={setPeriod} />

      {isLoading ? (
        <DashboardStatsSkeleton />
      ) : isError || !stats ? (
        <ErrorMessage
          error="Could not load dashboard stats. Please check your connection and try again."
          onRetry={refetch}
        />
      ) : (
        <>
          {/* Overview */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Overview
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <DashboardStatsCard
                label="Total Content"
                value={stats.totals.content}
                icon={LayoutDashboard}
                variant="default"
              />
              <DashboardStatsCard
                label="Published"
                value={stats.totals.published}
                icon={CheckCircle}
                variant="success"
              />
              <DashboardStatsCard
                label="Drafts"
                value={stats.totals.drafts}
                icon={EyeOff}
                variant="warning"
              />
              <DashboardStatsCard
                label="Gallery Photos"
                value={stats.totals.media}
                icon={Images}
                variant="muted"
              />
            </div>
          </section>

          {/* Content by module */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Content by module
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DashboardModuleCard
                label="Posts"
                icon={FileText}
                stats={stats.posts}
                href="/dashboard/posts"
              />
              <DashboardModuleCard
                label="Events"
                icon={CalendarDays}
                stats={stats.events}
                href="/dashboard/events"
              />
              <DashboardModuleCard
                label="Academy Guides"
                icon={GraduationCap}
                stats={stats.guides}
                href="/dashboard/academy"
              />
              <DashboardModuleCard
                label="Projects"
                icon={FolderKanban}
                stats={stats.projects}
                href="/dashboard/projects"
              />
              {/* Gallery has no featured flag — present its publish split */}
              <DashboardModuleCard
                label="Gallery"
                icon={Images}
                stats={{ ...stats.gallery, featured: 0 }}
                href="/dashboard/gallery/photos"
              />
            </div>
          </section>

          {/* Recent activity + secondary stats */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DashboardRecentActivity items={stats.recent} />
            </div>
            <div className="space-y-4">
              <DashboardStatsCard
                label="Post Categories"
                value={stats.categories.posts}
                icon={Layers}
                variant="muted"
              />
              <DashboardStatsCard
                label="Event Categories"
                value={stats.categories.events}
                icon={Layers}
                variant="muted"
              />
              <DashboardStatsCard
                label="Gallery Categories"
                value={stats.categories.gallery}
                icon={Layers}
                variant="muted"
              />
            </div>
          </section>

          {/* Team */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Team
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <DashboardStatsCard
                label="Total Users"
                value={stats.users.total}
                icon={Users}
                variant="default"
              />
              <DashboardStatsCard
                label="Admins"
                value={stats.users.admins}
                icon={ShieldCheck}
                variant="success"
              />
              <DashboardStatsCard
                label="Editors"
                value={stats.users.regular}
                icon={UserRound}
                variant="muted"
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
