import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchMarketplace } from '@/lib/marketplaceSlice';
import { ArrowLeft, Edit, ExternalLink } from 'lucide-react';
import { Card, Button, Tag, Spin } from 'antd';

const MarketplaceDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const { marketplace, loading } = useSelector((state: RootState) => state.marketplace);

  useEffect(() => {
    if (id) {
      dispatch(fetchMarketplace(id));
    }
  }, [id, dispatch]);


  const handleEdit = () => {
    if (id) {
      navigate(`/marketplaces/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/marketplaces');
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
                {marketplace.marketplace}
              </h1>
              <p 
                style={{ 
                  marginTop: '0.5rem',
                  color: currentTheme === 'dark' ? '#d1d5db' : '#4b5563'
                }}
              >
                {t('marketplace.detailDescription')}
              </p>
            </div>
            <Button 
              type="primary" 
              icon={<Edit size={20} />}
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              {t('common.edit')}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card
            title={t('marketplace.basicInfo')}
            style={{
              backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#374151' }}>
                  {t('marketplace.name')}
                </label>
                <p style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}>
                  {marketplace.marketplace}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#374151' }}>
                  {t('marketplace.website')}
                </label>
                <div className="flex items-center gap-2">
                  <span style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}>
                    {marketplace.marketplaceURL}
                  </span>
                  {marketplace.marketplaceURL && (
                    <a 
                      href={marketplace.marketplaceURL.startsWith('http') ? marketplace.marketplaceURL : `https://${marketplace.marketplaceURL}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#374151' }}>
                  {t('marketplace.status')}
                </label>
                <Tag color={marketplace.isActive ? 'success' : 'default'}>
                  {marketplace.isActive ? t('common.active') : t('common.inactive')}
                </Tag>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card
            title={t('marketplace.additionalInfo')}
            style={{
              backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#374151' }}>
                  {t('marketplace.createdAt')}
                </label>
                <p style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}>
                  {new Date(marketplace.createdAt).toLocaleString()}
                </p>
              </div>

              {marketplace.updatedAt && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#374151' }}>
                    {t('marketplace.updatedAt')}
                  </label>
                  <p style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}>
                    {new Date(marketplace.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#374151' }}>
                  ID
                </label>
                <p style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827', fontFamily: 'monospace' }}>
                  {marketplace.id}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceDetail;
