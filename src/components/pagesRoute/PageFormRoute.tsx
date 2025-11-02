import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import {
  fetchPageRouteById,
  createPageRoute,
  updatePageRoute,
  clearCurrentPageRoute,
  clearError,
} from '@/lib/pageSlice';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useErrorHandler } from '@/lib/useErrorHandler';
import { useTheme } from '@/providers/theme';

const PageFormRoute: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPageRoute, loading } = useSelector(
    (state: RootState) => state.page
  );
  const { theme } = useTheme();
  const { handleError, showSuccess } = useErrorHandler();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    component: '',
    icon: '',
    path: '',
    isActive: true,
    isVisible: true,
    isUnderConstruction: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(id);

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
    if (currentPageRoute && isEditing) {
      setFormData({
        name: currentPageRoute.name || '',
        description: currentPageRoute.description || '',
        component: currentPageRoute.component || '',
        icon: currentPageRoute.icon || '',
        path: currentPageRoute.path || '',
        isActive: currentPageRoute.is_active || true,
        isVisible: currentPageRoute.is_visible || true,
        isUnderConstruction: currentPageRoute.IsUnderConstruction || false,
      });
    }
  }, [currentPageRoute, isEditing]);

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
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Auto-generate path from name
    if (name === 'name' && !isEditing) {
      const path =
        '/' +
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      setFormData(prev => ({
        ...prev,
        path,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare payload - set parentID to empty string if it's empty
      const payload = {
        ...formData,
      };

      if (isEditing && currentPageRoute) {
        await dispatch(
          updatePageRoute({
            pageRouteId: currentPageRoute.id,
            pageRouteData: payload,
          })
        ).unwrap();
        showSuccess('pageUpdatedSuccessfully');
      } else {
        await dispatch(createPageRoute(payload)).unwrap();
        showSuccess('pageCreatedSuccessfully');
      }
      navigate('/page-routes');
    } catch (error: any) {
      console.error('Sayfa kaydedilirken hata oluştu:', error);
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/page-routes');
  };

  const handlePreview = () => {};

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
      <div className="mx-auto w-full md:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className={`mb-4 flex items-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft size={20} />
            {t('pages.backToPages')}
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {isEditing ? t('pages.editPage') : t('pages.createPage')}
              </h1>
              <p
                className={`mt-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {isEditing
                  ? t('pages.editPageSubtitle')
                  : t('pages.createPageSubtitle')}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePreview}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye size={16} />
                {t('pages.preview')}
              </button>
              <button
                type="submit"
                form="pageForm"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                {isSubmitting ? t('pages.saving') : t('pages.save')}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form id="pageForm" onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border p-6 shadow-sm ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <h2
              className={`mb-4 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {t('pages.basicInfo')}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.name')} *
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
                  placeholder={t('pages.enterName')}
                />
              </div>

              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.path')} *
                </label>
                <input
                  type="text"
                  name="path"
                  value={formData.path}
                  onChange={handleInputChange}
                  required
                  className={`w-full rounded-lg border px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="/sayfa-yolu"
                />
              </div>

              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.component')}
                </label>
                <input
                  type="text"
                  name="component"
                  value={formData.component}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="ComponentName"
                />
              </div>

              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.icon')}
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="🏠"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
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
                    {t('pages.isActive')}
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={formData.isVisible}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('pages.isVisible')}
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isUnderConstruction"
                    checked={formData.isUnderConstruction}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('pages.underConstruction')}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border p-6 shadow-sm ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <h2
              className={`mb-4 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {t('pages.description')}
            </h2>

            <div>
              <label
                className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('pages.description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder={t('pages.enterDescription')}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageFormRoute;
