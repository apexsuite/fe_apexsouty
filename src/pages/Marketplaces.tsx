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
import { Plus, Search } from 'lucide-react';
import { Card, Typography, theme, Pagination } from 'antd';
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
  const { marketplaces, loading, error, currentPageNumber, pageSize, totalPages, totalCount } = useSelector((state: RootState) => state.marketplace);
  const { handleError, showSuccess } = useErrorHandler();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [marketplaceToDelete, setMarketplaceToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMarketplaces = () => {
    const params: any = {
      page: currentPageNumber || 1,
      pageSize: pageSize || 10,
    };

    if (searchTerm && searchTerm.trim() !== '') {
      params.marketplace = searchTerm.trim();
    }

    dispatch(fetchMarketplaces(params));
  };

  useEffect(() => {
    dispatch(clearError());
    loadMarketplaces();
  }, [currentPageNumber, pageSize]);

  useEffect(() => {
    if (searchTerm !== '') {
      dispatch(setCurrentPageNumber(1));
    }
    loadMarketplaces();
  }, [searchTerm]);

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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search marketplaces..."
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
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 rounded-lg p-4 transition-colors duration-200 ${
            currentTheme === 'dark' 
              ? 'bg-red-900/20 border border-red-800' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`transition-colors duration-200 ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>{error}</p>
          </div>
        )}

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
