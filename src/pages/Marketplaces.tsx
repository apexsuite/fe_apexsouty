import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/lib/store';
import { 
  fetchMarketplaces, 
  deleteMarketplace, 
  changeMarketplaceStatus, 
  clearError,
  setCurrentPageNumber,
  setPageSize
} from '@/lib/marketplaceSlice';
import { Plus, Search, Filter, X } from 'lucide-react';
import { Card, Typography, theme, Pagination, Select, Button } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
import PermissionGuard from '@/components/PermissionGuard';

// Import components
import MarketplaceTable from '@/components/marketplaces/MarketplaceTable';
import MarketplaceDeleteModal from '@/components/marketplaces/MarketplaceDeleteModal';
import MarketplaceEmptyState from '@/components/marketplaces/MarketplaceEmptyState';

const { } = Typography;

const Marketplaces: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const { marketplaces, loading, currentPageNumber, pageSize, totalPages, totalCount } = useSelector((state: RootState) => state.marketplace);
  const { handleError, showSuccess } = useErrorHandler();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    marketplace: '',
    marketplaceURL: '',
    isActive: undefined as boolean | undefined
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [marketplaceToDelete, setMarketplaceToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMarketplaces = () => {
    const params: any = {
      page: currentPageNumber || 1,
      pageSize: pageSize || 10,
    };

    // Search term'i ekle
    if (searchTerm && searchTerm.trim() !== '') {
      params.marketplace = searchTerm.trim();
    }

    // Filtreleri ekle
    if (filters.marketplace && filters.marketplace.trim() !== '') {
      params.marketplace = filters.marketplace.trim();
    }
    if (filters.marketplaceURL && filters.marketplaceURL.trim() !== '') {
      params.marketplaceURL = filters.marketplaceURL.trim();
    }
    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive;
    }

    dispatch(fetchMarketplaces(params));
  };

  useEffect(() => {
    dispatch(clearError());
    loadMarketplaces();
  }, [currentPageNumber, pageSize, searchTerm, filters.marketplace, filters.marketplaceURL, filters.isActive]);

  // Arama kelimesi değiştiğinde sayfa numarasını sıfırla
  useEffect(() => {
    if (searchTerm !== '') {
      dispatch(setCurrentPageNumber(1));
    }
  }, [searchTerm]);

  // Filtreler değiştiğinde sayfa numarasını sıfırla
  useEffect(() => {
    const hasActiveFilters = 
      (filters.marketplace && filters.marketplace !== '') ||
      (filters.marketplaceURL && filters.marketplaceURL !== '') ||
      (filters.isActive !== undefined);
    
    if (hasActiveFilters) {
      dispatch(setCurrentPageNumber(1));
    }
  }, [filters.marketplace, filters.marketplaceURL, filters.isActive]);

  const handlePageChange = (page: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
      dispatch(setCurrentPageNumber(1));
    } else {
      dispatch(setCurrentPageNumber(page));
    }
  };

  const handleCreateMarketplace = () => {
    navigate('/marketplaces/create');
  };

  const handleEditMarketplace = (marketplaceId: string) => {
    navigate(`/marketplaces/${marketplaceId}/edit`);
  };

  const handleViewMarketplace = (marketplaceId: string) => {
    navigate(`/marketplaces/${marketplaceId}`);
  };

  const handleDeleteMarketplace = (marketplaceId: string, marketplaceName: string) => {
    setMarketplaceToDelete({ id: marketplaceId, name: marketplaceName });
    setShowDeleteModal(true);
  };

  const confirmDeleteMarketplace = async () => {
    if (!marketplaceToDelete) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteMarketplace(marketplaceToDelete.id)).unwrap();
      showSuccess('marketplaceDeletedSuccessfully');
      setShowDeleteModal(false);
      setMarketplaceToDelete(null);
      loadMarketplaces();
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (marketplaceId: string) => {
    try {
      await dispatch(changeMarketplaceStatus(marketplaceId)).unwrap();
      showSuccess('marketplaceStatusChangedSuccessfully');
      loadMarketplaces();
    } catch (error: any) {
      handleError(error);
    }
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPageNumber(1));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      marketplace: '',
      marketplaceURL: '',
      isActive: undefined
    });
    dispatch(setCurrentPageNumber(1));
  };


  return (
    <div 
      style={{
        padding: '1.5rem',
        minHeight: '100vh',
        backgroundColor: currentTheme === 'dark' ? '#111827' : '#f9fafb',
        color: currentTheme === 'dark' ? '#ffffff' : '#111827'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 
                style={{ 
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  color: currentTheme === 'dark' ? '#ffffff' : '#111827'
                }}
              >
                {t('marketplace.title')}
              </h1>
              <p 
                style={{ 
                  marginTop: '0.5rem',
                  color: currentTheme === 'dark' ? '#d1d5db' : '#4b5563'
                }}
              >
                {t('marketplace.description')}
              </p>
            </div>
            <PermissionGuard 
              permission="create-marketplace" 
              mode="hide"
            >
              <button
                onClick={handleCreateMarketplace}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                {t('marketplace.create')}
              </button>
            </PermissionGuard>
          </div>
        </div>

        {/* Search and Filters */}
        <Card
          style={{
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            marginBottom: '1.5rem'
          }}
        >
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('marketplace.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    style={{
                      backgroundColor: currentTheme === 'dark' ? '#374151' : '#ffffff',
                      borderColor: currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
                      color: currentTheme === 'dark' ? '#ffffff' : '#111827'
                    }}
                  />
                  <Search 
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} 
                    size={20} 
                  />
                </div>
              </div>
              
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 ${
                  Object.values(filters).some(value => value !== '' && value !== undefined) 
                    ? 'bg-blue-600 text-white' 
                    : currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
                style={{
                  backgroundColor: Object.values(filters).some(value => value !== '' && value !== undefined) 
                    ? '#2563eb' 
                    : currentTheme === 'dark' ? '#374151' : '#f3f4f6',
                  borderColor: currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: Object.values(filters).some(value => value !== '' && value !== undefined) 
                    ? '#ffffff' 
                    : currentTheme === 'dark' ? '#d1d5db' : '#374151'
                }}
              >
                <Filter size={16} />
                {t('marketplace.filters') || 'Filters'}
                {Object.values(filters).some(value => value !== '' && value !== undefined) && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-white text-blue-600 rounded-full">
                    {Object.values(filters).filter(value => value !== '' && value !== undefined).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('marketplace.title')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('marketplace.enterMarketplace')}
                    value={filters.marketplace}
                    onChange={(e) => handleFilterChange('marketplace', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('marketplace.marketplaceURL')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('marketplace.enterMarketplaceURL')}
                    value={filters.marketplaceURL}
                    onChange={(e) => handleFilterChange('marketplaceURL', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('common.status') }
                  </label>
                  <Select
                    placeholder={t('marketplace.selectStatus') }
                    value={filters.isActive}
                    onChange={(value) => handleFilterChange('isActive', value)}
                    className="w-full"
                    suffixIcon={null}
                    showSearch={false}
                    options={[
                      { label: t('common.all') || 'All', value: undefined },
                      { label: t('common.active') || 'Active', value: true },
                      { label: t('common.inactive') || 'Inactive', value: false }
                    ]}
                  />
                </div>

                <div className="md:col-span-3 flex justify-end gap-2">
                  <Button
                    onClick={clearFilters}
                    className="flex items-center gap-2"
                    style={{
                      backgroundColor: currentTheme === 'dark' ? '#374151' : '#f3f4f6',
                      borderColor: currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
                      color: currentTheme === 'dark' ? '#d1d5db' : '#374151'
                    }}
                  >
                    <X size={16} />
                    {t('common.clearFilters') || 'Clear Filters'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>



        {/* Marketplaces Table or Empty State */}
        {marketplaces.length === 0 && !loading ? (
          <div style={{ 
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            border: `1px solid ${currentTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <MarketplaceEmptyState onCreateMarketplace={handleCreateMarketplace} />
          </div>
        ) : (
          <div style={{ 
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            border: `1px solid ${currentTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <MarketplaceTable
              marketplaces={marketplaces}
              loading={loading}
              onEdit={handleEditMarketplace}
              onView={handleViewMarketplace}
              onDelete={handleDeleteMarketplace}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}

        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'right',
          padding: '16px',
          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
          border: `1px solid ${currentTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px'
        }}>
          <Pagination
            current={currentPageNumber}
            total={totalPages * pageSize}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => (
              <span style={{ 
                color: currentTheme === 'dark' ? '#d1d5db' : '#374151',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {`${range[0]}-${range[1]} of ${totalCount || total} items`}
              </span>
            )}
            onChange={(page, size) => {
              handlePageChange(page, size);
            }}
            onShowSizeChange={(_current, size) => {
              handlePageSizeChange(size);
            }}
            style={{
              color: currentTheme === 'dark' ? '#f9fafb' : '#111827'
            }}
          />
        </div>

        <MarketplaceDeleteModal
          visible={showDeleteModal}
          marketplace={marketplaceToDelete}
          onConfirm={confirmDeleteMarketplace}
          onCancel={() => {
            setShowDeleteModal(false);
            setMarketplaceToDelete(null);
          }}
          loading={isDeleting}
        />
      </div>
    </div>
  );
};

export default Marketplaces;
