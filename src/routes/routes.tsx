import RouteGuard from '@/components/RouteGuard';
import ClientLayout from '@/components/ClientLayout';
import { RootState } from '@/lib/store';
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';

// Lazy loading ile sayfa component'lerini import ediyoruz
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AccessDenied = lazy(() => import('@/pages/AccessDenied'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

const Permissions = lazy(() => import('@/pages/Permissions'));
const PermissionsManagement = lazy(
  () => import('@/pages/PermissionsManagement')
);
const AllServices = lazy(() => import('@/pages/AllServices'));
const AllResources = lazy(() => import('@/pages/AllResources'));
const PagesRoute = lazy(() => import('@/pages/PagesRoute'));
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
const Subscription = lazy(() => import('@/pages/Subscription'));
const NewPermissionExamples = lazy(
  () => import('@/examples/NewPermissionExamples')
);
const Region = lazy(() => import('@/pages/Region'));
const RegionForm = lazy(() => import('@/pages/Region/RegionForm'));

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
        path: 'permissions-management',
        element: <PermissionsManagement />,
        handle: { title: 'routes.permissionsManagement' },
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
            element: <PagesRoute />,
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
        children: [
          {
            index: true,
            element: <Roles />,
            handle: { title: 'routes.roles.title' },
          },
          {
            path: 'create',
            element: <RoleCreate />,
            handle: { title: 'routes.roles.create' },
          },
          {
            path: ':id',
            element: <RoleDetail />,
            handle: { title: 'routes.roles.detail' },
          },
          {
            path: ':id/edit',
            element: <RoleEdit />,
            handle: { title: 'routes.roles.edit' },
          },
        ],
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <Products />,
            handle: { title: 'routes.products.title' },
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
        children: [
          {
            index: true,
            element: <Marketplaces />,
            handle: { title: 'routes.marketplaces.title' },
          },
          {
            path: 'create',
            element: <MarketplaceCreate />,
            handle: { title: 'routes.marketplaces.create' },
          },
          {
            path: ':id',
            element: <MarketplaceDetail />,
            handle: { title: 'routes.marketplaces.detail' },
          },
          {
            path: ':id/edit',
            element: <MarketplaceEdit />,
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
        path: 'permission-test',
        element: <PermissionTest />,
        handle: { title: 'Permission Test' },
      },
      {
        path: 'permission-examples',
        element: <NewPermissionExamples />,
        handle: { title: 'Permission Examples' },
      },
      {
        path: "subscription",
        element: <Subscription />,
        handle: { title: 'Subscription' }
      },
      {
        path: "regions",
        children: [
          {
            index: true,
            element: <Region />,
            handle: { title: 'Region' },
          },
          {
            path: "create",
            element: <RegionForm />,
            handle: { title: 'Region Create' },
          },
          {
            path: ':id/edit',
            element: <RegionForm />,
            handle: { title: 'Region Edit' },
          },
        ]
      }
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
