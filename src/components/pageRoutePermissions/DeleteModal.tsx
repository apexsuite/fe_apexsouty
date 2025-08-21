import React from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteModalProps {
  isVisible: boolean;
  permissionName: string;
  isDeleting: boolean;
  onDelete: () => void;
  onCancel: () => void;
  theme: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ 
  isVisible, 
  permissionName, 
  isDeleting, 
  onDelete, 
  onCancel, 
  theme 
}) => {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t('pages.pageRoutePermissions.deletePermission')}
        </h3>
        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('pages.pageRoutePermissions.deleteConfirmMessage', { name: permissionName })}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
              theme === 'dark' 
                ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
            disabled={isDeleting}
          >
            {t('pages.pageRoutePermissions.cancel')}
          </button>
          <button
            onClick={onDelete}
            className={`flex-1 px-4 py-2 rounded-lg disabled:opacity-50 ${
              theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'
            } text-white`}
            disabled={isDeleting}
          >
            {isDeleting ? t('pages.pageRoutePermissions.saving') : t('pages.pageRoutePermissions.delete')}
          </button>
        </div>
      </div>  
    </div>
  );
};

export default DeleteModal; 