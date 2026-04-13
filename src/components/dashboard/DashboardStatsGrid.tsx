// src/components/dashboard/DashboardStatsGrid.tsx
'use client';
import * as React from 'react';
import {
  FileText,
  CheckCircle,
  EyeOff,
  Star,
  Images,
  FolderOpen,
  Users,
  ShieldCheck,
  UserRound,
  Camera,
  Layers,
  Image,
  LayoutDashboard,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useGetDashboardStatsQuery } from '@/redux/dashboard-api';
import { DashboardStatsCard } from './DashboardStatsCard';
import { DashboardPeriodFilter } from './DashboardPeriodFilter';
import { DashboardStatsSkeleton } from './DashboardStatsSkeleton';
import { DashboardPeriod } from '@/types/dashboard.types';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';

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

  if (isLoading) return <DashboardStatsSkeleton />;

  if (isError) {
    return (
      <ErrorMessage
        error="Could not load dashboard stats. Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  if (!stats) {
    return (
      <EmptyState
        icon={LayoutDashboard}
        title="No Stats Available"
        description="There's no data to display yet. Stats will appear here once content is added to the system."
        showCreateButton={false}
      />
    );
  }

  const cards = [
    // Posts
    {
      label: 'Total Posts',
      value: stats.posts.total,
      icon: FileText,
      variant: 'default' as const,
    },
    {
      label: 'Published Posts',
      value: stats.posts.published,
      icon: CheckCircle,
      variant: 'success' as const,
    },
    {
      label: 'Unpublished Posts',
      value: stats.posts.unpublished,
      icon: EyeOff,
      variant: 'warning' as const,
    },
    {
      label: 'Featured Posts',
      value: stats.posts.featured,
      icon: Star,
      variant: 'default' as const,
    },
    // Gallery
    {
      label: 'Total Photos',
      value: stats.gallery.total,
      icon: Images,
      variant: 'default' as const,
    },
    {
      label: 'Published Photos',
      value: stats.gallery.published,
      icon: Camera,
      variant: 'success' as const,
    },
    {
      label: 'Unpublished Photos',
      value: stats.gallery.unpublished,
      icon: Image,
      variant: 'warning' as const,
    },
    // Categories
    {
      label: 'Post Categories',
      value: stats.categories.posts,
      icon: FolderOpen,
      variant: 'muted' as const,
    },
    {
      label: 'Gallery Categories',
      value: stats.categories.gallery,
      icon: Layers,
      variant: 'muted' as const,
    },
    // Users
    {
      label: 'Total Admins',
      value: stats.users.total,
      icon: Users,
      variant: 'default' as const,
    },
    {
      label: 'Super Admins',
      value: stats.users.admins,
      icon: ShieldCheck,
      variant: 'success' as const,
    },
    {
      label: 'Regular Admins',
      value: stats.users.regular,
      icon: UserRound,
      variant: 'muted' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting(firstName)}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your content.
        </p>
      </div>

      {/* Period filter */}
      <DashboardPeriodFilter value={period} onChange={setPeriod} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <DashboardStatsCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            variant={card.variant}
          />
        ))}
      </div>
    </div>
  );
}
