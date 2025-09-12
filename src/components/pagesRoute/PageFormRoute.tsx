import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPageRouteById, createPageRoute, updatePageRoute, clearCurrentPageRoute, clearError } from '@/lib/pageSlice';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { message } from 'antd';

const PageFormRoute: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPageRoute, loading, error } = useSelector((state: RootState) => state.page);
  const theme = useSelector((state: RootState) => state.theme.theme);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    component: '',
    icon: '',
    path: '',
    isActive: true,
    isVisible: true,
    isUnderConstruction: false,
    parentID: '',
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
        parentID: currentPageRoute.parentID || '',
      });
    }
  }, [currentPageRoute, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const path = '/' + value
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
      const payload = { ...formData };
      if (!payload.parentID || payload.parentID.trim() === '') {
        payload.parentID = '';
      }

      if (isEditing && currentPageRoute) {
        await dispatch(updatePageRoute({ pageRouteId: currentPageRoute.id, pageRouteData: payload })).unwrap();
        message.success(t('pages.pageUpdatedSuccessfully') || 'Page updated successfully!');
      } else {
        await dispatch(createPageRoute(payload)).unwrap();
        message.success(t('pages.pageCreatedSuccessfully') || 'Page created successfully!');
      }
      navigate('/page-routes');
    } catch (error: any) {
      console.error('Sayfa kaydedilirken hata oluştu:', error);
      const errorMessage = error?.message || error?.data?.message || t('pages.errorSavingPage') || 'Error saving page';
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/page-routes');
  };

  const handlePreview = () => {
    // Preview functionality can be implemented here
    console.log('Preview:', formData);
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
            className={`flex items-center gap-2 mb-4 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <ArrowLeft size={20} />
            {t('pages.backToPages')}
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                {isEditing ? t('pages.editPage') : t('pages.createPage')}
              </h1>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                {isEditing ? t('pages.editPageSubtitle') : t('pages.createPageSubtitle')}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePreview}
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${theme === 'dark'
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <Eye size={16} />
                {t('pages.preview')}
              </button>
              <button
                type="submit"
                form="pageForm"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {isSubmitting ? t('pages.saving') : t('pages.save')}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 rounded-lg p-4 ${theme === 'dark'
              ? 'bg-red-900/20 border border-red-800'
              : 'bg-red-50 border border-red-200'
            }`}>
            <p className={theme === 'dark' ? 'text-red-400' : 'text-red-800'}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form id="pageForm" onSubmit={handleSubmit} className="space-y-6">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('pages.basicInfo')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('pages.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  placeholder={t('pages.enterName')}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('pages.path')} *
                </label>
                <input
                  type="text"
                  name="path"
                  value={formData.path}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  placeholder="/sayfa-yolu"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('pages.component')}
                </label>
                <input
                  type="text"
                  name="component"
                  value={formData.component}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  placeholder="ComponentName"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('pages.icon')}
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
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
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
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
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
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
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('pages.underConstruction')}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('pages.description')}</h2>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pages.description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
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