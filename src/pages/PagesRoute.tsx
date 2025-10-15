import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState, store } from '@/lib/store';
import { fetchPageRoutes, setCurrentPageNumber, setPageSize, clearError, changePageRouteStatus, deletePageRoute } from '@/lib/pageSlice';
import { fetchMenu, fetchFavorites } from '@/lib/menuSlice';

import { Plus, Search, Filter, X } from 'lucide-react';
import { Pagination, Card, Select, Button } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
import PermissionGuard from '@/components/PermissionGuard';
import PageRouteTable from '@/components/pagesRoute/PageRouteTable';

const PagesRoute: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pageRoutes, loading, totalPages, currentPageNumber, pageSize, statusChangeLoading } = useSelector(
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
  const [filters, setFilters] = useState({
    name: '',
    path: '',
    component: '',
    isActive: undefined as boolean | undefined
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    loadPages();
  }, [currentPageNumber, pageSize, searchTerm, filters.name, filters.path, filters.component, filters.isActive]);

  // Arama kelimesi değiştiğinde sayfa numarasını sıfırla
  useEffect(() => {
    if (searchTerm !== '') {
      dispatch(setCurrentPageNumber(1));
    }
  }, [searchTerm]);

  // Filtreler değiştiğinde sayfa numarasını sıfırla
  useEffect(() => {
    const hasActiveFilters = 
      (filters.name && filters.name !== '') ||
      (filters.path && filters.path !== '') ||
      (filters.component && filters.component !== '') ||
      (filters.isActive !== undefined);
    
    if (hasActiveFilters) {
      dispatch(setCurrentPageNumber(1));
    }
  }, [filters.name, filters.path, filters.component, filters.isActive]);

  const loadPages = () => {
    const params: any = {
      page: currentPageNumber,
      limit: pageSize,
    };

    // Search term'i ekle
    if (searchTerm && searchTerm.trim() !== '') {
      params.name = searchTerm.trim();
    }

    // Filtreleri ekle
    if (filters.name && filters.name.trim() !== '') {
      params.name = filters.name.trim();
    }
    if (filters.path && filters.path.trim() !== '') {
      params.path = filters.path.trim();
    }
    if (filters.component && filters.component.trim() !== '') {
      params.component = filters.component.trim();
    }
    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive;
    }

    dispatch(fetchPageRoutes(params));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPageNumber(page));
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
      name: '',
      path: '',
      component: '',
      isActive: undefined
    });
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

  const handleDeletePage = async (pageId: string) => {
    try {
      await dispatch(deletePageRoute(pageId)).unwrap();
      showSuccess('pageDeletedSuccessfully');
      loadPages(); // Refresh the list
    } catch (error: any) {
      handleError(error);
      throw error; // Re-throw to let the table component handle loading state
    }
  };

  const handleStatusChange = async (pageRouteId: string, currentStatus: boolean) => {
    try {
      await dispatch(changePageRouteStatus({ 
        pageRouteId, 
        status: !currentStatus 
      })).unwrap();
      showSuccess('pageStatusChangedSuccessfully');
      
      // Status değişikliği sonrası verileri yeniden yükle - mevcut filtreleri koru
      const params: any = {
        page: currentPageNumber,
        limit: pageSize,
      };

      // Search term'i ekle
      if (searchTerm && searchTerm.trim() !== '') {
        params.name = searchTerm.trim();
      }

      // Filtreleri ekle
      if (filters.name && filters.name.trim() !== '') {
        params.name = filters.name.trim();
      }
      if (filters.path && filters.path.trim() !== '') {
        params.path = filters.path.trim();
      }
      if (filters.component && filters.component.trim() !== '') {
        params.component = filters.component.trim();
      }
      if (filters.isActive !== undefined) {
        params.isActive = filters.isActive;
      }

      dispatch(fetchPageRoutes(params));

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
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('pages.searchPlaceholder')}
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
            
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 ${
                  Object.values(filters).some(value => value !== '' && value !== undefined) 
                    ? 'bg-blue-600 text-white' 
                    : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
                style={{
                  backgroundColor: Object.values(filters).some(value => value !== '' && value !== undefined) 
                    ? '#2563eb' 
                    : theme === 'dark' ? '#374151' : '#f3f4f6',
                  borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: Object.values(filters).some(value => value !== '' && value !== undefined) 
                    ? '#ffffff' 
                    : theme === 'dark' ? '#d1d5db' : '#374151'
                }}
              >
                <Filter size={16} />
                {t('pages.searchFilter')}
                {Object.values(filters).some(value => value !== '' && value !== undefined) && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-white text-blue-600 rounded-full">
                    {Object.values(filters).filter(value => value !== '' && value !== undefined).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('pages.name')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('pages.enterName')}
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('pages.path')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('pages.enterPath')}
                    value={filters.path}
                    onChange={(e) => handleFilterChange('path', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('pages.component')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('pages.enterComponent')}
                    value={filters.component}
                    onChange={(e) => handleFilterChange('component', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('pages.table.status')}
                  </label>
                  <Select
                    placeholder={t('pages.selectStatus')}
                    value={filters.isActive}
                    onChange={(value) => handleFilterChange('isActive', value)}
                    className="w-full"
                    suffixIcon={null}
                    showSearch={false}
                    options={[
                      { label: t('common.all'), value: undefined },
                      { label: t('common.active'), value: true },
                      { label: t('common.inactive'), value: false }
                    ]}
                  />
                </div>

                <div className="md:col-span-4 flex justify-end gap-2">
                  <Button
                    onClick={clearFilters}
                    className="flex items-center gap-2"
                    style={{
                      backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                      color: theme === 'dark' ? '#d1d5db' : '#374151'
                    }}
                  >
                    <X size={16} />
                    {t('common.clearFilters')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>


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
                    {t('pages.noResults')}
                  </p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>
                    {t('pages.noResultsSubtext')}
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                    {t('pages.noPages')}
                  </p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>
                    {t('pages.createFirstPage')}
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
              onDelete={handleDeletePage}
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