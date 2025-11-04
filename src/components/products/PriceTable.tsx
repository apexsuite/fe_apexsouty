  import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Switch, 
  Tooltip, 
  Card,
  Typography,
  theme 
} from 'antd';
import PermissionGuard from '@/components/PermissionGuard';
import { useErrorHandler } from '@/lib/useErrorHandler';
import { 
  Plus, 
  Eye, 
  Star, 
  StarOff,
  DollarSign,
  Calendar,
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { RootState } from '@/lib/store';
import { AppDispatch } from '@/lib/store';
import { useDispatch } from 'react-redux';
import { updatePriceStatus, setDefaultPrice } from '@/lib/productSlice';
import CreatePriceModal from './CreatePriceModal';
import { useTheme } from '@/providers/theme';

const { Title } = Typography;

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

interface PriceTableProps {
  prices: Price[];
  productId: string;
  defaultPriceId?: string;
  loading: boolean;
  onRefresh: () => void;
}

const PriceTable: React.FC<PriceTableProps> = ({
  prices,
  productId,
  defaultPriceId,
  loading,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { theme: currentTheme } = useTheme();
  const { handleError, showSuccess } = useErrorHandler();
  
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [createModalVisible, setCreateModalVisible] = useState(false);
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



  const handleStatusChange = async (priceId: string, isActive: boolean) => {
    setLoadingStates(prev => ({ ...prev, [priceId]: true }));
    try {
      await dispatch(updatePriceStatus({ productId, priceId, isActive })).unwrap();
      showSuccess('priceStatusChangedSuccessfully');
      onRefresh();
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [priceId]: false }));
    }
  };

  const handleSetDefault = async (priceId: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    
    setLoadingStates(prev => ({ ...prev, [priceId]: true }));
    try {
      await dispatch(setDefaultPrice({ productId, priceId })).unwrap();
      showSuccess('priceSetAsDefaultSuccessfully');
      onRefresh();
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [priceId]: false }));
    }
  };

  const handleViewDetail = (priceId: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    
    // Yeni sayfaya yönlendir
    navigate(`/products/${productId}/prices/${priceId}`);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatInterval = (interval: string) => {
    return interval.charAt(0).toUpperCase() + interval.slice(1);
  };

  const columns: ColumnsType<Price> = [
    {
      title: (
        <span className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-500 dark:text-gray-400" />
          {t('price.currency')}
        </span>
      ),
      dataIndex: 'currency',
      key: 'currency',
      render: (currency: string) => (
        <Tag color="blue" className="font-medium">
          {currency.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
          {t('price.interval')}
        </span>
      ),
      dataIndex: 'interval',
      key: 'interval',
      render: (interval: string) => (
        <span style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorText }}>
          {formatInterval(interval)}
        </span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-500 dark:text-gray-400" />
          {t('price.unitAmount')}
        </span>
      ),
      dataIndex: 'unitAmount',
      key: 'unitAmount',
      render: (unitAmount: number, record: Price) => (
        <span 
          style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorText }}
          className="font-medium"
        >
          {formatCurrency(unitAmount, record.currency)}
        </span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <Activity size={16} className="text-gray-500 dark:text-gray-400" />
          {t('price.isActive')}
        </span>
      ),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: Price) => (
        <div className="flex items-center gap-2">
          <PermissionGuard 
            permission="change-price-status" 
            mode="disable"
          >
            <Switch
              checked={isActive}
              loading={loadingStates[record.id]}
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
      title: (
        <span className="flex items-center gap-2">
          <Star size={16} className="text-gray-500 dark:text-gray-400" />
          {t('price.default')}
        </span>
      ),
      key: 'default',
      render: (_, record: Price) => {
        const isDefault = defaultPriceId === record.id;
        
        return (
          <div className="flex items-center gap-2">
            {isDefault ? (
              <Tag color="gold" icon={<Star size={2} />}>
                {t('price.default')}
              </Tag>
            ) : (
              <PermissionGuard 
                permission="set-default-price" 
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  loading={loadingStates[record.id]}
                  onClick={(e) => handleSetDefault(record.id, e)}
                  className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                  icon={<StarOff size={14} />}
                >
                  {t('price.setDefault')}
                </Button>
              </PermissionGuard>
            )}
          </div>
        );
      },
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record: Price) => (
        <Space size="small">
          <PermissionGuard 
            permission="get-price" 
            mode="hide"
          >
            <Tooltip title={t('common.view')}>
              <div
                onClick={(e) => handleViewDetail(record.id, e)}
                style={{ 
                  color: currentTheme === 'dark' ? '#ffffff' : token.colorPrimary,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme === 'dark' ? '#374151' : '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Eye size={16} />
              </div>
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  // Mobile Card Component
  const PriceCard: React.FC<{ price: Price }> = ({ price }) => {
    const isExpanded = openCard === price.id;
    const isDefault = defaultPriceId === price.id;
    
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
        onClick={() => setOpenCard(isExpanded ? null : price.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign 
                size={14} 
                className={currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-500'} 
              />
              <h3 
                className="font-medium text-sm truncate flex-1"
                style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}
              >
                {formatCurrency(price.unitAmount, price.currency)}
              </h3>
              {isDefault && (
                <Tag 
                  color="gold" 
                  icon={<Star size={10} />}
                  style={{ fontSize: '10px' }}
                >
                  Default
                </Tag>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-xs"
                style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Status:
              </span>
              <PermissionGuard 
                permission="change-price-status" 
                mode="disable"
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={price.isActive}
                    loading={loadingStates[price.id]}
                    onChange={(checked) => handleStatusChange(price.id, checked)}
                    size="small"
                  />
                </div>
              </PermissionGuard>
              <Tag 
                color={price.isActive ? 'success' : 'default'}
                style={{ fontSize: '10px' }}
              >
                {price.isActive ? 'Active' : 'Inactive'}
              </Tag>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <Tag 
                color="blue" 
                style={{ fontSize: '10px', marginRight: 0 }}
              >
                {price.currency.toUpperCase()}
              </Tag>
              <div className="flex items-center gap-1">
                <Calendar size={10} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <span 
                  className="text-xs"
                  style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                  {formatInterval(price.interval)}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            type="text" 
            size="small" 
            onClick={(e) => { 
              e.stopPropagation(); 
              setOpenCard(isExpanded ? null : price.id); 
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
            <div className="flex flex-wrap gap-1">
              <PermissionGuard 
                permission="get-price" 
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Eye size={12} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail(price.id, e);
                  }}
                  style={{ 
                    color: currentTheme === 'dark' ? '#ffffff' : token.colorPrimary,
                    fontSize: '11px',
                    height: '24px',
                    padding: '0 6px'
                  }}
                >
                  View
                </Button>
              </PermissionGuard>
              
              {!isDefault && (
                <PermissionGuard 
                  permission="set-default-price" 
                  mode="hide"
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<StarOff size={12} />}
                    loading={loadingStates[price.id]}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(price.id, e);
                    }}
                    style={{ 
                      color: '#f59e0b',
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px'
                    }}
                  >
                    Set Default
                  </Button>
                </PermissionGuard>
              )}
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <Title level={4} className="mb-0 text-gray-900 dark:text-white">
                {t('price.prices')}
              </Title>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('price.managePrices')}
              </p>
            </div>
          </div>
          <PermissionGuard 
            permission="create-price" 
            mode="hide"
          >
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setCreateModalVisible(true)}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
            >
              {t('price.createPrice')}
            </Button>
          </PermissionGuard>
        </div>
      </Card>

      {/* Price Table or Cards */}
      {isMobile ? (
        <div className="space-y-2">
          {prices.length === 0 && !loading ? (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="text-center py-8">
                <DollarSign size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {t('price.noPrices')}
                </p>
              </div>
            </Card>
          ) : (
            <>
              {prices.map((price) => (
                <PriceCard key={price.id} price={price} />
              ))}
              {loading && (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <Card className={`border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${currentTheme === 'dark' ? 'dark-table' : ''}`}>
          <Table
            columns={columns}
            dataSource={prices}
            rowKey="id"
            loading={loading}
            pagination={false}
            className={currentTheme === 'dark' ? 'dark-table' : ''}
            style={{
              backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadow
            }}
            rowClassName={currentTheme === 'dark' ? "hover:bg-gray-800" : "hover:bg-gray-50"}
            locale={{
              emptyText: (
                <div className="text-center py-8">
                  <DollarSign size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('price.noPrices')}
                  </p>
                </div>
              )
            }}
          />
        </Card>
      )}

      {/* Modals */}
      <CreatePriceModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          onRefresh();
        }}
        productId={productId}
      />

    </div>
  );
};

export default PriceTable;