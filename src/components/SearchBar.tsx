import { useState, useRef, useEffect } from "react";
import { Search, Loader2, Star, Grid, Folder, Sliders, Network, AppWindow, HardDrive, Activity, Cloud, Database, Server, Zap, BarChart2, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/lib/store";
import { fetchMenu, selectMenu, MenuItem, addFavorite } from "@/lib/menuSlice";
import * as LucideIcons from "lucide-react";

interface SearchResult {
  id: string | number;
  label: string;
  path?: string;
}

interface FavoriteMenuItem {
  key: string;
  icon: keyof typeof ICONS;
  href?: string;
  label?: string;
  favorite?: number;
  children?: FavoriteMenuItem[];
  fixed?: boolean;
}

interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  minimal?: boolean;
}

const ICONS = { Grid, Folder, Sliders, Network, AppWindow, HardDrive, Activity, Cloud, Database, Server, Zap, BarChart2, Layers };

export default function SearchBar({ onSearch, placeholder = "Ara...", minimal = false }: SearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const favorites: MenuItem[] = useSelector(selectMenu);
  const [menuFetched, setMenuFetched] = useState(false);

  const dispatchRedux = useDispatch<AppDispatch>();
  const handleFavorite = (pageRouteID: string, isCurrentlyFavorite: boolean) => {
    // Eğer zaten favori ise istek atma
    if (isCurrentlyFavorite) {
      return;
    }
    dispatchRedux(addFavorite(pageRouteID));
  };

  const [history, setHistory] = useState<SearchResult[]>([
    { id: 1, label: "Kubernetes services" },
    { id: 2, label: "SQL databases" },
    { id: 3, label: "Virtual machines" },
  ]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await onSearch(query);
        setResults(res);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && results.length > 0) {
      handleSelect(results[activeIndex]);
    }
  };

  const handleSelect = (item: SearchResult | FavoriteMenuItem) => {
    setQuery("");
    setShowDropdown(false);
    setActiveIndex(-1);
    if ('href' in item && item.href) {
      window.location.href = item.href;
    } else if ('path' in item && item.path) {
      navigate(item.path);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleClearHistory = () => setHistory([]);

  const handleOpenDropdown = () => {
    setShowDropdown(true);
    if (!menuFetched) {
      dispatch(fetchMenu());
      setMenuFetched(true);
    }
  };

  if (minimal) {
    return (
      <div className="relative w-full max-w-xs">
        <div className="flex items-center border rounded bg-background px-2 py-1">
          <Search size={18} className="text-gray-600 dark:text-gray-300 mr-1" />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100"
            placeholder={placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ minWidth: 0 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl">
      <div className="flex items-center border rounded-lg bg-background px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-green-500"
        onClick={handleOpenDropdown}
      >
        <Search size={20} className="text-gray-600 dark:text-gray-300 mr-2.5" />
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none text-base text-gray-900 dark:text-gray-100"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={handleOpenDropdown}
          onKeyDown={handleKeyDown}
        />
        {loading && <Loader2 size={20} className="animate-spin ml-2.5 text-gray-600 dark:text-gray-300" />}
      </div>
      {showDropdown && (
        <div ref={dropdownRef} className="absolute left-0 right-0 mt-1 bg-background border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50 max-h-96 overflow-auto">
          {!query && (
            <>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-xs font-bold  ">{t("searchBar.history")}</span>
                <button className="text-xs text-green-700  hover:underline" onClick={handleClearHistory}>{t("searchBar.clearHistory")}</button>
              </div>
              <ul>
                {history.length === 0 ? (
                  <li className="p-3 text-sm ">{t("searchBar.noHistory")}</li>
                ) : (
                  history.map((item) => (
                    <li
                      key={item.id}
                      className="px-4 py-2 cursor-pointer  "
                      onMouseDown={() => handleSelect(item)}
                    >
                      {item.label}
                    </li>
                  ))
                )}
              </ul>
              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
              <div className="flex items-center gap-1 px-4 pb-1">
                <Star size={14} className="text-yellow-500" />
                <span className="text-xs font-bold  ">{t("searchBar.favorites")}</span>
              </div>
              <div className="flex flex-col gap-2 px-4 py-2">
                {favorites.map((fav: MenuItem) => {
                  const Icon = fav.icon && (LucideIcons as any)[fav.icon];
                  const isFav = fav.isFavourite === true;
                  return (
                    <div 
                      key={fav.id} 
                      className="flex items-center justify-between rounded-md border border-border bg-background dark:bg-yellow-950/80 px-3 py-2 hover:shadow transition-all dark:border-yellow-900 dark:hover:bg-yellow-900/80 cursor-pointer"
                      onClick={() => {
                        if (fav.path) {
                          navigate(fav.path);
                          setShowDropdown(false);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex items-center justify-center w-8 h-8 min-w-[30px] min-h-[30px] rounded-full bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-100">
                          {Icon ? <Icon size={18} style={{ display: 'block' }} /> : (
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{ display: 'block' }}>
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          )}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium truncate text-sm text-gray-900 dark:text-yellow-100">{fav.label}</span>
                          {fav.description && <span className="text-xs text-gray-500 dark:text-yellow-200 truncate">{fav.description}</span>}
                        </div>
                      </div>
                      <button
                        className="ml-2 p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-700 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavorite(fav.pageRouteID || fav.id, isFav);
                        }}
                        title={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
                      >
                        <Star size={20} fill={isFav ? '#facc15' : 'none'} stroke="#facc15" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {query && (
            <>
              <ul>
                {results.length === 0 && !loading ? (
                  <li className="p-3 text-sm text-gray-800 dark:text-gray-300">{t("searchBar.noResults")}</li>
                ) : (
                  results.map((item, idx) => (
                    <li
                      key={item.id || idx}
                      className={`px-4 py-2 cursor-pointer hover:bg-green-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-gray-200 ${activeIndex === idx ? "bg-green-50 dark:bg-zinc-700" : ""}`}
                      onMouseDown={() => handleSelect(item)}
                    >
                      {item.label}
                    </li>
                  ))
                )}
              </ul>
              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
              <div className="flex items-center gap-1 px-4 pb-1">
                <Star size={14} className="text-yellow-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{t("searchBar.favorites")}</span>
              </div>
              <div className="flex flex-wrap gap-3 px-4 py-2">
                {favorites.map((fav) => {
                  const Icon = fav.icon && (LucideIcons as any)[fav.icon];
                  return (
                    <div key={fav.id} className="flex cursor-pointer flex-col items-center gap-1">
                      <button
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                        onMouseDown={() => handleSelect(fav)}
                      >
                        {Icon && <Icon size={24} />}
                      </button>
                      <span className="text-xs text-gray-900 dark:text-gray-200">{t(`sidebar.${typeof (fav as any).key === 'string' ? (fav as any).key : (typeof fav.label === 'string' ? fav.label : fav.id)}`)}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 