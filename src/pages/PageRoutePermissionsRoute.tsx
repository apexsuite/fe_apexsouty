import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPermissions, setCurrentPageNumber, setPageSize, clearError } from '@/lib/pageRoutePermissionSlice';
import { Eye, Edit, Plus, Search } from 'lucide-react';

const PageRoutePermissionsRoute: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pageRouteId } = useParams<{ pageRouteId?: string }>();
  const { permissions, loading, error, totalPages, currentPageNumber, pageSize } = useSelector(
    (state: RootState) => state.permission
  );
  const theme = useSelector((state: RootState) => state.theme.theme);
  
  const [searchTerm] = useState('');

  useEffect(() => {
    dispatch(clearError());
    loadPermissions();
  }, [pageRouteId, currentPageNumber, pageSize, searchTerm]);

  const loadPermissions = () => {
    dispatch(fetchPermissions({
      page: currentPageNumber,
      pageSize: 100, // Sabit 100 olarak ayarlandı
      pageRouteID: pageRouteId,
      name: searchTerm || undefined,
    }));
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };



  if (loading && permissions.length === 0) {
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
            <button
              onClick={handleCreatePermission}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              {t('pages.pageRoutePermissions.newPermission')}
            </button>
          </div>

          {/* Search and Filters
          <div 
            style={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              padding: '1rem',
              border: '1px solid'
            }}
          >
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
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${
                    theme === 'dark' 
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Filter size={20} />
                  {t('pages.filters')}
                </button>
              </div>
            </div>
          </div> */}
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className={`transition-colors duration-200 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>{error}</p>
          </div>
        )}

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {permissions.filter(permission => permission !== null).map((permission, index) => (
            <div
              key={permission?.id || `permission-${index}`}
              className={`rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/50' 
                  : 'bg-white border-gray-200 hover:shadow-gray-200/50'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-lg font-semibold line-clamp-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {permission?.name || 'Unnamed Permission'}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    permission?.isActive 
                      ? theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {permission?.isActive ? t('pages.pageRoutePermissions.status.active') : t('pages.pageRoutePermissions.status.inactive')}
                  </span>
                </div>

                {permission?.description && (
                  <p className={`text-sm mb-4 line-clamp-3 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {permission.description}
                  </p>
                )}

                <div className={`flex items-center justify-between text-sm mb-4 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span>{permission?.createdAt ? formatDate(permission.createdAt) : 'No date'}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    theme === 'dark' ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800'
                  }`}>
                    ID: {permission?.id || 'No ID'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => permission?.id && handleViewPermission(permission.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors duration-200"
                    disabled={!permission?.id}
                  >
                    <Eye size={16} />
                    {t('pages.pageRoutePermissions.view')}
                  </button>
                  <button
                    onClick={() => permission?.id && handleEditPermission(permission.id)}
                    className={`px-3 py-2 border rounded-lg text-sm flex items-center gap-1 transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                    disabled={!permission?.id}
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              <button
                onClick={handleCreatePermission}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {t('pages.pageRoutePermissions.createFirstPermission')}
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className={`text-sm transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pages.pageRoutePermissions.itemsPerPage')}:
              </span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className={`px-3 py-1 border rounded-lg text-sm transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPageNumber - 1)}
                disabled={currentPageNumber === 1}
                className={`px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300 disabled:hover:bg-transparent' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700 disabled:hover:bg-transparent'
                }`}
              >
                {t('pages.pageRoutePermissions.previous')}
              </button>
              
              <span className={`px-3 py-2 text-sm transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {currentPageNumber} / {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPageNumber + 1)}
                disabled={currentPageNumber === totalPages}
                className={`px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300 disabled:hover:bg-transparent' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700 disabled:hover:bg-transparent'
                }`}
              >
                {t('pages.pageRoutePermissions.next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageRoutePermissionsRoute; 