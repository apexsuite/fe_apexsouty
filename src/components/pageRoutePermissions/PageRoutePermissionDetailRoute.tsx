import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPermissionById, clearCurrentPermission, clearError } from '@/lib/pageRoutePermissionSlice';
import { ArrowLeft, Edit, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';

import PermissionInfo from './PermissionInfo';
import PageRouteInfo from './PageRouteInfo';
import RolePermissions from './RolePermissions';

const PageRoutePermissionDetailRoute: React.FC = () => {
  const { t } = useTranslation();
  const { pageRouteId, permissionId } = useParams<{ pageRouteId: string; permissionId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPermission, loading, error } = useSelector((state: RootState) => state.permission);
  const theme = useSelector((state: RootState) => state.theme.theme);

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

  const handleBack = () => {
    navigate(`/page-route-permissions`);
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
        <div className="max-w-4xl mx-auto md:px-8">
          <div className={`rounded-lg p-6 text-center ${theme === 'dark' ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            <h2 className="text-xl font-semibold mb-2">{t('notification.error')}</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={handleBack}
              className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'
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
        <div className="max-w-4xl mx-auto md:px-8">
          <div className={`rounded-lg p-6 text-center ${theme === 'dark' ? 'bg-yellow-900/20 border-yellow-700 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
            <h2 className="text-xl font-semibold mb-2">{t('pages.pageRoutePermissions.permissionNotFound')}</h2>
            <p className="mb-4">{t('pages.pageRoutePermissions.permissionNotFoundMessage')}</p>
            <button
              onClick={handleBack}
              className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-600 hover:bg-yellow-700'
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
      <div className="w-full mx-auto md:px-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 mb-4 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <ArrowLeft size={20} />
            {t('pages.pageRoutePermissions.backToPermissions')}
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {currentPermission.name}
              </h1>
              <div className={`flex flex-wrap items-center gap-3 md:gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span className="hidden sm:inline">{currentPermission.createdAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={16} />
                  <span className="hidden sm:inline">{t('pages.pageRoutePermissions.basicInfo')}</span>
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

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleEdit}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                <Edit size={16} />
                <span className="hidden sm:inline">{t('pages.pageRoutePermissions.edit')}</span>
                <span className="sm:hidden">{t('common.edit') || 'Edit'}</span>
              </button>
            </div>
          </div>
        </div>

        <PermissionInfo permission={currentPermission} theme={theme} />

        <PageRouteInfo permission={currentPermission} theme={theme} />

        <RolePermissions permission={currentPermission} theme={theme} />
      </div>
    </div>
  );
};

export default PageRoutePermissionDetailRoute; 