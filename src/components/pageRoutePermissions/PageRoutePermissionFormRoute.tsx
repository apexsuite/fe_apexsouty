import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import {
  fetchPermissionById,
  createPermission,
  updatePermission,
  clearCurrentPermission,
  clearError,
} from '@/lib/pageRoutePermissionSlice';
import { fetchPageRoutes } from '@/lib/pageSlice';
import { ArrowLeft, Save } from 'lucide-react';
import { useErrorHandler } from '@/lib/useErrorHandler';
import { useTheme } from '@/providers/theme';

const PageRoutePermissionFormRoute: React.FC = () => {
  const { t } = useTranslation();
  const { pageRouteId, permissionId } = useParams<{
    pageRouteId: string;
    permissionId: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPermission, loading } = useSelector(
    (state: RootState) => state.permission
  );
  const { pageRoutes } = useSelector((state: RootState) => state.page);
  const { theme } = useTheme();
  const { handleError, showSuccess } = useErrorHandler();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    label: '',
    isActive: true,
    pageRouteId: pageRouteId || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(permissionId);

  useEffect(() => {
    if (permissionId) {
      dispatch(clearError());
      dispatch(fetchPermissionById(permissionId));
    }

    dispatch(
      fetchPageRoutes({
        page: 1,
        limit: 100,
        name: '',
      })
    );

    return () => {
      dispatch(clearCurrentPermission());
    };
  }, [permissionId, pageRouteId, dispatch]);

  useEffect(() => {
    if (currentPermission && isEditing) {
      setFormData({
        name: currentPermission.name || '',
        description: currentPermission.description || '',
        label: currentPermission.label || '',
        isActive: currentPermission.isActive || true,
        pageRouteId: currentPermission.pageRouteId || pageRouteId || '',
      });
    } else if (!isEditing && pageRouteId) {
      setFormData(prev => ({
        ...prev,
        pageRouteId: pageRouteId,
      }));
    }
  }, [currentPermission, isEditing, pageRouteId]);

  useEffect(() => {}, [
    isEditing,
    currentPermission,
    formData.pageRouteId,
    pageRoutes,
  ]);

  useEffect(() => {
    if (isEditing && currentPermission && pageRoutes && pageRoutes.length > 0) {
      const isValidPageRoute = pageRoutes.some(
        (route: any) => route.id === currentPermission.pageRouteId
      );

      if (isValidPageRoute) {
        setFormData(prev => ({
          ...prev,
          pageRouteId: currentPermission.pageRouteId,
        }));
      }
    }
  }, [isEditing, currentPermission, pageRoutes]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value,
        };
        return newData;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && currentPermission) {
        await dispatch(
          updatePermission({
            pageRouteId: formData.pageRouteId,
            permissionId: currentPermission.id,
            permissionData: formData,
          })
        ).unwrap();
        showSuccess('permissionUpdatedSuccessfully');
      } else {
        await dispatch(
          createPermission({
            pageRouteId: formData.pageRouteId,
            permissionData: formData,
          })
        ).unwrap();
        showSuccess('permissionCreatedSuccessfully');
        navigate('/page-route-permissions');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/page-route-permissions');
  };

  if (loading && isEditing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="mx-auto w-full px-8">
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

          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {isEditing
                  ? t('pages.pageRoutePermissions.editPermission')
                  : t('pages.pageRoutePermissions.createPermission')}
              </h1>
              <p
                className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {isEditing
                  ? t('pages.pageRoutePermissions.editPermissionSubtitle')
                  : t('pages.pageRoutePermissions.createPermissionSubtitle')}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border p-6 shadow-sm ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <h2
              className={`mb-4 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {t('pages.pageRoutePermissions.basicInfo')}
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.pageRoutePermissions.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder={t('pages.pageRoutePermissions.enterName')}
                />
              </div>

              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.pageRoutePermissions.description')}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder={t('pages.pageRoutePermissions.enterDescription')}
                />
              </div>

              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter label"
                />
              </div>

              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.pageRoute')} *
                </label>
                <select
                  key={`pageRoute-${formData.pageRouteId}-${pageRoutes?.length || 0}`}
                  name="pageRouteId"
                  value={formData.pageRouteId}
                  onChange={handleInputChange}
                  required
                  disabled={!pageRoutes || pageRoutes.length === 0}
                  className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  } ${!pageRoutes || pageRoutes.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <option value="">
                    {!pageRoutes || pageRoutes.length === 0
                      ? t('pages.loadingPageRoutes') || 'Loading page routes...'
                      : t('pages.selectPageRoute') || 'Select Page Route'}
                  </option>
                  {pageRoutes?.map((pageRoute: any) => (
                    <option key={pageRoute.id} value={pageRoute.id}>
                      {pageRoute.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.pageRoutePermissions.isActive')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleBack}
              className={`rounded-lg border px-6 py-2 transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              disabled={isSubmitting}
            >
              {t('pages.pageRoutePermissions.cancel')}
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 rounded-lg px-6 py-2 transition-colors disabled:opacity-50 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              disabled={isSubmitting}
            >
              <Save size={16} />
              {isSubmitting
                ? t('pages.pageRoutePermissions.saving')
                : t('pages.pageRoutePermissions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageRoutePermissionFormRoute;
