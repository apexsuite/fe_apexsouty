import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

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
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText={t('roles.delete') || 'Delete'}
      cancelText={t('roles.cancel') || 'Cancel'}
      okButtonProps={{ danger: true }}
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