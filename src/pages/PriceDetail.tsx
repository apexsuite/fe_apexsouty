import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { getPriceDetail } from '@/lib/productSlice';
import { ArrowLeft, DollarSign, Calendar, Activity, Star, Info, Clock, Hash } from 'lucide-react';
import { 
  Button, 
  Card, 
  Typography, 
  Descriptions, 
  Tag as AntTag, 
  message,
  Spin,
  theme
} from 'antd';

const { Title, Text } = Typography;

const PriceDetail: React.FC = () => {
  const { t } = useTranslation();
  const { } = theme.useToken();
  const { productId, priceId } = useParams<{ productId: string; priceId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { theme: _ } = useSelector((state: RootState) => state.theme);
  
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<any>(null);

  useEffect(() => {
    if (productId && priceId) {
      loadPriceDetail();
    }
  }, [productId, priceId]);

  const loadPriceDetail = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getPriceDetail({ productId: productId!, priceId: priceId! })).unwrap();
      
      const priceData = response.data;
      
      if (priceData && priceData.id) {
        setPrice(priceData);
      } else {
        message.error('No price data received');
      }
    } catch (error: any) {
      console.error('Error loading price detail:', error);
      message.error(error.message || t('price.detailError'));
      navigate(`/products/${productId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/products/${productId}`);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatInterval = (interval: string) => {
    return interval.charAt(0).toUpperCase() + interval.slice(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!price) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Title level={3}>{t('price.notFound')}</Title>
          <Button onClick={handleBack}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  const isDefaultPrice = false;

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto">
        <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <DollarSign size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <Title level={2} className="mb-1 text-gray-900 dark:text-white">
                    {t('price.priceDetails')}
                  </Title>
                  <div className="flex gap-2">
                    <AntTag color={price.isActive ? 'green' : 'red'}>
                      {price.isActive ? t('common.active') : t('common.inactive')}
                    </AntTag>
                    {isDefaultPrice && (
                      <AntTag color="gold" icon={<Star size={12} />}>
                        {t('price.default')}
                      </AntTag>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Title level={3} className="mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Info size={18} className="text-blue-500" /> {t('price.basicInfo')}
          </Title>
          
          <Descriptions
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            className="dark:text-gray-300"
            labelStyle={{ color: 'inherit' }}
            contentStyle={{ color: 'inherit' }}
          >
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Hash size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('price.priceId')}
                </span>
              }
            >
              <Text copyable className="font-medium text-gray-900 dark:text-white">
                {price.id}
              </Text>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <DollarSign size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('price.currency')}
                </span>
              }
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {price.currency.toUpperCase()}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('price.interval')}
                </span>
              }
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {formatInterval(price.interval)}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <DollarSign size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('price.unitAmount')}
                </span>
              }
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(price.unitAmount, price.currency)}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Activity size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('price.isActive')}
                </span>
              }
            >
              <AntTag color={price.isActive ? 'green' : 'red'}>
                {price.isActive ? t('common.active') : t('common.inactive')}
              </AntTag>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Star size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('price.default')}
                </span>
              }
            >
              {isDefaultPrice ? (
                <AntTag color="gold" icon={<Star size={12} />}>
                  {t('price.default')}
                </AntTag>
              ) : (
                <AntTag color="default">
                  {t('common.no')}
                </AntTag>
              )}
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('price.createdAt')}
                </span>
              }
            >
              <span className="text-gray-600 dark:text-gray-300">
                {formatDate(price.createdAt)}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {price.product && (
          <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Title level={3} className="mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Info size={18} className="text-purple-500" /> {t('product.basicInfo')} ({t('product.product')})
            </Title>
            
            <Descriptions
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              className="dark:text-gray-300"
              labelStyle={{ color: 'inherit' }}
              contentStyle={{ color: 'inherit' }}
            >
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Hash size={16} className="text-gray-500 dark:text-gray-400" />
                    {t('product.name')}
                  </span>
                }
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {price.product.name}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Info size={16} className="text-gray-500 dark:text-gray-400" />
                    {t('product.description')}
                  </span>
                }
              >
                <span className="text-gray-600 dark:text-gray-300">
                  {price.product.description || t('product.noDescription')}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Hash size={16} className="text-gray-500 dark:text-gray-400" />
                    {t('product.unitLabel')}
                  </span>
                }
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {price.product.unitLabel || t('product.noUnitLabel')}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Hash size={16} className="text-gray-500 dark:text-gray-400" />
                    {t('product.statementDescriptor')}
                  </span>
                }
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {price.product.statementDescriptor || t('product.noStatementDescriptor')}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Activity size={16} className="text-gray-500 dark:text-gray-400" />
                    {t('product.isActive')}
                  </span>
                }
              >
                <AntTag color={price.product.isActive ? 'green' : 'red'}>
                  {price.product.isActive ? t('common.active') : t('common.inactive')}
                </AntTag>
              </Descriptions.Item>
              
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Star size={16} className="text-gray-500 dark:text-gray-400" />
                    {t('product.isDefault')}
                  </span>
                }
              >
                <AntTag color={price.product.isDefaultProduct ? 'blue' : 'default'}>
                  {price.product.isDefaultProduct ? t('common.yes') : t('common.no')}
                </AntTag>
              </Descriptions.Item>
              
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                    {t('product.createdAt')}
                  </span>
                }
              >
                <span className="text-gray-600 dark:text-gray-300">
                  {formatDate(price.product.createdAt)}
                </span>
              </Descriptions.Item>
            </Descriptions>

            {price.product.marketingFeatures && price.product.marketingFeatures.length > 0 && (
              <div className="mt-4">
                <Title level={5} className="mb-2 text-gray-900 dark:text-white">
                  {t('product.marketingFeatures')}
                </Title>
                <div className="flex flex-wrap gap-2">
                  {price.product.marketingFeatures.map((feature: string, index: number) => (
                    <AntTag key={index} color="blue" className="text-sm">
                      {feature}
                    </AntTag>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default PriceDetail;
