import { useEffect, useState } from "react";
import { Table as AntdTable, Card, Button } from "antd";
import { useTranslation } from "react-i18next";

interface Resource {
  name: string;
  type: string;
  lastViewed: string;
  favorite?: number;
}

export default function AllResourcesPage() {
  const { t } = useTranslation();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);

  useEffect(() => {
    import("@/data/resource.json").then((data) => {
      setResources(data.default as Resource[]);
    });
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = [
    { title: t("table.name"), dataIndex: "name", key: "name", render: (text: string) => <span style={{ color: '#1677ff', fontWeight: 500, cursor: 'pointer' }}>{text}</span> },
    { title: t("table.type"), dataIndex: "type", key: "type" },
    { title: t("table.lastViewed"), dataIndex: "lastViewed", key: "lastViewed" },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>{t("table.allResources")}</h1>
      {!isMobile ? (
        <AntdTable
          columns={columns}
          dataSource={resources}
          pagination={false}
          rowKey={(r) => r.name + r.type}
          scroll={{ x: true }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {resources.map((item) => (
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
    </div>
  );
} 