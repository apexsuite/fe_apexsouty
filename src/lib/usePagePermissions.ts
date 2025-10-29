import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from './store';
import { fetchMyPermissions } from './permissionSlice';


export const usePagePermissions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useSelector((state: RootState) => state.userPermissions.loading);
  const lastFetched = useSelector((state: RootState) => state.userPermissions.lastFetched);
  const lastRouteRef = useRef<string>('');
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const publicRoutes = [
      '/login',
      '/register', 
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/access-denied'
    ];

    const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));
    
    if (isPublicRoute) {
      return;
    }

    const currentRoute = location.pathname;
    const hasRouteChanged = lastRouteRef.current !== currentRoute;
    
    if (isInitializedRef.current && hasRouteChanged && !loading) {
      const timeSinceLastFetch = lastFetched ? Date.now() - lastFetched : Infinity;
      const shouldFetch = timeSinceLastFetch > 10 * 1000; // 10 seconds
      
      if (shouldFetch) {
        console.log({
          from: lastRouteRef.current,
          to: currentRoute,
          timeSinceLastFetch: Math.round(timeSinceLastFetch / 1000) + 's'
        });
        
        lastRouteRef.current = currentRoute;
        dispatch(fetchMyPermissions());
      }
    } else if (!isInitializedRef.current) { 
      lastRouteRef.current = currentRoute;
      isInitializedRef.current = true;
    }
  }, [location.pathname, dispatch, loading, lastFetched, isAuthenticated]);

  return {
    loading,
    lastFetched,
    currentRoute: location.pathname,
  };
};
