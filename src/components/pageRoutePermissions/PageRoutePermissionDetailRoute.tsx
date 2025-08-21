import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPermissionById, deletePermission, clearCurrentPermission, clearError } from '@/lib/pageRoutePermissionSlice';
import { ArrowLeft, Edit, Trash2, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';

// Import components
import PermissionInfo from './PermissionInfo';
import PageRouteInfo from './PageRouteInfo';
import RolePermissions from './RolePermissions';
import DeleteModal from './DeleteModal';

const PageRoutePermissionDetailRoute: React.FC = () => {
  const { t } = useTranslation();
  const { pageRouteId, permissionId } = useParams<{ pageRouteId: string; permissionId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPermission, loading, error } = useSelector((state: RootState) => state.permission);
  const theme = useSelector((state: RootState) => state.theme.theme);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (permissionId) {
      dispatch(clearError());
      dispatch(fetchPermissionById(permissionId));
    }

    return () => {
      dispatch(clearCurrentPermission());
    };
  }, [pageRouteId, permissionId, dispatch]);

  const handleEdit = () => {
    if (currentPermission) {
      navigate(`/page-route-permissions/${pageRouteId || 'all'}/permissions/${currentPermission.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!currentPermission || !pageRouteId) return;

    setIsDeleting(true);
    try {
      await dispatch(deletePermission(currentPermission.id)).unwrap();
      navigate(`/page-route-permissions/${pageRouteId || 'all'}/permissions`);
    } catch (error) {
      console.error('Permission silinirken hata oluştu:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleBack = () => {
    navigate(`/page-route-permissions/${pageRouteId || 'all'}/permissions`);
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
            theme === 'dark' ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <h2 className="text-xl font-semibold mb-2">{t('notification.error')}</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={handleBack}
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {t('pages.pageRoutePermissions.backToPermissions')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPermission) {
    return (
      <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-lg p-6 text-center ${
            theme === 'dark' ? 'bg-yellow-900/20 border-yellow-700 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            <h2 className="text-xl font-semibold mb-2">{t('pages.pageRoutePermissions.permissionNotFound')}</h2>
            <p className="mb-4">{t('pages.pageRoutePermissions.permissionNotFoundMessage')}</p>
            <button
              onClick={handleBack}
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-600 hover:bg-yellow-700'
              } text-white`}
            >
              {t('pages.pageRoutePermissions.backToPermissions')}
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
            {t('pages.pageRoutePermissions.backToPermissions')}
          </button>

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {currentPermission.name}
              </h1>
              <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {currentPermission.createdAt}
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={16} />
                  {t('pages.pageRoutePermissions.basicInfo')}
                </div>
                <div className="flex items-center gap-1">
                  {currentPermission.isActive ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  {currentPermission.isActive ? t('pages.pageRoutePermissions.status.active') : t('pages.pageRoutePermissions.status.inactive')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Edit size={16} />
                {t('pages.pageRoutePermissions.edit')}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  theme === 'dark' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <Trash2 size={16} />
                {t('pages.pageRoutePermissions.delete')}   
              </button>
            </div>
          </div>
        </div>

        {/* Permission Information */}
        <PermissionInfo permission={currentPermission} theme={theme} />

        {/* Page Route Information */}
        <PageRouteInfo permission={currentPermission} theme={theme} />

        {/* Role Permissions */}
        <RolePermissions permission={currentPermission} theme={theme} />
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isVisible={showDeleteModal}
        permissionName={currentPermission.name}
        isDeleting={isDeleting}
        onDelete={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        theme={theme}
      />
    </div>
  );
};

export default PageRoutePermissionDetailRoute; 