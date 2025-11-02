import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import '@/locales';
import { useEffect, useState, useRef } from 'react';
import { setLanguage } from '@/lib/langSlice';
import i18n from '@/locales';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/theme';
import { THEME_STORAGE_KEY } from '@/utils/constants/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="border-t-primary inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300"></span>
    </div>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
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

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const unsubscribe = store.subscribe(() => {
      const newLang = store.getState().lang.language;

      if (newLang && newLang !== i18n.language) {
        i18n.changeLanguage(newLang);
      }
    });

    return () => unsubscribe();
  }, [ready]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey={THEME_STORAGE_KEY}>
          {ready ? children : <Spinner />}
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
