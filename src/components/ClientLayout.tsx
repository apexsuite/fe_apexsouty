import { useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - desktop & mobile */}
      <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      {/* Main content */}
      <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-h-screen">
        <Navbar minimal={false} onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 