import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import sidebarMenu from "@/data/sidebarMenu.json";
import { Home, BarChart2, Layers, Grid, Folder, Zap, Database, Cloud, Server, Sliders, AppWindow, HardDrive, Network, Activity, Users, Shield, Star } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { logout } from "@/lib/authSlice";
import { filterMenuItemsByPermissions, canRead, type MenuItem } from "@/lib/utils";

const ICONS = { Home, BarChart2, Layers, Grid, Folder, Zap, Database, Cloud, Server, Sliders, AppWindow, HardDrive, Network, Activity, Users, Shield, Star };

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const lang = useSelector((state: RootState) => state.lang.language);
  const user = useSelector((state: RootState) => state.auth.user);
  const [allServicesOpen, setAllServicesOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  if (i18n.language !== lang) return null;

  // Kullanıcının Read izni yoksa hiçbir şey gösterme
  if (!canRead(user)) {
    return (
      <aside className="h-screen w-64 bg-white dark:bg-zinc-900 border-r border-border flex flex-col py-6 px-4 md:fixed top-0 left-0 z-40">
        <div className="mb-8 cursor-pointer font-bold text-green-700 dark:text-green-300 text-center hover:text-green-600 dark:hover:text-green-300 text-3xl">ApexScouty</div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Shield size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm">Bu sayfaya erişim izniniz bulunmamaktadır.</p>
          </div>
        </div>
        <div className="mt-auto">
          <button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition-colors mb-3"
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M16 17l5-5m0 0l-5-5m5 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t("sidebar.logout")}
          </button>
          <div className="text-xs text-muted-foreground text-center">© 2024 ApexScouty</div>
        </div>
      </aside>
    );
  }

  // Permission'a göre menü öğelerini filtrele
  const filteredMenu = filterMenuItemsByPermissions(sidebarMenu as MenuItem[], user);
  
  // Sabit menüler
  const fixedMenus = filteredMenu.filter((item: MenuItem) => item.fixed);
  // All services menüsü
  const allServices = filteredMenu.find((item: MenuItem) => item.key === "allServices");
  const children = allServices?.children || [];
  const favorites = children.filter((c: MenuItem) => c.favorite === 1);
  const others = children.filter((c: MenuItem) => c.favorite !== 1);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success(t("sidebar.logoutSuccess", "Başarıyla çıkış yapıldı!"));
  };

  return (
    <aside className="h-screen w-64 bg-background border-r border-border flex flex-col py-6 px-4 md:fixed top-0 left-0 z-40">
      <div onClick={() => navigate("/dashboard")} className="mb-8 cursor-pointer font-bold  text-center hover:text-green-600 dark:hover:text-green-300 text-3xl">ApexScouty</div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {fixedMenus.map((item: MenuItem) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS];
            if (!item.href) return null;
            return (
              <li key={item.href}>
                <Link to={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-300 transition-colors  dark:text-green-700 font-medium">
                  {Icon && <Icon size={20} className="shrink-0" />}
                  <span>{t(`sidebar.${item.key}`)}</span>
                </Link>
              </li>
            );
          })}
          {allServices && (
            <li>
              <button
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg dark:text-green-700 dark:hover:bg-green-400 transition-colors  font-medium focus:outline-none"
                onClick={() => setAllServicesOpen((v) => !v)}
                aria-expanded={allServicesOpen}
              >
                <Layers size={20} className="shrink-0" />
                <span>{t("sidebar.allServices")}</span>
                <svg className={`ml-auto transition-transform ${allServicesOpen ? "rotate-90" : "rotate-0"}`} width="16" height="16" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {allServicesOpen && (
                <div className="pl-4 mt-2">
                  {favorites.length > 0 && (
                    <>
                      <div className="text-xs font-bold text-gray-800 dark:text-gray-400 mb-1 flex items-center gap-1">
                        <Star size={14} className="text-yellow-400" /> {t("sidebar.favorites")}
                      </div>
                      <ul className="mb-2">
                        {favorites.map((item: MenuItem) => {
                          const Icon = ICONS[item.icon as keyof typeof ICONS];
                          if (!item.href) return null;
                          return (
                            <li key={item.href}>
                              <Link to={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-yellow-500 hover:bg-yellow-100  transition-colors  font-medium">
                                {Icon && <Icon size={18} className="shrink-0" />}
                                <span>{t(`sidebar.${item.key}`)}</span>
                                <span className="ml-auto text-yellow-400">★</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                  <ul>
                    {others.map((item: MenuItem) => {
                      const Icon = ICONS[item.icon as keyof typeof ICONS];
                      if (!item.href) return null;
                      return (
                        <li key={item.href}>
                          <Link to={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg  dark:hover:bg-green-500 transition-colors  font-medium">
                            {Icon && <Icon size={18} className="shrink-0" />}
                            <span>{t(`sidebar.${item.key}`)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>
      <div className="mt-auto">
        <button
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition-colors mb-3"
          onClick={handleLogout}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M16 17l5-5m0 0l-5-5m5 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
         {t("sidebar.logout")}
        </button>
        <div className="text-xs text-muted-foreground text-center">© 2024 ApexScouty</div>
      </div>
    </aside>
  );
} 