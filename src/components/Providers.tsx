import { Provider } from "react-redux";
import { store } from "@/lib/store";
import "@/lib/i18n";
import { useEffect, useState, useRef } from "react";
import { setLanguage } from "@/lib/langSlice";
import i18n from "@/lib/i18n";

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></span>
    </div>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const dispatchRef = useRef(store.dispatch);
  const theme = store.getState().theme.theme;

  useEffect(() => {
    const storedLang = typeof window === "undefined" ? "en" : localStorage.getItem("lang") || "en";
    if (storedLang) {
      dispatchRef.current(setLanguage(storedLang));
      i18n.changeLanguage(storedLang);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    
    const unsubscribe = store.subscribe(() => {
      const newTheme = store.getState().theme.theme;
      if (newTheme !== theme) {
        setIsThemeChanging(true);
        setTimeout(() => {
          const root = window.document.documentElement;
          if (newTheme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
          } else {
            root.classList.add("light");
            root.classList.remove("dark");
          }
          setIsThemeChanging(false);
        }, 100); // 500ms loading gösterimi
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