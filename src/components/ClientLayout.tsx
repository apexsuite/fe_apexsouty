import { useLocation } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { usePageHistory } from '@/utils/hooks/usePageHistory';
import { AppSidebar } from '@/components/layouts/Sidebar';
import Navbar from '@/components/Navbar';

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
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <Navbar />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
