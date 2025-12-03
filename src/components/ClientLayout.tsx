import { useLocation } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { usePageHistory } from '@/utils/hooks/usePageHistory';

import Navbar from '@/components/layouts/navbar';
import DashboardSidebar from '@/components/layouts/dashboard-sidebar';

interface ClientLayoutProps {
  children?: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { pathname } = useLocation();

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password';

  if (isAuthPage) {
    return <div className="bg-background min-h-screen">{children}</div>;
  }

  usePageHistory();

  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="z-0 flex flex-col">
          <Navbar />
          <div className="h-[calc(100vh-3rem)] overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
