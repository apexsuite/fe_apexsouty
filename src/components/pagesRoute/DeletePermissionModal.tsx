import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Modal,
  Button,
  Typography,
  Space,
  theme
} from 'antd';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { RootState } from '@/lib/store';

const { Title, Text } = Typography;

interface DeletePermissionModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  permission: any;
  loading?: boolean;
}

const DeletePermissionModal: React.FC<DeletePermissionModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  permission,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
            <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <span className="text-gray-900 dark:text-white">
            {t('permissions.deletePermission') || 'Delete Permission'}
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      className={`${currentTheme === 'dark' ? 'dark-modal' : ''}`}
      style={{
        backgroundColor: currentTheme === 'dark' ? '#1f2937' : token.colorBgContainer,
      }}
    >
      <div className="py-4">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 flex-shrink-0">
            <Trash2 size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <Title level={4} className="mb-2 text-gray-900 dark:text-white">
              {t('permissions.deleteConfirmTitle') || 'Are you sure you want to delete this permission?'}
            </Title>
            <Text className="text-gray-600 dark:text-gray-300">
              {t('permissions.deleteConfirmMessage') || 'This action cannot be undone. The permission will be permanently removed from the system.'}
            </Text>
          </div>
        </div>

        {permission && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <Title level={5} className="mb-2 text-gray-900 dark:text-white">
              {t('permissions.permissionDetails') || 'Permission Details'}
            </Title>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text className="text-gray-600 dark:text-gray-300 font-medium">
                  {t('permissions.name') || 'Name'}:
                </Text>
                <Text className="text-gray-900 dark:text-white">
                  {permission.name}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600 dark:text-gray-300 font-medium">
                  {t('permissions.label') || 'Label'}:
                </Text>
                <Text className="text-gray-900 dark:text-white">
                  {permission.label}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600 dark:text-gray-300 font-medium">
                  {t('permissions.status') || 'Status'}:
                </Text>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  permission.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {permission.isActive ? (t('common.active') || 'Active') : (t('common.inactive') || 'Inactive')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} disabled={loading}>
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button 
            type="primary" 
            danger 
            onClick={onConfirm} 
            loading={loading}
            icon={<Trash2 size={16} />}
          >
            {t('permissions.deletePermission') || 'Delete Permission'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePermissionModal;
