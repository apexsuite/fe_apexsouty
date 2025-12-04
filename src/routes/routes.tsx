import RouteGuard from '@/components/RouteGuard';
import ClientLayout from '@/components/ClientLayout';
import { RootState } from '@/lib/store';
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';

const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AccessDenied = lazy(() => import('@/pages/AccessDenied'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

const Permissions = lazy(() => import('@/pages/Permissions'));
const AllServices = lazy(() => import('@/pages/AllServices'));
const AllResources = lazy(() => import('@/pages/AllResources'));
const PageRoutes = lazy(() => import('@/pages/PageRoutes'));
const PageDetailRoute = lazy(
  () => import('@/components/pagesRoute/PageDetailRoute')
);
const PageFormRoute = lazy(
  () => import('@/components/pagesRoute/PageFormRoute')
);
const PageRoutePermissionsRoute = lazy(
  () => import('@/pages/PageRoutePermissionsRoute')
);
const PageRoutePermissionDetailRoute = lazy(
  () =>
    import('@/components/pageRoutePermissions/PageRoutePermissionDetailRoute')
);
const PageRoutePermissionFormRoute = lazy(
  () => import('@/components/pageRoutePermissions/PageRoutePermissionFormRoute')
);
const Roles = lazy(() => import('@/pages/Roles'));
const RoleForm = lazy(() => import('@/pages/Roles/RoleForm'));

const RoleDetail = lazy(() => import('@/pages/RoleDetail'));

const Products = lazy(() => import('@/pages/Products'));
const ProductCreate = lazy(() => import('@/pages/ProductCreate'));
const ProductEdit = lazy(() => import('@/pages/ProductEdit'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const PriceDetail = lazy(() => import('@/pages/PriceDetail'));
const BillingForm = lazy(() => import('@/components/billing/BillingForm'));

const Marketplaces = lazy(() => import('@/pages/MarketPlaces'));
const MarketPlaceForm = lazy(
  () => import('@/pages/MarketPlaces/MarketPlaceForm')
);
const MarketPlaceDetail = lazy(
  () => import('@/pages/MarketPlaces/MarketPlaceDetail')
);

const Consents = lazy(() => import('@/pages/Consents'));

const Subscription = lazy(() => import('@/pages/Subscription'));
const Region = lazy(() => import('@/pages/Region'));
const RegionForm = lazy(() => import('@/pages/Region/RegionForm'));

const Vendor = lazy(() => import('@/pages/Vendor'));
const VendorForm = lazy(() => import('@/pages/Vendor/VendorForm'));
const VendorDetail = lazy(() => import('@/pages/Vendor/VendorDetail'));

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const ProtectedLayout: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <RouteGuard>
      <ClientLayout>
        <Outlet />
      </ClientLayout>
    </RouteGuard>
  );
};

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
];

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
        handle: { title: 'routes.dashboard' },
      },
      {
        path: 'permissions',
        element: <Permissions />,
        handle: { title: 'routes.permissions' },
      },
      {
        path: 'all-services',
        element: <AllServices />,
        handle: { title: 'routes.allServices' },
      },
      {
        path: 'all-resources',
        element: <AllResources />,
        handle: { title: 'routes.allResources' },
      },
      {
        path: 'page-routes',
        children: [
          {
            index: true,
            element: <PageRoutes />,
            handle: { title: 'routes.pageRoutes.title' },
          },
          {
            path: 'create',
            element: <PageFormRoute />,
            handle: { title: 'routes.pageRoutes.create' },
          },
          {
            path: ':id',
            element: <PageDetailRoute />,
            handle: { title: 'routes.pageRoutes.detail' },
          },
          {
            path: ':id/edit',
            element: <PageFormRoute />,
            handle: { title: 'routes.pageRoutes.edit' },
          },
        ],
      },
      {
        path: 'page-route-permissions',
        children: [
          {
            index: true,
            element: <PageRoutePermissionsRoute />,
            handle: { title: 'routes.pageRoutePermissions.title' },
          },
          {
            path: ':pageRouteId/permissions/create',
            element: <PageRoutePermissionFormRoute />,
            handle: { title: 'routes.pageRoutePermissions.create' },
          },
          {
            path: ':pageRouteId/permissions/:permissionId/edit',
            element: <PageRoutePermissionFormRoute />,
            handle: { title: 'routes.pageRoutePermissions.edit' },
          },
          {
            path: ':pageRouteId/permissions/:permissionId',
            element: <PageRoutePermissionDetailRoute />,
            handle: { title: 'routes.pageRoutePermissions.detail' },
          },
        ],
      },
      {
        path: 'roles',
        handle: { title: 'routes.roles.title' },
        children: [
          {
            index: true,
            element: <Roles />,
          },
          {
            path: 'create',
            element: <RoleForm />,
            handle: { title: 'routes.roles.create' },
          },
          {
            path: ':id/edit',
            element: <RoleForm />,
            handle: { title: 'routes.roles.edit' },
          },
          {
            path: ':id',
            element: <RoleDetail />,
            handle: { title: 'routes.roles.detail' },
          },
        ],
      },
      {
        path: 'products',
        handle: { title: 'routes.products.title' },
        children: [
          {
            index: true,
            element: <Products />,
          },
          {
            path: 'create',
            element: <ProductCreate />,
            handle: { title: 'routes.products.create' },
          },
          {
            path: ':productId',
            element: <ProductDetail />,
            handle: { title: 'routes.products.detail' },
          },
          {
            path: ':productId/edit',
            element: <ProductEdit />,
            handle: { title: 'routes.products.edit' },
          },
          {
            path: ':productId/prices/:priceId',
            element: <PriceDetail />,
            handle: { title: 'routes.products.priceDetail' },
          },
        ],
      },
      {
        path: 'billings',
        element: <BillingForm />,
        handle: { title: 'routes.billings.title' },
      },
      {
        path: 'marketplaces',
        handle: { title: 'routes.marketplaces.title' },
        children: [
          {
            index: true,
            element: <Marketplaces />,
          },
          {
            path: 'create',
            element: <MarketPlaceForm />,
            handle: { title: 'routes.marketplaces.create' },
          },
          {
            path: ':id',
            element: <MarketPlaceDetail />,
            handle: { title: 'routes.marketplaces.detail' },
          },
          {
            path: ':id/edit',
            element: <MarketPlaceForm />,
            handle: { title: 'routes.marketplaces.edit' },
          },
        ],
      },
      {
        path: 'consents',
        element: <Consents />,
        handle: { title: 'routes.consents.title' },
      },
      {
        path: 'subscription',
        element: <Subscription />,
        handle: { title: 'routes.subscription.title' },
      },
      {
        path: 'regions',
        handle: { title: 'routes.regions.title' },
        children: [
          {
            index: true,
            element: <Region />,
          },
          {
            path: 'create',
            element: <RegionForm />,
            handle: { title: 'routes.regions.create' },
          },
          {
            path: ':id/edit',
            element: <RegionForm />,
            handle: { title: 'routes.regions.edit' },
          },
        ],
      },
      {
        path: 'vendors',
        handle: { title: 'routes.vendors.title' },
        children: [
          {
            index: true,
            element: <Vendor />,
          },
          {
            path: 'create',
            element: <VendorForm />,
            handle: { title: 'routes.vendors.create' },
          },
          {
            path: ':id',
            element: <VendorDetail />,
            handle: { title: 'routes.vendors.detail' },
          },
          {
            path: ':id/edit',
            element: <VendorForm />,
            handle: { title: 'routes.vendors.edit' },
          },
        ],
      },
    ],
  },
];

export const routes: RouteObject[] = [
  {
    path: '*',
    element: <AccessDenied />,
  },
  ...publicRoutes,
  ...protectedRoutes,
];
