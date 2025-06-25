import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Folder, Sliders, Network, AppWindow, HardDrive, Activity, Cloud, Database, Server, Zap, BarChart2, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const ICONS = { Grid, Folder, Sliders, Network, AppWindow, HardDrive, Activity, Cloud, Database, Server, Zap, BarChart2, Layers };

interface ServiceMenuItem {
  key: string;
  icon: keyof typeof ICONS;
  href?: string;
  label?: string;
  favorite?: number;
  children?: ServiceMenuItem[];
}

export default function ServicesPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceMenuItem[]>([]);

  function getAllServices(menu: ServiceMenuItem[]): ServiceMenuItem[] {
    let all: ServiceMenuItem[] = [];
    for (const item of menu) {
      if (item.children) {
        all = all.concat(getAllServices(item.children));
      } else if (item.href) {
        all.push(item);
      }
    }
    return all;
  }

  useEffect(() => {
    import("@/data/sidebarMenu.json").then((menu) => {
      const allServices = getAllServices(menu.default as ServiceMenuItem[]);
      setServices(allServices);
    });
  }, []);

  return (
    <div className="w-full  px-6 md:px-12 py-12">
      <h1 className="text-2xl font-bold mb-8">{t("sidebar.allServices")}</h1>
      <div className="flex flex-col gap-4">
        {services.map((service) => {
          const Icon = ICONS[service.icon];
          return (
            <Link
              key={service.href}
              to={service.href || "#"}
              className="flex items-center gap-4 px-4 py-4 rounded-xl bg-background shadow hover:shadow-lg  transition-all border border-transparent hover:border-green-200 dark:hover:border-green-600 group w-full"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800 transition-colors">
                {Icon && <Icon size={24} />}
              </div>
              <span className="text-sm font-medium  truncate">
                {t(`sidebar.${service.key}`)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 