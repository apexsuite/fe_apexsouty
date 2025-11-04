import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, Switch, Button, theme } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
import { Edit, Info, Tag as TagIcon, Activity } from 'lucide-react';
import { AppDispatch } from '@/lib/store';
import { updatePermission } from '@/lib/pageRoutePermissionSlice';
import { useTheme } from '@/providers/theme';

interface EditPermissionModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  permission: any;
  pageRouteId: string;
}

interface EditPermissionFormData {
  name: string;
  description: string;
  label: string;
  isActive: boolean;
}

const EditPermissionModal: React.FC<EditPermissionModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  permission,
  pageRouteId,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();
  const { theme: currentTheme } = useTheme();
  const { handleError, showSuccess } = useErrorHandler();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permission && visible) {
      form.setFieldsValue({
        name: permission.name,
        description: permission.description,
        label: permission.label,
        isActive: permission.isActive,
      });
    }
  }, [permission, visible, form]);

  const handleSubmit = async (values: EditPermissionFormData) => {
    setLoading(true);
    try {
      const payload = {
        pageRouteId: pageRouteId,
        permissionId: permission.id,
        permissionData: {
          ...values,
          pageRouteId: pageRouteId,
        },
      };

      await dispatch(updatePermission(payload)).unwrap();
      showSuccess('permissionUpdatedSuccessfully');
      form.resetFields();
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
            <Edit size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-gray-900 dark:text-white">
            {t('permissions.editPermission') || 'Edit Permission'}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className={`${currentTheme === 'dark' ? 'dark-modal' : ''}`}
      style={{
        backgroundColor:
          currentTheme === 'dark' ? '#1f2937' : token.colorBgContainer,
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={`mt-4 ${currentTheme === 'dark' ? 'dark-input' : ''}`}
      >
        <Form.Item
          name="name"
          label={
            <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Info size={16} className="text-gray-500 dark:text-gray-400" />
              {t('permissions.name') || 'Name'}
            </span>
          }
          rules={[
            {
              required: true,
              message: t('permissions.nameRequired') || 'Name is required',
            },
            {
              min: 2,
              message:
                t('permissions.nameMinLength') ||
                'Name must be at least 2 characters',
            },
          ]}
        >
          <Input
            placeholder={t('permissions.enterName') || 'Enter permission name'}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Info size={16} className="text-gray-500 dark:text-gray-400" />
              {t('permissions.description') || 'Description'}
            </span>
          }
          rules={[
            {
              required: true,
              message:
                t('permissions.descriptionRequired') ||
                'Description is required',
            },
            {
              min: 5,
              message:
                t('permissions.descriptionMinLength') ||
                'Description must be at least 5 characters',
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder={
              t('permissions.enterDescription') ||
              'Enter permission description'
            }
          />
        </Form.Item>

        <Form.Item
          name="label"
          label={
            <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TagIcon size={16} className="text-gray-500 dark:text-gray-400" />
              {t('permissions.label') || 'Label'}
            </span>
          }
          rules={[
            {
              required: true,
              message: t('permissions.labelRequired') || 'Label is required',
            },
            {
              min: 2,
              message:
                t('permissions.labelMinLength') ||
                'Label must be at least 2 characters',
            },
          ]}
        >
          <Input
            placeholder={
              t('permissions.enterLabel') || 'Enter permission label'
            }
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label={
            <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Activity
                size={16}
                className="text-gray-500 dark:text-gray-400"
              />
              {t('permissions.isActive') || 'Is Active'}
            </span>
          }
          valuePropName="checked"
        >
          <Switch
            className="dark:bg-gray-600"
            checkedChildren={t('common.yes') || 'Yes'}
            unCheckedChildren={t('common.no') || 'No'}
          />
        </Form.Item>

        <Form.Item className="mt-6">
          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel} disabled={loading}>
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<Edit size={16} />}
            >
              {t('permissions.updatePermission') || 'Update Permission'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPermissionModal;
