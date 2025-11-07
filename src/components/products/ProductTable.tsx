import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Button, Space, Tag, Switch, Tooltip, theme, Card } from 'antd';
import {
  Edit,
  Eye,
  Trash2,
  Calendar,
  Package,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import PermissionGuard from '@/components/PermissionGuard';
import { useTheme } from '@/providers/theme';

export interface Product {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  capacity?: number | null;
  marketingFeatures: string[];
  statementDescriptor: string;
  unitLabel: string;
  createdAt: string;
  updatedAt: string;
  prices?: Price[];
  defaultPriceId?: string;
}

export interface Price {
  id: string;
  createdAt: string;
  currency: string;
  interval: string;
  isActive: boolean;
  productId: string;
  unitAmount: number;
  statementDescriptor?: string;
  unitLabel?: string;
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
  const { theme: currentTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStatusChange = (productId: string, _: boolean) => {
    onStatusChange(productId);
  };

  const columns: ColumnsType<Product> = [
    {
      title: t('product.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span
          style={{
            color: currentTheme === 'dark' ? '#ffffff' : token.colorText,
            fontWeight: 500,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: t('product.description'),
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <span
          style={{
            color:
              currentTheme === 'dark' ? '#ffffff' : token.colorTextSecondary,
          }}
          className="block max-w-xs truncate"
        >
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
            <span
              style={{
                color:
                  currentTheme === 'dark'
                    ? '#ffffff'
                    : token.colorTextQuaternary,
              }}
            >
              -
            </span>
          )}
          {features && features.length > 2 && (
            <Tag
              color={currentTheme === 'dark' ? 'default' : 'blue'}
              className="text-xs"
            >
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
        <span
          style={{
            color:
              currentTheme === 'dark' ? '#ffffff' : token.colorTextSecondary,
          }}
        >
          {text || '-'}
        </span>
      ),
    },
    {
      title: t('product.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: Product) => (
        <div className="flex items-center gap-2">
          <PermissionGuard permission="change-product-status" mode="disable">
            <Switch
              checked={isActive}
              onChange={checked => handleStatusChange(record.id, checked)}
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
      title: t('product.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span
          style={{
            color:
              currentTheme === 'dark' ? '#ffffff' : token.colorTextTertiary,
          }}
        >
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record: Product) => (
        <Space size="small">
          <PermissionGuard permission="get-product" mode="hide">
            <Tooltip title={t('common.view')}>
              <Button
                type="text"
                size="small"
                icon={<Eye size={16} />}
                onClick={() => onView(record.id)}
                style={{
                  color:
                    currentTheme === 'dark' ? '#ffffff' : token.colorPrimary,
                }}
              />
            </Tooltip>
          </PermissionGuard>

          <PermissionGuard permission="update-product" mode="hide">
            <Tooltip title={t('common.edit')}>
              <Button
                type="text"
                size="small"
                icon={<Edit size={16} />}
                onClick={() => onEdit(record.id)}
                style={{
                  color:
                    currentTheme === 'dark' ? '#ffffff' : token.colorSuccess,
                }}
              />
            </Tooltip>
          </PermissionGuard>

          <PermissionGuard permission="delete-product" mode="hide">
            <Tooltip title={t('common.delete')}>
              <Button
                type="text"
                size="small"
                icon={<Trash2 size={16} />}
                onClick={() => onDelete(record.id, record.name)}
                style={{
                  color: currentTheme === 'dark' ? '#ffffff' : token.colorError,
                }}
              />
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  // Mobile Card Component
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const isExpanded = openCard === product.id;

    return (
      <Card
        style={{
          cursor: 'pointer',
          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
          borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
          borderRadius: '8px',
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
        bodyStyle={{ padding: '12px' }}
        onClick={() => setOpenCard(isExpanded ? null : product.id)}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Package
                size={14}
                className={
                  currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }
              />
              <h3
                className="flex-1 truncate text-sm font-medium"
                style={{
                  color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                }}
              >
                {product.name}
              </h3>
            </div>

            <div className="mb-1 flex items-center gap-2">
              <span
                className="text-xs"
                style={{
                  color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280',
                }}
              >
                Status:
              </span>
              <PermissionGuard
                permission="change-product-status"
                mode="disable"
              >
                <div onClick={e => e.stopPropagation()}>
                  <Switch
                    checked={product.isActive}
                    onChange={checked =>
                      handleStatusChange(product.id, checked)
                    }
                    size="small"
                  />
                </div>
              </PermissionGuard>
              <Tag
                color={product.isActive ? 'success' : 'default'}
                style={{ fontSize: '10px' }}
              >
                {product.isActive ? 'Aktif' : 'Pasif'}
              </Tag>
            </div>

            {product.description && (
              <div className="mb-1">
                <span
                  className="line-clamp-2 text-xs"
                  style={{
                    color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280',
                  }}
                >
                  {product.description}
                </span>
              </div>
            )}

            {product.marketingFeatures &&
              product.marketingFeatures.length > 0 && (
                <div className="mb-1 flex flex-wrap gap-1">
                  {product.marketingFeatures
                    .slice(0, 2)
                    .map((feature, index) => (
                      <Tag key={index} color="blue" className="text-xs">
                        {feature}
                      </Tag>
                    ))}
                  {product.marketingFeatures.length > 2 && (
                    <Tag color="default" className="text-xs">
                      +{product.marketingFeatures.length - 2}
                    </Tag>
                  )}
                </div>
              )}

            <div className="flex items-center gap-1">
              <Calendar
                size={12}
                className={
                  currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }
              />
              <span
                className="text-xs"
                style={{
                  color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280',
                }}
              >
                {new Date(product.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>

          <Button
            type="text"
            size="small"
            onClick={e => {
              e.stopPropagation();
              setOpenCard(isExpanded ? null : product.id);
            }}
            className="h-auto p-0"
            style={{ minWidth: 'auto' }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>

        {isExpanded && (
          <div
            className="mt-3 border-t pt-3"
            style={{
              borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          >
            {product.unitLabel && (
              <div className="mb-3">
                <span
                  className="text-xs font-medium"
                  style={{
                    color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                  }}
                >
                  {t('product.mobile.unitLabel')}:
                </span>
                <span
                  className="ml-2 text-xs"
                  style={{
                    color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280',
                  }}
                >
                  {product.unitLabel}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              <PermissionGuard permission="get-product" mode="hide">
                <Tooltip title={t('common.view')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<Eye size={12} />}
                    onClick={e => {
                      e.stopPropagation();
                      onView(product.id);
                    }}
                    style={{
                      color:
                        currentTheme === 'dark'
                          ? '#ffffff'
                          : token.colorPrimary,
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px',
                    }}
                  >
                    {t('product.mobile.view')}
                  </Button>
                </Tooltip>
              </PermissionGuard>

              <PermissionGuard permission="update-product" mode="hide">
                <Tooltip title={t('common.edit')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<Edit size={12} />}
                    onClick={e => {
                      e.stopPropagation();
                      onEdit(product.id);
                    }}
                    style={{
                      color:
                        currentTheme === 'dark'
                          ? '#ffffff'
                          : token.colorSuccess,
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px',
                    }}
                  >
                    {t('product.mobile.edit')}
                  </Button>
                </Tooltip>
              </PermissionGuard>

              <PermissionGuard permission="delete-product" mode="hide">
                <Tooltip title={t('common.delete')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<Trash2 size={12} />}
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(product.id, product.name);
                    }}
                    style={{
                      color:
                        currentTheme === 'dark' ? '#ffffff' : token.colorError,
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px',
                    }}
                    danger
                  >
                    {t('product.mobile.delete')}
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
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {loading && (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      loading={loading}
      pagination={false}
      style={{
        backgroundColor:
          currentTheme === 'dark' ? '#1f1f1f' : token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadow,
      }}
      rowClassName={
        currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
      }
    />
  );
};

export default ProductTable;
