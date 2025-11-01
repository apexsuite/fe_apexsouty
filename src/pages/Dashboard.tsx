import { Card, Table as AntdTable, Button, Row, Col, Tabs } from "antd";
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import FavoriteServicesBar from "@/components/FavoriteServicesBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { validateAmazonConsent } from "@/lib/consentSlice";
import { useErrorHandler } from "@/lib/useErrorHandler";
import CustomDataTable from "@/components/CustomDataTable";

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
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { handleError, showSuccess } = useErrorHandler();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    import("@/data/resource.json").then((data) => {
      setResources(data.default as Resource[]);
    });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Senaryo 2: Amazon callback validate - Dashboard'a geldiğinde kontrol et
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const raw = localStorage.getItem('pendingAmazonValidateParams');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.state || parsed.selling_partner_id || parsed.spapi_oauth_code)) {
          dispatch<any>(validateAmazonConsent({
            state: parsed.state || '',
            selling_partner_id: parsed.selling_partner_id || '',
            spapi_oauth_code: parsed.spapi_oauth_code || '',
          }))
            .unwrap()
            .then(() => {
              // Başarılı olursa sessizce devam et
              showSuccess('consentValidationSuccess');
            })
            .catch((err: any) => {
              // Hata varsa uyarı mesajı göster
              handleError(err);
            })
            .finally(() => {
              localStorage.removeItem('pendingAmazonValidateParams');
            });
        }
      }
    } catch (e) {
      console.error('Error parsing pendingAmazonValidateParams:', e);
      localStorage.removeItem('pendingAmazonValidateParams');
    }
  }, [isAuthenticated, dispatch, handleError, showSuccess]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></span>
      </div>
    );
  }

  const columns = [
    { title: t("table.name"), dataIndex: "name", key: "name", ellipsis: true, width: 120, render: (text: string) => <span className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{text}</span> },
    { title: t("table.type"), dataIndex: "type", key: "type", ellipsis: true, width: 120 },
    { title: t("table.lastViewed"), dataIndex: "lastViewed", key: "lastViewed", ellipsis: true, width: 120 },
  ];

  const filteredResources = activeTab === 'recent'
    ? resources
    : resources.filter(r => r.favorite === 1);

  const data = [
    { name: "John Doe", type: "User", lastViewed: "2021-01-01" },
    { name: "Jane Doe", type: "User", lastViewed: "2021-01-01" },
    { name: "John Doe", type: "User", lastViewed: "2021-01-01" },
    { name: "Jane Doe", type: "User", lastViewed: "2021-01-01" },

    { name: "John Doe", type: "User", lastViewed: "2021-01-01" },
    { name: "Jane Doe", type: "User", lastViewed: "2021-01-01" },
  ]

  const fakeColumns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Last Viewed",
      accessorKey: "lastViewed",
    }
  ]
  return (
    <div className="min-h-screen w-full px-6 md:px-12 py-12 bg-background">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>{t("sidebar.dashboard")}</h1>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={6}>
            <Card className="bg-background text-foreground" bodyStyle={{ background: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="bg-green-100 dark:bg-green-900" style={{ padding: 12, borderRadius: '50%' }}>
                  <Users className="text-green-700 dark:text-green-300" size={28} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>1,245</div>
                  <div className="text-muted-foreground" style={{ fontSize: 14 }}>{t("dashboard.users")}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="bg-background text-foreground" bodyStyle={{ background: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="bg-blue-100 dark:bg-blue-900" style={{ padding: 12, borderRadius: '50%' }}>
                  <ShoppingCart className="text-blue-700 dark:text-blue-300" size={28} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>320</div>
                  <div className="text-muted-foreground" style={{ fontSize: 14 }}>{t("dashboard.orders")}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="bg-background text-foreground" bodyStyle={{ background: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="bg-yellow-100 dark:bg-yellow-900" style={{ padding: 12, borderRadius: '50%' }}>
                  <TrendingUp className="text-yellow-700 dark:text-yellow-300" size={28} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>%18</div>
                  <div className="text-muted-foreground" style={{ fontSize: 14 }}>{t("dashboard.growth")}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="bg-background text-foreground" bodyStyle={{ background: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="bg-purple-100 dark:bg-purple-900" style={{ padding: 12, borderRadius: '50%' }}>
                  <DollarSign className="text-purple-700 dark:text-purple-300" size={28} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>₺12.500</div>
                  <div className="text-muted-foreground" style={{ fontSize: 14 }}>{t("dashboard.revenue")}</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <FavoriteServicesBar />
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{t("table.resources")}</h2>
        <Tabs
          activeKey={activeTab}
          onChange={key => setActiveTab(key as 'recent' | 'favorite')}
          items={[{
            key: 'recent',
            label: <span className="text-foreground">{t("table.recent")}</span>,
          }, {
            key: 'favorite',
            label: <span className="text-foreground hover:text-blue-400 dark:hover:text-blue-300">{t("table.favorite")}</span>,
          }]}
          className="custom-tabs"
        />
        {/* Masaüstü: Tablo, Mobil: Card List */}
        {!isMobile ? (
          <div style={{ marginTop: 16, width: '100%' }}>
            <AntdTable
              columns={columns}
              dataSource={filteredResources}
              pagination={false}
              rowKey={(r) => r.name + r.type}
              scroll={{ x: true }}
              className="bg-background text-foreground"
            />
          </div>
        ) : (
          <div style={{ marginTop: 16, width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredResources.map((item) => (
              <Card
                key={item.name + item.type}
                style={{ cursor: 'pointer', background: 'inherit' }}
                className="bg-background dark:bg-zinc-900 text-foreground"
                bodyStyle={{ padding: 16, background: 'inherit' }}
                onClick={() => setOpenCard(openCard === item.name ? null : item.name)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1677ff' }}>{item.name}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{item.type}</div>
                  </div>
                  <Button type="link" size="small" onClick={e => { e.stopPropagation(); setOpenCard(openCard === item.name ? null : item.name); }}>
                    {openCard === item.name ? t('table.closeDetails', 'Kapat') : t('table.showDetails', 'Detay')}
                  </Button>
                </div>
                {openCard === item.name && (
                  <div style={{ marginTop: 12, color: '#444', fontSize: 14 }}>
                    <div><b>{t('table.lastViewed')}:</b> {item.lastViewed}</div>
                    {item.favorite === 1 && <div style={{ color: '#f59e42' }}>{t('table.favorite')}</div>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <Button type="link" onClick={() => navigate("/all-resources")}>{t("table.seeAll")}</Button>
        </div>
      </div>
    </div>
  );
} 