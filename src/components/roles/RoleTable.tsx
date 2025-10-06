import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Avatar, Tooltip, Card, theme } from 'antd';
import { Eye, Edit, Delete, Shield, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Role } from '@/lib/roleSlice';
import { RootState } from '@/lib/store';
import PermissionGuard from '@/components/PermissionGuard';

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
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStatusTag = (role: Role) => (
    <PermissionGuard 
      permission="change-role-status" 
      mode="disable"
    >
      <Tag
        color={role.isActive ? 'green' : 'red'}
        className="cursor-pointer hover:opacity-80"
        onClick={() => onStatusChange(role.id, role.isActive)}
      >
        {role.isActive ? t('roles.active') || 'Active' : t('roles.inactive') || 'Inactive'}
      </Tag>
    </PermissionGuard>
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
          <PermissionGuard 
            permission="get-role" 
            mode="hide"
          >
            <Tooltip title={t('roles.view') || 'View'}>
              <Button
                type="text"
                icon={<Eye size={16} />}
                onClick={() => onView(role.id)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              />
            </Tooltip>
          </PermissionGuard>
          
          <PermissionGuard 
            permission="update-role" 
            mode="hide"
          >
            <Tooltip title={t('roles.edit') || 'Edit'}>
              <Button
                type="text"
                icon={<Edit size={16} />}
                onClick={() => onEdit(role.id)}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              />
            </Tooltip>
          </PermissionGuard>
          
          <PermissionGuard 
            permission="delete-role" 
            mode="hide"
          >
            <Tooltip title={t('roles.delete') || 'Delete'}>
              <Button
                type="text"
                icon={<Delete size={16} />}
                onClick={() => onDelete(role.id, role.name)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              />
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  // Mobile Card Component
  const RoleCard: React.FC<{ role: Role }> = ({ role }) => {
    const isExpanded = openCard === role.id;
    
    return (
      <Card
        style={{ 
          cursor: 'pointer',
          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
          borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
        bodyStyle={{ padding: '12px' }}
        onClick={() => setOpenCard(isExpanded ? null : role.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <h3 
                className="font-medium text-sm truncate"
                style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}
              >
                {role.name}
              </h3>
              <div className="flex gap-1">
                {getStatusTag(role)}
                {getDefaultTag(role.isDefault)}
              </div>
            </div>
            
            {role.description && (
              <div className="mb-1">
                <span 
                  className="text-xs line-clamp-2"
                  style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }}
                >
                  {role.description}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center gap-1">
                <span 
                  className="text-xs font-medium"
                  style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}
                >
                  {t('roles.mobile.roleValue')}:
                </span>
                <span 
                  className="text-xs"
                  style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }}
                >
                  {role.roleValue}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <span 
                  className="text-xs font-medium"
                  style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}
                >
                  {t('roles.permissions')}:
                </span>
                <span 
                  className="text-xs"
                  style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }}
                >
                  {role.permissionCount || 0}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar size={12} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <span 
                className="text-xs"
                style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }}
              >
                {new Date(role.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
          
          <Button 
            type="text" 
            size="small" 
            onClick={(e) => { 
              e.stopPropagation(); 
              setOpenCard(isExpanded ? null : role.id); 
            }}
            className="p-0 h-auto"
            style={{ minWidth: 'auto' }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>

        {isExpanded && (
          <div 
            className="mt-3 pt-3 border-t"
            style={{ borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb' }}
          >
            <div className="flex flex-wrap gap-1">
              <PermissionGuard 
                permission="get-role" 
                mode="hide"
              >
                <Tooltip title={t('roles.view')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<Eye size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(role.id);
                    }}
                    style={{ 
                      color: currentTheme === 'dark' ? '#ffffff' : token.colorPrimary,
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px'
                    }}
                  >
                    {t('roles.mobile.view')}
                  </Button>
                </Tooltip>
              </PermissionGuard>
              
              <PermissionGuard 
                permission="update-role" 
                mode="hide"
              >
                <Tooltip title={t('roles.edit')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<Edit size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(role.id);
                    }}
                    style={{ 
                      color: currentTheme === 'dark' ? '#ffffff' : token.colorSuccess,
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px'
                    }}
                  >
                    {t('roles.mobile.edit')}
                  </Button>
                </Tooltip>
              </PermissionGuard>

              <PermissionGuard 
                permission="delete-role" 
                mode="hide"
              >
                <Tooltip title={t('roles.delete')}>
                  <Button
                    type="text"
                    size="small"
                    icon={<Delete size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(role.id, role.name);
                    }}
                    style={{ 
                      color: currentTheme === 'dark' ? '#ffffff' : token.colorError,
                      fontSize: '11px',
                      height: '24px',
                      padding: '0 6px'
                    }}
                    danger
                  >
                    {t('roles.mobile.delete')}
                  </Button>
                </Tooltip>
              </PermissionGuard>
            </div>
          </div>
        )}
      </Card>
    );
  };

  if (isMobile) {
    return (
      <div className="space-y-2 px-1">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
        {loading && (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    );
  }

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