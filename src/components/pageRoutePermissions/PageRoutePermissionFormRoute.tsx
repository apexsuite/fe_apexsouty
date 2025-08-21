import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPermissionById, createPermission, updatePermission, clearCurrentPermission, clearError } from '@/lib/pageRoutePermissionSlice';
import { ArrowLeft, Save } from 'lucide-react';

const PageRoutePermissionFormRoute: React.FC = () => {
  const { t } = useTranslation();
  const { pageRouteId, permissionId } = useParams<{ pageRouteId: string; permissionId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPermission, loading, error } = useSelector(
    (state: RootState) => state.permission
  );
  const theme = useSelector((state: RootState) => state.theme.theme);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    label: '',
    isActive: true,
    pageRouteID: pageRouteId || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(permissionId);

  useEffect(() => {
    if (permissionId) {
      dispatch(clearError());
      dispatch(fetchPermissionById(permissionId));
    }

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
        pageRouteID: currentPermission.pageRouteID || pageRouteId || '',
      });
    }
  }, [currentPermission, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && currentPermission) {
        await dispatch(updatePermission({ 
          permissionId: currentPermission.id, 
          permissionData: formData 
        })).unwrap();
      } else {
        await dispatch(createPermission(formData)).unwrap();
      }
      navigate(`/page-route-permissions/${pageRouteId}/permissions`);
    } catch (error) {
      console.error('Permission kaydedilirken hata oluştu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/page-route-permissions/${pageRouteId}/permissions`);
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
            className={`flex items-center gap-2 mb-4 transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft size={20} />
            {t('pages.pageRoutePermissions.backToPermissions')}
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isEditing ? t('pages.pageRoutePermissions.editPermission') : t('pages.pageRoutePermissions.createPermission')}
              </h1>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {isEditing ? t('pages.pageRoutePermissions.editPermissionSubtitle') : t('pages.pageRoutePermissions.createPermissionSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className={`transition-colors duration-200 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('pages.pageRoutePermissions.basicInfo')}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('pages.pageRoutePermissions.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder={t('pages.pageRoutePermissions.enterName')}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('pages.pageRoutePermissions.description')}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder={t('pages.pageRoutePermissions.enterDescription')}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter label"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('pages.pageRoutePermissions.isActive')}
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleBack}
              className={`px-6 py-2 border rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
              disabled={isSubmitting}
            >
              {t('pages.pageRoutePermissions.cancel')}
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 ${
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              disabled={isSubmitting}
            >
              <Save size={16} />
              {isSubmitting ? t('pages.pageRoutePermissions.saving') : t('pages.pageRoutePermissions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageRoutePermissionFormRoute; 