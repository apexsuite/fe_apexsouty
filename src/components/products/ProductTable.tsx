import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Table, Button, Space, Tag, Switch, Tooltip, Dropdown, theme } from 'antd';
import { Edit, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { RootState } from '@/lib/store';

export interface Product {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  marketingFeatures: string[];
  statementDescriptor: string;
  unitLabel: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (productId: string) => void;
  onView: (productId: string) => void;
  onDelete: (productId: string, productName: string) => void;
  onStatusChange: (productId: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);

  const handleStatusChange = (productId: string, _: boolean) => {
    onStatusChange(productId);
  };

  const columns: ColumnsType<Product> = [
    {
      title: t('product.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorText, fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: t('product.description'),
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <span style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorTextSecondary }} className="truncate max-w-xs block">
          {text || '-'}
        </span>
      ),
    },
    {
      title: t('product.marketingFeatures'),
      dataIndex: 'marketingFeatures',
      key: 'marketingFeatures',
      render: (features: string[]) => (
        <div className="flex flex-wrap gap-1">
          {features && features.length > 0 ? (
            features.slice(0, 2).map((feature, index) => (
              <Tag key={index} color="blue" className="text-xs">
                {feature}
              </Tag>
            ))
          ) : (
            <span style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorTextQuaternary }}>-</span>
          )}
          {features && features.length > 2 && (
            <Tag color={currentTheme === 'dark' ? 'default' : 'blue'} className="text-xs">
              +{features.length - 2}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: t('product.unitLabel'),
      dataIndex: 'unitLabel',
      key: 'unitLabel',
      render: (text: string) => (
        <span style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorTextSecondary }}>{text || '-'}</span>
      ),
    },
    {
      title: t('product.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: Product) => (
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
      title: t('product.createdAt'),
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
      render: (_, record: Product) => (
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
          
          <Dropdown
            menu={{
              items: [
                {
                  key: 'delete',
                  label: t('common.delete'),
                  icon: <Trash2 size={16} />,
                  danger: true,
                  onClick: () => onDelete(record.id, record.name),
                },
              ],
            }}
            trigger={['click']}
            overlayStyle={{
              backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated,
              border: `1px solid ${token.colorBorder}`,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadow
            }}
            overlayClassName={currentTheme === 'dark' ? 'dark-dropdown' : ''}
          >
            <Button
              type="text"
              size="small"
              icon={<MoreHorizontal size={16} />}
              style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorTextSecondary }}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
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

export default ProductTable; 