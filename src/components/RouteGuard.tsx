import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPrivateRoutes, forceRefresh } from '@/lib/routeGuardSlice';
import { checkAuth } from '@/lib/authSlice';
import { fetchMyPermissions } from '@/lib/permissionSlice';
import AccessDenied from '@/pages/AccessDenied';
import UnderConstruction from '@/pages/UnderConstruction';
import { PUBLIC_ROUTES, ALWAYS_ALLOWED_ROUTES } from '@/utils/constants/routes';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { privateRoutes, routeMap, loading, error } = useSelector(
    (state: RootState) => state.routeGuard
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  const isResourceDetailPage = (path: string) => {
    return (
      /\/([^\/]+)\/([^\/]+)(?:\/|$)/.test(path) && !path.includes('/create')
    );
  };

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    const initializePrivateRoutes = async () => {
      if (isAuthenticated && privateRoutes.length === 0 && !loading && !error) {
        try {
          await dispatch(fetchPrivateRoutes()).unwrap();
        } catch (err) {}
      }
    };

    initializePrivateRoutes();
  }, [isAuthenticated, dispatch, privateRoutes.length, loading, error]);

  // Her sayfa geçişinde auth check ve permissions fetch
  useEffect(() => {
    if (!isAuthenticated || isPublicRoute) {
      return;
    }

    // Her sayfa geçişinde auth check ve permissions fetch yap
    const fetchAuthAndPermissions = async () => {
      try {
        await Promise.all([
          dispatch(checkAuth()),
          dispatch(fetchMyPermissions()),
        ]);
      } catch (error) {
        // Hatalar sessizce yutulur, mevcut akış devam eder
      }
    };

    fetchAuthAndPermissions();
  }, [location.pathname, isAuthenticated, isPublicRoute, dispatch]);

  useEffect(() => {
    const checkRouteAccess = () => {
      if (!isAuthenticated || isPublicRoute) {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      const currentPath = location.pathname;

      const isAlwaysAllowed = ALWAYS_ALLOWED_ROUTES.some(
        route =>
          currentPath === route ||
          (currentPath.startsWith(route + '/') &&
            !isResourceDetailPage(currentPath))
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

        const hasRouteAccess =
          privateRoutes.includes(currentPath) ||
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
            state: { attemptedPath: currentPath },
          });
        } else if (hasRouteAccess) {
        }
        return;
      }

      if (loading) {
        return;
      }

      const hasRouteAccess =
        privateRoutes.includes(currentPath) ||
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
          state: { attemptedPath: currentPath },
        });
      } else if (hasRouteAccess) {
      }
    };

    checkRouteAccess();
  }, [
    location.pathname,
    privateRoutes,
    routeMap,
    isAuthenticated,
    isPublicRoute,
    loading,
    navigate,
    hasRefreshed,
    dispatch,
  ]);

  useEffect(() => {
    setHasRefreshed(false);
  }, [location.pathname]);

  if (isChecking || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess && isAuthenticated) {
    return <AccessDenied />;
  }

  // Eğer route'un component'i UnderConstruction ise, UnderConstruction component'ini render et
  const currentPath = location.pathname;
  const routeInfo =
    routeMap[currentPath] ||
    Object.values(routeMap).find(
      route =>
        currentPath.startsWith(route.path + '/') || currentPath === route.path
    );

  if (routeInfo && routeInfo.component === 'UnderConstruction') {
    return <UnderConstruction />;
  }

  return <>{children}</>;
};

export default RouteGuard;
