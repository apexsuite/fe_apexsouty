import { Card } from "@/components/ui/card";
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import FavoriteServicesBar from "@/components/FavoriteServicesBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Resource {
  name: string;
  type: string;
  lastViewed: string;
  favorite?: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'favorite'>('recent');
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    // Authentication kontrolü
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    import("@/data/resource.json").then((data) => {
      setResources(data.default as Resource[]);
    });
  }, [isAuthenticated, navigate]);

  // Eğer kullanıcı giriş yapmamışsa loading göster
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></span>
      </div>
    );
  }

  const filteredResources = activeTab === 'recent'
    ? resources
    : resources.filter(r => r.favorite === 1);

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-background">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-8 ">{t("sidebar.dashboard")}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex items-center gap-4 p-6">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <Users className="text-green-700 dark:text-green-300" size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold ">1,245</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{t("dashboard.users")}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <ShoppingCart className="text-blue-700 dark:text-blue-300" size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold ">320</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{t("dashboard.orders")}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-6">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <TrendingUp className="text-yellow-700 dark:text-yellow-300" size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold ">%18</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{t("dashboard.growth")}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-6">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <DollarSign className="text-purple-700 dark:text-purple-300" size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold ">₺12.500</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{t("dashboard.revenue")}</div>
            </div>
          </Card>
        </div>
      </div>
      <FavoriteServicesBar />
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4 ">{t("table.resources")}</h2>
        <div className="flex gap-8 border-b mb-2">
          <button
            className={`px-2 pb-2 font-medium border-b-2 transition-colors ${activeTab === 'recent' ? 'border-blue-600 text-blue-700 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActiveTab('recent')}
          >
            {t("table.recent")}
          </button>
          <button
            className={`px-2 pb-2 font-medium border-b-2 transition-colors ${activeTab === 'favorite' ? 'border-blue-600 text-blue-700 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActiveTab('favorite')}
          >
            {t("table.favorite")}
          </button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">{t("table.name")}</TableHead>
                <TableHead className="">{t("table.type")}</TableHead>
                <TableHead className="">{t("table.lastViewed")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((r, i) => (
                <TableRow key={r.name + i}>
                  <TableCell className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">{r.name}</TableCell>
                  <TableCell className="">{r.type}</TableCell>
                  <TableCell className="whitespace-nowrap ">{r.lastViewed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm px-2 py-1"
            onClick={() => navigate("/all-resources")}
          >
            {t("table.seeAll")}
          </button>
        </div>
      </div>
    </div>
  );
} 