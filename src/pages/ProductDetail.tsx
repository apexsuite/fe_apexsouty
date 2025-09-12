import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchProduct } from '@/lib/productSlice';
import { ArrowLeft, Edit, Calendar, Clock } from 'lucide-react';
import { 
  Button, 
  Card, 
  Typography, 
  Descriptions, 
  Tag as AntTag, 
  message,
  Spin,
  Row,
  Col,
  theme
} from 'antd';

const { Title, Paragraph, Text } = Typography;

const ProductDetail: React.FC = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const [loading, setLoading] = useState(true);

  const { product, loading: fetchLoading } = useSelector(
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
    <div 
      className="p-6 min-h-screen" 
      style={{ 
        backgroundColor: currentTheme === 'dark' ? '#141414' : token.colorBgContainer,
        color: token.colorText
      }}
    >
      <div className="mb-6">
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={handleBack}
          style={{
            backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
            borderColor: token.colorBorder,
            color: token.colorText
          }}
        >
          {t('common.back')}
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <Title level={2} style={{ color: token.colorText }}>{product.name}</Title>
            <Paragraph style={{ color: token.colorTextSecondary }}>
              {product.description || t('product.noDescription')}
            </Paragraph>
          </div>
          
          <Button
            type="primary"
            icon={<Edit size={16} />}
            onClick={handleEdit}
            size="large"
          >
            {t('common.edit')}
          </Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Ana Bilgiler */}
        <Col xs={24} lg={16}>
          <Card title={t('product.basicInfo')} className="mb-6" style={{ backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated }}>
            <Descriptions column={1} size="middle">
              <Descriptions.Item label={t('product.name')}>
                <Text strong>{product.name}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label={t('product.description')}>
                <Text>{product.description || t('product.noDescription')}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label={t('product.unitLabel')}>
                <Text>{product.unitLabel || t('product.noUnitLabel')}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label={t('product.statementDescriptor')}>
                <Text>{product.statementDescriptor || t('product.noStatementDescriptor')}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Pazarlama Özellikleri */}
          <Card title={t('product.marketingFeatures')} className="mb-6" style={{ backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated }}>
            {product.marketingFeatures && product.marketingFeatures.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.marketingFeatures.map((feature, index) => (
                  <AntTag key={index} color="blue" className="text-sm py-1 px-3">
                    {feature}
                  </AntTag>
                ))}
              </div>
            ) : (
              <Text type="secondary">{t('product.noMarketingFeatures')}</Text>
            )}
          </Card>
        </Col>

        {/* Yan Panel */}
        <Col xs={24} lg={8}>
          {/* Durum */}
          <Card title={t('product.status')} className="mb-6" style={{ backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated }}>
            <div className="flex items-center gap-3">
              <AntTag 
                color={product.isActive ? 'success' : 'default'}
                className="text-sm py-1 px-3"
              >
                {product.isActive ? t('common.active') : t('common.inactive')}
              </AntTag>
            </div>
          </Card>

          {/* Tarih Bilgileri */}
              <Card title={t('product.timestamps')} className="mb-6" style={{ backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated }}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: currentTheme === 'dark' ? '#ffffff' : '#9ca3af' }} />
                <div>
                  <Text type="secondary" className="text-xs">
                    {t('product.createdAt')}
                  </Text>
                  <div className="text-sm font-medium">
                    {formatDate(product.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: currentTheme === 'dark' ? '#ffffff' : '#9ca3af' }} />
                <div>
                  <Text type="secondary" className="text-xs">
                    {t('product.updatedAt')}
                  </Text>
                  <div className="text-sm font-medium">
                    {formatDate(product.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail; 