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
const PageRouteForm = lazy(() => import('@/pages/PageRoutes/PageRouteForm'));
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

const Support = lazy(() => import('@/pages/Support'));
const SupportForm = lazy(() => import('@/pages/Support/SupportForm'));
const SupportDetail = lazy(() => import('@/pages/Support/SupportDetail'));
const Messages = lazy(() => import('@/pages/Support/Messages'));
const MessageForm = lazy(() => import('@/pages/Support/Messages/MessageForm'));
const MessageDetail = lazy(() => import('@/pages/Support/Messages/MessageDetail'));

const UserManagement = lazy(() => import('@/pages/UserManagment'));
const UserDetail = lazy(() => import('@/pages/UserManagment/UserDetail'));
const UserForm = lazy(() => import('@/pages/UserManagment/UserForm'));

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
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
        handle: { title: 'routes.pageRoutes.title' },
        children: [
          {
            index: true,
            element: <PageRoutes />,
          },
          {
            path: 'create',
            element: <PageRouteForm />,
            handle: { title: 'routes.pageRoutes.create' },
          },
          {
            path: ':id/edit',
            element: <PageRouteForm />,
            handle: { title: 'routes.pageRoutes.edit' },
          },
          {
            path: ':id',
            element: <PageDetailRoute />,
            handle: { title: 'routes.pageRoutes.detail' },
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
      {
        path: 'user-management',
        handle: { title: 'routes.userManagement.title' },
        children: [
          {
            index: true,
            element: <UserManagement />,
          },
          {
            path: ':id',
            element: <UserDetail />,
            handle: { title: 'routes.userManagement.detail' },
          },
          {
            path: 'create',
            element: <UserForm />,
            handle: { title: 'routes.userManagement.create' },
          },
          {
            path: ':id/edit',
            element: <UserForm />,
            handle: { title: 'routes.userManagement.edit' },
          },
        ],
      },
      {
        path: 'support',
        handle: { title: 'routes.support.title' },
        children: [
          {
            index: true,
            element: <Support />,
          },
          {
            path: 'create',
            element: <SupportForm />,
            handle: { title: 'routes.support.create' },
          },
          {
            path: ':id/edit',
            element: <SupportForm />,
            handle: { title: 'routes.support.edit' },
          },
          {
            path: ':id',
            element: <SupportDetail />,
            handle: { title: 'routes.support.detail' },
          },
          {
            path: ':id/messages',
            handle: { title: 'routes.support.messages.title' },
            children: [
              {
                index: true,
                element: <Messages />,
              },
              {
                path: 'create',
                element: <MessageForm />,
                handle: { title: 'routes.support.messages.create' },
              },
              {
                path: ':messageId/edit',
                element: <MessageForm />,
                handle: { title: 'routes.support.messages.edit' },
              },
              {
                path: ':messageId',
                element: <MessageDetail />,
                handle: { title: 'routes.support.messages.detail' },
              },
            ],
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
