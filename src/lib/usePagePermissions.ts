import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from './store';
import { fetchMyPermissions } from './permissionSlice';

/**
 * Page-specific permission fetcher hook
 * Her sayfa için permission'ları günceller
 */
export const usePagePermissions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const loading = useSelector((state: RootState) => state.userPermissions.loading);
  const lastFetched = useSelector((state: RootState) => state.userPermissions.lastFetched);
  const lastRouteRef = useRef<string>('');
  const isInitializedRef = useRef<boolean>(false);

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

    // Route değişti mi kontrol et
    const currentRoute = location.pathname;
    const hasRouteChanged = lastRouteRef.current !== currentRoute;
    
    // İlk yükleme değilse ve route değiştiyse
    if (isInitializedRef.current && hasRouteChanged && !loading) {
      // Son fetch'ten en az 10 saniye geçmiş mi kontrol et
      const timeSinceLastFetch = lastFetched ? Date.now() - lastFetched : Infinity;
      const shouldFetch = timeSinceLastFetch > 10 * 1000; // 10 seconds
      
      if (shouldFetch) {
        console.log('🔄 Fetching permissions for new route...', {
          from: lastRouteRef.current,
          to: currentRoute,
          timeSinceLastFetch: Math.round(timeSinceLastFetch / 1000) + 's'
        });
        
        lastRouteRef.current = currentRoute;
        dispatch(fetchMyPermissions());
      }
    } else if (!isInitializedRef.current) {
      // İlk yükleme
      lastRouteRef.current = currentRoute;
      isInitializedRef.current = true;
    }
  }, [location.pathname, dispatch, loading, lastFetched]);

  return {
    loading,
    lastFetched,
    currentRoute: location.pathname,
  };
};
