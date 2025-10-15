import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPrivateRoutes, forceRefresh } from '@/lib/routeGuardSlice';
import AccessDenied from '@/pages/AccessDenied';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { privateRoutes, loading, error } = useSelector((state: RootState) => state.routeGuard);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  // Public routes that don't require permission check
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/access-denied'
  ];

  // Always allowed routes (core application routes that don't need API permission check)
  const alwaysAllowedRoutes = [
    '/', // Root path - will redirect to dashboard
    '/dashboard', // Always accessible for authenticated users
    '/permissions', // Always accessible for authenticated users
    '/permissions-management', // Always accessible for authenticated users
    '/all-services', // Always accessible for authenticated users
    '/all-resources' // Always accessible for authenticated users
  ];

  // Check if current path is a detail/edit page that needs resource-level permission check
  const isResourceDetailPage = (path: string) => {
    // Pattern: /resource/:id or /resource/:id/edit or /resource/:id/subresource/:subId
    return /\/([^\/]+)\/([^\/]+)(?:\/|$)/.test(path) && !path.includes('/create');
  };

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

  // Fetch private routes on mount (only once)  
  useEffect(() => {
    const initializePrivateRoutes = async () => {
      if (isAuthenticated && privateRoutes.length === 0 && !loading && !error) {
        try {
          await dispatch(fetchPrivateRoutes()).unwrap();
          console.log('🔄 Private routes initialized');
        } catch (err) {
          console.error('Failed to fetch private routes:', err);
        }
      }
    };

    initializePrivateRoutes();
  }, [isAuthenticated, dispatch, privateRoutes.length, loading, error]);

  // Check route access on path change
  useEffect(() => {
    const checkRouteAccess = () => {
      // If not authenticated or on public route, allow access
      if (!isAuthenticated || isPublicRoute) {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      const currentPath = location.pathname;
      
      // Check if current path is in always allowed routes (exact match only for core pages)
      const isAlwaysAllowed = alwaysAllowedRoutes.some(route => 
        currentPath === route || (currentPath.startsWith(route + '/') && !isResourceDetailPage(currentPath))
      );
      
      if (isAlwaysAllowed) {
        console.log('✅ Route allowed (always allowed):', currentPath);
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      // If it's a resource detail page, check if it's in private routes
      if (isResourceDetailPage(currentPath)) {
        console.log('🔍 Resource detail page detected:', currentPath);
        
        // If private routes are still loading, wait
        if (loading) {
          return;
        }

        // Check if current path is in private routes from API (exact match or starts with)
        const hasRouteAccess = privateRoutes.includes(currentPath) || 
          privateRoutes.some(route => currentPath.startsWith(route + '/'));
        
        console.log('🔍 Resource detail check:', {
          currentPath,
          privateRoutes,
          hasRouteAccess,
          hasRefreshed
        });
        
        // If route not found and we haven't refreshed yet, try refreshing once
        if (!hasRouteAccess && !hasRefreshed && !loading) {
          console.log('🔄 Resource route not found, refreshing private routes...');
          setHasRefreshed(true);
          dispatch(forceRefresh());
          dispatch(fetchPrivateRoutes());
          return; // Wait for refresh to complete
        }
        
        setHasAccess(hasRouteAccess);
        setIsChecking(false);

        // If no access and not already on access denied page, redirect
        if (!hasRouteAccess && currentPath !== '/access-denied') {
          console.log('❌ Resource access denied, redirecting to /access-denied');
          navigate('/access-denied', { 
            replace: true,
            state: { attemptedPath: currentPath }
          });
        } else if (hasRouteAccess) {
          console.log('✅ Resource access allowed (from API):', currentPath);
        }
        return;
      }

      // If private routes are still loading, wait
      if (loading) {
        return;
      }

      // Check if current path is in private routes from API (exact match or starts with)
      const hasRouteAccess = privateRoutes.includes(currentPath) || 
        privateRoutes.some(route => currentPath.startsWith(route + '/'));
      
      console.log('🔍 Route check:', {
        currentPath,
        privateRoutes,
        hasRouteAccess,
        hasRefreshed
      });
      
      // If route not found and we haven't refreshed yet, try refreshing once
      if (!hasRouteAccess && !hasRefreshed && !loading) {
        console.log('🔄 Route not found, refreshing private routes...');
        setHasRefreshed(true);
        dispatch(forceRefresh());
        dispatch(fetchPrivateRoutes());
        return; // Wait for refresh to complete
      }
      
      setHasAccess(hasRouteAccess);
      setIsChecking(false);

        // If no access and not already on access denied page, redirect
        if (!hasRouteAccess && currentPath !== '/access-denied') {
          console.log('❌ Access denied - route not found in private routes, redirecting to /access-denied');
          navigate('/access-denied', { 
            replace: true,
            state: { attemptedPath: currentPath }
          });
        } else if (hasRouteAccess) {
          console.log('✅ Route allowed (from API):', currentPath);
        }
    };

    checkRouteAccess();
  }, [location.pathname, privateRoutes, isAuthenticated, isPublicRoute, loading, navigate, alwaysAllowedRoutes, hasRefreshed, dispatch]);

  // Reset hasRefreshed when path changes
  useEffect(() => {
    setHasRefreshed(false);
  }, [location.pathname]);

  // Show loading spinner while checking
  if (isChecking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show access denied page if no access
  if (!hasAccess && isAuthenticated) {
    return <AccessDenied />;
  }

  // Render children if access is granted
  return <>{children}</>;
};

export default RouteGuard;
