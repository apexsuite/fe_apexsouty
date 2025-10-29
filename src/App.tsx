import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';
import { requestAmazonConsentCallback } from '@/lib/consentSlice';
import { useErrorHandler } from '@/lib/useErrorHandler';
import ScrollToTop from '@/components/ScrollToTop';
import Providers from '@/components/Providers';
import ToastProvider from '@/components/ToastProvider';
import ClientLayout from '@/components/ClientLayout';
import RouteGuard from '@/components/RouteGuard';
import { usePermissionFetcher } from '@/lib/usePermissionFetcher';

// Lazy loading for pages
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Permissions = lazy(() => import('@/pages/Permissions'));
const PermissionsManagement = lazy(() => import('@/pages/PermissionsManagement'));
const AllServices = lazy(() => import('@/pages/AllServices'));
const AllResources = lazy(() => import('@/pages/AllResources'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AccessDenied = lazy(() => import('@/pages/AccessDenied'));
const PagesRoute = lazy(() => import('@/pages/PagesRoute'));
const PageDetailRoute = lazy(() => import('@/components/pagesRoute/PageDetailRoute'));
const PageFormRoute = lazy(() => import('@/components/pagesRoute/PageFormRoute'));
const PageRoutePermissionsRoute = lazy(() => import('@/pages/PageRoutePermissionsRoute'));
const PageRoutePermissionDetailRoute = lazy(() => import('@/components/pageRoutePermissions/PageRoutePermissionDetailRoute'));
const PageRoutePermissionFormRoute = lazy(() => import('@/components/pageRoutePermissions/PageRoutePermissionFormRoute'));
const Roles = lazy(() => import('@/pages/Roles'));
const RoleCreate = lazy(() => import('@/pages/RoleCreate'));
const RoleEdit = lazy(() => import('@/pages/RoleEdit'));
const RoleDetail = lazy(() => import('@/pages/RoleDetail'));
const Products = lazy(() => import('@/pages/Products'));
const ProductCreate = lazy(() => import('@/pages/ProductCreate'));
const ProductEdit = lazy(() => import('@/pages/ProductEdit'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const PriceDetail = lazy(() => import('@/pages/PriceDetail'));
const BillingForm = lazy(() => import('@/components/billing/BillingForm'));
const Marketplaces = lazy(() => import('@/pages/Marketplaces'));
const MarketplaceDetail = lazy(() => import('@/pages/MarketplaceDetail'));
const MarketplaceEdit = lazy(() => import('@/pages/MarketplaceEdit'));
const MarketplaceCreate = lazy(() => import('@/pages/MarketplaceCreate'));
const Consents = lazy(() => import('@/pages/Consents'));
const PermissionTest = lazy(() => import('@/components/PermissionTest'));
const NewPermissionExamples = lazy(() => import('@/examples/NewPermissionExamples'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function PermissionWrapper() {
  usePermissionFetcher();
  return null;
}

function AppContent() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  function QueryParamHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { handleError } = useErrorHandler();
    
    React.useEffect(() => {
      const params = new URLSearchParams(location.search);
      // Senaryo 1: Amazon ürün yetkilendirme başlatma
      // Query params: amazon_callback_uri, amazon_state, selling_partner_id
      const amazonCallbackUri = params.get('amazon_callback_uri');
      const amazonState = params.get('amazon_state');
      const sellingPartnerId = params.get('selling_partner_id');
      
      // Senaryo 2: Amazon callback validate
      // Query params: state, selling_partner_id, spapi_oauth_code
      const state = params.get('state');
      const spapiOauthCode = params.get('spapi_oauth_code');
      const validateSellingPartnerId = params.get('selling_partner_id');
      
      // Senaryo 1 kontrolü
      if (amazonCallbackUri && amazonState && sellingPartnerId) {
        if (isAuth) {
          // Senaryo 1.1: Kullanıcı zaten login olmuş
          dispatch(requestAmazonConsentCallback({
            amazonCallbackUri,
            amazonState,
            sellingPartnerId,
          }))
          .unwrap()
          .then((response) => {
            const redirectUrl = response?.url || response?.data?.url || response?.redirectUrl || response?.data?.redirectUrl || response;
            if (redirectUrl && typeof redirectUrl === 'string') {
              window.location.href = redirectUrl;
            } else {
              handleError({ message: 'Authorization URL not found in response' });
            }
          })
          .catch((error: any) => {
            handleError(error);
          });
        } else {
          // Senaryo 1.2: Kullanıcı login olmamış - query param'ları kaydet
          localStorage.setItem(
            'pendingAmazonCallbackParams',
            JSON.stringify({ amazonCallbackUri, amazonState, sellingPartnerId })
          );
          navigate('/login', { replace: true });
        }
        return; // Senaryo 1 işlendi, diğer kontrollere geçme
      }
      
      // Senaryo 2 kontrolü
      if (state && validateSellingPartnerId && spapiOauthCode) {
        if (isAuth) {
          // Senaryo 2.1: Kullanıcı zaten login olmuş - login sayfasına yönlendir, oradan dashboard'a geçer
          // Query param'ları kaydet, dashboard'da validate edilecek
          localStorage.setItem(
            'pendingAmazonValidateParams',
            JSON.stringify({ state, selling_partner_id: validateSellingPartnerId, spapi_oauth_code: spapiOauthCode })
          );
          navigate('/login', { replace: true });
        } else {
          // Senaryo 2.2: Kullanıcı login olmamış - query param'ları kaydet
          localStorage.setItem(
            'pendingAmazonValidateParams',
            JSON.stringify({ state, selling_partner_id: validateSellingPartnerId, spapi_oauth_code: spapiOauthCode })
          );
          navigate('/login', { replace: true });
        }
      }
    }, [location.search, isAuth, navigate, dispatch, handleError]);
    return null;
  }

  return (
    <>
      <ToastProvider />
      <Router>
        <ScrollToTop />
        <QueryParamHandler />
        <PermissionWrapper />
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
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
          </Suspense>
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