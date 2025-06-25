import { useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen">
        <Navbar minimal />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 