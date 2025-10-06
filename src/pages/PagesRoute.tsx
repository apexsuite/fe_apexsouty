import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState, store } from '@/lib/store';
import { fetchPageRoutes, setCurrentPageNumber, setPageSize, clearError, changePageRouteStatus } from '@/lib/pageSlice';
import { fetchMenu, fetchFavorites } from '@/lib/menuSlice';

import { Plus, Search } from 'lucide-react';
import { Pagination, Card } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
import PermissionGuard from '@/components/PermissionGuard';
import PageRouteTable from '@/components/pagesRoute/PageRouteTable';

const PagesRoute: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pageRoutes, loading, error, totalPages, currentPageNumber, pageSize, statusChangeLoading } = useSelector(
    (state: RootState) => state.page
  );
  

  const theme = useSelector((state: RootState) => state.theme.theme);
  const { handleError, showSuccess } = useErrorHandler();
  
  // Tema değişikliğini zorlamak için key kullan
  const themeKey = theme === 'light' ? 'light' : 'dark';
  
  // Tema değişikliğini dinle
  useEffect(() => {
  }, [theme]);
  
  // Redux store'u kontrol et
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const currentTheme = store.getState().theme.theme;
      console.log('Store theme changed to:', currentTheme);
    });
    
    return () => unsubscribe();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(clearError());
    loadPages();
  }, [currentPageNumber, pageSize, searchTerm]);

  // Arama kelimesi değiştiğinde sayfa numarasını sıfırla
  useEffect(() => {
    if (searchTerm !== '') {
      dispatch(setCurrentPageNumber(1));
    }
  }, [searchTerm]);

  const loadPages = () => {
    dispatch(fetchPageRoutes({
      page: currentPageNumber,
      limit: pageSize,
      name: searchTerm,
    }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPageNumber(page));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPageNumber(1));
  };

  const handleViewPage = (pageId: string) => {
    navigate(`/page-routes/${pageId}`);
  };

  const handleEditPage = (pageId: string) => {
    navigate(`/page-routes/${pageId}/edit`);
  };

  const handleCreatePage = () => {
    navigate('/page-routes/create');
  };

  const handleStatusChange = async (pageRouteId: string, currentStatus: boolean) => {
    try {
      await dispatch(changePageRouteStatus({ 
        pageRouteId, 
        status: !currentStatus 
      })).unwrap();
      showSuccess('pageStatusChangedSuccessfully');
      
      // Status değişikliği sonrası verileri yeniden yükle
      dispatch(fetchPageRoutes({
        page: currentPageNumber,
        limit: pageSize,
        name: searchTerm,
      }));

      // Sidebar menü ve search bar için lazy load - sayfayı yenilemeden güncelle
      try {
        await Promise.all([
          dispatch(fetchMenu() as any),
          dispatch(fetchFavorites() as any)
        ]);
        console.log('Menu and favorites updated successfully after status change');
      } catch (menuError) {
        console.warn('Failed to update menu/favorites after status change:', menuError);
        // Menu güncelleme hatası sayfa işlemini durdurmasın, sadece log'la
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  // Sadece ilk yükleme sırasında loading göster
  if (loading && pageRoutes.length === 0 && !searchTerm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div 
      key={themeKey}
      style={{
        padding: '1.5rem',
        minHeight: '100vh',
        backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        color: theme === 'dark' ? '#ffffff' : '#111827'
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
                  color: theme === 'dark' ? '#ffffff' : '#111827'
                }}
              >
                {t('pages.title')}
              </h1>
              <p 
                style={{ 
                  marginTop: '0.5rem',
                  color: theme === 'dark' ? '#d1d5db' : '#4b5563'
                }}
              >
                {t('pages.subtitle')}
              </p>
            </div>
            <PermissionGuard 
              permission="create-page-route" 
              mode="hide"
            >
              <button
                onClick={handleCreatePage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                {t('pages.newPage')}
              </button>
            </PermissionGuard>
          </div>

      
        </div>

        {/* Search and Filters */}
        <Card
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            marginBottom: '1.5rem'
          }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  style={{
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    color: theme === 'dark' ? '#ffffff' : '#111827'
                  }}
                />
                <Search 
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} 
                  size={20} 
                />
              </div>
            </div>
            

          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 rounded-lg p-4 transition-colors duration-200 ${
            theme === 'dark' 
              ? 'bg-red-900/20 border border-red-800' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`transition-colors duration-200 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>{error}</p>
          </div>
        )}

        {/* Page Routes Table */}
        <div style={{ 
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {pageRoutes.length === 0 && !loading ? (
            <div style={{ 
              padding: '40px 20px',
              textAlign: 'center',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}>
              {searchTerm ? (
                <div>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                    No pages found matching your search criteria
                  </p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                    No pages available
                  </p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>
                    Create your first page to get started
                  </p>
                </div>
              )}
            </div>
          ) : (
            <PageRouteTable
              pageRoutes={pageRoutes}
              loading={loading}
              statusChangeLoading={statusChangeLoading}
              onView={handleViewPage}
              onEdit={handleEditPage}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>

        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'right',
          padding: '16px',
            backgroundColor: 'var(--ant-color-bg-container)',
            border: '1px solid var(--ant-color-border)',
          borderRadius: '8px'
        }}>
            <Pagination
              current={currentPageNumber}
              total={totalPages * pageSize}
              pageSize={pageSize}
              showSizeChanger
              showTotal={(_, range) => (
                <span style={{ 
                  color: theme === 'dark' ? '#d1d5db' : '#374151',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {searchTerm ? (
                    `${pageRoutes?.length || 0} items found`
                  ) : (
                    `${range[0]}-${range[1]} of ${totalPages * pageSize} items`
                  )}
                </span>
              )}
              onChange={(page, size) => {
                handlePageChange(page);
                if (size !== pageSize) {
                  handlePageSizeChange(size);
                }
              }}
              onShowSizeChange={(_current, size) => {
                handlePageSizeChange(size);
              }}
              style={{
                color: theme === 'dark' ? '#f9fafb' : '#111827'
              }}
            />
          </div>

      </div>
    </div>
  );
};

export default PagesRoute; 