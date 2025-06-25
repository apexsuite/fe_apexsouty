import { Globe, Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { setLanguage } from "@/lib/langSlice";
import { setTheme } from "@/lib/themeSlice";
import { useTranslation } from "react-i18next";
import SearchBar from "@/components/SearchBar";

export default function Navbar({ minimal = false }: { minimal?: boolean }) {
  const lang = useSelector((state: RootState) => state.lang.language);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <nav className={`sticky top-0 z-40 w-full flex items-center justify-between px-12 py-6 border-b border-border shadow-sm bg-background ${theme === "dark" ? "bg-zinc-900/80" : "bg-white/80"}`}>
      {!minimal && (
        <div className="flex items-center gap-2">
          <span className="text-green-700 dark:text-green-300">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-14a6 6 0 1 0 0 12A6 6 0 0 0 12 6Z" fill="currentColor" />
            </svg>
          </span>
          <span className="font-bold text-xl text-green-700 dark:text-green-300">ApexScouty</span>
        </div>
      )}
      {minimal && (
        <div className="flex w-full justify-center">
          <SearchBar
            onSearch={async (query) => {
              // Burada API veya local arama yapılabilir
              // Örnek statik sonuçlar
              return [
                { id: 1, label: "Kubernetes services" },
                { id: 2, label: "SQL databases" },
                { id: 3, label: "Virtual machines" }
              ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
            }}
            placeholder={t("navbar.search")}
          />
        </div>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <Globe size={18} className="text-muted-foreground" />

        <button
          className={`font-semibold px-1 cursor-pointer ${lang === "en" ? "text-red-700" : "text-muted-foreground"}`}
          onClick={() => dispatch(setLanguage("en"))}
        >
          EN
        </button>
        <span className="text-muted-foreground">|</span>
        <button
          className={`font-semibold px-1 cursor-pointer ${lang === "tr" ? "text-red-700" : "text-muted-foreground"}`}
          onClick={() => dispatch(setLanguage("tr"))}
        >
          TR
        </button>
        <span className="mx-2 text-muted-foreground">|</span>
        {theme === "dark" ? (
          <button
            className="p-2 rounded hover:bg-zinc-800 transition-colors"
            onClick={() => dispatch(setTheme("light"))}
            aria-label="Açık moda geç"
          >
            <Sun size={20} className="text-yellow-400" />
          </button>
        ) : (
          <button
            className="p-2 rounded hover:bg-zinc-200 transition-colors"
            onClick={() => dispatch(setTheme("dark"))}
            aria-label="Koyu moda geç"
          >
            <Moon size={20} className="text-blue-900" />
          </button>
        )}
      </div>
    </nav>
  );
} 