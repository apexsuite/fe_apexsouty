import { Provider } from "react-redux";
import { store } from "@/lib/store";
import "@/lib/i18n";
import { useEffect, useState, useRef } from "react";
import { setLanguage } from "@/lib/langSlice";
import { setTheme } from "@/lib/themeSlice";
import i18n from "@/lib/i18n";

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></span>
    </div>
  );
}

// Tema uygulama fonksiyonu
function applyTheme(theme: string) {
  const root = window.document.documentElement;
  
  // Önce tüm tema sınıflarını temizle
  root.classList.remove('dark', 'light');
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.add('light');
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const dispatchRef = useRef(store.dispatch);
  const theme = store.getState().theme.theme;

  useEffect(() => {
    // Dil ayarlarını yükle
    const storedLang = typeof window === "undefined" ? "en" : localStorage.getItem("lang") || "en";
    if (storedLang) {
      dispatchRef.current(setLanguage(storedLang));
      i18n.changeLanguage(storedLang);
    }
    
    // Tema ayarlarını yükle ve uygula
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    dispatchRef.current(setTheme(storedTheme));
    
    // Tema uygula
    applyTheme(storedTheme);
    
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    
    const unsubscribe = store.subscribe(() => {
      const newTheme = store.getState().theme.theme;
      if (newTheme !== theme) {
        setIsThemeChanging(true);
        setTimeout(() => {
          applyTheme(newTheme);
          setIsThemeChanging(false);
        }, 100);
      }
    });

    return () => unsubscribe();
  }, [ready, theme]);

  return (
    <Provider store={store}>
      {ready ? (
        isThemeChanging ? <Spinner /> : children
      ) : (
        <Spinner />
      )}
    </Provider>
  );
} 