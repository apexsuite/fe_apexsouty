import React from 'react';
import { Table, Button, Tag, Space, Avatar, Tooltip } from 'antd';
import { Eye, Edit, Delete, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Role } from '@/lib/roleSlice';

interface RoleTableProps {
  roles: Role[];
  loading: boolean;
  onView: (roleId: string) => void;
  onEdit: (roleId: string) => void;
  onDelete: (roleId: string, roleName: string) => void;
  onStatusChange: (roleId: string, currentStatus: boolean) => void;
  searchTerm?: string;
  selectedRoleValue?: string;
}

const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  loading,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  searchTerm,
  selectedRoleValue,
}) => {
  const { t } = useTranslation();

  const getStatusTag = (role: Role) => (
    <Tag
      color={role.isActive ? 'green' : 'red'}
      className="cursor-pointer hover:opacity-80"
      onClick={() => onStatusChange(role.id, role.isActive)}
    >
      {role.isActive ? t('roles.active') || 'Active' : t('roles.inactive') || 'Inactive'}
    </Tag>
  );

  const getDefaultTag = (isDefault: boolean) => {
    if (!isDefault) return null;
    return (
      <Tag color="blue" className="ml-1">
        {t('roles.default') || 'Default'}
      </Tag>
    );
  };

  const columns = [
    {
      title: t('roles.name') || 'Name',
      key: 'name',
      render: (role: Role) => (
        <div className="flex items-center">
          <Avatar
            icon={<Shield size={16} />}
            className="bg-blue-500 mr-3"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {role.name}
            </div>
            <div className="flex gap-1 mt-1">
              {getDefaultTag(role.isDefault)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('roles.description') || 'Description',
      key: 'description',
      render: (role: Role) => (
        <div className="text-gray-600 dark:text-gray-300">
          {role.description || t('roles.noDescription') || 'No description'}
        </div>
      ),
    },
    {
      title: t('roles.roleValue') || 'Role Value',
      key: 'roleValue',
      render: (role: Role) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {role.roleValue}
        </div>
      ),
    },
    {
      title: t('roles.permissions') || 'Permissions',
      key: 'permissions',
      render: (role: Role) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-300">
            {role.permissionCount || 0}
          </span>
        </div>
      ),
    },
    {
      title: t('roles.status') || 'Status',
      key: 'status',
      render: (role: Role) => getStatusTag(role),
    },
    {
      title: t('roles.actions') || 'Actions',
      key: 'actions',
      render: (role: Role) => (
        <Space size="small">
          <Tooltip title={t('roles.view') || 'View'}>
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => onView(role.id)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            />
          </Tooltip>
          <Tooltip title={t('roles.edit') || 'Edit'}>
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => onEdit(role.id)}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            />
          </Tooltip>
          <Tooltip title={t('roles.delete') || 'Delete'}>
            <Button
              type="text"
              icon={<Delete size={16} />}
              onClick={() => onDelete(role.id, role.name)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table
        columns={columns}
        dataSource={roles}
        loading={loading}
        rowKey="id"
        pagination={false}
        className="dark:bg-gray-800"
        rowClassName={(_record, index) =>
          index % 2 === 0 
            ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
        }
        components={{
          header: {
            cell: (props: any) => (
              <th 
                {...props} 
                className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              />
            ),
          },
        }}
        locale={{
          emptyText: (
            <div style={{ 
              padding: '40px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              {searchTerm || selectedRoleValue !== 'all' ? (
                <div>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                    No roles found matching your search criteria
                  </p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                    No roles available
                  </p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>
                    Create your first role to get started
                  </p>
                </div>
              )}
            </div>
          )
        }}
      />
    </div>
  );
};

export default RoleTable; 