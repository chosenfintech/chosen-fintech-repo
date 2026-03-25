// src/components/dashboard/DashboardSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  Images,
  ChevronDown,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '../ui/sidebar';

interface SubmenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
}

interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuItem[];
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Posts',
    path: '/dashboard/posts',
    icon: FileText,
    hasSubmenu: true,
    submenuItems: [
      {
        name: 'All Posts',
        path: '/dashboard/posts',
      },
      {
        name: 'Categories',
        path: '/dashboard/posts/categories',
      },
    ],
  },
  {
    name: 'Gallery',
    path: '/dashboard/gallery',
    icon: Images,
    hasSubmenu: true,
    submenuItems: [
      {
        name: 'Gallery',
        path: '/dashboard/gallery',
      },
      {
        name: 'Categories',
        path: '/dashboard/gallery/categories',
      },
    ],
  },
];

export default function DashboardSidebar() {
  const { isMobile, setOpenMobile, state } = useSidebar();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const isCollapsed = state === 'collapsed';

  const toggleSubmenu = (itemName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName],
    );
  };

  const isSubmenuItemActive = (submenuItems: SubmenuItem[]) => {
    return submenuItems.some((subItem) => pathname === subItem.path);
  };

  const isRouteActive = (itemPath: string) => {
    return pathname === itemPath;
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/20 shadow-sm"
    >
      <SidebarHeader className="flex flex-row items-center justify-between my-5 lg:h-20">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {!isCollapsed && (
            <>
              <Image
                src="/logo.jpg"
                alt="Chosen Fintech Logo"
                width={28}
                height={28}
                className="text-sidebar-primary shrink-0"
              />
              <span className="text-lg md:text-xl font-bold truncate text-sidebar-foreground">
                Chosen Fintech
              </span>
            </>
          )}
        </div>
        <SidebarTrigger className={`shrink-0 ${isCollapsed && 'pr-4'}`} />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu className="space-y-1.5">
          {navigationItems.map((item) => {
            const hasActiveSubmenu =
              item.hasSubmenu && item.submenuItems
                ? isSubmenuItemActive(item.submenuItems)
                : false;
            const isActive = !item.hasSubmenu && isRouteActive(item.path);
            const isExpanded = expandedMenus.includes(item.name);
            const shouldShowAsActive = isActive || hasActiveSubmenu;

            return (
              <SidebarMenuItem key={item.path}>
                {item.hasSubmenu ? (
                  <>
                    <SidebarMenuButton
                      onClick={() => toggleSubmenu(item.name)}
                      tooltip={item.name}
                      className={`px-4 py-3 gap-4 hover:bg-sidebar-foreground/10 transition-colors cursor-pointer ${
                        shouldShowAsActive
                          ? 'bg-sidebar-primary/10 text-sidebar-primary font-medium border-l-4 border-sidebar-primary'
                          : 'text-sidebar-foreground/90'
                      }`}
                    >
                      <item.icon
                        className={`h-6 w-6 ${
                          shouldShowAsActive ? 'text-sidebar-primary' : ''
                        }`}
                      />
                      <span className="ml-3 flex-1">{item.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </SidebarMenuButton>
                    {isExpanded && item.submenuItems && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenuItems.map((subItem) => {
                          const isSubItemActive = pathname === subItem.path;
                          return (
                            <SidebarMenuButton
                              key={subItem.path}
                              asChild
                              isActive={isSubItemActive}
                              tooltip={subItem.name}
                              className={`px-4 py-2 gap-3 hover:bg-sidebar-foreground/10 transition-colors ${
                                isSubItemActive
                                  ? 'bg-sidebar-primary/10 text-sidebar-primary font-medium'
                                  : 'text-sidebar-foreground/70'
                              }`}
                            >
                              <Link
                                href={subItem.path}
                                className="flex items-center w-full"
                                onClick={handleLinkClick}
                              >
                                <div
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    isSubItemActive
                                      ? 'bg-sidebar-primary'
                                      : 'bg-sidebar-foreground/40'
                                  }`}
                                />
                                <span className="ml-3">{subItem.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.name}
                    className={`px-4 py-3 gap-4 hover:bg-sidebar-foreground/10 transition-colors ${
                      isActive
                        ? 'bg-sidebar-primary/10 text-sidebar-primary font-medium border-l-4 border-sidebar-primary'
                        : 'text-sidebar-foreground/90'
                    }`}
                  >
                    <Link
                      href={item.path}
                      className="flex items-center w-full"
                      onClick={handleLinkClick}
                    >
                      <item.icon
                        className={`h-6 w-6 ${isActive ? 'text-sidebar-primary' : ''}`}
                      />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border/20">
        <SidebarMenuButton className="flex items-center gap-3 text-sidebar-foreground">
          <div className="text-[12px] text-sidebar-foreground/70">
            Chosen Fintech
          </div>
        </SidebarMenuButton>
      </SidebarFooter>

      <SidebarRail className="bg-sidebar-foreground/5 w-1" />
    </Sidebar>
  );
}
