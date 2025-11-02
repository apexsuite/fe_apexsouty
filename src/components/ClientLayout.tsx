import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { usePageHistory } from '@/utils/hooks/usePageHistory';

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  usePageHistory();

  if (isAuthPage) {
    return <div className="bg-background min-h-screen">{children}</div>;
  }

  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar - desktop & mobile */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      {/* Main content */}
      <div className="ml-0 flex min-h-screen flex-1 flex-col lg:ml-64">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
