import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import ScrollToTop from '@/components/ScrollToTop';
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
import AccessDenied from '@/pages/AccessDenied';
import Providers from '@/components/Providers';
import ToastProvider from '@/components/ToastProvider';
import ClientLayout from '@/components/ClientLayout';
import RouteGuard from '@/components/RouteGuard';
import PagesRoute from '@/pages/PagesRoute';
import PageDetailRoute from '@/components/pagesRoute/PageDetailRoute';
import PageFormRoute from '@/components/pagesRoute/PageFormRoute';
import PageRoutePermissionsRoute from '@/pages/PageRoutePermissionsRoute';
import PageRoutePermissionDetailRoute from '@/components/pageRoutePermissions/PageRoutePermissionDetailRoute';
import PageRoutePermissionFormRoute from '@/components/pageRoutePermissions/PageRoutePermissionFormRoute';
import Roles from '@/pages/Roles';
import RoleCreate from '@/pages/RoleCreate';
import RoleEdit from '@/pages/RoleEdit';
import RoleDetail from '@/pages/RoleDetail';
import Products from '@/pages/Products';
import ProductCreate from '@/pages/ProductCreate';
import ProductEdit from '@/pages/ProductEdit';
import ProductDetail from '@/pages/ProductDetail';
import PriceDetail from '@/pages/PriceDetail';
import BillingForm from '@/components/billing/BillingForm';
import Marketplaces from '@/pages/Marketplaces';
import MarketplaceDetail from '@/pages/MarketplaceDetail';
import MarketplaceEdit from '@/pages/MarketplaceEdit';
import MarketplaceCreate from '@/pages/MarketplaceCreate';
import Consents from '@/pages/Consents';
import PermissionTest from '@/components/PermissionTest';
import NewPermissionExamples from '@/examples/NewPermissionExamples';
import { usePermissionFetcher } from '@/lib/usePermissionFetcher';

// Permission wrapper component - Router içinde çalışır
function PermissionWrapper() {
  usePermissionFetcher();
  // usePagePermissions(); // Infinite loop'u önlemek için geçici olarak kapatıldı
  return null;
}

function AppContent() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <>
      <ToastProvider />
      <Router>
        <ScrollToTop />
        <PermissionWrapper />
        <RouteGuard>
          <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/access-denied" element={<AccessDenied />} />
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
          <Route path="/page-routes" element={
            isAuthenticated ? (
              <ClientLayout>
                <PagesRoute />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/page-routes/:id" element={
            isAuthenticated ? (
              <ClientLayout>
                <PageDetailRoute />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/page-routes/create" element={
            isAuthenticated ? (
              <ClientLayout>
                <PageFormRoute />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/page-routes/:id/edit" element={
            isAuthenticated ? (
              <ClientLayout>
                <PageFormRoute />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
          {/* Page Route Permissions Routes */}
          <Route path="/page-route-permissions" element={
            isAuthenticated ? (
              <ClientLayout>
                <PageRoutePermissionsRoute />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/page-route-permissions/:pageRouteId/permissions" element={
            isAuthenticated ? (
              <ClientLayout>
                <PageRoutePermissionsRoute />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/page-route-permissions/:pageRouteId/permissions/:permissionId" element={
            isAuthenticated ? (
              <ClientLayout>
                <PageRoutePermissionDetailRoute />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/page-route-permissions/:pageRouteId/permissions/create" element={
            isAuthenticated ? (
              <ClientLayout>
                <PageRoutePermissionFormRoute />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/page-route-permissions/:pageRouteId/permissions/:permissionId/edit" element={
            isAuthenticated ? (
              <ClientLayout>
                <PageRoutePermissionFormRoute />
              </ClientLayout>
            ) : (
              <Navigate to="/login" />
            )
          } />
          
                     {/* Roles Routes */}
           <Route path="/roles" element={
             isAuthenticated ? (
               <ClientLayout>
                 <Roles />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/roles/create" element={
             isAuthenticated ? (
               <ClientLayout>
                 <RoleCreate />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/roles/:id" element={
             isAuthenticated ? (
               <ClientLayout>
                 <RoleDetail />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/roles/:id/edit" element={
             isAuthenticated ? (
               <ClientLayout>
                 <RoleEdit />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           
           {/* Products Routes */}
           <Route path="/products" element={
             isAuthenticated ? (
               <ClientLayout>
                 <Products />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/products/create" element={
             isAuthenticated ? (
               <ClientLayout>
                 <ProductCreate />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/products/:productId" element={
             isAuthenticated ? (
               <ClientLayout>
                 <ProductDetail />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/products/:productId/edit" element={
             isAuthenticated ? (
               <ClientLayout>
                 <ProductEdit />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/products/:productId/prices/:priceId" element={
             isAuthenticated ? (
               <ClientLayout>
                 <PriceDetail />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           
           {/* Billing Routes */}
           <Route path="/billings" element={
             isAuthenticated ? (
               <ClientLayout>
                 <BillingForm />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           
           {/* Marketplaces Routes */}
           <Route path="/marketplaces" element={
             isAuthenticated ? (
               <ClientLayout>
                 <Marketplaces />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/marketplaces/:id" element={
             isAuthenticated ? (
               <ClientLayout>
                 <MarketplaceDetail />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/marketplaces/:id/edit" element={
             isAuthenticated ? (
               <ClientLayout>
                 <MarketplaceEdit />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/marketplaces/create" element={
             isAuthenticated ? (
               <ClientLayout>
                 <MarketplaceCreate />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           
           {/* Consents Routes */}
           <Route path="/consents" element={
             isAuthenticated ? (
               <ClientLayout>
                 <Consents />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           
           {/* Permission Test Routes */}
           <Route path="/permission-test" element={
             isAuthenticated ? (
               <ClientLayout>
                 <PermissionTest />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
           
           <Route path="/permission-examples" element={
             isAuthenticated ? (
               <ClientLayout>
                 <NewPermissionExamples />
               </ClientLayout>
             ) : (
               <Navigate to="/login" />
             )
           } />
          </Routes>
        </RouteGuard>
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