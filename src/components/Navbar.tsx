import { Globe, Moon, Sun, Menu as MenuIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { setLanguage } from "@/lib/langSlice";
import { setTheme } from "@/lib/themeSlice";
import { useTranslation } from "react-i18next";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function Navbar({ minimal = false, onMenuClick, hideSearchAndMenu = false }: { minimal?: boolean, onMenuClick?: () => void, hideSearchAndMenu?: boolean }) {
  const lang = useSelector((state: RootState) => state.lang.language);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  return (
    <>
      <nav className={`sticky top-0 z-40 w-full flex items-center justify-between px-4 md:px-12 py-6 border-b border-border shadow-sm bg-background ${theme === "dark" ? "bg-zinc-900/80" : "bg-white/80"}`}>
        {/* Hamburger icon - mobile only */}
        {!hideSearchAndMenu && (
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 rounded group hover:bg-green-100 dark:hover:bg-green-900"
              onClick={onMenuClick}
              aria-label="Menüyü Aç"
            >
              <MenuIcon size={24} className="group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors" />
            </button>
            {minimal && (
              <div
                className="flex items-center bg-background border border-gray-200 dark:border-zinc-700 rounded-full px-2 py-1 ml-1 shadow-sm cursor-pointer transition hover:bg-green-50 dark:hover:bg-zinc-800"
                style={{ minWidth: 0, maxWidth: 140 }}
                onClick={() => setSearchModalOpen(true)}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-green-600 dark:text-green-300 mr-1"><path d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <input
                  type="text"
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 w-16"
                  placeholder={t("navbar.search")}
                  style={{ minWidth: 0, pointerEvents: 'none' }}
                  readOnly
                />
              </div>
            )}
          </div>
        )}
        {!minimal && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-green-700 dark:text-green-300">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-14a6 6 0 1 0 0 12A6 6 0 0 0 12 6Z" fill="currentColor" />
              </svg>
            </span>
            <span className="font-bold text-xl text-green-700 dark:text-green-300">ApexScouty</span>
          </div>
        )}
        <div className="flex w-full justify-center">
          {!minimal && !hideSearchAndMenu && (
            <div className="mx-auto w-full max-w-xl px-4">
              <SearchBar
                onSearch={async (query) => {
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
        </div>
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
      {/* Modal for mobile search */}
      {minimal && searchModalOpen && !hideSearchAndMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex flex-col">
          <div className="bg-background p-4 shadow-lg flex flex-col w-full max-w-lg mx-auto mt-8 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">{t("navbar.search")}</span>
              <button onClick={() => setSearchModalOpen(false)} className="text-2xl px-2">×</button>
            </div>
            <SearchBar
              onSearch={async (query) => {
                return [
                  { id: 1, label: "Kubernetes services" },
                  { id: 2, label: "SQL databases" },
                  { id: 3, label: "Virtual machines" }
                ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
              }}
              placeholder={t("navbar.search")}
            />
          </div>
        </div>
      )}
    </>
  );
} 