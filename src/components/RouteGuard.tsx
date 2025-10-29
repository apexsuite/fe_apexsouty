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

  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/access-denied'
  ];
  const alwaysAllowedRoutes = [
    '/', 
    '/dashboard', 
    '/permissions', 
    '/permissions-management', 
    '/all-services', 
    '/all-resources' 
  ];

  const isResourceDetailPage = (path: string) => {
    return /\/([^\/]+)\/([^\/]+)(?:\/|$)/.test(path) && !path.includes('/create');
  };

  const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    const initializePrivateRoutes = async () => {
      if (isAuthenticated && privateRoutes.length === 0 && !loading && !error) {
        try {
          await dispatch(fetchPrivateRoutes()).unwrap();
        } catch (err) {
        }
      }
    };

    initializePrivateRoutes();
  }, [isAuthenticated, dispatch, privateRoutes.length, loading, error]);

  useEffect(() => {
    const checkRouteAccess = () => {
      if (!isAuthenticated || isPublicRoute) {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      const currentPath = location.pathname;
      
      const isAlwaysAllowed = alwaysAllowedRoutes.some(route => 
        currentPath === route || (currentPath.startsWith(route + '/') && !isResourceDetailPage(currentPath))
      );
      
      if (isAlwaysAllowed) {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      if (isResourceDetailPage(currentPath)) {
        
        if (loading) {
          return;
        }

        const hasRouteAccess = privateRoutes.includes(currentPath) || 
          privateRoutes.some(route => currentPath.startsWith(route + '/'));
        
        if (!hasRouteAccess && !hasRefreshed && !loading) {
          setHasRefreshed(true);
          dispatch(forceRefresh());
          dispatch(fetchPrivateRoutes());
          return; 
        }
        
        setHasAccess(hasRouteAccess);
        setIsChecking(false);

        if (!hasRouteAccess && currentPath !== '/access-denied') {
          navigate('/access-denied', { 
            replace: true,
            state: { attemptedPath: currentPath }
          });
        } else if (hasRouteAccess) {
        }
        return;
      }

      if (loading) {
        return;
      }

      const hasRouteAccess = privateRoutes.includes(currentPath) || 
        privateRoutes.some(route => currentPath.startsWith(route + '/'));
      
      if (!hasRouteAccess && !hasRefreshed && !loading) {
        setHasRefreshed(true);
        dispatch(forceRefresh());
        dispatch(fetchPrivateRoutes());
        return; 
      }
      
      setHasAccess(hasRouteAccess);
      setIsChecking(false);

        if (!hasRouteAccess && currentPath !== '/access-denied') {
          navigate('/access-denied', { 
            replace: true,
            state: { attemptedPath: currentPath }
          });
        } else if (hasRouteAccess) {        
        }
    };

    checkRouteAccess();
  }, [location.pathname, privateRoutes, isAuthenticated, isPublicRoute, loading, navigate, alwaysAllowedRoutes, hasRefreshed, dispatch]);

  useEffect(() => {
    setHasRefreshed(false);
  }, [location.pathname]);

  if (isChecking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess && isAuthenticated) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default RouteGuard;
