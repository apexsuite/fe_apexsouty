import { useState, useRef, useEffect } from "react";
import { Search, Loader2, Star, Grid, Folder, Sliders, Network, AppWindow, HardDrive, Activity, Cloud, Database, Server, Zap, BarChart2, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchResult {
  id: string | number;
  label: string;
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
}

const ICONS = { Grid, Folder, Sliders, Network, AppWindow, HardDrive, Activity, Cloud, Database, Server, Zap, BarChart2, Layers };

export default function SearchBar({ onSearch, placeholder = "Ara..." }: SearchBarProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<FavoriteMenuItem[]>([]);

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

  function getAllFavorites(menu: FavoriteMenuItem[]): FavoriteMenuItem[] {
    let favs: FavoriteMenuItem[] = [];
    for (const item of menu) {
      if (item.favorite === 1) favs.push(item);
      if (item.children) favs = favs.concat(getAllFavorites(item.children));
    }
    return favs;
  }

  useEffect(() => {
    import("@/data/sidebarMenu.json").then((menu) => {
      setFavorites(getAllFavorites(menu.default as FavoriteMenuItem[]));
    });
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl">
      <div className="flex items-center border rounded-lg bg-background px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-green-500">
        <Search size={20} className="text-gray-500 dark:text-gray-400 mr-2.5" />
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none text-base text-gray-900 dark:text-gray-100"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onClick={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />
        {loading && <Loader2 size={20} className="animate-spin ml-2.5 text-gray-500 dark:text-gray-400" />}
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
              <div className="flex flex-wrap gap-3 px-4 py-2">
                {favorites.map((fav) => {
                  const Icon = ICONS[fav.icon];
                  return (
                    <div key={fav.href} className="flex flex-col items-center gap-1">
                      <button
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                        onMouseDown={() => handleSelect(fav)}
                      >
                        {Icon && <Icon size={24} />}
                      </button>
                      <span className="text-xs  ">{t(`sidebar.${fav.key}`)}</span>
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
                  const Icon = ICONS[fav.icon];
                  return (
                    <div key={fav.href} className="flex cursor-pointer flex-col items-center gap-1">
                      <button
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                        onMouseDown={() => handleSelect(fav)}
                      >
                        {Icon && <Icon size={24} />}
                      </button>
                      <span className="text-xs text-gray-900 dark:text-gray-200">{t(`sidebar.${fav.key}`)}</span>
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