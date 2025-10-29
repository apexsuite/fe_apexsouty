import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/lib/store';
import { 
  fetchConsents, 
  requestConsentCallback, 
  setCurrentPageNumber,
  setPageSize
} from '@/lib/consentSlice';
import { Plus, Search, Filter, X } from 'lucide-react';
import { Card, Typography, theme, Pagination, Select, Button } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
import PermissionGuard from '@/components/PermissionGuard';

// Import components
import ConsentTable from '@/components/consents/ConsentTable';
import ConsentEmptyState from '@/components/consents/ConsentEmptyState';

const { } = Typography;

const Consents: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const { consents, loading, currentPageNumber, pageSize, totalPages, totalCount } = useSelector((state: RootState) => state.consent);
  const { handleError } = useErrorHandler();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    marketplace: '',
    marketplaceURL: '',
    isActive: undefined as boolean | undefined
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadConsents = () => {
    const params: any = {
      page: currentPageNumber || 1,
      pageSize: pageSize || 10,
    };

    // Add search term
    if (searchTerm) {
      params.marketplace = searchTerm;
    }

    // Add filters
    if (filters.marketplace) {
      params.marketplace = filters.marketplace;
    }
    if (filters.marketplaceURL) {
      params.marketplaceURL = filters.marketplaceURL;
    }
    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive;
    }

    dispatch(fetchConsents(params));
  };

  useEffect(() => {
    loadConsents();
  }, [currentPageNumber, pageSize]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadConsents();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPageNumber(page));
  };

  const handlePageSizeChange = (_current: number, size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPageNumber(1));
  };



  const handleAuthorizeConsent = async (consentId: string) => {
    try {
      const response = await dispatch(requestConsentCallback(consentId)).unwrap();
      
      // Response'dan URL'i al ve yönlendir
      const redirectUrl = response?.url || response?.data?.url || response?.redirectUrl || response?.data?.redirectUrl || response;
      
      if (redirectUrl && typeof redirectUrl === 'string') {
        // URL'e yönlendir
        window.location.href = redirectUrl;
      } else {
        // URL bulunamadıysa hata göster
        handleError({ message: 'Authorization URL not found in response' });
      }
    } catch (error: any) {
      handleError(error);
    }
  };


  const clearFilters = () => {
    setFilters({
      marketplace: '',
      marketplaceURL: '',
      isActive: undefined
    });
    setSearchTerm('');
  };

  const hasActiveFilters = filters.marketplace || filters.marketplaceURL || filters.isActive !== undefined;

  if (loading && consents.length === 0) {
    return (
      <div className={`p-6 min-h-screen ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-full mx-auto md:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={`text-lg ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('common.loading') || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="w-full mx-auto md:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('consents.title')}
              </h1>
              <p className={`mt-2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('consents.description')}
              </p>
            </div>
            <PermissionGuard permission="create-consent" mode="hide">
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={() => navigate('/consents/create')}
                className="w-full md:w-auto"
              >
                {t('consents.create')}
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className={`mb-6 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search 
                    size={20} 
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} 
                  />
                  <input
                    type="text"
                    placeholder={t('consents.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
              <Button
                icon={<Filter size={16} />}
                onClick={() => setShowFilters(!showFilters)}
                className={`${hasActiveFilters ? 'bg-blue-100 text-blue-700 border-blue-300' : ''}`}
              >
                {t('consents.filters')}
                {hasActiveFilters && (
                  <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className={`p-4 rounded-lg border ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('consents.name')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('consents.enterMarketplace')}
                      value={filters.marketplace}
                      onChange={(e) => setFilters(prev => ({ ...prev, marketplace: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        currentTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('consents.website')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('consents.enterMarketplaceURL')}
                      value={filters.marketplaceURL}
                      onChange={(e) => setFilters(prev => ({ ...prev, marketplaceURL: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        currentTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('consents.status')}
                    </label>
                    <Select
                      placeholder={t('consents.selectStatus')}
                      value={filters.isActive}
                      onChange={(value) => setFilters(prev => ({ ...prev, isActive: value }))}
                      className="w-full"
                      allowClear
                    >
                      <Select.Option value={true}>Active</Select.Option>
                      <Select.Option value={false}>Inactive</Select.Option>
                    </Select>
                  </div>
                </div>
                {hasActiveFilters && (
                  <div className="flex justify-end mt-4">
                    <Button
                      icon={<X size={16} />}
                      onClick={clearFilters}
                      size="small"
                    >
                      {t('common.clearFilters') || 'Clear Filters'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Content */}
        {consents.length === 0 ? (
          <ConsentEmptyState />
        ) : (
          <>
            <ConsentTable
              consents={consents}
              loading={loading}
              onAuthorize={handleAuthorizeConsent}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPageNumber}
                  total={totalCount}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageSizeChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                  className={currentTheme === 'dark' ? 'dark-pagination' : ''}
                />
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Consents;
