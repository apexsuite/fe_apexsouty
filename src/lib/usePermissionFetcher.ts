import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from './store';
import { fetchMyPermissions } from './permissionSlice';


export const usePermissionFetcher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const permissions = useSelector((state: RootState) => state.userPermissions.permissions);
  const loading = useSelector((state: RootState) => state.userPermissions.loading);
  const lastFetched = useSelector((state: RootState) => state.userPermissions.lastFetched);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const shouldFetch = !loading && permissions.length === 0;
    const isStale = lastFetched && Date.now() - lastFetched > 5 * 60 * 1000;
    const hasNeverFetched = !lastFetched;

    if (shouldFetch || isStale || hasNeverFetched) {
      hasInitialized.current = true;
      dispatch(fetchMyPermissions());
    }
  }, [dispatch, loading, permissions.length, lastFetched, isAuthenticated]);

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

    const shouldRefresh = lastFetched && Date.now() - lastFetched > 5 * 60 * 1000;
    
    if (shouldRefresh && !loading) {
      dispatch(fetchMyPermissions());
    }
  }, [location.pathname, dispatch, loading, lastFetched, isAuthenticated]);

  return {
    permissions,
    loading,
    lastFetched,
    hasInitialized: hasInitialized.current,
  };
};
