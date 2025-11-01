import RouteGuard from "@/components/RouteGuard";
import ClientLayout from "@/components/ClientLayout";
import { RootState } from "@/lib/store";
import { lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RouteObject } from "react-router-dom";

// Lazy loading ile sayfa component'lerini import ediyoruz
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AccessDenied = lazy(() => import('@/pages/AccessDenied'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

const Permissions = lazy(() => import('@/pages/Permissions'));
const PermissionsManagement = lazy(() => import('@/pages/PermissionsManagement'));
const AllServices = lazy(() => import('@/pages/AllServices'));
const AllResources = lazy(() => import('@/pages/AllResources'));
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

/**
 * Public route'lar için wrapper component
 * Login olmuş kullanıcıyı dashboard'a yönlendirir
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

/**
 * Korumalı route'lar için layout wrapper
 * RouteGuard ve ClientLayout'u bir kez render eder
 */
const ProtectedLayout: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

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

/**
 * Public Routes - Giriş yapmamış kullanıcılar için
 */
export const publicRoutes: RouteObject[] = [
    {
        path: "/",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {
        path: "/verify-email",
        element: <VerifyEmail />,
    },
    {
        path: "/reset-password",
        element: <ResetPassword />,
    },
];

/**
 * Protected Routes - Giriş yapmış kullanıcılar için
 * ClientLayout ve RouteGuard içinde render edilir
 */
export const protectedRoutes: RouteObject[] = [
    {
        path: "/",
        element: <ProtectedLayout />,
        children: [
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "permissions",
                element: <Permissions />,
            },
            {
                path: "permissions-management",
                element: <PermissionsManagement />,
            },
            {
                path: "all-services",
                element: <AllServices />,
            },
            {
                path: "all-resources",
                element: <AllResources />,
            },
            {
                path: "page-routes",
                children: [
                    {
                        index: true,
                        element: <PagesRoute />,
                    },
                    {
                        path: "create",
                        element: <PageFormRoute />,
                    },
                    {
                        path: ":id",
                        element: <PageDetailRoute />,
                    },
                    {
                        path: ":id/edit",
                        element: <PageFormRoute />,
                    },
                ],
            },
            {
                path: "page-route-permissions",
                children: [
                    {
                        index: true,
                        element: <PageRoutePermissionsRoute />,
                    },
                    {
                        path: ":id",
                        element: <PageRoutePermissionDetailRoute />,
                    },
                    {
                        path: ":id/edit",
                        element: <PageRoutePermissionFormRoute />,
                    },
                ],
            },
            {
                path: "roles",
                children: [
                    {
                        index: true,
                        element: <Roles />,
                    },
                    {
                        path: "create",
                        element: <RoleCreate />,
                    },
                    {
                        path: ":id",
                        element: <RoleDetail />,
                    },
                    {
                        path: ":id/edit",
                        element: <RoleEdit />,
                    },
                ],
            },
            {
                path: "products",
                children: [
                    {
                        index: true,
                        element: <Products />,
                    },
                    {
                        path: "create",
                        element: <ProductCreate />,
                    },
                    {
                        path: ":id",
                        element: <ProductDetail />,
                    },
                    {
                        path: ":id/edit",
                        element: <ProductEdit />,
                    },
                    {
                        path: ":id/prices/:priceId",
                        element: <PriceDetail />,
                    },
                ],
            },
            {
                path: "billings",
                element: <BillingForm />,
            },
            {
                path: "marketplaces",
                children: [
                    {
                        index: true,
                        element: <Marketplaces />,
                    },
                    {
                        path: "create",
                        element: <MarketplaceCreate />,
                    },
                    {
                        path: ":id",
                        element: <MarketplaceDetail />,
                    },
                    {
                        path: ":id/edit",
                        element: <MarketplaceEdit />,
                    },
                ],
            },
            {
                path: "consents",
                element: <Consents />,
            },
            {
                path: "permission-test",
                element: <PermissionTest />,
            },
            {
                path: "permission-examples",
                element: <NewPermissionExamples />,
            },
        ],
    },
];

/**
 * Ana route yapılandırması
 * React Router DOM v7 best practices'e göre düzenlenmiştir
 */
export const routes: RouteObject[] = [
    {
        path: "*",
        element: <AccessDenied />,
    },
    ...publicRoutes,
    ...protectedRoutes,

];