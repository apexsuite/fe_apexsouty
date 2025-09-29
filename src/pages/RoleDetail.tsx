import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchRoleById, clearCurrentRole } from '@/lib/roleSlice';
import { ArrowLeft, Edit, Shield, Users, Calendar, Hash } from 'lucide-react';
import { Button, Card, Typography, Tag, Descriptions, Spin } from 'antd';
import RolePermissionTable from '@/components/roles/RolePermissionTable';

const { Title, Paragraph } = Typography;

const RoleDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { currentRole, loading, error } = useSelector((state: RootState) => state.role);
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);

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
      setRolePermissions(currentRole.rolePermissions || []);
    }
  }, [currentRole]);

  const handleEdit = () => {
    if (id) {
      navigate(`/roles/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/roles');
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('roles.loadingRole') || 'Loading role...'}
          </p>
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
              <Button onClick={handleBack}>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Shield size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <Title level={2} className="mb-1 text-gray-900 dark:text-white">
                    {currentRole.name}
                  </Title>
                  <div className="flex gap-2">
                    <Tag color={currentRole.isActive ? 'green' : 'red'}>
                      {currentRole.isActive ? t('roles.active') || 'Active' : t('roles.inactive') || 'Inactive'}
                    </Tag>
                    {currentRole.isDefault && (
                      <Tag color="blue">{t('roles.default') || 'Default'}</Tag>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              icon={<Edit size={16} />}
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
            >
              {t('roles.editRole') || 'Edit Role'}
            </Button>
          </div>
        </Card>

        {/* Role Information */}
        <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Title level={3} className="mb-4 text-gray-900 dark:text-white">
            {t('roles.roleInformation') || 'Role Information'}
          </Title>
          
          <Descriptions
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            className="dark:text-gray-300"
          >
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <Hash size={16} className="text-gray-500" />
                  {t('roles.roleValue') || 'Role Value'}
                </span>
              }
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {currentRole.roleValue}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  {t('roles.permissions') || 'Permissions'}
                </span>
              }
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {currentRole.permissionCount || 0}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  {t('roles.createdAt') || 'Created At'}
                </span>
              }
            >
              <span className="text-gray-600 dark:text-gray-300">
                {new Date(currentRole.createdAt).toLocaleDateString()}
              </span>
            </Descriptions.Item>
            
            {currentRole.updatedAt && (
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    {t('roles.updatedAt') || 'Updated At'}
                  </span>
                }
              >
                <span className="text-gray-600 dark:text-gray-300">
                  {new Date(currentRole.updatedAt).toLocaleDateString()}
                </span>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Description */}
        <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Title level={3} className="mb-4 text-gray-900 dark:text-white">
            {t('roles.description') || 'Description'}
          </Title>
          <Paragraph className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {currentRole.description || t('roles.noDescription') || 'No description provided.'}
          </Paragraph>
        </Card>

        {/* Permissions Management */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <RolePermissionTable
            roleId={id!}
            rolePermissions={rolePermissions}
          />
        </Card>
      </div>
    </div>
  );
};

export default RoleDetail; 