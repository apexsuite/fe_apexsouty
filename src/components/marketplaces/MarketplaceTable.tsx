import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Table, Button, Space, Tag, Switch, Tooltip, theme } from 'antd';
import { Edit, Eye, ExternalLink, Trash2 } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { RootState } from '@/lib/store';
import { Marketplace } from '@/lib/marketplaceSlice';

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
          <Switch
            checked={isActive}
            onChange={(checked) => handleStatusChange(record.id, checked)}
            className={`custom-switch ${currentTheme === 'dark' ? 'dark-switch' : ''}`}
          />
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
          <Tooltip title={t('common.view')}>
            <Button
              type="text"
              size="small"
              icon={<Eye size={16} />}
              onClick={() => onView(record.id)}
              style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorPrimary }}
            />
          </Tooltip>
          
          <Tooltip title={t('common.edit')}>
            <Button
              type="text"
              size="small"
              icon={<Edit size={16} />}
              onClick={() => onEdit(record.id)}
              style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorSuccess }}
            />
          </Tooltip>

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
        </Space>
      ),
    },
  ];

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
