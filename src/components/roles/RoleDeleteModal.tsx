import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PermissionGuard from '@/components/PermissionGuard';

interface RoleDeleteModalProps {
  visible: boolean;
  roleName?: string;
  loading: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const RoleDeleteModal: React.FC<RoleDeleteModalProps> = ({
  visible,
  roleName,
  loading,
  onOk,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-red-500" />
          <span className="text-gray-900 dark:text-white">{t('roles.deleteRole') || 'Delete Role'}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      cancelText={t('roles.cancel') || 'Cancel'}
      footer={[
        <button
          key="cancel"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {t('roles.cancel') || 'Cancel'}
        </button>,
        <PermissionGuard 
          key="delete"
          permission="delete-role" 
          mode="hide"
        >
          <button
            onClick={onOk}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : (t('roles.delete') || 'Delete')}
          </button>
        </PermissionGuard>
      ]}
      className="text-center dark:bg-gray-800"
      styles={{
        content: { backgroundColor: 'var(--ant-color-bg-container)' },
        header: { backgroundColor: 'var(--ant-color-bg-container)' },
        body: { backgroundColor: 'var(--ant-color-bg-container)' },
        footer: { backgroundColor: 'var(--ant-color-bg-container)' }
      }}
    >
      <div className="py-4">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('roles.deleteConfirmMessage') || 'Are you sure you want to delete this role? This action cannot be undone.'}
        </p>
        {roleName && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong className="text-gray-700 dark:text-gray-300">Role:</strong> {roleName}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default RoleDeleteModal; 