import { Card, Table as AntdTable, Button, Row, Col, Tabs } from "antd";
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import FavoriteServicesBar from "@/components/FavoriteServicesBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

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

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>{t("sidebar.dashboard")}</h1>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: '#d1fae5', padding: 12, borderRadius: '50%' }}>
                  <Users className="text-green-700 dark:text-green-300" size={28} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>1,245</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>{t("dashboard.users")}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: '#dbeafe', padding: 12, borderRadius: '50%' }}>
                  <ShoppingCart className="text-blue-700 dark:text-blue-300" size={28} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>320</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>{t("dashboard.orders")}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: '#fef9c3', padding: 12, borderRadius: '50%' }}>
                  <TrendingUp className="text-yellow-700 dark:text-yellow-300" size={28} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>%18</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>{t("dashboard.growth")}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: '#ede9fe', padding: 12, borderRadius: '50%' }}>
                  <DollarSign className="text-purple-700 dark:text-purple-300" size={28} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>₺12.500</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>{t("dashboard.revenue")}</div>
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
            label: t("table.recent"),
          }, {
            key: 'favorite',
            label: t("table.favorite"),
          }]}
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
            />
          </div>
        ) : (
          <div style={{ marginTop: 16, width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredResources.map((item) => (
              <Card
                key={item.name + item.type}
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenCard(openCard === item.name ? null : item.name)}
                bodyStyle={{ padding: 16 }}
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