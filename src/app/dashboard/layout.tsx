// src/app/dashboard/layout.tsx
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import DashboardHeader from '@/components/dashboard/DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        {/* <DashboardFooter /> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
