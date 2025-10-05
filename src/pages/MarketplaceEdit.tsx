import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchMarketplace, updateMarketplace } from '@/lib/marketplaceSlice';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, Button, Input, Form, Spin } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';

const MarketplaceEdit: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const { marketplace, loading } = useSelector((state: RootState) => state.marketplace);
  const { handleError, showSuccess } = useErrorHandler();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchMarketplace(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (marketplace) {
      form.setFieldsValue({
        marketplace: marketplace.marketplace,
        marketplaceURL: marketplace.marketplaceURL,
      });
    }
  }, [marketplace, form]);


  const handleSubmit = async (values: { marketplace: string; marketplaceURL: string }) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(updateMarketplace({ 
        marketplaceId: id, 
        marketplaceData: values 
      })).unwrap();
      showSuccess('marketplaceUpdatedSuccessfully');
      navigate(`/marketplaces/${id}`);
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (id) {
      navigate(`/marketplaces/${id}`);
    } else {
      navigate('/marketplaces');
    }
  };

  if (loading) {
    return (
      <div 
        style={{
          padding: '1.5rem',
          minHeight: '100vh',
          backgroundColor: currentTheme === 'dark' ? '#111827' : '#f9fafb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!marketplace) {
    return (
      <div 
        style={{
          padding: '1.5rem',
          minHeight: '100vh',
          backgroundColor: currentTheme === 'dark' ? '#111827' : '#f9fafb',
          color: currentTheme === 'dark' ? '#ffffff' : '#111827'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}>
              {t('marketplace.notFound')}
            </h1>
            <Button onClick={handleBack} className="mt-4">
              {t('common.back')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{
        padding: '1.5rem',
        minHeight: '100vh',
        backgroundColor: currentTheme === 'dark' ? '#111827' : '#f9fafb',
        color: currentTheme === 'dark' ? '#ffffff' : '#111827'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              icon={<ArrowLeft size={20} />} 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              {t('common.back')}
            </Button>
            <div className="flex-1">
              <h1 
                style={{ 
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  color: currentTheme === 'dark' ? '#ffffff' : '#111827'
                }}
              >
                {t('marketplace.edit')}
              </h1>
              <p 
                style={{ 
                  marginTop: '0.5rem',
                  color: currentTheme === 'dark' ? '#d1d5db' : '#4b5563'
                }}
              >
                {t('marketplace.editDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card
          style={{
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="max-w-2xl"
          >
            <Form.Item
              name="marketplace"
              label={t('marketplace.name')}
              rules={[
                { required: true, message: t('marketplace.nameRequired') },
                { min: 2, message: t('marketplace.nameMinLength') },
                { max: 100, message: t('marketplace.nameMaxLength') }
              ]}
            >
              <Input
                placeholder={t('marketplace.namePlaceholder')}
                style={{
                  backgroundColor: currentTheme === 'dark' ? '#374151' : '#ffffff',
                  borderColor: currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: currentTheme === 'dark' ? '#ffffff' : '#111827'
                }}
              />
            </Form.Item>

            <Form.Item
              name="marketplaceURL"
              label={t('marketplace.website')}
              rules={[
                { required: true, message: t('marketplace.urlRequired') },
                { type: 'url', message: t('marketplace.urlInvalid') }
              ]}
            >
              <Input
                placeholder={t('marketplace.urlPlaceholder')}
                style={{
                  backgroundColor: currentTheme === 'dark' ? '#374151' : '#ffffff',
                  borderColor: currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: currentTheme === 'dark' ? '#ffffff' : '#111827'
                }}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex gap-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  icon={<Save size={20} />}
                  className="flex items-center gap-2"
                >
                  {t('common.save')}
                </Button>
                <Button onClick={handleBack}>
                  {t('common.cancel')}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default MarketplaceEdit;
