import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import '@/locales';
import { useEffect, useRef } from 'react';
import { setLanguage } from '@/lib/langSlice';
import i18n from '@/locales';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/theme';
import { THEME_STORAGE_KEY } from '@/utils/constants/theme';
import ToastProvider from '@/components/ToastProvider';
import { ToastProvider as CustomToastProvider } from '@/components/ui/toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const dispatchRef = useRef(store.dispatch);

  useEffect(() => {
    const storedLang =
      typeof window === 'undefined'
        ? 'en'
        : localStorage.getItem('lang') || 'en';
    if (storedLang) {
      dispatchRef.current(setLanguage(storedLang));
      i18n.changeLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newLang = store.getState().lang.language;

      if (newLang && newLang !== i18n.language) {
        i18n.changeLanguage(newLang);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey={THEME_STORAGE_KEY}>
          {children}
          <CustomToastProvider position="top-center" />
          <ToastProvider />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
