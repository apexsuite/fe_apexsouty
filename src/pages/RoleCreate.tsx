import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '@/lib/store';
import { createRole } from '@/lib/roleSlice';
import { ArrowLeft, Save } from 'lucide-react';
import { Form, Input, Button, Card, Typography, Switch, message } from 'antd';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const RoleCreate: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await dispatch(createRole(values)).unwrap();
      message.success(t('roles.roleCreatedSuccessfully') || 'Role created successfully!');
      navigate('/roles');
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.message || t('roles.errorCreatingRole') || 'Error creating role';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/roles');
  };

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
                {t('roles.createRole') || 'Create Role'}
              </Title>
              <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">
                {t('roles.createNewRole') || 'Create a new role with specific permissions'}
              </Paragraph>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              isActive: true,
              isDefault: false,
              roleValue: 1
            }}
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
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('roles.cancel') || 'Cancel'}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<Save size={16} />}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                >
                  {loading ? t('roles.creating') || 'Creating...' : t('roles.createRole') || 'Create Role'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default RoleCreate; 