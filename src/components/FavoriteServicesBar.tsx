import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Grid, Folder, Sliders, Network, AppWindow, HardDrive, Activity, Cloud, Database, Server, Zap, BarChart2, Layers } from "lucide-react";
import { Card } from 'antd';

const ICONS = { Grid, Folder, Sliders, Network, AppWindow, HardDrive, Activity, Cloud, Database, Server, Zap, BarChart2, Layers };

interface FavoriteMenuItem {
  key: string;
  icon: keyof typeof ICONS;
  href?: string;
  label?: string;
  favorite?: number;
  children?: FavoriteMenuItem[];
}

export default function FavoriteServicesBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteMenuItem[]>([]);

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
    <Card
      className="w-full rounded-lg shadow px-2 py-4 md:px-8 md:py-6 bg-white"
      style={{ margin: '0 auto' }}
    >
      <span className="text-lg font-semibold mb-4 block text-center">Azure services</span>
      <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:gap-8 w-full items-center md:items-start justify-center">
        {favorites.map((fav) => {
          const Icon = ICONS[fav.icon];
          return (
            <button
              key={fav.href}
              className="flex flex-col items-center justify-center w-20 mx-auto md:mx-2 group"
              onClick={() => fav.href && navigate(fav.href)}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200 transition-colors mb-1">
                {Icon && <Icon size={32} />}
              </div>
              <span className="text-xs text-center text-gray-600 max-w-[80px] truncate" style={{ fontSize: 13 }}>{t(`sidebar.${fav.key}`)}</span>
            </button>
          );
        })}
        <button
          className="flex flex-col items-center justify-center w-20 mx-auto md:mx-2 group md:ml-auto"
          onClick={() => navigate("/all-services")}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-700 group-hover:bg-blue-200 transition-colors mb-1">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-xs text-center text-blue-600 max-w-[80px] truncate" style={{ fontSize: 13 }}>{t("sidebar.allServices", "More services")}</span>
        </button>
      </div>
    </Card>
  );
} 