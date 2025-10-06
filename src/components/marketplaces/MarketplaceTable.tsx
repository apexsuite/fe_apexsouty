import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Table, Button, Space, Tag, Switch, Tooltip, theme, Card } from 'antd';
import { Edit, Eye, ExternalLink, Trash2, Calendar, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { RootState } from '@/lib/store';
import { Marketplace } from '@/lib/marketplaceSlice';
import PermissionGuard from '@/components/PermissionGuard';

interface MarketplaceTableProps {
  marketplaces: Marketplace[];
  loading: boolean;
  onEdit: (marketplaceId: string) => void;
  onView: (marketplaceId: string) => void;
  onDelete: (marketplaceId: string, marketplaceName: string) => void;
  onStatusChange: (marketplaceId: string) => void;
}

const MarketplaceTable: React.FC<MarketplaceTableProps> = ({
  marketplaces,
  loading,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStatusChange = (marketplaceId: string, _: boolean) => {
    onStatusChange(marketplaceId);
  };

  const columns: ColumnsType<Marketplace> = [
    {
      title: t('marketplace.name'),
      dataIndex: 'marketplace',
      key: 'marketplace',
      render: (text: string) => (
        <span style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorText, fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: t('marketplace.website'),
      dataIndex: 'marketplaceURL',
      key: 'marketplaceURL',
      render: (url: string) => (
        <div className="flex items-center gap-2">
          <span style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorTextSecondary }} className="truncate max-w-xs">
            {url || '-'}
          </span>
          {url && (
            <a 
              href={url.startsWith('http') ? url : `https://${url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      ),
    },
    {
      title: t('marketplace.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: Marketplace) => (
        <div className="flex items-center gap-2">
          <PermissionGuard 
            permission="change-marketplace-status" 
            mode="disable"
          >
            <Switch
              checked={isActive}
              onChange={(checked) => handleStatusChange(record.id, checked)}
              className={`custom-switch ${currentTheme === 'dark' ? 'dark-switch' : ''}`}
            />
          </PermissionGuard>
          <Tag color={isActive ? 'success' : 'default'}>
            {isActive ? t('common.active') : t('common.inactive')}
          </Tag>
        </div>
      ),
    },
    {
      title: t('marketplace.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorTextTertiary }}>
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record: Marketplace) => (
        <Space size="small">
          <PermissionGuard 
            permission="get-marketplace" 
            mode="hide"
          >
            <Tooltip title={t('common.view')}>
              <Button
                type="text"
                size="small"
                icon={<Eye size={16} />}
                onClick={() => onView(record.id)}
                style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorPrimary }}
              />
            </Tooltip>
          </PermissionGuard>
          
          <PermissionGuard 
            permission="update-marketplace" 
            mode="hide"
          >
            <Tooltip title={t('common.edit')}>
              <Button
                type="text"
                size="small"
                icon={<Edit size={16} />}
                onClick={() => onEdit(record.id)}
                style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorSuccess }}
              />
            </Tooltip>
          </PermissionGuard>

          <PermissionGuard 
            permission="delete-marketplace" 
            mode="hide"
          >
            <Tooltip title={t('common.delete')}>
              <Button
                type="text"
                size="small"
                icon={<Trash2 size={16} />}
                onClick={() => onDelete(record.id, record.marketplace)}
                style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorError }}
                danger
              />
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  // Mobile Card Component
  const MarketplaceCard: React.FC<{ marketplace: Marketplace }> = ({ marketplace }) => {
    const isExpanded = openCard === marketplace.id;
    
    return (
      <Card
        style={{ 
          cursor: 'pointer',
          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
          borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
        bodyStyle={{ padding: '12px' }}
        onClick={() => setOpenCard(isExpanded ? null : marketplace.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 
                className="font-medium text-sm truncate"
                style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}
              >
                {marketplace.marketplace}
              </h3>
              <Tag 
                color={marketplace.isActive ? 'success' : 'default'}
              >
                {marketplace.isActive ? 'Aktif' : 'Pasif'}
              </Tag>
            </div>
            
            {marketplace.marketplaceURL && (
              <div className="flex items-center gap-1 mb-1">
                <Globe size={12} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <span 
                  className="text-xs truncate flex-1"
                  style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }}
                >
                  {marketplace.marketplaceURL}
                </span>
                <a 
                  href={marketplace.marketplaceURL.startsWith('http') ? marketplace.marketplaceURL : `https://${marketplace.marketplaceURL}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-500 hover:text-blue-600 flex-shrink-0"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar size={12} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <span 
                className="text-xs"
                style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }}
              >
                {new Date(marketplace.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
          
          <Button 
            type="text" 
            size="small" 
            onClick={(e) => { 
              e.stopPropagation(); 
              setOpenCard(isExpanded ? null : marketplace.id); 
            }}
            className="p-0 h-auto"
            style={{ minWidth: 'auto' }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>

        {isExpanded && (
          <div 
            className="mt-3 pt-3 border-t"
            style={{ borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span 
                  className="text-xs font-medium"
                  style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}
                >
                  {t('marketplace.mobile.status')}:
                </span>
                <PermissionGuard 
                  permission="change-marketplace-status" 
                  mode="disable"
                >
                  <Switch
                    checked={marketplace.isActive}
                    onChange={(checked) => handleStatusChange(marketplace.id, checked)}
                    size="small"
                  />
                </PermissionGuard>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <PermissionGuard 
                permission="get-marketplace" 
                mode="hide"
              >
                <Tooltip title={t('common.view')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<Eye size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(marketplace.id);
                    }}
                    style={{ 
                      color: currentTheme === 'dark' ? '#ffffff' : token.colorPrimary,
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px'
                    }}
                  >
                    {t('marketplace.mobile.view')}
                  </Button>
                </Tooltip>
              </PermissionGuard>
              
              <PermissionGuard 
                permission="update-marketplace" 
                mode="hide"
              >
                <Tooltip title={t('common.edit')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<Edit size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(marketplace.id);
                    }}
                    style={{ 
                      color: currentTheme === 'dark' ? '#ffffff' : token.colorSuccess,
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px'
                    }}
                  >
                    {t('marketplace.mobile.edit')}
                  </Button>
                </Tooltip>
              </PermissionGuard>

              <PermissionGuard 
                permission="delete-marketplace" 
                mode="hide"
              >
                <Tooltip title={t('common.delete')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<Trash2 size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(marketplace.id, marketplace.marketplace);
                    }}
                    style={{ 
                      color: currentTheme === 'dark' ? '#ffffff' : token.colorError,
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px'
                    }}
                    danger
                  >
                    {t('marketplace.mobile.delete')}
                  </Button>
                </Tooltip>
              </PermissionGuard>
            </div>
          </div>
        )}
      </Card>
    );
  };

  if (isMobile) {
    return (
      <div className="space-y-2 px-1">
        {marketplaces.map((marketplace) => (
          <MarketplaceCard key={marketplace.id} marketplace={marketplace} />
        ))}
        {loading && (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={marketplaces}
      rowKey="id"
      loading={loading}
      pagination={false}
      style={{
        backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadow
      }}
      rowClassName={currentTheme === 'dark' ? "hover:bg-gray-800" : "hover:bg-gray-50"}
    />
  );
};

export default MarketplaceTable;
