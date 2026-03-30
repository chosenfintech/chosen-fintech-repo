// src/components/dashboard/DashboardHeader.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { LayoutDashboard } from 'lucide-react';
import UserProfileDropdown from '../users/UserProfileDropdown';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { pageConfigs } from '@/static-data/dashboard-header';

interface DashboardHeaderProps {
  additionalContent?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  const currentPageConfig = pageConfigs.find((config) => {
    if (config.dynamicPaths) {
      const dynamicMatch = config.dynamicPaths.some((regex) =>
        regex.test(pathname),
      );
      if (dynamicMatch) return true;
    }

    return config.paths.some((path) => {
      if (config.exact) return pathname === path;
      return pathname === path || pathname.startsWith(path + '/');
    });
  });

  const fallbackConfig = {
    title: 'Dashboard',
    description: 'Admin dashboard',
    icon: LayoutDashboard,
  };

  const pageConfig = currentPageConfig || fallbackConfig;

  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 px-4 lg:px-8 py-3 lg:py-4">
      {/* Mobile only: Trigger + Profile */}
      <div className="flex items-center justify-between mb-3 md:hidden">
        <SidebarTrigger />
        <UserProfileDropdown />
      </div>

      {/* Mobile/Tablet: Title + Description */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-foreground">
                {pageConfig.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {pageConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tablet only */}
        <div className="hidden md:flex lg:hidden items-center gap-3 shrink-0">
          <UserProfileDropdown />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between h-20">
        <div className="flex-1 flex justify-start">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {pageConfig.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {pageConfig.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="hidden xl:block text-right">
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <p className="text-sm font-semibold text-foreground">
                {user.fullname}
              </p>
            </div>
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
