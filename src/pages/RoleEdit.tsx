import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchRoleById, updateRole, clearCurrentRole } from '@/lib/roleSlice';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { Form, Input, Button, Card, Typography, Switch } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const RoleEdit: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { currentRole, loading, error } = useSelector((state: RootState) => state.role);
  const { handleError, showSuccess } = useErrorHandler();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchRoleById(id));
    }
    return () => {
      dispatch(clearCurrentRole());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentRole) {
      form.setFieldsValue({
        name: currentRole.name,
        description: currentRole.description,
        roleValue: currentRole.roleValue,
        isActive: currentRole.isActive,
        isDefault: currentRole.isDefault,
      });
    }
  }, [currentRole, form]);

  const onFinish = async (values: any) => {
    if (!id) return;
    
    setSubmitting(true);
    try {
      await dispatch(updateRole({ roleId: id, roleData: values })).unwrap();
      showSuccess('roleUpdatedSuccessfully');
      navigate('/roles');
    } catch (error: any) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/roles');
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin mx-auto h-12 w-12 text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('roles.loadingRole') || 'Loading role...'}</p>
        </div>
      </div>
    );
  }

  if (error || !currentRole) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <div className="text-center text-red-600 dark:text-red-400">
              <p className="mb-4">{error || t('roles.roleNotFound') || 'Role not found'}</p>
              <Button onClick={handleCancel}>
                {t('roles.backToRoles') || 'Back to Roles'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <Title level={2} className="mb-2 text-gray-900 dark:text-white">
                {t('roles.editRole') || 'Edit Role'}
              </Title>
              <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">
                {t('roles.editRoleDescription') || 'Update role information and permissions'}
              </Paragraph>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <Form.Item
                label={t('roles.name') || 'Name'}
                name="name"
                rules={[
                  { required: true, message: t('roles.nameRequired') || 'Name is required' },
                  { min: 2, message: t('roles.nameMinLength') || 'Name must be at least 2 characters' }
                ]}
              >
                <Input
                  placeholder={t('roles.enterRoleName') || 'Enter role name'}
                  size="large"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </Form.Item>

              {/* Role Value */}
              <Form.Item
                label={t('roles.roleValue') || 'Role Value'}
                name="roleValue"
                rules={[
                  { required: true, message: t('roles.roleValueRequired') || 'Role value is required' },
                  { type: 'number', min: 1, message: t('roles.roleValueMin') || 'Role value must be at least 1' }
                ]}
              >
                <Input
                  type="number"
                  placeholder={t('roles.enterRoleValue') || 'Enter role value'}
                  size="large"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </Form.Item>
            </div>

            {/* Description */}
            <Form.Item
              label={t('roles.description') || 'Description'}
              name="description"
              rules={[
                { required: true, message: t('roles.descriptionRequired') || 'Description is required' },
                { min: 10, message: t('roles.descriptionMinLength') || 'Description must be at least 10 characters' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder={t('roles.enterRoleDescription') || 'Enter role description'}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </Form.Item>

            {/* Switches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={t('roles.isActive') || 'Is Active'}
                name="isActive"
                valuePropName="checked"
              >
                <Switch className="dark:bg-gray-600" />
              </Form.Item>

              <Form.Item
                label={t('roles.isDefault') || 'Is Default'}
                name="isDefault"
                valuePropName="checked"
              >
                <Switch className="dark:bg-gray-600" />
              </Form.Item>
            </div>


            {/* Actions */}
            <Form.Item className="mb-0">
              <div className="flex gap-3 justify-end">
                <Button
                  size="large"
                  onClick={handleCancel}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {t('roles.cancel') || 'Cancel'}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  icon={<Save size={16} />}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                >
                  {submitting ? t('roles.updating') || 'Updating...' : t('roles.updateRole') || 'Update Role'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default RoleEdit; 