import { useLocation } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { usePageHistory } from '@/utils/hooks/usePageHistory';
import Navbar from '@/components/Navbar';
import { AppSidebar } from './layouts/sidebar';

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
        <SidebarInset className="z-0 flex flex-col">
          <Navbar />
          <main className="h-[calc(100vh-48px)] overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
