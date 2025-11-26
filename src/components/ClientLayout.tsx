import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { usePageHistory } from '@/utils/hooks/usePageHistory';
import { AppSidebar } from '@/components/layouts/Sidebar';

interface ClientLayoutProps {
  children?: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password';

  usePageHistory();

  if (isAuthPage) {
    return <div className="bg-background min-h-screen">{children}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
