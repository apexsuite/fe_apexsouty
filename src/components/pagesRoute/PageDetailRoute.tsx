import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPageRouteById, deletePageRoute, clearCurrentPageRoute, clearError } from '@/lib/pageSlice';
import { ArrowLeft, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import PermissionTable from './PermissionTable';

const PageDetailRoute: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPageRoute, loading, error } = useSelector((state: RootState) => state.page);
  const theme = useSelector((state: RootState) => state.theme.theme);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagePermissions, setPagePermissions] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(clearError());
      dispatch(fetchPageRouteById(id));
    }

    return () => {
      dispatch(clearCurrentPageRoute());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentPageRoute) {
      setPagePermissions(currentPageRoute.page_route_permissions || []);
    }
  }, [currentPageRoute]);

  const handleEdit = () => {
    if (currentPageRoute) {
      navigate(`/page-routes/${currentPageRoute.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!currentPageRoute) return;

    setIsDeleting(true);
    try {
      await dispatch(deletePageRoute(currentPageRoute.id)).unwrap();
      navigate('/page-routes');
    } catch (error) {
      console.error('Sayfa silinirken hata oluştu:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleBack = () => {
    navigate('/page-routes');
  };

  // Handle permission changes
  const handlePermissionsChange = (permissions: any[]) => {
    setPagePermissions(permissions);
  };

  // Refresh page route data
  const handlePermissionsUpdate = () => {
    if (id) {
      dispatch(fetchPageRouteById(id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-lg p-6 text-center ${
            theme === 'dark' 
              ? 'bg-red-900/20 border border-red-800 text-red-400' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>
              {t('notification.error')}
            </h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            <button
              onClick={handleBack}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              {t('pages.backToPages')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPageRoute) {
    return (
      <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-lg p-6 text-center ${
            theme === 'dark' 
              ? 'bg-yellow-900/20 border border-yellow-800 text-yellow-400' 
              : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
          }`}>
            <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}`}>
              {t('pages.pageNotFound')}
            </h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {t('pages.pageNotFoundMessage')}
            </p>
            <button
              onClick={handleBack}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
            >
              {t('pages.backToPages')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 mb-4 transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft size={20} />
            {t('pages.backToPages')}
          </button>

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {currentPageRoute.name}
              </h1>
              <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {formatDate(currentPageRoute.createdAt)}
                </div>
                {currentPageRoute.IsUnderConstruction && (
                  <div className="flex items-center gap-1">
                    <Tag size={16} />
                    {t('pages.underConstruction')}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit size={16} />
                {t('pages.edit')}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Trash2 size={16} />
                {t('pages.delete')}   
              </button>
            </div>
          </div>
        </div>

        {/* Icon */}
        {currentPageRoute.icon && (
          <div className="mb-6">
            <div className={`w-full h-24 rounded-lg shadow-sm flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <div className={`text-3xl ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
                {currentPageRoute.icon}
              </div>
            </div>
          </div>
        )}

        {/* Meta Information */}
        <div className={`rounded-lg shadow-sm p-6 mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('pages.pageDetails')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pages.path')}
              </label>
              <p className={`px-3 py-2 rounded-lg font-mono text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-50 text-gray-900'
              }`}>
                {currentPageRoute.path}
              </p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pages.component')}
              </label>
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                {currentPageRoute.component}
              </p>
            </div>

            {currentPageRoute.description && (
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('pages.description')}
                </label>
                <p className={`px-3 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-50 text-gray-900'
                }`}>
                  {currentPageRoute.description}
                </p>
              </div>
            )}


            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pages.visibility')}
              </label>
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  currentPageRoute.is_visible 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-800 text-gray-200'
                }`}>
                  {currentPageRoute.is_visible ? t('pages.visible') : t('pages.hidden')}
                </span>
              </p>
            </div>



            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Permission Count
              </label>
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  {currentPageRoute.permissionCount || 0}
                </span>
              </p>
            </div>
          </div>

          {currentPageRoute.IsUnderConstruction && (
            <div className="mt-4">
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pages.constructionStatus')}
              </label>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                  theme === 'dark' 
                    ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <Tag size={14} />
                  {t('pages.underConstruction')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Permissions Management */}
        <div className={`rounded-lg shadow-sm p-6 mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <PermissionTable
            pageRouteId={id!}
            pageRoutePermissions={pagePermissions}
            onPermissionsUpdate={handlePermissionsUpdate}
            onPermissionsChange={handlePermissionsChange}
          />
        </div>

      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('pages.deletePage')}
            </h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('pages.deleteConfirmMessage', { title: currentPageRoute.name })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 ${
                  theme === 'dark' 
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                disabled={isDeleting}
              >
                {t('pages.cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? t('pages.saving') : t('pages.delete')}
              </button>
            </div>
          </div>  
        </div>
      )}
    </div>
  );
};

export default PageDetailRoute; 