import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPermissions, setCurrentPageNumber, setPageSize, clearError, clearSearch, deletePermissionDirect } from '@/lib/pageRoutePermissionSlice';
import { Plus, Search, Filter, X } from 'lucide-react';
import { Pagination, Card, Select, Button } from 'antd';
import PermissionGuard from '@/components/PermissionGuard';
import PageRoutePermissionTable from '@/components/pageRoutePermissions/PageRoutePermissionTable';
import { useErrorHandler } from '@/lib/useErrorHandler';

const PageRoutePermissionsRoute: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pageRouteId } = useParams<{ pageRouteId?: string }>();
  const { permissions, loading, totalPages, totalCount, currentPageNumber, pageSize } = useSelector(
    (state: RootState) => state.permission
  );
  const theme = useSelector((state: RootState) => state.theme.theme);
  const { handleError, showSuccess } = useErrorHandler();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    label: '',
    isActive: undefined as boolean | undefined
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSearch());
    loadPermissions();
  }, [pageRouteId, currentPageNumber, pageSize, searchTerm, filters.name, filters.label, filters.isActive]);

  // Arama veya filtreler değiştiğinde sayfa numarasını sıfırla
  useEffect(() => {
    if (searchTerm !== '') {
      dispatch(setCurrentPageNumber(1));
    }
  }, [searchTerm]);

  // Filtreler değiştiğinde sayfa numarasını sıfırla
  useEffect(() => {
    const hasActiveFilters = 
      (filters.name && filters.name !== '') ||
      (filters.label && filters.label !== '') ||
      (filters.isActive !== undefined);
    
    if (hasActiveFilters) {
      dispatch(setCurrentPageNumber(1));
    }
  }, [filters.name, filters.label, filters.isActive]);

  const loadPermissions = () => {
    const params: any = {
      page: currentPageNumber,
      pageSize: pageSize,
    };

    // Search term'i name parametresi olarak ekle
    if (searchTerm && searchTerm.trim() !== '') {
      params.name = searchTerm.trim();
    }

    // Filtreleri API'ye ekle
    if (filters.name && filters.name.trim() !== '') {
      params.name = filters.name.trim();
    }
    if (filters.label && filters.label.trim() !== '') {
      params.label = filters.label.trim();
    }
    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive;
    }

    dispatch(fetchPermissions(params));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPageNumber(page));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPageNumber(1));
  };

  const handleViewPermission = (permissionId: string) => {
    navigate(`/page-route-permissions/${pageRouteId || 'all'}/permissions/${permissionId}`);
  };

  const handleEditPermission = (permissionId: string) => {
    navigate(`/page-route-permissions/${pageRouteId || 'all'}/permissions/${permissionId}/edit`);
  };

  const handleCreatePermission = () => {
    navigate(`/page-route-permissions/${pageRouteId || 'all'}/permissions/create`);
  };

  const handleDeletePermission = async (permissionId: string) => {
    try {
      await dispatch(deletePermissionDirect(permissionId)).unwrap();
      showSuccess('permissionDeletedSuccessfully');
      loadPermissions(); // Refresh the list
    } catch (error: any) {
      handleError(error);
      throw error; // Re-throw to let the table component handle loading state
    }
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
      label: '',
      isActive: undefined
    });
    dispatch(setCurrentPageNumber(1));
  };

  return (
    <div 
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
                {t('pages.pageRoutePermissions.title')}
              </h1>
              <p 
                style={{ 
                  marginTop: '0.5rem',
                  color: theme === 'dark' ? '#d1d5db' : '#4b5563'
                }}
              >
                {t('pages.pageRoutePermissions.subtitle')} {pageRouteId && `- Page Route ID: ${pageRouteId}`}
              </p>
            </div>
            <PermissionGuard 
              permission="create-page-route-permission" 
              mode="hide"
            >
              <button
                onClick={handleCreatePermission}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                {t('pages.pageRoutePermissions.newPermission')}
              </button>
            </PermissionGuard>
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
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} size={20} />
                    <input
                      type="text"
                      placeholder={t('pages.pageRoutePermissions.searchPermissions')}
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
                  {t('pages.pageRoutePermissions.filters') || 'Filters'}
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
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('pages.pageRoutePermissions.name') || 'Name'}
                    </label>
                    <input
                      type="text"
                      placeholder={t('pages.pageRoutePermissions.enterName') || 'Enter name'}
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
                      {t('pages.pageRoutePermissions.label') || 'Label'}
                    </label>
                    <input
                      type="text"
                      placeholder={t('pages.pageRoutePermissions.enterLabel') || 'Enter label'}
                      value={filters.label}
                      onChange={(e) => handleFilterChange('label', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('common.status') || 'Status'}
                    </label>
                    <Select
                      placeholder={t('pages.pageRoutePermissions.selectStatus') || 'Select status'}
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
                        backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                        borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                        color: theme === 'dark' ? '#d1d5db' : '#374151'
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
        </div>


        {/* Permissions Table */}
        <div style={{ 
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <PageRoutePermissionTable
            permissions={permissions.filter(permission => permission !== null)}
            loading={loading}
            onView={handleViewPermission}
            onEdit={handleEditPermission}
            onDelete={handleDeletePermission}
          />
        </div>

        {/* Empty State */}
        {!loading && permissions.length === 0 && (
          <div className="text-center py-12">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <Search className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={32} />
            </div>
            <h3 className={`text-lg font-medium mb-2 transition-colors duration-200 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{t('pages.pageRoutePermissions.noPermissionsFound')}</h3>
            <p className={`mb-4 transition-colors duration-200 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchTerm
                ? t('pages.pageRoutePermissions.noPermissionsFoundCriteria')
                : t('pages.pageRoutePermissions.noPermissionsFound')}
            </p>
            {!searchTerm && (
              <PermissionGuard 
                permission="create-page-route-permission" 
                mode="hide"
              >
                <button
                  onClick={handleCreatePermission}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  {t('pages.pageRoutePermissions.createFirstPermission')}
                </button>
              </PermissionGuard>
            )}
          </div>
        )}

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
            showTotal={(total, range) => (
              <span style={{ 
                color: theme === 'dark' ? '#d1d5db' : '#374151',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {`${range[0]}-${range[1]} of ${totalCount || total} items`}
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

export default PageRoutePermissionsRoute; 