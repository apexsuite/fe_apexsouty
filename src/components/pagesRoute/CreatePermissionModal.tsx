import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal,
  Form,
  Input,
  Switch,
  Button,
  message,
  theme
} from 'antd';
import { Shield, Plus, Info, Tag, Activity } from 'lucide-react';
import { RootState, AppDispatch } from '@/lib/store';
import { createPermission } from '@/lib/pageRoutePermissionSlice';

interface CreatePermissionModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  pageRouteId: string;
}

interface CreatePermissionFormData {
  name: string;
  description: string;
  label: string;
  isActive: boolean;
}

const CreatePermissionModal: React.FC<CreatePermissionModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  pageRouteId,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const dispatch = useDispatch<AppDispatch>();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CreatePermissionFormData) => {
    setLoading(true);
    try {
      const payload = {
        pageRouteId: pageRouteId,
        permissionData: {
          ...values,
        }
      };
      
      await dispatch(createPermission(payload)).unwrap();
      message.success(t('permissions.createdSuccessfully') || 'Permission created successfully');
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error.message || t('permissions.createError') || 'Failed to create permission');
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
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Shield size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-gray-900 dark:text-white">
            {t('permissions.createPermission') || 'Create Permission'}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className={`${currentTheme === 'dark' ? 'dark-modal' : ''}`}
      style={{
        backgroundColor: currentTheme === 'dark' ? '#1f2937' : token.colorBgContainer,
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
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Info size={16} className="text-gray-500 dark:text-gray-400" />
              {t('permissions.name') || 'Name'}
            </span>
          }
          rules={[
            { required: true, message: t('permissions.nameRequired') || 'Name is required' },
            { min: 2, message: t('permissions.nameMinLength') || 'Name must be at least 2 characters' }
          ]}
        >
          <Input
            placeholder={t('permissions.enterName') || 'Enter permission name'}
            className={currentTheme === 'dark' ? 'dark-input' : ''}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Info size={16} className="text-gray-500 dark:text-gray-400" />
              {t('permissions.description') || 'Description'}
            </span>
          }
          rules={[
            { required: true, message: t('permissions.descriptionRequired') || 'Description is required' },
            { min: 5, message: t('permissions.descriptionMinLength') || 'Description must be at least 5 characters' }
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder={t('permissions.enterDescription') || 'Enter permission description'}
            className={currentTheme === 'dark' ? 'dark-input' : ''}
          />
        </Form.Item>

        <Form.Item
          name="label"
          label={
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Tag size={16} className="text-gray-500 dark:text-gray-400" />
              {t('permissions.label') || 'Label'}
            </span>
          }
          rules={[
            { required: true, message: t('permissions.labelRequired') || 'Label is required' },
            { min: 2, message: t('permissions.labelMinLength') || 'Label must be at least 2 characters' }
          ]}
        >
          <Input
            placeholder={t('permissions.enterLabel') || 'Enter permission label'}
            className={currentTheme === 'dark' ? 'dark-input' : ''}
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label={
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Activity size={16} className="text-gray-500 dark:text-gray-400" />
              {t('permissions.isActive') || 'Is Active'}
            </span>
          }
          valuePropName="checked"
          initialValue={true}
        >
          <Switch 
            className={currentTheme === 'dark' ? 'dark-switch' : ''}
            checkedChildren={t('common.yes') || 'Yes'}
            unCheckedChildren={t('common.no') || 'No'}
          />
        </Form.Item>

        <Form.Item className="mt-6">
          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel} disabled={loading}>
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t('permissions.createPermission') || 'Create Permission'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePermissionModal;
