import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPermissions, setCurrentPageNumber, setPageSize, clearError, setSearching, setFilteredPermissions, clearSearch } from '@/lib/pageRoutePermissionSlice';
import { Plus, Search } from 'lucide-react';
import { Pagination, Card } from 'antd';
import PermissionGuard from '@/components/PermissionGuard';
import PageRoutePermissionTable from '@/components/pageRoutePermissions/PageRoutePermissionTable';

const PageRoutePermissionsRoute: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pageRouteId } = useParams<{ pageRouteId?: string }>();
  const { permissions, filteredPermissions, loading, error, totalPages, currentPageNumber, pageSize, isSearching } = useSelector(
    (state: RootState) => state.permission
  );
  const theme = useSelector((state: RootState) => state.theme.theme);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(clearError());
    if (searchTerm.trim() === '') {
      // Arama yapılmıyorsa normal yükleme
      dispatch(clearSearch());
      loadPermissions();
    } else {
      // Arama yapılıyorsa client-side filtreleme
      dispatch(setSearching(true));
      filterPermissions();
    }
  }, [pageRouteId, currentPageNumber, pageSize, searchTerm]);

  const loadPermissions = () => {
    dispatch(fetchPermissions({
      page: currentPageNumber,
      pageSize: pageSize,
    }));
  };

  const filterPermissions = () => {
    if (searchTerm.trim() === '') {
      dispatch(setFilteredPermissions(permissions));
      return;
    }

    const filtered = permissions.filter(permission => 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    dispatch(setFilteredPermissions(filtered));
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



  if (loading && !isSearching && permissions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} size={20} />
                  <input
                    type="text"
                    placeholder="Search permissions..."
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
              
            </div>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className={`transition-colors duration-200 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>{error}</p>
          </div>
        )}

        {/* Permissions Table */}
        <div style={{ 
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <PageRoutePermissionTable
            permissions={isSearching ? filteredPermissions.filter(permission => permission !== null) : permissions.filter(permission => permission !== null)}
            loading={loading && !isSearching}
            onView={handleViewPermission}
            onEdit={handleEditPermission}
          />
        </div>

        {/* Empty State */}
        {!loading && ((isSearching && filteredPermissions.length === 0) || (!isSearching && permissions.length === 0)) && (
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
                  {`${range[0]}-${range[1]} of ${total} items`}
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