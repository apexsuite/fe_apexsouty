import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from './store';
import { fetchMyPermissions } from './permissionSlice';

/**
 * Global permission fetcher hook
 * Bu hook her sayfa değişiminde permission'ları günceller
 */
export const usePermissionFetcher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const permissions = useSelector((state: RootState) => state.userPermissions.permissions);
  const loading = useSelector((state: RootState) => state.userPermissions.loading);
  const lastFetched = useSelector((state: RootState) => state.userPermissions.lastFetched);
  const hasInitialized = useRef(false);

  // Initial fetch
  useEffect(() => {
    const shouldFetch = !loading && permissions.length === 0;
    const isStale = lastFetched && Date.now() - lastFetched > 5 * 60 * 1000; // 5 minutes
    const hasNeverFetched = !lastFetched;

    if (shouldFetch || isStale || hasNeverFetched) {
      console.log('🚀 Initializing permissions...', { shouldFetch, isStale, hasNeverFetched });
      hasInitialized.current = true;
      dispatch(fetchMyPermissions());
    }
  }, [dispatch, loading, permissions.length, lastFetched]);

  // Route change fetch - sadece gerekli durumlarda güncelle
  useEffect(() => {
    // Public routes'da permission fetch yapma
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

    // Sadece belirli aralıklarla güncelle (5 dakika)
    const shouldRefresh = lastFetched && Date.now() - lastFetched > 5 * 60 * 1000;
    
    if (shouldRefresh && !loading) {
      console.log('🔄 Refreshing permissions (5min interval)...', location.pathname);
      dispatch(fetchMyPermissions());
    }
  }, [location.pathname, dispatch, loading, lastFetched]);

  return {
    permissions,
    loading,
    lastFetched,
    hasInitialized: hasInitialized.current,
  };
};
