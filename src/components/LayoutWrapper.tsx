import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password';

  if (isAuthPage) {
    return <div className="bg-background min-h-screen">{children}</div>;
  }

  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar - desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content */}
      <div className="ml-0 flex min-h-screen flex-1 flex-col md:ml-64">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
