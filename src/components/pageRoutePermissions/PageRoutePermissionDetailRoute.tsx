import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import {
  fetchPermissionById,
  clearCurrentPermission,
  clearError,
} from '@/lib/pageRoutePermissionSlice';
import {
  ArrowLeft,
  Edit,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import PermissionInfo from './PermissionInfo';
import PageRouteInfo from './PageRouteInfo';
import RolePermissions from './RolePermissions';
import { useTheme } from '@/providers/theme';

const PageRoutePermissionDetailRoute: React.FC = () => {
  const { t } = useTranslation();
  const { pageRouteId, permissionId } = useParams<{
    pageRouteId: string;
    permissionId: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPermission, loading, error } = useSelector(
    (state: RootState) => state.permission
  );
  const { theme } = useTheme();
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
      navigate(
        `/page-route-permissions/${pageRouteId || 'all'}/permissions/${currentPermission.id}/edit`
      );
    }
  };

  const handleBack = () => {
    navigate(`/page-route-permissions`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="mx-auto max-w-4xl md:px-8">
          <div
            className={`rounded-lg p-6 text-center ${
              theme === 'dark'
                ? 'border-red-700 bg-red-900/20 text-red-400'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            <h2 className="mb-2 text-xl font-semibold">
              {t('notification.error')}
            </h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={handleBack}
              className={`rounded-lg px-4 py-2 ${
                theme === 'dark'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-red-600 hover:bg-red-700'
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
      <div
        className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="mx-auto max-w-4xl md:px-8">
          <div
            className={`rounded-lg p-6 text-center ${
              theme === 'dark'
                ? 'border-yellow-700 bg-yellow-900/20 text-yellow-400'
                : 'border-yellow-200 bg-yellow-50 text-yellow-800'
            }`}
          >
            <h2 className="mb-2 text-xl font-semibold">
              {t('pages.pageRoutePermissions.permissionNotFound')}
            </h2>
            <p className="mb-4">
              {t('pages.pageRoutePermissions.permissionNotFoundMessage')}
            </p>
            <button
              onClick={handleBack}
              className={`rounded-lg px-4 py-2 ${
                theme === 'dark'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
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
    <div
      className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="mx-auto w-full md:px-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className={`mb-4 flex items-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft size={20} />
            {t('pages.pageRoutePermissions.backToPermissions')}
          </button>

          <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
            <div className="flex-1">
              <h1
                className={`mb-2 text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {currentPermission.name}
              </h1>
              <div
                className={`flex flex-wrap items-center gap-3 text-sm md:gap-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span className="hidden sm:inline">
                    {currentPermission.createdAt}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={16} />
                  <span className="hidden sm:inline">
                    {t('pages.pageRoutePermissions.basicInfo')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {currentPermission.isActive ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  {currentPermission.isActive
                    ? t('pages.pageRoutePermissions.status.active')
                    : t('pages.pageRoutePermissions.status.inactive')}
                </div>
              </div>
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto">
              <button
                onClick={handleEdit}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors md:flex-none ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Edit size={16} />
                <span className="hidden sm:inline">
                  {t('pages.pageRoutePermissions.edit')}
                </span>
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
