import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Permissions from '@/pages/Permissions';
import PermissionsManagement from '@/pages/PermissionsManagement';
import AllServices from '@/pages/AllServices';
import AllResources from '@/pages/AllResources';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import VerifyEmail from '@/pages/VerifyEmail';
import ResetPassword from '@/pages/ResetPassword';
import Providers from '@/components/Providers';
import ToastProvider from '@/components/ToastProvider';
import ClientLayout from '@/components/ClientLayout';

function AppContent() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <>
      <ToastProvider />
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={
            isAuthenticated ? (
              <ClientLayout>
                <Dashboard />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/permissions" element={
            isAuthenticated ? (
              <ClientLayout>
                <Permissions />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/permissions/:id" element={
            isAuthenticated ? (
              <ClientLayout>
                <Permissions />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/permissions-management" element={
            isAuthenticated ? (
              <ClientLayout>
                <PermissionsManagement />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/permissions-management/:id" element={
            isAuthenticated ? (
              <ClientLayout>
                <PermissionsManagement />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/all-services" element={
            isAuthenticated ? (
              <ClientLayout>
                <AllServices />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/all-resources" element={
            isAuthenticated ? (
              <ClientLayout>
                <AllResources />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </Router>
    </>
  );
}

function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

export default App; 