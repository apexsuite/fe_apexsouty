import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchProduct } from '@/lib/productSlice';
import { ArrowLeft, Edit, Calendar,  } from 'lucide-react';
import { 
  Button, 
  Card, 
  Typography, 
  Descriptions, 
  Tag as AntTag, 
  message,
  Spin,
} from 'antd';
import PriceTable from '@/components/products/PriceTable';

const { Title } = Typography;

const ProductDetail: React.FC = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);


  const { product,  loading: fetchLoading, } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);





  const loadProduct = async () => {
    try {
      await dispatch(fetchProduct(productId!)).unwrap();
    } catch (error: any) {
      message.error(error.message || t('product.fetchError'));
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = () => {
    navigate(`/products/${productId}/edit`);
  };

  const handleBack = () => {
    navigate('/products');
  };


  if (loading || fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Title level={3}>{t('product.notFound')}</Title>
          <Button onClick={handleBack}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };


  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Edit size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <Title level={2} className="mb-1 text-gray-900 dark:text-white">
                    {product.name}
                  </Title>
                  <div className="flex gap-2">
                    <AntTag color={product.isActive ? 'green' : 'red'}>
                      {product.isActive ? t('common.active') : t('common.inactive')}
                    </AntTag>
                  </div>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              icon={<Edit size={16} />}
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
            >
              {t('common.edit')}
            </Button>
          </div>
        </Card>

        {/* Product Information */}
        <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Title level={3} className="mb-4 text-gray-900 dark:text-white">
            {t('product.basicInfo')}
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
                  <Edit size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('product.name')}
                </span>
              }
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {product.name}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Edit size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('product.description')}
                </span>
              }
            >
              <span className="text-gray-600 dark:text-gray-300">
                {product.description || t('product.noDescription')}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Edit size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('product.unitLabel')}
                </span>
              }
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {product.unitLabel || t('product.noUnitLabel')}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Edit size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('product.statementDescriptor')}
                </span>
              }
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {product.statementDescriptor || t('product.noStatementDescriptor')}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                  {t('product.createdAt')}
                </span>
              }
            >
              <span className="text-gray-600 dark:text-gray-300">
                {formatDate(product.createdAt)}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Marketing Features */}
        {product.marketingFeatures && product.marketingFeatures.length > 0 && (
          <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Title level={3} className="mb-4 text-gray-900 dark:text-white">
              {t('product.marketingFeatures')}
            </Title>
            <div className="flex flex-wrap gap-2">
              {product.marketingFeatures.map((feature, index) => (
                <AntTag key={index} color="blue" className="text-sm">
                  {feature}
                </AntTag>
              ))}
            </div>
          </Card>
        )}

        {/* Prices Section */}
        <PriceTable
          prices={product.prices || []}
          productId={productId!}
          defaultPriceId={product.defaultPriceId}
          loading={loading}
          onRefresh={loadProduct}
        />

      </div>
    </div>
  );
};

export default ProductDetail; 