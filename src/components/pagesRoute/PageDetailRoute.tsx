import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import {
  fetchPageRouteById,
  clearCurrentPageRoute,
  clearError,
} from '@/lib/pageSlice';
import { ArrowLeft, Edit, Calendar, Tag } from 'lucide-react';
import PermissionTable from './PermissionTable';
import { useTheme } from '@/providers/theme';

const PageDetailRoute: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPageRoute, loading, error } = useSelector(
    (state: RootState) => state.page
  );
  const { theme } = useTheme();

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
                ? 'border border-red-800 bg-red-900/20 text-red-400'
                : 'border border-red-200 bg-red-50 text-red-800'
            }`}
          >
            <h2
              className={`mb-2 text-xl font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}
            >
              {t('notification.error')}
            </h2>
            <p
              className={`mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}
            >
              {error}
            </p>
            <button
              onClick={handleBack}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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
      <div
        className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="mx-auto w-full md:px-8">
          <div
            className={`rounded-lg p-6 text-center ${
              theme === 'dark'
                ? 'border border-yellow-800 bg-yellow-900/20 text-yellow-400'
                : 'border border-yellow-200 bg-yellow-50 text-yellow-800'
            }`}
          >
            <h2
              className={`mb-2 text-xl font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}`}
            >
              {t('pages.pageNotFound')}
            </h2>
            <p
              className={`mb-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}
            >
              {t('pages.pageNotFoundMessage')}
            </p>
            <button
              onClick={handleBack}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
            >
              {t('pages.backToPages')}
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
        {/* Header */}
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
            {t('pages.backToPages')}
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1
                className={`mb-2 text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {currentPageRoute.name}
              </h1>
              <div
                className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
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
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <Edit size={16} />
                {t('pages.edit')}
              </button>
            </div>
          </div>
        </div>

        {/* Icon */}
        {currentPageRoute.icon && (
          <div className="mb-6">
            <div
              className={`flex h-24 w-full items-center justify-center rounded-lg shadow-sm ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <div
                className={`text-3xl ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}
              >
                {currentPageRoute.icon}
              </div>
            </div>
          </div>
        )}

        {/* Meta Information */}
        <div
          className={`mb-6 rounded-lg p-6 shadow-sm ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2
            className={`mb-4 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {t('pages.pageDetails')}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('pages.path')}
              </label>
              <p
                className={`rounded-lg px-3 py-2 font-mono text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                {currentPageRoute.path}
              </p>
            </div>

            <div>
              <label
                className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('pages.component')}
              </label>
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                {currentPageRoute.component}
              </p>
            </div>

            {currentPageRoute.description && (
              <div className="md:col-span-2">
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.description')}
                </label>
                <p
                  className={`rounded-lg px-3 py-2 ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-50 text-gray-900'
                  }`}
                >
                  {currentPageRoute.description}
                </p>
              </div>
            )}

            <div>
              <label
                className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('pages.visibility')}
              </label>
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    currentPageRoute.is_visible
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  {currentPageRoute.is_visible
                    ? t('pages.visible')
                    : t('pages.hidden')}
                </span>
              </p>
            </div>

            <div>
              <label
                className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Permission Count
              </label>
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  {currentPageRoute.permissionCount || 0}
                </span>
              </p>
            </div>
          </div>

          {currentPageRoute.IsUnderConstruction && (
            <div className="mt-4">
              <label
                className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('pages.constructionStatus')}
              </label>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
                    theme === 'dark'
                      ? 'border border-yellow-800 bg-yellow-900/20 text-yellow-400'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <Tag size={14} />
                  {t('pages.underConstruction')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Permissions Management */}
        <div
          className={`mb-6 rounded-lg p-6 shadow-sm ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <PermissionTable
            pageRouteId={id!}
            pageRoutePermissions={pagePermissions}
            onPermissionsUpdate={handlePermissionsUpdate}
            onPermissionsChange={handlePermissionsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PageDetailRoute;
